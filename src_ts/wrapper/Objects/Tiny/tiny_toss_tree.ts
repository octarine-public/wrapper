import Ability from "../Base/Ability"

export default class tiny_toss_tree extends Ability {
	public readonly m_pBaseEntity!: C_DOTA_Ability_Tiny_TossTree
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("tiny_toss_tree", tiny_toss_tree)
