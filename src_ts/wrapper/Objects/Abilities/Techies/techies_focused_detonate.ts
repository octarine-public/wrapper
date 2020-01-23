import Ability from "../../Base/Ability"

export default class techies_focused_detonate extends Ability {
	public NativeEntity: Nullable<C_DOTA_Ability_Techies_FocusedDetonate>
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("techies_focused_detonate", techies_focused_detonate)
