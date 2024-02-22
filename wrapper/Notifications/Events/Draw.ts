import { Color } from "../../Base/Color"
import { Rectangle } from "../../Base/Rectangle"
import { GUIInfo } from "../../GUI/GUIInfo"
import { EventsSDK } from "../../Managers/EventsSDK"
import { InputManager } from "../../Managers/InputManager"
import { RendererSDK } from "../../Native/RendererSDK"
import { Notifications, Queue } from "../Data"
import { NotificationsSDK } from "../index"
import { GetPanel } from "../Util"

EventsSDK.after("Draw", () => {
	Notifications.removeCallback(x => x.IsExpired)
	if (InputManager.IsShopOpen) {
		return
	}
	const num = Math.min(Queue.length, NotificationsSDK.limit - Notifications.length)
	for (let index = 0; index < num; index++) {
		const notification = Queue.shift()
		if (notification === undefined) {
			continue
		}
		notification.PushTime()
		Notifications.push(notification)
	}

	const panel = new Rectangle()

	GetPanel(panel)
	const panelOffset = GUIInfo.ScaleHeight(20),
		panelHeight = panel.Height

	if (NotificationsSDK.debug) {
		for (let i = 0; i < NotificationsSDK.limit; i++) {
			RendererSDK.OutlinedRect(panel.pos1, panel.Size, 3, Color.White)
			panel.AddY(panelHeight + panelOffset)
		}
		GetPanel(panel) // because we've just been modifying existing one
	}

	for (let index = Notifications.length - 1; index > -1; index--) {
		const notification = Notifications[index]
		notification.Draw(panel)
		notification.PlaySound()
		panel.AddY(panelHeight + panelOffset)
	}
})
