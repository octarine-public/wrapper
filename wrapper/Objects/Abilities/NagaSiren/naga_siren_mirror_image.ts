import { WrapperClass } from "../../../Decorators"
import { Ability } from "../../Base/Ability"

@WrapperClass("naga_siren_mirror_image")
export class naga_siren_mirror_image extends Ability {
	public get AppearanceDelay(): number {
		return this.GetSpecialValue("invuln_duration")
	}
}
