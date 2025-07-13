import { WrapperClass } from "../../../Decorators"
import { Ability } from "../../Base/Ability"

@WrapperClass("shadow_demon_disseminate")
export class shadow_demon_disseminate extends Ability {
	public GetBaseAOERadiusForLevel(level: number): number {
		return this.GetSpecialValue("radius", level)
	}
	// public GetRawDamage(target: Unit): number {
	// 	const owner = this.Owner
	// 	if (owner === undefined || this.Level === 0) {
	// 		return 0
	// 	}
	// 	return (target.HP * this.GetSpecialValue("health_lost")) / 100
	// }
}
