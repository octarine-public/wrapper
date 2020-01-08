import Ability from "../Base/Ability"

export default class vengefulspirit_nether_swap extends Ability {
	public readonly m_pBaseEntity!: C_DOTA_Ability_VengefulSpirit_Nether_Swap
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("vengefulspirit_nether_swap", vengefulspirit_nether_swap)
