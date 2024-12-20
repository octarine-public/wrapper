import { WrapperClassModifier } from "../../../../Decorators"
import { EModifierfunction } from "../../../../Enums/EModifierfunction"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_muerta_pierce_the_veil_buff extends Modifier {
	private cachedDamage = 0

	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_PREATTACK_BONUS_DAMAGE,
			this.GetPreAttackBonusDamage.bind(this)
		],
		[
			EModifierfunction.MODIFIER_PROPERTY_PROCATTACK_CONVERT_PHYSICAL_TO_MAGICAL,
			this.GetProcAttackConvertPhysicalToMagical.bind(this)
		]
	])

	protected GetPreAttackBonusDamage(): [number, boolean] {
		return [this.cachedDamage, false]
	}

	protected GetProcAttackConvertPhysicalToMagical(): [number, boolean] {
		return [1, false]
	}

	protected UpdateSpecialValues(): void {
		this.cachedDamage = this.GetSpecialValue("bonus_damage", "muerta_pierce_the_veil")
	}
}
