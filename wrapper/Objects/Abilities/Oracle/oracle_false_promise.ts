import { WrapperClass } from "../../../Decorators"
import { Ability } from "../../Base/Ability"

@WrapperClass("oracle_false_promise")
export class oracle_false_promise extends Ability {
	public get IsInvisibility(): boolean {
		return this.Owner?.HasScepter ?? false
	}

	public GetBaseAOERadiusForLevel(level: number): number {
		return this.GetSpecialValue("radius", level)
	}
}
