import Ability from "../../Base/Ability"
import { WrapperClass } from "../../../Decorators"

@WrapperClass("ogre_magi_fireblast")
export default class ogre_magi_fireblast extends Ability {
	public get AbilityDamage(): number {
		return this.GetSpecialValue("fireblast_damage")
	}
}
