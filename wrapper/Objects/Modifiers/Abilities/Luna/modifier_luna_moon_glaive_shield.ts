import { WrapperClassModifier } from "../../../../Decorators"
import { EModifierfunction } from "../../../../Enums/EModifierfunction"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_luna_moon_glaive_shield extends Modifier implements IBuff, IShield {
	public readonly IsHidden = false
	public readonly BuffModifierName = this.Name
	public readonly ShieldModifierName = this.Name

	private cachedIncomingDamage = 0
	private cachedMovespeed = 0

	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_INCOMING_DAMAGE_PERCENTAGE,
			this.GetIncomingDamagePercentage.bind(this)
		],
		[
			EModifierfunction.MODIFIER_PROPERTY_MOVESPEED_BONUS_PERCENTAGE,
			this.GetMoveSpeedBonusPercentage.bind(this)
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
	protected GetMoveSpeedBonusPercentage(): [number, boolean] {
		return [this.cachedMovespeed, false]
	}
	protected UpdateSpecialValues(): void {
		const name = "luna_lunar_orbit"
		this.cachedIncomingDamage = this.GetSpecialValue(
			"rotating_glaives_damage_reduction",
			name
		)
		this.cachedMovespeed = this.GetSpecialValue("bonus_movement_speed", name)
	}
}
