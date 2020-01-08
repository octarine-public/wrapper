import Ability from "../Base/Ability"

export default class alpha_wolf_command_aura extends Ability {
	public readonly m_pBaseEntity!: C_DOTA_Ability_AlphaWolf_CommandAura
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("alpha_wolf_command_aura", alpha_wolf_command_aura)
