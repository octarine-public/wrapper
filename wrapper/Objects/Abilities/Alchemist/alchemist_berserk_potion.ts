import { WrapperClass } from "../../../Decorators"
import { Ability } from "../../Base/Ability"

@WrapperClass("alchemist_berserk_potion")
export class alchemist_berserk_potion extends Ability {
	public get ProjectileAttachment(): string {
		return "attach_attack3"
	}
	public GetBaseSpeedForLevel(level: number): number {
		return this.GetSpecialValue("projectile_speed", level)
	}
}
