import { Rectangle } from "../Base/Rectangle"
import { GUIInfo } from "../GUI/GUIInfo"
import { RendererSDK } from "../Native/RendererSDK"
import { NotificationsSDK } from "./Imports"

export function GetPanel(panel: Rectangle): void {
	const ScreenSize = RendererSDK.WindowSize
	const width = GUIInfo.ScaleWidth(NotificationsSDK.size, ScreenSize)
	const height = Math.round(width / 3.5)

	panel.x = GUIInfo.HUDFlipped
		? 0
		: ScreenSize.x - width
	panel.y = GUIInfo.ScaleHeight(NotificationsSDK.y_offset, ScreenSize)
	panel.Width = width
	panel.Height = height
}
