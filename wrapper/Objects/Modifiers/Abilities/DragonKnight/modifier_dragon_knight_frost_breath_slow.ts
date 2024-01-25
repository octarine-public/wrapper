import { WrapperClassModifier } from "../../../../Decorators"
import { Modifier } from "../../../Base/Modifier"
import { Unit } from "../../../Base/Unit"

@WrapperClassModifier()
export class modifier_dragon_knight_frost_breath_slow extends Modifier {
	public readonly IsDebuff = true

	protected SetMoveSpeedAmplifier(
		specialName = "frost_bonus_movement_speed",
		subtract = false
	): void {
		super.SetMoveSpeedAmplifier(specialName, subtract)
	}

	protected GetSpecialValue(
		specialName: string,
		level: number = this.AbilityLevel
	): number {
		if (!this.IsValid || this.Caster === undefined) {
			return 0
		}
		if (this.isBlackDragonForm(this.Caster)) {
			level += 1
		}
		return super.GetSpecialValue(specialName, level)
	}

	private isBlackDragonForm(unit: Nullable<Unit>) {
		return unit?.HasBuffByName("modifier_dragon_knight_black_dragon_tooltip") ?? false
	}
}
