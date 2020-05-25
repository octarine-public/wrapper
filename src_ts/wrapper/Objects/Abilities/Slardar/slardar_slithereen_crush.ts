import Ability from "../../Base/Ability"
import { WrapperClass } from "../../../Decorators"

@WrapperClass("slardar_slithereen_crush")
export default class slardar_slithereen_crush extends Ability {
	public get AOERadius(): number {
		return this.GetSpecialValue("crush_radius")
	}
}
