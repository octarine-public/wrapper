import Ability from "../../Base/Ability"

export default class shredder_chakram extends Ability {
	public NativeEntity: Nullable<C_DOTA_Ability_Shredder_Chakram>
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("shredder_chakram", shredder_chakram)
