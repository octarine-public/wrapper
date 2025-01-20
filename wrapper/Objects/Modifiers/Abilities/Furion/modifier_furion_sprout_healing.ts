import { WrapperClassModifier } from "../../../../Decorators"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_furion_sprout_healing extends Modifier implements IBuff {
	public readonly IsHidden = false
	public readonly BuffModifierName = this.Name

	private cachedDuration = 0

	public get Duration(): number {
		return this.cachedDuration || super.Duration
	}
	public IsBuff(): this is IBuff {
		return true
	}
	protected UpdateSpecialValues(): void {
		this.cachedDuration = this.GetSpecialValue("duration", "furion_sprout")
	}
}
