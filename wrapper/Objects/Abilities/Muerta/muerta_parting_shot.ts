import { WrapperClass } from "../../../Decorators"
import { Ability } from "../../Base/Ability"

@WrapperClass("muerta_parting_shot")
export class muerta_parting_shot extends Ability {
	public get ProjectileAttachment(): string {
		return "attach_attack1"
	}
	public GetBaseSpeedForLevel(level: number): number {
		return this.GetSpecialValue("projectile_speed", level)
	}
}
