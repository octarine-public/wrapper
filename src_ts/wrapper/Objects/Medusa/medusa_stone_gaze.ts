import Ability from "../Base/Ability"

export default class medusa_stone_gaze extends Ability {
	public readonly m_pBaseEntity!: C_DOTA_Ability_Medusa_StoneGaze
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("medusa_stone_gaze", medusa_stone_gaze)
