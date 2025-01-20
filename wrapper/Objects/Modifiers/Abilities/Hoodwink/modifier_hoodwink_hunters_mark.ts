import { WrapperClassModifier } from "../../../../Decorators"
import { EModifierfunction } from "../../../../Enums/EModifierfunction"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_hoodwink_hunters_mark extends Modifier implements IDebuff {
	public readonly IsHidden = false
	public readonly DebuffModifierName = this.Name

	private cachedSpeed = 0
	private cachedSpellAmplify = 0
	// private cachedStatusResist = 0

	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_MOVESPEED_BONUS_PERCENTAGE,
			this.GetMoveSpeedBonusPercentage.bind(this)
		],
		[
			EModifierfunction.MODIFIER_PROPERTY_SPELL_AMPLIFY_PERCENTAGE_TARGET,
			this.GetSpellAmplifyPercentageTarget.bind(this)
		]
		// [
		// 	EModifierfunction.MODIFIER_PROPERTY_STATUS_RESISTANCE_STACKING,
		// 	this.GetStatusResistanceStacking.bind(this)
		// ]
	])
	public IsDebuff(): this is IDebuff {
		return true
	}
	protected GetMoveSpeedBonusPercentage(): [number, boolean] {
		return [-this.cachedSpeed, this.IsMagicImmune()]
	}

	protected GetSpellAmplifyPercentageTarget(): [number, boolean] {
		return [this.cachedSpellAmplify, this.IsMagicImmune()]
	}

	// protected GetStatusResistanceStacking(): [number, boolean] {
	// 	return [-this.cachedStatusResist, this.IsMagicImmune()]
	// }

	protected UpdateSpecialValues(): void {
		const name = "hoodwink_hunters_boomerang"
		this.cachedSpeed = this.GetSpecialValue("slow_pct", name)
		this.cachedSpellAmplify = this.GetSpecialValue("spell_amp", name)
		// this.cachedStatusResist = this.GetSpecialValue("status_resistance", name)
	}
}
