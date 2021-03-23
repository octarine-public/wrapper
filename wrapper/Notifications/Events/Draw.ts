import Color from "../../Base/Color"
import Rectangle from "../../Base/Rectangle"
import EventsSDK from "../../Managers/EventsSDK"
import RendererSDK from "../../Native/RendererSDK"
import { arrayRemove } from "../../Utils/ArrayExtensions"
import { MAX_SHOW_NOTIFICATION, Notifications, Queue } from "../data"
import { NotificationsSDK } from "../Imports"
import { GetPanel } from "../Util"
import { IsShopOpen } from "./Update"

EventsSDK.after("Draw", () => {
	arrayRemove(Notifications, Notifications.filter(x => x.IsExpired)[0])
	if (IsShopOpen)
		return
	const num = Math.min(Queue.length, MAX_SHOW_NOTIFICATION - Notifications.length)
	for (let index = 0; index < num; index++) {
		const notification = Queue.shift()
		if (notification === undefined)
			continue
		notification.PushTime()
		Notifications.unshift(notification)
	}

	const panel = new Rectangle()

	GetPanel(panel)
	const panel_height = panel.Size.y
	if (NotificationsSDK.debug) {
		for (let i = 0; i < MAX_SHOW_NOTIFICATION; i++) {
			RendererSDK.OutlinedRect(panel.pos1, panel.Size, 1, Color.White)
			panel.SubtractY(panel_height + 20)
		}
		GetPanel(panel) // because we've just been modifying existing one
	}
	Notifications.forEach(notification => {
		notification.Draw(panel)
		notification.PlaySound()
		panel.SubtractY(panel_height + 20)
	})
})
