import { WrapperClass } from "../../../Decorators"
import { Ability } from "../../Base/Ability"

@WrapperClass("skeleton_king_hellfire_blast")
export class skeleton_king_hellfire_blast extends Ability implements INuke {
	public get ProjectileAttachment(): string {
		return "attach_attack2"
	}
	public IsNuke(): this is INuke {
		return true
	}
	public GetBaseSpeedForLevel(level: number): number {
		return this.GetSpecialValue("blast_speed", level)
	}
	public GetBaseDamageForLevel(level: number): number {
		return this.GetSpecialValue("damage", level)
	}
}
