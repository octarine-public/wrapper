import { WrapperClass } from "../../../Decorators"
import { Ability } from "../../Base/Ability"

@WrapperClass("ice_shaman_incendiary_bomb")
export class ice_shaman_incendiary_bomb extends Ability {
	public get ProjectileAttachment(): string {
		return "attach_attack1"
	}
	public GetBaseSpeedForLevel(_level: number): number {
		return 1000 // no special data
	}
}
