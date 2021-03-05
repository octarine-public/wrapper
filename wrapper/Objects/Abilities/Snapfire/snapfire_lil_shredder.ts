import { WrapperClass } from "../../../Decorators"
import Ability from "../../Base/Ability"

@WrapperClass("snapfire_lil_shredder")
export default class snapfire_lil_shredder extends Ability {
	public GetCastRangeForLevel(_level: number): number {
		return 0
	}
}
