import { WrapperClassModifier } from "../../../../Decorators"
import { EModifierfunction } from "../../../../Enums/EModifierfunction"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_winter_wyvern_winterproof extends Modifier {
	private cachedDamage = 0

	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_PREATTACK_BONUS_DAMAGE,
			this.GetPreAttackBonusDamage.bind(this)
		]
	])

	protected GetPreAttackBonusDamage(params?: IModifierParams): [number, boolean] {
		return [((params?.RawDamageBase ?? 0) * this.cachedDamage) / 100, false]
	}

	protected UpdateSpecialValues(): void {
		this.cachedDamage = this.GetSpecialValue(
			"damage_buff_pct",
			"winter_wyvern_cold_embrace"
		)
	}
}
