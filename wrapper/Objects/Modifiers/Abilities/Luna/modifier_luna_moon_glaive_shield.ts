import { WrapperClassModifier } from "../../../../Decorators"
import { EModifierfunction } from "../../../../Enums/EModifierfunction"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_luna_moon_glaive_shield extends Modifier implements IBuff, IShield {
	public readonly IsHidden = false
	public readonly BuffModifierName = this.Name
	public readonly ShieldModifierName = this.Name

	private cachedIncomingDamage = 0

	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_INCOMING_DAMAGE_PERCENTAGE,
			this.GetIncomingDamagePercentage.bind(this)
		]
	])
	public IsBuff(): this is IBuff {
		return true
	}
	public IsShield(): this is IShield {
		return true
	}
	protected GetIncomingDamagePercentage(): [number, boolean] {
		return [-this.cachedIncomingDamage, false]
	}
	protected UpdateSpecialValues(): void {
		this.cachedIncomingDamage = this.GetSpecialValue(
			"rotating_glaives_damage_reduction",
			"luna_lunar_orbit"
		)
	}
}
