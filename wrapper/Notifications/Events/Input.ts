import { Rectangle } from "../../Base/Rectangle"
import {
	InputEventSDK,
	InputManager,
	VMouseKeys
} from "../../Managers/InputManager"
import { Notifications } from "../Data"
import { GetPanel } from "../Util"

InputEventSDK.on("MouseKeyDown", key => {
	if (InputManager.IsShopOpen || key !== VMouseKeys.MK_LBUTTON) return true

	const cursorPosition = InputManager.CursorOnScreen,
		panel = new Rectangle()
	GetPanel(panel)
	const panelHeight = panel.Height
	return !Notifications.some(notification => {
		if (panel.Contains(cursorPosition) && notification.OnClick()) return true
		panel.AddY(panelHeight + 20)
		return false
	})
})
