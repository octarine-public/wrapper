import { WrapperClassModifier } from "../../../../Decorators"
import { Modifier } from "../../../Base/Modifier"
import { Unit } from "../../../Base/Unit"

@WrapperClassModifier()
export class modifier_ancient_rock_golem_weakening extends Modifier {
	public readonly IsDebuff = true

	public IsPassiveDisabled(unit: Nullable<Unit> = this.Caster) {
		return (unit ?? this.Parent)?.IsPassiveDisabled ?? false
	}

	protected SetBonusArmor(specialName = "armor_reduction", subtract = true): void {
		super.SetBonusArmor(specialName, subtract)
	}
}
