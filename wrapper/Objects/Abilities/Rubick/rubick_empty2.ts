import { WrapperClass } from "../../../Decorators"
import { Ability } from "../../Base/Ability"

@WrapperClass("rubick_empty2")
export class rubick_empty2 extends Ability {
	constructor(index: number, serial: number, name: string) {
		super(index, serial, name)
		this.IsEmpty = true
	}
}
