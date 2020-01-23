import Ability from "../../Base/Ability"

export default class tiny_toss_tree extends Ability {
	public NativeEntity: Nullable<C_DOTA_Ability_Tiny_TossTree>
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("tiny_toss_tree", tiny_toss_tree)
