import Ability from "../../Base/Ability"

export default class windrunner_focusfire extends Ability {
	public NativeEntity: Nullable<C_DOTA_Ability_Windrunner_FocusFire>
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("windrunner_focusfire", windrunner_focusfire)
