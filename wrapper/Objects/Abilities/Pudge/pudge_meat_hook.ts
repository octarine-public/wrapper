import { WrapperClass } from "../../../Decorators"
import Ability from "../../Base/Ability"

@WrapperClass("pudge_meat_hook")
@WrapperClass("CDOTA_Ability_Pudge_MeatHook")
export default class pudge_meat_hook extends Ability {
	public get Speed(): number {
		return this.GetSpecialValue("hook_speed")
	}
	public GetAOERadiusForLevel(level: number): number {
		return this.GetSpecialValue("hook_width", level)
	}
}
