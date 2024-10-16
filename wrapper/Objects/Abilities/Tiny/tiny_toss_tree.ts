import { WrapperClass } from "../../../Decorators"
import { Ability } from "../../Base/Ability"

@WrapperClass("tiny_toss_tree")
export class tiny_toss_tree extends Ability {
	public get ProjectileAttachment(): string {
		return "attach_attack2"
	}
	public GetBaseSpeedForLevel(level: number): number {
		return this.GetSpecialValue("speed", level)
	}
}
