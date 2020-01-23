import Ability from "../../Base/Ability"

export default class visage_stone_form_self_cast extends Ability {
	public NativeEntity: Nullable<C_DOTA_Ability_Visage_Stone_Form_Self_Cast>
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("visage_stone_form_self_cast", visage_stone_form_self_cast)
