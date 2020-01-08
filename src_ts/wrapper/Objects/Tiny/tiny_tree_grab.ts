import Ability from "../Base/Ability"

export default class tiny_tree_grab extends Ability {
	public readonly m_pBaseEntity!: C_DOTA_Ability_Tiny_Tree_Grab
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("tiny_tree_grab", tiny_tree_grab)
