import Ability from "../../Base/Ability"
import { WrapperClass } from "../../../Decorators"

@WrapperClass("zuus_cloud")
export default class zuus_cloud extends Ability {
	public get CastRange(): number {
		return Number.MAX_SAFE_INTEGER
	}

	public get AOERadius(): number {
		return this.GetSpecialValue("cloud_radius")
	}
}
