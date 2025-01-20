import { WrapperClassModifier } from "../../../../Decorators"
import { EModifierfunction } from "../../../../Enums/EModifierfunction"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_gyrocopter_flak_cannon extends Modifier implements IBuff {
	public readonly IsHidden = false
	public readonly BuffModifierName = this.Name

	private cachedDamage = 0

	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_PREATTACK_BONUS_DAMAGE,
			this.GetPreAttackBonusDamage.bind(this)
		]
	])

	protected GetPreAttackBonusDamage(): [number, boolean] {
		return this.StackCount !== 0 ? [this.cachedDamage, false] : [0, false]
	}

	public IsBuff(): this is IBuff {
		return this.StackCount !== 0
	}

	protected UpdateSpecialValues(): void {
		this.cachedDamage = this.GetSpecialValue("bonus_damage", "gyrocopter_flak_cannon")
	}
}
