import { WrapperClass } from "../../../Decorators"
import { Ability } from "../../Base/Ability"

@WrapperClass("enigma_gravity_well")
export class enigma_gravity_well extends Ability {
	public get ShouldBeDrawable(): boolean {
		return false
	}
}
