import { WrapperClass } from "../../../Decorators"
import { Ability } from "../../Base/Ability"

@WrapperClass("chaos_knight_reality_rift")
export class chaos_knight_reality_rift extends Ability {
	public get CanHitSpellImmuneEnemy(): boolean {
		return (
			super.CanHitSpellImmuneEnemy || this.GetSpecialValue("pierces_immunity") !== 0
		)
	}
}
