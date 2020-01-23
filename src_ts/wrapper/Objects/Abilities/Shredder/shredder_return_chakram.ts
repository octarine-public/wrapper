import Ability from "../../Base/Ability"

export default class shredder_return_chakram extends Ability {
	public NativeEntity: Nullable<C_DOTA_Ability_Shredder_ReturnChakram>
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("shredder_return_chakram", shredder_return_chakram)
