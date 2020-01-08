import Ability from "../Base/Ability"

export default class omniknight_degen_aura extends Ability {
	public readonly m_pBaseEntity!: C_DOTA_Ability_Omniknight_Degen_Aura
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("omniknight_degen_aura", omniknight_degen_aura)
