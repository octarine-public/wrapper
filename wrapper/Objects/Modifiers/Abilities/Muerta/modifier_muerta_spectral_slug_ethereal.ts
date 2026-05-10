import { WrapperClassModifier } from "../../../../Decorators"
import { EModifierfunction } from "../../../../Enums/EModifierfunction"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_muerta_spectral_slug_ethereal extends Modifier implements IDebuff {
	public readonly IsHidden: boolean = false
	public readonly DebuffModifierName = this.Name

	private cachedSpeed = 0
	private cachedIncDamage = 0

	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_MOVESPEED_BONUS_PERCENTAGE,
			this.GetMoveSpeedBonusPercentage.bind(this)
		],
		[
			EModifierfunction.MODIFIER_PROPERTY_INCOMING_DAMAGE_PERCENTAGE,
			this.GetIncomingDamagePercentage.bind(this)
		]
	])
	public IsDebuff(): this is IDebuff {
		return true
	}
	protected GetMoveSpeedBonusPercentage(): [number, boolean] {
		return [this.cachedSpeed, this.IsMagicImmune()]
	}
	protected GetIncomingDamagePercentage(): [number, boolean] {
		return [-this.cachedIncDamage, this.IsMagicImmune()]
	}
	protected UpdateSpecialValues(): void {
		const name = "muerta_spectral_slug"
		this.cachedSpeed = this.GetSpecialValue("slow_pct", name)
		this.cachedIncDamage = this.GetSpecialValue("bonus_spell_damage_pct", name)
	}
}
