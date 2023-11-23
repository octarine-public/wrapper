import { EventsSDK } from "../Managers/EventsSDK"
import { Notification } from "./AbstractNotification"

export const Queue: Notification[] = []
export const Notifications: Notification[] = []

EventsSDK.on("GameEnded", () => {
	Queue.clear()
	Notifications.clear()
})
