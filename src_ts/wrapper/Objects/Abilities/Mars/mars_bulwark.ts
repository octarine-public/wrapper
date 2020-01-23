import Ability from "../../Base/Ability"

export default class mars_bulwark extends Ability {
	public NativeEntity: Nullable<CDOTA_Ability_Mars_Bulwark>
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("mars_bulwark", mars_bulwark)
