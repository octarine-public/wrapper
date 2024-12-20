import { WrapperClassModifier } from "../../../../Decorators"
import { EModifierfunction } from "../../../../Enums/EModifierfunction"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_tidehunter_anchor_smash extends Modifier {
	private cachedReduction = 0

	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_PREATTACK_BONUS_DAMAGE,
			this.GetPreAttackBonusDamage.bind(this)
		]
	])

	protected GetPreAttackBonusDamage(params?: IModifierParams): [number, boolean] {
		const owner = this.Parent
		if (owner === undefined || params === undefined) {
			return [0, false]
		}
		const damage = params.RawDamageBase ?? 0
		return [damage - damage * (1 - this.cachedReduction / 100), this.IsMagicImmune()]
	}

	protected UpdateSpecialValues(): void {
		this.cachedReduction = this.GetSpecialValue(
			"damage_reduction",
			"tidehunter_anchor_smash"
		)
	}
}
