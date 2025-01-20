import { WrapperClassModifier } from "../../../../Decorators"
import { EModifierfunction } from "../../../../Enums/EModifierfunction"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_hoodwink_bushwhack_trap
	extends Modifier
	implements IDisable, IDebuff
{
	public readonly IsHidden = false
	public readonly DebuffModifierName = this.Name

	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_FIXED_DAY_VISION,
			this.GetFixedDayVision.bind(this)
		],
		[
			EModifierfunction.MODIFIER_PROPERTY_FIXED_NIGHT_VISION,
			this.GetFixedNightVision.bind(this)
		]
	])
	public IsDebuff(): this is IDebuff {
		return true
	}
	public IsDisable(): this is IDisable {
		return true
	}
	protected GetFixedDayVision(): [number, boolean] {
		return [1, this.IsMagicImmune()]
	}
	protected GetFixedNightVision(): [number, boolean] {
		return [1, this.IsMagicImmune()]
	}
}
