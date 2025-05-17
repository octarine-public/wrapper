import { WrapperClass } from "../../../Decorators"
import { Ability } from "../../Base/Ability"

@WrapperClass("shredder_chakram")
export class shredder_chakram extends Ability implements INuke {
	public IsNuke(): this is INuke {
		return true
	}
	public GetBaseAOERadiusForLevel(level: number): number {
		return this.GetSpecialValue("radius", level)
	}
	public GetBaseSpeedForLevel(level: number): number {
		return this.GetSpecialValue("speed", level)
	}
	public GetBaseDamageForLevel(level: number): number {
		return this.GetSpecialValue("pass_damage", level)
	}
	public GetBaseCastPointForLevel(level: number): number {
		return this.OwnerHasScepter
			? this.GetSpecialValue("castpoint_scepter", level)
			: super.GetBaseCastPointForLevel(level)
	}
}
