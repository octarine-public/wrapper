import { WrapperClass } from "../../../Decorators"
import { Ability } from "../../Base/Ability"

@WrapperClass("magnataur_skewer")
export class magnataur_skewer extends Ability {
	public get Speed(): number {
		return this.GetSpecialValue("skewer_speed")
	}
	public GetBaseAOERadiusForLevel(level: number): number {
		return this.GetSpecialValue("skewer_radius", level)
	}
}
