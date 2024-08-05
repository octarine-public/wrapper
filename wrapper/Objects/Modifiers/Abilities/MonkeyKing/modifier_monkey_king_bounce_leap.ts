import { WrapperClassModifier } from "../../../../Decorators"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_monkey_king_bounce_leap extends Modifier {
	public get InvisibilityLevel(): number {
		return 0
	}
	public get DeltaZ(): number {
		// just in case buff bugs out
		return this.ElapsedTime < 10 ? (this.kv.FadeTime ?? 0) : 0
	}
}
