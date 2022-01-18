import Notification from "./AbstractNotification"
import EventsSDK from "../Managers/EventsSDK"

export const MAX_SHOW_NOTIFICATION = 5
export let Queue: Notification[] = []
export let Notifications: Notification[] = []

EventsSDK.on("GameEnded", () => {
	Queue = []
	Notifications = []
})