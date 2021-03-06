import { WrapperClass } from "../../../Decorators"
import Ability from "../../Base/Ability"

@WrapperClass("omniknight_guardian_angel")
export default class omniknight_guardian_angel extends Ability {
	public GetBaseCastRangeForLevel(level: number): number {
		if (this.Owner?.HasScepter)
			return Number.MAX_SAFE_INTEGER
		return super.GetBaseCastRangeForLevel(level)
	}
}
