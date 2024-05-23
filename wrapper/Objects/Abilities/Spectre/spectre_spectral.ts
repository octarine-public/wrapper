import { WrapperClass } from "../../../Decorators"
import { Ability } from "../../Base/Ability"

@WrapperClass("spectre_spectral")
export class spectre_spectral extends Ability {
	public get ShouldBeDrawable(): boolean {
		return false
	}
}
