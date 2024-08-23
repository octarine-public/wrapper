import { WrapperClass } from "../../../Decorators"
import { Ability } from "../../Base/Ability"

@WrapperClass("ringmaster_dark_carnival_souvenirs")
export class ringmaster_dark_carnival_souvenirs extends Ability {
	public get ShouldBeDrawable(): boolean {
		return false
	}
}
