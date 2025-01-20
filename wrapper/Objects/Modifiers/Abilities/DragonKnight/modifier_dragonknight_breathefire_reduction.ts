import { WrapperClassModifier } from "../../../../Decorators"
import { EModifierfunction } from "../../../../Enums/EModifierfunction"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_dragonknight_breathefire_reduction
	extends Modifier
	implements IDebuff
{
	public readonly IsHidden = false
	public readonly DebuffModifierName = this.Name

	private cachedAttackDamage = 0

	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_PREATTACK_BONUS_DAMAGE_PERCENTAGE,
			this.GetPreAttackBonusDamagePercentage.bind(this)
		]
	])

	public IsDebuff(): this is IDebuff {
		return true
	}

	protected GetPreAttackBonusDamagePercentage(): [number, boolean] {
		return [this.cachedAttackDamage, false]
	}

	protected UpdateSpecialValues(): void {
		this.cachedAttackDamage = this.GetSpecialValue(
			"reduction",
			"dragon_knight_breathe_fire"
		)
	}
}
