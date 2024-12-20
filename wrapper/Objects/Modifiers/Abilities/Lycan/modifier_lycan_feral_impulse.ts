import { WrapperClassModifier } from "../../../../Decorators"
import { EModifierfunction } from "../../../../Enums/EModifierfunction"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_lycan_feral_impulse extends Modifier {
	private cachedDamage = 0

	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_PREATTACK_BONUS_DAMAGE,
			this.GetPreAttackBonusDamage.bind(this)
		]
	])

	protected GetPreAttackBonusDamage(params?: IModifierParams): [number, boolean] {
		if (params === undefined) {
			return [0, false]
		}
		const damage = ((params.RawDamageBase ?? 0) * this.cachedDamage) / 100
		return [damage, this.IsPassiveDisabled(this.Caster)]
	}

	protected UpdateSpecialValues(): void {
		this.cachedDamage = this.GetSpecialValue("bonus_damage", "lycan_feral_impulse")
	}
}
