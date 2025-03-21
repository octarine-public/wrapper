import { WrapperClassModifier } from "../../../../Decorators"
import { EModifierfunction } from "../../../../Enums/EModifierfunction"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_furbolg_enrage_damage extends Modifier {
	private cachedDamage = 0

	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_PREATTACK_BONUS_DAMAGE,
			this.GetPreAttackBonusDamage.bind(this)
		]
	])

	protected GetPreAttackBonusDamage(_params?: IModifierParams): [number, boolean] {
		const owner = this.Parent
		if (owner === undefined) {
			return [0, false]
		}
		return [(owner.AttackDamageAverage * this.cachedDamage) / 100, false]
	}

	protected UpdateSpecialValues() {
		this.cachedDamage = this.GetSpecialValue("bonus_dmg_pct", "furbolg_enrage_damage")
	}
}
