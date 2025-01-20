import { WrapperClassModifier } from "../../../../Decorators"
import { EModifierfunction } from "../../../../Enums/EModifierfunction"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_earth_spirit_magnetize_hero_self_buff
	extends Modifier
	implements IBuff
{
	public readonly IsHidden = false
	public readonly BuffModifierName = this.Name

	private cachedAttackDamage = 0

	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_PREATTACK_BONUS_DAMAGE,
			this.GetPreAttackBonusDamage.bind(this)
		]
	])

	public IsBuff(): this is IBuff {
		return true
	}

	protected GetPreAttackBonusDamage(): [number, boolean] {
		return [this.cachedAttackDamage, false]
	}

	protected UpdateSpecialValues(): void {
		this.cachedAttackDamage = this.GetSpecialValue(
			"magnetized_rocks_bonus_self_damage",
			"earth_spirit_magnetize"
		)
	}
}
