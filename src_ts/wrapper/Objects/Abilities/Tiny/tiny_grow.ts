import Ability from "../../Base/Ability"

export default class tiny_grow extends Ability {
	public NativeEntity: Nullable<C_DOTA_Ability_Tiny_Grow>
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("tiny_grow", tiny_grow)