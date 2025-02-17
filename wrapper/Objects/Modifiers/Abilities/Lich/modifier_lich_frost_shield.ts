import { WrapperClassModifier } from "../../../../Decorators"
import { EModifierfunction } from "../../../../Enums/EModifierfunction"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_lich_frost_shield extends Modifier implements IBuff, IShield {
	public readonly IsHidden = false
	public readonly BuffModifierName = this.Name
	public readonly ShieldModifierName = this.Name

	private cachedIncDamage = 0

	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_PREATTACK_INCOMING_DAMAGE_PERCENTAGE,
			this.GetIncomingDamagePercentage.bind(this)
		]
	])
	public IsBuff(): this is IBuff {
		return true
	}
	public IsShield(): this is IShield {
		return true
	}
	protected GetIncomingDamagePercentage(_params?: IModifierParams): [number, boolean] {
		return [-this.cachedIncDamage, false]
	}
	protected UpdateSpecialValues(): void {
		this.cachedIncDamage = this.GetSpecialValue(
			"damage_reduction",
			"lich_frost_shield"
		)
	}
}
