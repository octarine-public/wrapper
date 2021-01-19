import { ArrayExtensions } from "../../wrapper/Imports"
import Notification from "./AbstractNotification"
import { Notifications, Queue } from "./data"

export { default as Notification } from "./AbstractNotification"
export const NotificationsSDK = new (class CNotificationsSDK {
	public size = 65
	public y_offset = 240
	public debug = false

	/**
	 * @param notification abstract class
	 * @param extendTime
	 * @description add in Queue notification
	 * @example
	 *
	 * class TestNotification extends Notification {
	 *
	 *   constructor(...) {
	 *     super(...)
	 *   }
	 *
	 *   public OnClick(): boolean {
	 *      // some code...
	 *   }
	 *
	 *   public Draw(position: Rectangle): void {
	 *      // some code...
	 *   }
	 *
	 * }
	 *
	 * const TestNotification = new TestNotification(...)
	 *
	 * EventsSDK.on("GameStarted", () => {
	 *   NotificationsSDK.Push(TestNotification)
	 * })
	 *
	 */
	public Push(notification: Notification, UniqCheck = false) {
		if (UniqCheck) {
			ArrayExtensions.arrayRemoveCallback(
				Notifications,
				x => x.UniqueKey === x.UniqueKey && !x.IsExpired,
			)
			if (!Queue.some(x => x.UniqueKey === notification.UniqueKey))
				Queue.push(notification)
		} else
			Queue.push(notification)
	}
})()
