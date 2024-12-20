import { WrapperClass } from "../../../Decorators"
import { Ability } from "../../Base/Ability"
import { Unit } from "../../Base/Unit"

@WrapperClass("necrolyte_reapers_scythe")
export class necrolyte_reapers_scythe extends Ability {
	public GetRawDamage(target: Unit): number {
		const owner = this.Owner
		if (owner === undefined || this.Level === 0) {
			return 0
		}
		const damagePerHP = this.GetSpecialValue("damage_per_health")
		return (target.MaxHP - target.HP) * damagePerHP
	}
}
