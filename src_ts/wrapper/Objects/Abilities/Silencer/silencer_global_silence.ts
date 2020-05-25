import Ability from "../../Base/Ability"
import { WrapperClass } from "../../../Decorators"

@WrapperClass("silencer_global_silence")
export default class silencer_global_silence extends Ability {
	public get AOERadius(): number {
		return Number.MAX_SAFE_INTEGER
	}
}
