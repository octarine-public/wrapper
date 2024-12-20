import { WrapperClassModifier } from "../../../../Decorators"
import { EModifierfunction } from "../../../../Enums/EModifierfunction"
import { Modifier } from "../../../Base/Modifier"
import { modifier_spectre_dispersion_boost } from "./modifier_spectre_dispersion_boost"

@WrapperClassModifier()
export class modifier_spectre_dispersion extends Modifier {
	private cachedDamageReflection = 0
	private cachedDamageReflectionValue = 0

	protected readonly CanPostDataUpdate = true
	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_INCOMING_DAMAGE_PERCENTAGE,
			this.GetIncomingDamagePercentage.bind(this)
		]
	])

	public PostDataUpdate(): void {
		const owner = this.Parent
		if (owner === undefined || owner.IsIllusion || this.IsPassiveDisabled()) {
			this.cachedDamageReflection = 0
			return
		}
		let value = this.cachedDamageReflectionValue
		const modifier = owner.GetBuffByClass(modifier_spectre_dispersion_boost)
		if (modifier !== undefined) {
			value *= (modifier.CachedDamageReflection + 100) / 100
		}
		this.cachedDamageReflection = value
	}

	protected GetIncomingDamagePercentage(): [number, boolean] {
		return [-this.cachedDamageReflection, false]
	}

	protected UpdateSpecialValues(): void {
		this.cachedDamageReflectionValue = this.GetSpecialValue(
			"damage_reflection_pct",
			"spectre_dispersion"
		)
	}
}
