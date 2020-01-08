import Ability from "../Base/Ability"

export default class tiny_toss extends Ability {
	public readonly m_pBaseEntity!: C_DOTA_Ability_Tiny_Toss
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("tiny_toss", tiny_toss)
