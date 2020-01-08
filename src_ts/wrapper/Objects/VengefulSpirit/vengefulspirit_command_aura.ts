import Ability from "../Base/Ability"

export default class vengefulspirit_command_aura extends Ability {
	public readonly m_pBaseEntity!: C_DOTA_Ability_VengefulSpirit_Command_Aura
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("vengefulspirit_command_aura", vengefulspirit_command_aura)
