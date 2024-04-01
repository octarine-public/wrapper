import { WrapperClass } from "../../../Decorators"
import { Ability } from "../../Base/Ability"

@WrapperClass("ogre_magi_ignite")
export class ogre_magi_ignite extends Ability {
	public GetBaseDamageForLevel(level: number): number {
		return this.GetSpecialValue("burn_damage", level)
	}

	public GetBaseSpeedForLevel(level: number): number {
		return this.GetSpecialValue("projectile_speed", level)
	}
}
