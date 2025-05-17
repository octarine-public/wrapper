import { WrapperClass } from "../../../Decorators"
import { Ability } from "../../Base/Ability"
import { Unit } from "../../Base/Unit"

@WrapperClass("axe_culling_blade")
export class axe_culling_blade extends Ability implements INuke {
	public IsNuke(): this is INuke {
		return true
	}
	public GetBaseDamageForLevel(level: number): number {
		return this.GetSpecialValue("damage", level)
	}
	public GetDamage(target: Unit): number {
		if (target.IsAvoidTotalDamage) {
			return 0
		}
		const rawDamage = this.GetRawDamage(target)
		if (target.HP <= rawDamage) {
			return rawDamage
		}
		return target.HP <= rawDamage ? rawDamage : super.GetDamage(target)
	}
}
