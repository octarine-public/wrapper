import Ability from "../Base/Ability"

export default class kobold_taskmaster_speed_aura extends Ability {
	public readonly m_pBaseEntity!: C_DOTA_Ability_KoboldTaskmaster_SpeedAura
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("kobold_taskmaster_speed_aura", kobold_taskmaster_speed_aura)
