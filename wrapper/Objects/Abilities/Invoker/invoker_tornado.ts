import { WrapperClass } from "../../../Decorators"
import { Unit } from "../../Base/Unit"
import { invoker_spell_extends } from "./invoker_spell_extends"

@WrapperClass("invoker_tornado")
export class invoker_tornado extends invoker_spell_extends implements INuke {
	public IsNuke(): this is INuke {
		return true
	}
	public GetBaseAOERadiusForLevel(level: number): number {
		return this.GetSpecialValue("area_of_effect", level)
	}
	public GetBaseDamageForLevel(level: number): number {
		return this.GetSpecialValue("base_damage", level)
	}
	public GetBaseSpeedForLevel(level: number): number {
		return this.GetSpecialValue("travel_speed", level)
	}
	public GetRawDamage(target: Unit): number {
		return (
			super.GetRawDamage(target) + this.GetSpecialValue("wex_damage", this.WexLevel)
		)
	}
}
