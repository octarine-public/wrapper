import Ability from "../Base/Ability"

export default class brewmaster_storm_dispel_magic extends Ability {
	public readonly m_pBaseEntity!: C_DOTA_Ability_Brewmaster_DispelMagic
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("brewmaster_storm_dispel_magic", brewmaster_storm_dispel_magic)
