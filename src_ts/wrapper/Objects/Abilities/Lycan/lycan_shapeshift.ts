import Ability from "../../Base/Ability"

export default class lycan_shapeshift extends Ability {
	public NativeEntity: Nullable<C_DOTA_Ability_Lycan_Shapeshift>
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("lycan_shapeshift", lycan_shapeshift)