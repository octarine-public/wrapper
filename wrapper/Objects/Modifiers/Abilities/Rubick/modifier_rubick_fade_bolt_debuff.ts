import { WrapperClassModifier } from "../../../../Decorators"
import { EModifierfunction } from "../../../../Enums/EModifierfunction"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_rubick_fade_bolt_debuff extends Modifier implements IDebuff {
	public readonly IsHidden = false
	public readonly DebuffModifierName = this.Name

	private cachedDamage = 0

	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_PREATTACK_BONUS_DAMAGE,
			this.GetPreAttackBonusDamage.bind(this)
		],
		[
			EModifierfunction.MODIFIER_PROPERTY_SPELL_AMPLIFY_PERCENTAGE,
			this.GetSpellAmplifyPercentage.bind(this)
		]
	])
	public IsDebuff(): this is IDebuff {
		return true
	}
	protected GetPreAttackBonusDamage(params?: IModifierParams): [number, boolean] {
		return [
			-(((params?.RawDamageBase ?? 0) * this.cachedDamage) / 100),
			this.IsMagicImmune()
		]
	}
	protected GetSpellAmplifyPercentage(): [number, boolean] {
		return [-this.cachedDamage, this.IsMagicImmune()]
	}
	protected UpdateSpecialValues(): void {
		this.cachedDamage = this.GetSpecialValue("damage_reduction", "rubick_fade_bolt")
	}
}
