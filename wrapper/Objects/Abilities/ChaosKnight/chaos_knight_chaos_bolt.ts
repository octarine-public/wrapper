import { WrapperClass } from "../../../Decorators"
import { Ability } from "../../Base/Ability"

@WrapperClass("chaos_knight_chaos_bolt")
export class chaos_knight_chaos_bolt extends Ability {
	public get ProjectileAttachment(): string {
		return "attach_attack1"
	}
	public GetBaseSpeedForLevel(level: number): number {
		return this.GetSpecialValue("chaos_bolt_speed", level)
	}
	public GetBaseDamageForLevel(level: number): number {
		return this.GetSpecialValue("damage_min", level)
	}
}
