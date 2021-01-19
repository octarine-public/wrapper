import { Input, InputEventSDK, VMouseKeys } from "wrapper/Imports"
import Rectangle from "../../Base/Rectangle"
import { Notifications } from "../data"
import { GetPanel } from "../Util"

InputEventSDK.on("MouseKeyDown", key => {
	if (key !== VMouseKeys.MK_LBUTTON)
		return true

	const MosePosition = Input.CursorOnScreen,
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
