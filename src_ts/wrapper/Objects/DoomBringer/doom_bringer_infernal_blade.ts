import Ability from "../Base/Ability"

export default class doom_bringer_infernal_blade extends Ability {
	public readonly m_pBaseEntity!: C_DOTA_Ability_DoomBringer_InfernalBlade
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("doom_bringer_infernal_blade", doom_bringer_infernal_blade)
