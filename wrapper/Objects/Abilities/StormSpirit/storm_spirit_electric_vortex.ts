import { WrapperClass } from "../../../Decorators"
import Ability from "../../Base/Ability"

@WrapperClass("storm_spirit_electric_vortex")
export default class storm_spirit_electric_vortex extends Ability {
	public get CastRange(): number {
		return this.Owner?.HasScepter
			? Number.MAX_SAFE_INTEGER
			: super.CastRange
	}

	public get AOERadius(): number {
		return this.Owner?.HasScepter
			? this.GetSpecialValue("radius_scepter")
			: 0
	}
}
