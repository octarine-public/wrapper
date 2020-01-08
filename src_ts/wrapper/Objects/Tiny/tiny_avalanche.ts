import Ability from "../Base/Ability"

export default class tiny_avalanche extends Ability {
	public readonly m_pBaseEntity!: C_DOTA_Ability_Tiny_Avalanche
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("tiny_avalanche", tiny_avalanche)
