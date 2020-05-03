import Ability from "../../Base/Ability"
import { AbilityLogicType } from "../../../Enums/AbilityLogicType"

export default class windrunner_windrun extends Ability {
	public get MaxCharges(): number {
		return this.Owner?.HasScepter ? this.GetSpecialValue("max_charges") : 0
	}
	public get ChargeRestoreTime(): number {
		return this.Owner?.HasScepter ? this.GetSpecialValue("charge_restore_time") : 0
	}
	public get AbilityLogicType(): AbilityLogicType {
		return this.Owner?.GetAbilityByName("special_bonus_unique_windranger")?.Level !== 0
			? AbilityLogicType.Invisibility
			: AbilityLogicType.None
	}
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("windrunner_windrun", windrunner_windrun)
