import { WrapperClassModifier } from "../../../../Decorators"
import { EModifierfunction } from "../../../../Enums/EModifierfunction"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_lich_sinister_gaze_cryophobia_debuff
	extends Modifier
	implements IDebuff
{
	public readonly IsHidden = false
	public readonly DebuffModifierName = this.Name

	private slowResistance = 0

	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_SLOW_RESISTANCE_STACKING,
			this.GetSlowResistanceStacking.bind(this)
		]
	])
	protected GetSlowResistanceStacking(): [number, boolean] {
		return [-this.slowResistance, this.IsMagicImmune()]
	}
	public IsDebuff(): this is IDebuff {
		return true
	}
	protected UpdateSpecialValues(): void {
		this.slowResistance = this.GetSpecialValue(
			"slow_resistance",
			"lich_sinister_gaze"
		)
	}
}
