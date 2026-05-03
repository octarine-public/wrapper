import { WrapperClass } from "../../../Decorators"
import { Ability } from "../../Base/Ability"
import { Unit } from "../../Base/Unit"

@WrapperClass("chen_martyrdom")
export class chen_martyrdom extends Ability implements INuke {
	public IsNuke(): this is INuke {
		return true
	}
	public GetRawDamage(target: Unit): number {
		const owner = this.Owner,
			damage = super.GetRawDamage(target)
		if (owner === undefined) {
			return damage
		}
		return damage + (owner.HP * this.GetSpecialValue("current_hp_pct")) / 100
	}
	public GetBaseDamageForLevel(level: number): number {
		return this.GetSpecialValue("base_value", level)
	}
}
