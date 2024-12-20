import { WrapperClass } from "../../../Decorators"
import { Ability } from "../../Base/Ability"
import { Unit } from "../../Base/Unit"

@WrapperClass("bloodseeker_rupture")
export class bloodseeker_rupture extends Ability {
	public GetRawDamage(target: Unit): number {
		const owner = this.Owner
		if (owner === undefined || this.Level === 0) {
			return 0
		}
		return (target.HP * this.GetSpecialValue("hp_pct")) / 100
	}
}
