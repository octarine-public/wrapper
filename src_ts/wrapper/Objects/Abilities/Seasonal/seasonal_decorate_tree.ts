import Ability from "../../Base/Ability"

export default class seasonal_decorate_tree extends Ability {
	public NativeEntity: Nullable<C_DOTA_Ability_Seasonal_Decorate_Tree>
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("seasonal_decorate_tree", seasonal_decorate_tree)
