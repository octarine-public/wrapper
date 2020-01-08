import Ability from "../Base/Ability"

export default class bounty_hunter_shuriken_toss extends Ability {
	public readonly m_pBaseEntity!: C_DOTA_Ability_BountyHunter_ShurikenToss
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("bounty_hunter_shuriken_toss", bounty_hunter_shuriken_toss)
