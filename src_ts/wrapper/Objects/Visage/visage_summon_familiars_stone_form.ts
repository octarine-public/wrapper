import Ability from "../Base/Ability"

export default class visage_summon_familiars_stone_form extends Ability {
	public readonly m_pBaseEntity!: C_DOTA_Ability_Visage_SummonFamiliars_StoneForm
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("visage_summon_familiars_stone_form", visage_summon_familiars_stone_form)
