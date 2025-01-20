import { WrapperClassModifier } from "../../../../Decorators"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_faceless_void_chronosphere_freeze
	extends Modifier
	implements IDebuff, IDisable
{
	public readonly IsHidden = false
	public readonly DebuffModifierName = this.Name

	private cachedDuration = 0

	public get Duration(): number {
		return this.cachedDuration + this.InternalDuration
	}

	public IsDebuff(): this is IDebuff {
		return true
	}
	public IsDisable(): this is IDisable {
		return true
	}
	protected UpdateSpecialValues(): void {
		this.cachedDuration = this.GetSpecialValue(
			"duration",
			"faceless_void_chronosphere"
		)
	}
}
