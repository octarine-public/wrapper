import Ability from "../Base/Ability"

export default class pugna_nether_blast extends Ability {
	public readonly m_pBaseEntity!: C_DOTA_Ability_Pugna_NetherBlast
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("pugna_nether_blast", pugna_nether_blast)
