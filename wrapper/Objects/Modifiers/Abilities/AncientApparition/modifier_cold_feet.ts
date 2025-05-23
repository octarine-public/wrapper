import { WrapperClassModifier } from "../../../../Decorators"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_cold_feet extends Modifier implements IDebuff {
	public readonly IsHidden = false
	public readonly DebuffModifierName = this.Name

	private cachedDuration = -1

	public get Duration(): number {
		return this.cachedDuration || super.Duration
	}
	public IsDebuff(): this is IDebuff {
		return true
	}
	protected UpdateSpecialValues(): void {
		this.cachedDuration = this.Ability?.MaxDuration ?? -1
	}
}
