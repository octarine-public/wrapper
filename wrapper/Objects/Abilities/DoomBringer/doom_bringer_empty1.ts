import { WrapperClass } from "../../../Decorators"
import { Ability } from "../../Base/Ability"

@WrapperClass("doom_bringer_empty1")
export class doom_bringer_empty1 extends Ability {
	constructor(index: number, serial: number, name: string) {
		super(index, serial, name)
		this.IsEmpty = true
	}
}
