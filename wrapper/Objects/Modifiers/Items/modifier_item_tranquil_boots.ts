import { WrapperClassModifier } from "../../../Decorators"
import { Modifier } from "../../Base/Modifier"

@WrapperClassModifier()
export class modifier_item_tranquil_boots extends Modifier {
	public readonly IsBoots = true

	public OnAbilityCooldownChanged(): void {
		this.SetBonusMoveSpeed()
	}

	protected SetBonusMoveSpeed(_specialName?: string, subtract = false): void {
		if (this.Ability === undefined) {
			this.BonusMoveSpeed = 0
			return
		}
		const cooldown = this.Ability.Cooldown
		const specialSpeed = `${cooldown === 0 ? "bonus_" : "broken_"}movement_speed`
		super.SetBonusMoveSpeed(specialSpeed, subtract)
	}
}
