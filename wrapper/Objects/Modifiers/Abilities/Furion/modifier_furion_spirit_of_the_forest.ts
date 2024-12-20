import { WrapperClassModifier } from "../../../../Decorators"
import { EModifierfunction } from "../../../../Enums/EModifierfunction"
import { Hero } from "../../../Base/Hero"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_furion_spirit_of_the_forest extends Modifier {
	private cachedMultiplier: number = 0
	private cachedDamagePerTree: number = 0

	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_PREATTACK_BONUS_DAMAGE,
			this.GetPreAttackBonusDamage.bind(this)
		]
	])

	protected GetPreAttackBonusDamage(params?: IModifierParams): [number, boolean] {
		if (params === undefined) {
			return [0, false]
		}
		const owner = this.Parent
		if (!(owner instanceof Hero) || this.IsPassiveDisabled()) {
			return [0, false]
		}
		let multiplier = this.cachedMultiplier
		if (owner.HeroFacetID === 1) {
			multiplier = this.cachedDamagePerTree
		}
		const mulDamage = this.NetworkDamage * multiplier
		return [((params.RawDamageBase ?? 0) * mulDamage) / 100, false]
	}

	protected UpdateSpecialValues(): void {
		const name = "furion_spirit_of_the_forest"
		this.cachedMultiplier = this.GetSpecialValue("multiplier", name)
		this.cachedDamagePerTree = this.GetSpecialValue("damage_per_tree_pct", name)
	}
}
