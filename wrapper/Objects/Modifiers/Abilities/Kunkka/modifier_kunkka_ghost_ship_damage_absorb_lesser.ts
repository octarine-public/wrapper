import { WrapperClassModifier } from "../../../../Decorators"
import { EModifierfunction } from "../../../../Enums/EModifierfunction"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_kunkka_ghost_ship_damage_absorb_lesser
	extends Modifier
	implements IBuff, IShield
{
	public readonly IsHidden = false
	public readonly BuffModifierName = this.Name
	public readonly ShieldModifierName = this.Name

	private cachedSpeed = 0
	private cachedIncomingDamage = 0

	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_MOVESPEED_BONUS_PERCENTAGE,
			this.GetMoveSpeedBonusPercentage.bind(this)
		],
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
	protected GetMoveSpeedBonusPercentage(): [number, boolean] {
		return [this.cachedSpeed, false]
	}
	protected GetIncomingDamagePercentage(): [number, boolean] {
		return [-this.cachedIncomingDamage, false]
	}
	protected UpdateSpecialValues(): void {
		const name = "kunkka_admirals_rum"
		this.cachedSpeed = this.GetSpecialValue("movespeed_bonus", name)
		this.cachedIncomingDamage = this.GetSpecialValue("ghostship_absorb", name)
	}
}
