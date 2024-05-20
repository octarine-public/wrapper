import { Events } from "./Events"
import { EventsSDK } from "./EventsSDK"

const cbQueue: (() => void)[] = []
export function QueueEvent(cb: () => void): void {
	cbQueue.push(cb)
}

Events.on("NewConnection", () => cbQueue.clear())
EventsSDK.on(
	"PostDataUpdate",
	() => {
		for (const cb of cbQueue) {
			cb()
		}
		cbQueue.clear()
	},
	-Infinity
)
