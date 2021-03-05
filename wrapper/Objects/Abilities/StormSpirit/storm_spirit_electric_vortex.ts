import { WrapperClass } from "../../../Decorators"
import Ability from "../../Base/Ability"

@WrapperClass("storm_spirit_electric_vortex")
export default class storm_spirit_electric_vortex extends Ability {
	public GetCastRangeForLevel(level: number): number {
		if (this.Owner?.HasScepter)
			return Number.MAX_SAFE_INTEGER
		return super.GetCastRangeForLevel(level)
	}
	public GetAOERadiusForLevel(level: number): number {
		return this.Owner?.HasScepter
			? this.GetSpecialValue("radius_scepter", level)
			: 0
	}
}
