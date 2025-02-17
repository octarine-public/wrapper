import { WrapperClass } from "../../../Decorators"
import { Ability } from "../../Base/Ability"

@WrapperClass("ogre_magi_fireblast")
export class ogre_magi_fireblast extends Ability {
	public GetBaseDamageForLevel(level: number): number {
		return this.GetSpecialValue("fireblast_damage", level)
	}
}
