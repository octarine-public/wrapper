import Ability from "../../Base/Ability"

export default class mars_gods_rebuke extends Ability {
	public NativeEntity: Nullable<CDOTA_Ability_Mars_GodsRebuke>

	public get AOERadius(): number {
		return this.GetSpecialValue("radius")
	}
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("mars_gods_rebuke", mars_gods_rebuke)
