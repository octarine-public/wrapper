import { Rectangle } from "../Base/Rectangle"
import { GUIInfo } from "../GUI/GUIInfo"
import { RendererSDK } from "../Native/RendererSDK"
import { NotificationsSDK } from "./index"

export function GetPanel(panel: Rectangle): void {
	const windowSize = RendererSDK.WindowSize
	const width = GUIInfo.ScaleWidth(NotificationsSDK.size, windowSize)
	const height = Math.round(width / 3.5)

	panel.x = GUIInfo.HUDFlipped ? 0 : windowSize.x - width
	panel.y = GUIInfo.ScaleHeight(NotificationsSDK.yOffset, windowSize)
	panel.Width = width
	panel.Height = height
}
