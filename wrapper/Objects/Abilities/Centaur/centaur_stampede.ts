import { WrapperClass } from "../../../Decorators"
import Ability from "../../Base/Ability"

@WrapperClass("centaur_stampede")
export default class centaur_stampede extends Ability {
	public GetAOERadiusForLevel(_level: number): number {
		return Number.MAX_SAFE_INTEGER
	}
}
