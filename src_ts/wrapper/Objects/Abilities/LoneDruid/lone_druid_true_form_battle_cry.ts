import Ability from "../../Base/Ability"

export default class lone_druid_true_form_battle_cry extends Ability {
	public NativeEntity: Nullable<C_DOTA_Ability_LoneDruid_TrueForm_BattleCry>
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("lone_druid_true_form_battle_cry", lone_druid_true_form_battle_cry)
