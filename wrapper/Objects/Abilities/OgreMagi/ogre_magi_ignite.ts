import Ability from "../../Base/Ability"
import { WrapperClass } from "../../../Decorators"

@WrapperClass("ogre_magi_ignite")
export default class ogre_magi_ignite extends Ability {
	public get ProjectileName() {
		return []
	}
}
