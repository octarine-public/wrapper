import { EventsSDK } from "./EventsSDK"

type ScheduledTask = {
	handleID: bigint
	queueTime: number
	callback: (...args: any[]) => void
}

export const TaskManager = new (class CTaskManager {
	private counter = 0n
	// https://v8.dev/features/bigint
	private readonly maxCounter = 2n ** 64n - 1n
	private readonly tasks: ScheduledTask[] = []

	constructor() {
		EventsSDK.on("PostDataUpdate", this.mainLoop.bind(this), -Infinity)
	}

	public IsValid(handleID: bigint) {
		return this.tasks.some(task => task.handleID === handleID)
	}

	public Begin(callback: (...args: any[]) => void, ms: number = 0) {
		const queueTime = hrtime() + ms
		const counter = this.counter++
		if (counter >= this.maxCounter) {
			this.counter = BigInt(this.tasks.length + 1)
		}
		this.tasks.push({ queueTime, callback, handleID: counter })
		this.tasks.orderBy(task => task.queueTime)
		return counter
	}

	public Cancel(handleID: bigint) {
		if (this.tasks.removeCallback(task => task.handleID === handleID)) {
			EventsSDK.emit("TaskCancelled", false, handleID)
			return true
		}
		return false
	}

	private mainLoop(_dt: number) {
		while (this.tasks.length > 0 && this.tasks[0].queueTime <= hrtime()) {
			const task = this.tasks.shift()
			task!.callback()
			EventsSDK.emit("TaskReleased", false, task!.handleID)
		}
	}
})()
