import Ability from "../Base/Ability"

export default class monkey_king_tree_dance extends Ability {
	public readonly m_pBaseEntity!: C_DOTA_Ability_MonkeyKing_TreeDance
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("monkey_king_tree_dance", monkey_king_tree_dance)
