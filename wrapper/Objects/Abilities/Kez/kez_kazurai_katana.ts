import { WrapperClass } from "../../../Decorators"
import { DOTA_ABILITY_BEHAVIOR } from "../../../Enums/DOTA_ABILITY_BEHAVIOR"
import { Ability } from "../../Base/Ability"

@WrapperClass("kez_kazurai_katana")
export class kez_kazurai_katana extends Ability {
	public get AbilityBehaviorMask(): DOTA_ABILITY_BEHAVIOR {
		const behavior = super.AbilityBehaviorMask
		return this.OwnerHasShard
			? behavior | DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_UNIT_TARGET
			: behavior
	}
}
