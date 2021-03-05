import { WrapperClass } from "../../../Decorators"
import Ability from "../../Base/Ability"

@WrapperClass("snapfire_firesnap_cookie")
export default class snapfire_firesnap_cookie extends Ability {
	public get Speed(): number {
		return this.GetSpecialValue("projectile_speed")
	}
	public GetAOERadiusForLevel(level: number): number {
		return this.GetSpecialValue("impact_radius", level)
	}
}
