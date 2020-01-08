import Ability from "../Base/Ability"

export default class crystal_maiden_frostbite extends Ability {
	public readonly m_pBaseEntity!: C_DOTA_Ability_CrystalMaiden_Frostbite
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("crystal_maiden_frostbite", crystal_maiden_frostbite)
