import Ability from "../../Base/Ability"

export default class visage_summon_familiars extends Ability {
	public NativeEntity: Nullable<C_DOTA_Ability_Visage_SummonFamiliars>
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("visage_summon_familiars", visage_summon_familiars)
