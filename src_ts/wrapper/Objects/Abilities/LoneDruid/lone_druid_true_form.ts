import Ability from "../../Base/Ability"

export default class lone_druid_true_form extends Ability {
	public NativeEntity: Nullable<C_DOTA_Ability_LoneDruid_TrueForm>
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("lone_druid_true_form", lone_druid_true_form)
