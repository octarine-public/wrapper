import { WrapperClassModifier } from "../../../Decorators"
import { EModifierfunction } from "../../../Enums/EModifierfunction"
import { Modifier } from "../../Base/Modifier"

@WrapperClassModifier()
export class modifier_item_revenants_brooch_active extends Modifier {
	private suppressCrit = 0
	private cachedManaCost = 0

	protected readonly CanPostDataUpdate = true
	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_SUPPRESS_CRIT,
			this.GetSuppressCrit.bind(this)
		],
		[
			EModifierfunction.MODIFIER_PROPERTY_PROCATTACK_CONVERT_PHYSICAL_TO_MAGICAL,
			this.GetProcAttackConvertPhysicalToMagical.bind(this)
		]
	])

	public PostDataUpdate(): void {
		const owner = this.Parent,
			ability = this.Ability
		if (owner === undefined || ability === undefined) {
			this.suppressCrit = 0
			return
		}
		const currMana = owner.Mana
		const manaCost = ability.GetManaCostModifier(this.cachedManaCost)
		this.suppressCrit = currMana >= manaCost ? 1 : 0
	}

	protected GetSuppressCrit(): [number, boolean] {
		return [1, false]
	}

	protected GetProcAttackConvertPhysicalToMagical(): [number, boolean] {
		return [this.suppressCrit, false]
	}

	protected UpdateSpecialValues(): void {
		this.cachedManaCost = this.GetSpecialValue(
			"manacost_per_hit",
			"item_revenants_brooch"
		)
	}
}
