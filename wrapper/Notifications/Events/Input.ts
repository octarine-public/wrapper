import Rectangle from "../../Base/Rectangle"
import InputManager, { InputEventSDK, VMouseKeys } from "../../Managers/InputManager"
import { Notifications } from "../data"
import { GetPanel } from "../Util"

InputEventSDK.on("MouseKeyDown", key => {
	if (key !== VMouseKeys.MK_LBUTTON)
		return true

	const MosePosition = InputManager.CursorOnScreen,
		panel = new Rectangle()
	GetPanel(panel)
	const panel_height = panel.Size.y
	return !Notifications.some(notification => {
		if (panel.Contains(MosePosition) && notification.OnClick())
			return true
		panel.SubtractY(panel_height + 20)
		return false
	})
})
