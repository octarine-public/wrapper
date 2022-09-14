import { WrapperClass } from "../../../Decorators"
import { Ability } from "../../Base/Ability"

@WrapperClass("terrorblade_terror_wave")
export class terrorblade_terror_wave extends Ability {
	public GetAOERadiusForLevel(level: number): number {
		return this.GetSpecialValue("scepter_radius", level)
	}
}
