import { WrapperClass } from "../../../Decorators"
import { Ability } from "../../Base/Ability"

@WrapperClass("ancient_apparition_ice_blast_release")
export class ancient_apparition_ice_blast_release extends Ability {
	public get Speed() {
		return 750
	}
}
