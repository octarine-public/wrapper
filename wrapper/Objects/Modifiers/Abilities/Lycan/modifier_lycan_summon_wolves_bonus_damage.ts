import { WrapperClassModifier } from "../../../../Decorators"
import { EModifierfunction } from "../../../../Enums/EModifierfunction"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_lycan_summon_wolves_bonus_damage extends Modifier {
	private cachedDamage = 0

	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_PREATTACK_BONUS_DAMAGE,
			this.GetPreAttackBonusDamage.bind(this)
		]
	])

	protected GetPreAttackBonusDamage(_params?: IModifierParams): [number, boolean] {
		return [this.cachedDamage, false]
	}

	protected UpdateSpecialValues(): void {
		this.cachedDamage = this.GetSpecialValue("bonus_damage", "lycan_feral_impulse")
	}
}
