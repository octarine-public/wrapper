import Ability from "../../Base/Ability"

export default class lycan_howl extends Ability {
	public NativeEntity: Nullable<C_DOTA_Ability_Lycan_Howl>
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("lycan_howl", lycan_howl)
