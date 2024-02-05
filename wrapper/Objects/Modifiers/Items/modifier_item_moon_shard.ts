import { WrapperClassModifier } from "../../../Decorators"
import { Modifier } from "../../Base/Modifier"

@WrapperClassModifier()
export class modifier_item_moon_shard extends Modifier {
	public static readonly ChildName = "modifier_item_moon_shard_consumed"

	public readonly BonusAttackSpeedStack = true

	protected readonly CustomAbilityName = "item_moon_shard"

	protected SetBonusNightVision(
		specialName = "bonus_night_vision",
		_subtract = false
	): void {
		const owner = this.Parent
		if (owner === undefined) {
			return
		}
		const value = this.GetSpecialValue(specialName)
		const hasChildBuff = owner.HasBuffByName(modifier_item_moon_shard.ChildName)
		this.BonusNightVision = hasChildBuff ? value / 2 : value
	}

	protected SetBonusAttackSpeed(specialName = "bonus_attack_speed", subtract = false) {
		super.SetBonusAttackSpeed(specialName, subtract)
	}
}
