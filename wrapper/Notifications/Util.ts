import Rectangle from "../Base/Rectangle"
import RendererSDK from "../Native/RendererSDK"
import { NotificationsSDK } from "./Imports"

export function GetPanel(panel: Rectangle): void {
	const ScreenSize = RendererSDK.WindowSize
	const size = NotificationsSDK.size
	const width = size * 3.5

	panel.pos1.x = ScreenSize.x - width
	panel.pos1.y = NotificationsSDK.y_offset

	panel.pos2.x = ScreenSize.x
	panel.pos2.y = panel.pos1.y + size
}
