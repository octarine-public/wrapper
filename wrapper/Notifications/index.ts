import { BackgroundCover } from "../Enums/BackgroundCover"
import * as ArrayExtensions from "../Utils/ArrayExtensions"
import { Notification } from "./AbstractNotification"
import { Notifications, Queue } from "./Data"

export { Notification } from "./AbstractNotification"
export { ResetSettingsUpdated } from "./Prepared/ResetSettingsUpdated"

export const NotificationsSDK = new (class CNotificationsSDK {
	public size = 230
	public yOffset = 150
	public limit = 4
	public debug = false
	public backgroundCover = BackgroundCover.Octarine

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
	public Push(
		notification: Notification,
		uniqCheck = false,
		backgroundCover = this.backgroundCover
	) {
		notification.Cover = backgroundCover

		if (uniqCheck) {
			ArrayExtensions.arrayRemoveCallback(
				Notifications,
				x => x.UniqueKey === x.UniqueKey && !x.IsExpired
			)
			if (!Queue.some(x => x.UniqueKey === notification.UniqueKey)) {
				Queue.push(notification)
			}
		} else {
			Queue.push(notification)
		}
	}
})()
