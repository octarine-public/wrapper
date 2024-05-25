import { WrapperClass } from "../../../Decorators"
import { Ability } from "../../Base/Ability"

@WrapperClass("bristleback_viscous_nasal_goo")
export class bristleback_viscous_nasal_goo extends Ability {
	public get ProjectileAttachment(): string {
		return "attach_attack3"
	}
	public GetBaseSpeedForLevel(level: number): number {
		return this.GetSpecialValue("goo_speed", level)
	}
}
