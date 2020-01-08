import Ability from "../Base/Ability"

export default class pugna_nether_ward extends Ability {
	public readonly m_pBaseEntity!: C_DOTA_Ability_Pugna_NetherWard
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("pugna_nether_ward", pugna_nether_ward)
