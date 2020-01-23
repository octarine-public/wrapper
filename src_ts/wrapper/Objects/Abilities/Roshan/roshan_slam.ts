import Ability from "../../Base/Ability"

export default class roshan_slam extends Ability {
	public NativeEntity: Nullable<C_DOTA_Ability_Roshan_Slam>
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("roshan_slam", roshan_slam)
