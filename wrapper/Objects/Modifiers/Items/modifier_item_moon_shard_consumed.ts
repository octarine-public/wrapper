import { WrapperClassModifier } from "../../../Decorators"
import { Modifier } from "../../Base/Modifier"

@WrapperClassModifier()
export class modifier_item_moon_shard_consumed extends Modifier {
	protected readonly CustomAbilityName = "item_moon_shard"

	protected SetBonusNightVision(
		specialName = "consumed_bonus_night_vision",
		subtract = false
	): void {
		super.SetBonusNightVision(specialName, subtract)
	}
}
