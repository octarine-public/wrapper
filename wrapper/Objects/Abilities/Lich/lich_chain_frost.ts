import Ability from "../../Base/Ability"
import { WrapperClass } from "../../../Decorators"

@WrapperClass("lich_chain_frost")
export default class lich_chain_frost extends Ability {
	public get ProjectileName() {
		return []
	}
}
