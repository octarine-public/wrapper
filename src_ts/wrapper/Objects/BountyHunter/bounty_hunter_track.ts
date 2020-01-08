import Ability from "../Base/Ability"

export default class bounty_hunter_track extends Ability {
	public readonly m_pBaseEntity!: C_DOTA_Ability_BountyHunter_Track
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("bounty_hunter_track", bounty_hunter_track)
