import Ability from "../../Base/Ability"

export default class high_five extends Ability {
	public NativeEntity: Nullable<CDOTA_Ability_HighFive>
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("high_five", high_five)
