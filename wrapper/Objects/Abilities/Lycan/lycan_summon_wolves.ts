import { AbilityImagePath } from "../../../Data/PathData"
import { WrapperClass } from "../../../Decorators"
import { Ability } from "../../Base/Ability"

@WrapperClass("lycan_summon_wolves")
export class lycan_summon_wolves extends Ability {
	public get TexturePath() {
		return this.HeroFacetKey === 2
			? AbilityImagePath + "/lycan_summon_spirit_wolves_png.vtex_c"
			: super.TexturePath
	}
}
