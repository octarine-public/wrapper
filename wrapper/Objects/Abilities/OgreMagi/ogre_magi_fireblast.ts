import { WrapperClass } from "../../../Decorators"
import Ability from "../../Base/Ability"

@WrapperClass("ogre_magi_fireblast")
export default class ogre_magi_fireblast extends Ability {
	public get AbilityDamage(): number {
		return this.GetSpecialValue("fireblast_damage")
	}
}
