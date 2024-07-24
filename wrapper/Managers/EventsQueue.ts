import { Events } from "./Events"
import { EventsSDK } from "./EventsSDK"
import { TaskManager } from "./TaskManager"

const handleIds: bigint[] = []
export function QueueEvent(cb: () => void): void {
	handleIds.push(TaskManager.Begin(cb))
}

Events.on("NewConnection", () => {
	// last in first out
	for (let i = handleIds.length - 1; i > -1; i--) {
		const handleID = handleIds[i]
		TaskManager.Cancel(handleID)
		handleIds.remove(handleID)
	}
})

EventsSDK.on("TaskReleased", handleID => handleIds.remove(handleID))
