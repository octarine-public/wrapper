import Ability from "../Base/Ability"

export default class tiny_tree_channel extends Ability {
	public readonly m_pBaseEntity!: C_DOTA_Ability_Tiny_Tree_Channel
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("tiny_tree_channel", tiny_tree_channel)
