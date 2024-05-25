import { WrapperClassModifier } from "../../../../Decorators"
import { Modifier } from "../../../Base/Modifier"
import { Unit } from "../../../Base/Unit"

@WrapperClassModifier()
export class modifier_dragon_knight_dragon_form extends Modifier {
	public readonly IsBuff = true

	public Update(): void {
		super.Update()
		this.updateDependsModifier()
	}

	public Remove(): boolean {
		if (!super.Remove()) {
			return false
		}
		this.updateDependsModifier()
		return true
	}

	protected SetBonusAttackRange(
		specialName = "bonus_attack_range",
		subtract = false
	): void {
		super.SetBonusAttackRange(specialName, subtract)
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

	private updateDependsModifier() {
		// update by armor
		this.Parent?.GetBuffByName(
			"modifier_dragon_knight_inherited_vigor"
		)?.OnUnitStateChaged()
	}
}
