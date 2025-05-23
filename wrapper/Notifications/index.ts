import { BackgroundCover } from "../Enums/BackgroundCover"
import { Notification } from "./AbstractNotification"
import { Notifications, Queue } from "./Data"

export { Notification } from "./AbstractNotification"
export { EnableDisableUpdated } from "./Prepared/EnableDisableUpdated"
export { ResetSettingsUpdated } from "./Prepared/ResetSettingsUpdated"

export const NotificationsSDK = new (class CNotificationsSDK {
	public size = 230
	public yOffset = 150
	public limit = 4
	public debug = false
	public backgroundCover = BackgroundCover.Octarine

	/**
	 * @param notification abstract class
	 * @param uniqCheck check on unique key
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
	public Push(
		notification: Notification,
		uniqCheck = false,
		backgroundCover = this.backgroundCover
	) {
		notification.Cover = backgroundCover
		if (!uniqCheck) {
			Queue.push(notification)
			return
		}
		Notifications.removeCallback(x => x.UniqueKey === x.UniqueKey && !x.IsExpired)
		if (!Queue.some(x => x.UniqueKey === notification.UniqueKey)) {
			Queue.push(notification)
		}
	}
})()
