import { WrapperClassModifier } from "../../../../Decorators"
import { Modifier } from "../../../Base/Modifier"
import { Unit } from "../../../Base/Unit"

@WrapperClassModifier()
export class modifier_enraged_wildkin_toughness_aura_bonus extends Modifier {
	public readonly IsBuff = true

	public IsPassiveDisabled(unit: Nullable<Unit> = this.Caster) {
		return (unit ?? this.Parent)?.IsPassiveDisabled ?? false
	}

	protected SetBonusArmor(specialName = "bonus_armor", subtract = false): void {
		super.SetBonusArmor(specialName, subtract)
	}
}
