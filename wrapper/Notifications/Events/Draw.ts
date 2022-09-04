import Color from "../../Base/Color"
import Rectangle from "../../Base/Rectangle"
import GUIInfo from "../../GUI/GUIInfo"
import EventsSDK from "../../Managers/EventsSDK"
import InputManager from "../../Managers/InputManager"
import RendererSDK from "../../Native/RendererSDK"
import { arrayRemove } from "../../Utils/ArrayExtensions"
import { Notifications, Queue } from "../Data"
import { NotificationsSDK } from "../Imports"
import { GetPanel } from "../Util"

EventsSDK.after("Draw", () => {
	arrayRemove(Notifications, Notifications.filter(x => x.IsExpired)[0])
	if (InputManager.IsShopOpen)
		return
	const num = Math.min(Queue.length, NotificationsSDK.limit - Notifications.length)
	for (let index = 0; index < num; index++) {
		const notification = Queue.shift()
		if (notification === undefined)
			continue
		notification.PushTime()
		Notifications.push(notification)
	}

	const panel = new Rectangle()

	GetPanel(panel)
	const panel_offset = GUIInfo.ScaleHeight(20),
		panel_height = panel.Height
	if (NotificationsSDK.debug) {
		for (let i = 0; i < NotificationsSDK.limit; i++) {
			RendererSDK.OutlinedRect(panel.pos1, panel.Size, 3, Color.White)
			panel.AddY(panel_height + panel_offset)
		}
		GetPanel(panel) // because we've just been modifying existing one
	}
	Notifications.forEach(notification => {
		notification.Draw(panel)
		notification.PlaySound()
		panel.AddY(panel_height + panel_offset)
	})
})
