import { WrapperClass } from "../../../Decorators"
import Ability from "../../Base/Ability"

@WrapperClass("zuus_thundergods_wrath")
export default class zuus_thundergods_wrath extends Ability {
	public get AOERadius(): number {
		return Number.MAX_SAFE_INTEGER
	}
}
