import Ability from "../../Base/Ability"
import { WrapperClass } from "../../../Decorators"

@WrapperClass("naga_siren_mirror_image")
export default class naga_siren_mirror_image extends Ability {
	public get ActivationDelay(): number {
		return this.GetSpecialValue("invuln_duration")
	}
}
