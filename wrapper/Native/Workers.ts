import { Events } from "../Managers/Events"
import { arrayRemove, orderBy } from "../Utils/ArrayExtensions"

type RPCEndPoint = (data: WorkerIPCType) => WorkerIPCType
type PromiseResolver = [(data: WorkerIPCType) => void, (data: any) => void]
type WorkerType = [bigint, WorkerOptions, PromiseResolver[], boolean, boolean]
export const Workers = new (class CWorkers {
	private readonly workers: WorkerType[] = []
	private readonly endpoints = new Map<string, RPCEndPoint>()
	private queuedTasks: [string, WorkerIPCType, PromiseResolver][] = []
	private workersPromises: Promise<void>[] = []
	constructor() {
		if (IS_MAIN_WORKER) {
			// 2 general purpose workers
			for (let i = 0; i < 2; i++) {
				const prom = this.AddWorkerWithOpts({
					forward_events: false,
					forward_server_messages: false
				}).then(() => {
					arrayRemove(this.workersPromises, prom)
				})
				this.workersPromises.push(prom)
			}
		}
		Events.on("IPCMessage", (sourceWorkerUID, name, data) => {
			if (name !== "RPCCall" || !Array.isArray(data)) return
			const [endpointName, realData] = data
			if (typeof endpointName !== "string") return
			const endpoint = this.endpoints.get(endpointName)
			if (endpoint === undefined) {
				if (name === "RPCCall")
					SendIPCMessage(sourceWorkerUID, "RPCCallResponse", [
						false,
						"Remote RPC Endpoint name not found",
						endpointName
					])
				return
			}
			try {
				const res = endpoint(realData)
				if (name === "RPCCall")
					SendIPCMessage(sourceWorkerUID, "RPCCallResponse", [true, res])
			} catch (e: any) {
				if (name === "RPCCall") {
					const err = e instanceof Error ? e : new Error(e)
					SendIPCMessage(sourceWorkerUID, "RPCCallResponse", [
						false,
						err.message,
						err.stack ?? ""
					])
				} else console.error(e)
			}
		})
		Events.on("IPCMessage", (sourceWorkerUID, name, data) => {
			if (name !== "RPCCallResponse" || !Array.isArray(data)) return
			const [success, realData, stack] = data
			if (typeof success !== "boolean") return
			const worker = this.workers.find(([uid]) => uid === sourceWorkerUID)
			if (worker === undefined) return
			const resolver = worker[2].shift()
			if (resolver === undefined) return
			if (!success) {
				resolver[1]([realData, stack])
			} else resolver[0](realData)
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
		highPriority = false,
		exclusiveWorkerOptions?: WorkerOptions
	): Promise<WorkerIPCType> {
		const endpoint = this.endpoints.get(name)
		if (endpoint === undefined)
			return Promise.reject(["Local RPC Endpoint name not found", name])
		return new Promise<WorkerIPCType>(async (resolve, reject) => {
			if (exclusiveWorkerOptions !== undefined) {
				const newWorker = await this.AddWorkerWithOpts(
					exclusiveWorkerOptions,
					true
				)
				newWorker[2].push([
					val => {
						DespawnWorker(newWorker[0])
						resolve(val)
					},
					err => {
						DespawnWorker(newWorker[0])
						reject(err)
					}
				])
				SendIPCMessage(newWorker[0], "RPCCall", [name, data])
				return
			}
			const worker = orderBy(this.workers, ar => ar[2].length) // pick the least used worker
				.find(ar => !ar[4] && ar[3] && (!highPriority || ar[2].length === 0))
			if (worker !== undefined) {
				worker[2].push([resolve, reject])
				SendIPCMessage(worker[0], "RPCCall", [name, data])
				return
			}
			if (!highPriority) {
				this.queuedTasks.push([name, data, [resolve, reject]])
				return
			}
			try {
				resolve(endpoint(data))
			} catch (e: any) {
				const err = e instanceof Error ? e : new Error(e)
				reject([err.message, err.stack ?? ""])
			}
		})
	}
	private AddWorkerWithOpts(
		opts: WorkerOptions,
		exclusive = false
	): Promise<WorkerType> {
		return new Promise<WorkerType>(resolve => {
			const fixedOpts: WorkerOptions = {
				forward_events: opts.forward_events,
				forward_server_messages:
					opts.forward_events && opts.forward_server_messages,
				display_name:
					opts.display_name ?? `Wrapper RPC Worker #${this.workers.length + 1}`,
				entry_point:
					opts.entry_point ?? "github.com/octarine-public/wrapper/index"
			}
			const ar: WorkerType = [
				SpawnWorker(fixedOpts),
				fixedOpts,
				[],
				false,
				exclusive
			]
			this.workers.push(ar)
			const spawnCb = (workerUID: bigint) => {
				if (workerUID !== ar[0]) return
				Events.removeListener("WorkerSpawned", spawnCb)
				ar[3] = true
				this.queuedTasks.forEach(([name, data, promise]) =>
					this.CallRPCEndPoint(name, data).then(promise[0], promise[1])
				)
				this.queuedTasks = []
				resolve(ar)
			}
			Events.on("WorkerSpawned", spawnCb)
			const despawnCb = (workerUID: bigint) => {
				if (workerUID !== ar[0]) return
				Events.removeListener("WorkerDespawned", despawnCb)
				ar[3] = false
				ar[2].forEach(([, rej]) => rej("RPC Worker died"))
				arrayRemove(this.workers, ar)
				if (!exclusive) {
					const prom = this.AddWorkerWithOpts(fixedOpts).then(() => {
						arrayRemove(this.workersPromises, prom)
					})
					this.workersPromises.push(prom)
				}
			}
			Events.on("WorkerDespawned", despawnCb)
		})
	}
})()
