import { WrapperClassModifier } from "../../../../Decorators"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_enigma_black_hole_pull extends Modifier {
	public get RemainingTime(): number {
		const blackHole = this.Ability
		if (blackHole === undefined) {
			return super.RemainingTime
		}
		return Math.max(blackHole.MaxDuration - this.ElapsedTime, 0)
	}
}
