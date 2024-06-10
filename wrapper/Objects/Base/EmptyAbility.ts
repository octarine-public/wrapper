import { WrapperClass } from "../../Decorators"
import { Ability } from "./Ability"

@WrapperClass("CDOTAEmptyAbility")
export class EmptyAbility extends Ability {
	constructor(index: number, serial: number, name: string) {
		super(index, serial, name)
		this.IsEmpty = true
	}
}
