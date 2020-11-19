import { WrapperClass } from "../../../Decorators"
import Ability from "../../Base/Ability"

@WrapperClass("ogre_magi_ignite")
export default class ogre_magi_ignite extends Ability {
	public get ProjectileName() {
		return [
			"particles/units/heroes/hero_ogre_magi/ogre_magi_ignite.vpcf",
			"particles/econ/items/ogre_magi/ogre_magi_arcana/ogre_magi_arcana_ignite.vpcf",
			"particles/econ/items/ogre_magi/ogre_magi_arcana/ogre_magi_arcana_ignite_secondstyle.vpcf"
		]
	}
}
