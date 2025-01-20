import { WrapperClassModifier } from "../../../../Decorators"
import { EModifierfunction } from "../../../../Enums/EModifierfunction"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_leshrac_decrepify extends Modifier implements IDebuff {
	public readonly IsGhost = true
	public readonly IsHidden = false
	public readonly DebuffModifierName = this.Name

	private cachedMres = 0
	private cachedSpeed = 0

	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_MOVESPEED_BONUS_PERCENTAGE,
			this.GetMoveSpeedBonusPercentage.bind(this)
		],
		[
			EModifierfunction.MODIFIER_PROPERTY_MAGICAL_RESISTANCE_DECREPIFY_UNIQUE,
			this.GetMagicalResistanceDecrepifyUnique.bind(this)
		]
	])
	public IsDebuff(): this is IDebuff {
		return true
	}
	protected GetMoveSpeedBonusPercentage(): [number, boolean] {
		return [-this.cachedSpeed, this.IsMagicImmune()]
	}
	protected GetMagicalResistanceDecrepifyUnique(): [number, boolean] {
		return [-this.cachedMres, this.IsMagicImmune()]
	}
	protected UpdateSpecialValues(): void {
		const name = "leshrac_greater_lightning_storm"
		this.cachedMres = this.GetSpecialValue("magic_amp", name)
		this.cachedSpeed = this.GetSpecialValue("slow", name)
	}
}
