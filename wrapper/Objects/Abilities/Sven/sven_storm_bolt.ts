import { WrapperClass } from "../../../Decorators"
import { Ability } from "../../Base/Ability"

@WrapperClass("sven_storm_bolt")
export class sven_storm_bolt extends Ability {
	public readonly ProjectilePath = "particles/units/heroes/hero_sven/sven_spell_storm_bolt.vpcf"
	public get Speed(): number {
		return this.GetSpecialValue("bolt_speed")
	}
	public GetAOERadiusForLevel(level: number): number {
		return this.GetSpecialValue("bolt_aoe", level)
	}
}
