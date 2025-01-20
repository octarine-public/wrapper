import { WrapperClassModifier } from "../../../../Decorators"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_spirit_breaker_charge_of_darkness_vision extends Modifier {
	public get ForceVisible(): boolean {
		return true
	}
	// public Remove(): boolean {
	// 	this.removeFakeModifier()
	// 	return super.Remove()
	// }
	// protected AddModifier(): boolean {
	// 	this.addFakeModifier()
	// 	return super.AddModifier()
	// }
	// private addFakeModifier(): void {}
	// private removeFakeModifier(): void {}
}
