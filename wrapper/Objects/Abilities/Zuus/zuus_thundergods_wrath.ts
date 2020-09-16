import Ability from "../../Base/Ability"
import { WrapperClass } from "../../../Decorators"

@WrapperClass("zuus_thundergods_wrath")
export default class zuus_thundergods_wrath extends Ability {
	public get AOERadius(): number {
		return Number.MAX_SAFE_INTEGER
	}
}
