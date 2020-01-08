import Ability from "../Base/Ability"

export default class sniper_shrapnel extends Ability {
	public readonly m_pBaseEntity!: C_DOTA_Ability_Sniper_Shrapnel
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("sniper_shrapnel", sniper_shrapnel)
