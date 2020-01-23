import Ability from "../../Base/Ability"

export default class tiny_avalanche extends Ability {
	public NativeEntity: Nullable<C_DOTA_Ability_Tiny_Avalanche>
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("tiny_avalanche", tiny_avalanche)
