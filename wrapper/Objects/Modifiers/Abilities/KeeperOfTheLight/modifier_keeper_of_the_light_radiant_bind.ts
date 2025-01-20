import { WrapperClassModifier } from "../../../../Decorators"
import { EModifierfunction } from "../../../../Enums/EModifierfunction"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_keeper_of_the_light_radiant_bind
	extends Modifier
	implements IDebuff
{
	public readonly IsHidden = false
	public readonly DebuffModifierName = this.Name

	private cachedMres = 0

	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_MAGICAL_RESISTANCE_BONUS,
			this.GetMagicalResistanceBonus.bind(this)
		],
		[
			EModifierfunction.MODIFIER_PROPERTY_MOVESPEED_BONUS_PERCENTAGE,
			this.GetMoveSpeedBonusPercentage.bind(this)
		]
	])
	public IsDebuff(): this is IDebuff {
		return true
	}
	protected GetMagicalResistanceBonus(): [number, boolean] {
		return [-this.cachedMres, this.IsMagicImmune()]
	}
	protected GetMoveSpeedBonusPercentage(): [number, boolean] {
		return [-this.StackCount, this.IsMagicImmune()]
	}
	protected UpdateSpecialValues(): void {
		this.cachedMres = this.GetSpecialValue(
			"magic_resistance",
			"keeper_of_the_light_radiant_bind"
		)
	}
}
