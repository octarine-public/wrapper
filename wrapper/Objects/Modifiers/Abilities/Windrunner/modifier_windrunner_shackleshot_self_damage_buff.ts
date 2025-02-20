import { WrapperClassModifier } from "../../../../Decorators"
import { EModifierfunction } from "../../../../Enums/EModifierfunction"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_windrunner_shackleshot_self_damage_buff
	extends Modifier
	implements IBuff
{
	public readonly IsHidden = false
	public readonly BuffModifierName = this.Name

	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_PREATTACK_BONUS_DAMAGE,
			this.GetPreAttackBonusDamage.bind(this)
		]
	])
	public IsBuff(): this is IBuff {
		return this.StackCount !== 0
	}
	protected GetPreAttackBonusDamage(): [number, boolean] {
		return [this.StackCount, false]
	}
	protected UpdateSpecialValues(): void {
		this.GetSpecialValue("bonus_damage_per_hero", "windrunner_shackleshot")
	}
}
