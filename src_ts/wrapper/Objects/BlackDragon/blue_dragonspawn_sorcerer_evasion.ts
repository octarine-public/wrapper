import Ability from "../Base/Ability"

export default class blue_dragonspawn_sorcerer_evasion extends Ability {
	public readonly m_pBaseEntity!: C_DOTA_Ability_BlueDragonspawnSorcerer_Evasion
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("blue_dragonspawn_sorcerer_evasion", blue_dragonspawn_sorcerer_evasion)
