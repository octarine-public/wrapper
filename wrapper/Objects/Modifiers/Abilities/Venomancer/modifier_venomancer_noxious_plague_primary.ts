import { WrapperClassModifier } from "../../../../Decorators"
import { EModifierfunction } from "../../../../Enums/EModifierfunction"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_venomancer_noxious_plague_primary
	extends Modifier
	implements IDebuff
{
	public readonly IsHidden = false
	public readonly DebuffModifierName = this.Name

	private cachedMres = 0
	private cachedSpeed = 0

	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_MOVESPEED_BONUS_PERCENTAGE,
			this.GetMoveSpeedBonusPercentage.bind(this)
		],
		[
			EModifierfunction.MODIFIER_PROPERTY_MAGICAL_RESISTANCE_BONUS,
			this.GetMagicalResistanceBonus.bind(this)
		]
	])
	public IsDebuff(): this is IDebuff {
		return true
	}
	protected GetMagicalResistanceBonus(): [number, boolean] {
		return [-this.cachedMres, false]
	}
	protected GetMoveSpeedBonusPercentage(): [number, boolean] {
		return [-this.cachedSpeed, this.IsMagicImmune()]
	}
	protected UpdateSpecialValues(): void {
		const name = "venomancer_noxious_plague"
		this.cachedMres = this.GetSpecialValue("mres_reduce", name)
		this.cachedSpeed = this.GetSpecialValue("movement_slow", name)
	}
}
