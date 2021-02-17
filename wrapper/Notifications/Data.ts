import Notification from "./AbstractNotification"

export const MAX_SHOW_NOTIFICATION = 3
export let Queue: Notification[] = []
export let Notifications: Notification[] = []

export function DispsoeNotification() {
	Queue = []
	Notifications = []
}
