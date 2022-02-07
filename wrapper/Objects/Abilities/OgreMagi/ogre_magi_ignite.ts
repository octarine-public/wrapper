import { WrapperClass } from "../../../Decorators"
import Ability from "../../Base/Ability"

@WrapperClass("ogre_magi_ignite")
export default class ogre_magi_ignite extends Ability {
	public readonly ProjectilePath = "particles/units/heroes/hero_ogre_magi/ogre_magi_ignite.vpcf"
}
