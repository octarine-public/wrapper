import { WrapperClassModifier } from "../../../../Decorators"
import { EModifierfunction } from "../../../../Enums/EModifierfunction"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_muerta_pierce_the_veil_buff extends Modifier implements IBuff {
	public readonly IsHidden = false
	public readonly BuffModifierName = this.Name

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
	public IsBuff(): this is IBuff {
		return true
	}
	protected GetPreAttackBonusDamage(params?: IModifierParams): [number, boolean] {
		return [((params?.RawDamageBase ?? 0) * this.cachedDamage) / 100, false]
	}
	protected GetProcAttackConvertPhysicalToMagical(): [number, boolean] {
		return [1, false]
	}
	protected UpdateSpecialValues(): void {
		this.cachedDamage = this.GetSpecialValue(
			"base_damage_percent",
			"muerta_pierce_the_veil"
		)
	}
}
