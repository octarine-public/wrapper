import { WrapperClassModifier } from "../../../../Decorators"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_faceless_void_chronosphere_freeze extends Modifier {
	public get RemainingTime(): number {
		const chronosphere = this.Ability
		if (chronosphere === undefined) {
			return super.RemainingTime
		}
		return Math.max(chronosphere.MaxDuration - this.ElapsedTime, 0)
	}
}
