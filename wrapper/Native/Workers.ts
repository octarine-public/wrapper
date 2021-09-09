import Events from "../Managers/Events"
import { arrayRemove, orderBy } from "../Utils/ArrayExtensions"

type RPCEndPoint = (data: WorkerIPCType) => Promise<WorkerIPCType> | WorkerIPCType
type PromiseResolver = [((data: WorkerIPCType) => void), (data: any) => void]
type WorkerType = [
	bigint,
	WorkerOptions,
	PromiseResolver[],
	boolean,
	boolean,
]
export default new (class Workers {
	private readonly workers: WorkerType[] = []
	private readonly endpoints = new Map<string, RPCEndPoint>()
	private queued_tasks: [string, WorkerIPCType, PromiseResolver][] = []
	constructor() {
		if (IS_MAIN_WORKER) {
			// 2 general purpose workers
			for (let i = 0; i < 2; i++)
				this.AddWorkerWithOpts({
					forward_events: false,
					forward_server_messages: false,
				})
		}
		Events.on("IPCMessage", async (source_worker_uid, name, data) => {
			if (name !== "RPCCall" || !Array.isArray(data))
				return
			const [endpoint_name, real_data] = data
			if (typeof endpoint_name !== "string")
				return
			const endpoint = this.endpoints.get(endpoint_name)
			if (endpoint === undefined) {
				SendIPCMessage(
					source_worker_uid,
					"RPCCallResponse",
					[false, "Remote RPC Endpoint name not found", endpoint_name],
				)
				return
			}
			try {
				const res = await endpoint(real_data)
				SendIPCMessage(
					source_worker_uid,
					"RPCCallResponse",
					[true, res],
				)
			} catch (e: any) {
				const err = e instanceof Error ? e : new Error(e)
				SendIPCMessage(
					source_worker_uid,
					"RPCCallResponse",
					[false, err.message, err.stack ?? ""],
				)
			}
		})
		Events.on("IPCMessage", (source_worker_uid, name, data) => {
			if (name !== "RPCCallResponse" || !Array.isArray(data))
				return
			const [success, real_data, stack] = data
			if (typeof success !== "boolean")
				return
			const worker = this.workers.find(([uid]) => uid === source_worker_uid)
			if (worker === undefined)
				return
			const resolver = worker[2].shift()
			if (resolver === undefined)
				return
			if (!success) {
				resolver[1]([real_data, stack])
			} else
				resolver[0](real_data)
		})
	}
	public RegisterRPCEndPoint(name: string, endpoint: RPCEndPoint): void {
		if (this.endpoints.has(name))
			throw `Tried to register "${name}" RPC endpoint more than once`
		this.endpoints.set(name, endpoint)
	}
	public CallRPCEndPoint(
		name: string,
		data: WorkerIPCType,
		high_priority = false,
		exclusive_worker_options?: WorkerOptions,
	): Promise<WorkerIPCType> {
		const endpoint = this.endpoints.get(name)
		if (endpoint === undefined)
			return Promise.reject(["Local RPC Endpoint name not found", name])
		return new Promise<WorkerIPCType>(async (resolve, reject) => {
			if (exclusive_worker_options !== undefined) {
				this.AddWorkerWithOpts(exclusive_worker_options, true).then(new_worker => {
					new_worker[2].push([
						val => {
							DespawnWorker(new_worker[0])
							resolve(val)
						},
						err => {
							DespawnWorker(new_worker[0])
							reject(err)
						},
					])
					SendIPCMessage(
						new_worker[0],
						"RPCCall",
						[name, data],
					)
				})
				return
			}
			const worker = orderBy(this.workers, ar => ar[2].length) // pick the least used worker
				.find(ar => !ar[4] && ar[3] && (!high_priority || ar[2].length === 0))
			if (worker !== undefined) {
				worker[2].push([resolve, reject])
				SendIPCMessage(
					worker[0],
					"RPCCall",
					[name, data],
				)
				return
			}
			if (!high_priority) {
				this.queued_tasks.push([name, data, [resolve, reject]])
				return
			}
			try {
				resolve(await endpoint(data))
			} catch (e: any) {
				const err = e instanceof Error ? e : new Error(e)
				reject([err.message, err.stack ?? ""])
			}
		})
	}
	private AddWorkerWithOpts(opts: WorkerOptions, exclusive = false): Promise<WorkerType> {
		return new Promise<WorkerType>(resolve => {
			const fixed_opts: WorkerOptions = {
				forward_events: opts.forward_events,
				forward_server_messages: opts.forward_events && opts.forward_server_messages,
				display_name: opts.display_name ?? `Wrapper RPC Worker #${this.workers.length + 1}`,
			}
			const ar: WorkerType = [
				SpawnWorker(fixed_opts),
				fixed_opts,
				[],
				false,
				exclusive,
			]
			this.workers.push(ar)
			const spawn_cb = (worker_uid: bigint) => {
				if (worker_uid !== ar[0])
					return
				Events.removeListener("WorkerSpawned", spawn_cb)
				ar[3] = true
				this.queued_tasks.forEach(([name, data, promise]) => this.CallRPCEndPoint(
					name,
					data,
				).then(promise[0]).catch(promise[1]))
				this.queued_tasks = []
				resolve(ar)
			}
			Events.on("WorkerSpawned", spawn_cb)
			const despawn_cb = (worker_uid: bigint) => {
				if (worker_uid !== ar[0])
					return
				Events.removeListener("WorkerDespawned", despawn_cb)
				ar[3] = false
				ar[2].forEach(([, rej]) => rej("RPC Worker died"))
				arrayRemove(this.workers, ar)
				if (!exclusive)
					this.AddWorkerWithOpts(fixed_opts)
			}
			Events.on("WorkerDespawned", despawn_cb)
		})
	}
})()
