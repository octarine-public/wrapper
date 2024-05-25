import { WrapperClass } from "../../../Decorators"
import { Ability } from "../../Base/Ability"

@WrapperClass("omniknight_hammer_of_purity")
export class omniknight_hammer_of_purity extends Ability {
	public get ProjectileAttachment(): string {
		return "attach_attack2"
	}
	public GetBaseDamageForLevel(level: number): number {
		return this.GetSpecialValue("bonus_damage", level)
	}
}
