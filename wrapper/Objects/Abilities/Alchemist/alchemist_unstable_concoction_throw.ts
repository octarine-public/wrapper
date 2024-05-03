import { WrapperClass } from "../../../Decorators"
import { Ability } from "../../Base/Ability"

@WrapperClass("alchemist_unstable_concoction_throw")
export class alchemist_unstable_concoction_throw extends Ability {
	public get ProjectileAttachment(): string {
		return "attach_attack3"
	}
	public GetBaseSpeedForLevel(level: number): number {
		return this.GetSpecialValue("projectile_speed", level)
	}
	public GetBaseAOERadiusForLevel(level: number): number {
		return this.GetSpecialValue("midair_explosion_radius", level)
	}
}
