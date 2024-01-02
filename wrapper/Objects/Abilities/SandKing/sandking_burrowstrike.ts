import { WrapperClass } from "../../../Decorators"
import { Ability } from "../../Base/Ability"

@WrapperClass("sandking_burrowstrike")
export class sandking_burrowstrike extends Ability {
	public get Speed(): number {
		return this.GetSpecialValue(
			`burrow_speed${this.Owner?.HasScepter ? "_scepter" : ""}`
		)
	}
	public GetBaseCastRangeForLevel(level: number): number {
		return this.GetSpecialValue("AbilityCastRange", level)
	}
}
