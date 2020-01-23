import Ability from "../../Base/Ability"

export default class sandking_epicenter extends Ability {
	public NativeEntity: Nullable<C_DOTA_Ability_SandKing_Epicenter>
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("sandking_epicenter", sandking_epicenter)
