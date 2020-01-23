import Ability from "../../Base/Ability"

export default class throw_coal extends Ability {
	public NativeEntity: Nullable<C_DOTA_Ability_Throw_Coal>
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("throw_coal", throw_coal)
