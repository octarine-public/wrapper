import { WrapperClassModifier } from "../../../Decorators"
import { EModifierfunction } from "../../../Enums/EModifierfunction"
import { lycan_summon_wolves } from "../../../Imports"
import { Modifier } from "../../Base/Modifier"

@WrapperClassModifier()
export class modifier_kill extends Modifier {
	private cachedBAT = 0

	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_FIXED_ATTACK_RATE,
			this.GetFixedAttackRate.bind(this)
		]
	])
	protected GetFixedAttackRate(): [number, boolean] {
		return [this.cachedBAT, false]
	}
	protected UpdateSpecialValues(): void {
		if (this.Ability instanceof lycan_summon_wolves) {
			this.cachedBAT = this.GetSpecialValue("wolf_bat", this.Ability.Name)
		}
	}
}
