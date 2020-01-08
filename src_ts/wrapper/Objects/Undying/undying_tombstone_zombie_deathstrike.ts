import Ability from "../Base/Ability"

export default class undying_tombstone_zombie_deathstrike extends Ability {
	public readonly m_pBaseEntity!: C_DOTA_Ability_Undying_Tombstone_Zombie_DeathStrike
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("undying_tombstone_zombie_deathstrike", undying_tombstone_zombie_deathstrike)
