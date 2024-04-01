import { WrapperClass } from "../../../Decorators"
import { Ability } from "../../Base/Ability"

@WrapperClass("undying_decay")
export class undying_decay extends Ability {
	public get AbilityDamage(): number {
		return this.GetSpecialValue("decay_damage")
	}

	public GetBaseAOERadiusForLevel(level: number): number {
		return this.GetSpecialValue("radius", level)
	}
}
