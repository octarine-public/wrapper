// import { Paths } from "../../../Data/Paths"
import { WrapperClass } from "../../../Decorators"
// import { BrawlActive } from "../../../Enums/BrawlActive"
import { Ability } from "../../Base/Ability"

@WrapperClass("brewmaster_primal_companion")
export class brewmaster_primal_companion extends Ability {
	// TODO: add after traking recusive ability
	// public get TexturePath(): string {
	// 	if ((this.DrunkenBrawler?.Level ?? 0) <= 0) {
	// 		return super.TexturePath
	// 	}
	// 	const path = Paths.AbilityIcons
	// 	switch (this.DrunkenBrawler?.BrawlActive) {
	// 		case BrawlActive.EARTH_FIGHTER:
	// 			return path + "/brewmaster_primal_companion_earth_png.vtex_c"
	// 		case BrawlActive.STORM_FIGHTER:
	// 			return path + "/brewmaster_primal_companion_storm_png.vtex_c"
	// 		case BrawlActive.FIRE_FIGHTER:
	// 			return path + "/brewmaster_primal_companion_fire_png.vtex_c"
	// 		case BrawlActive.VOID_FIGHTER:
	// 			return path + "/brewmaster_primal_companion_void_png.vtex_c"
	// 		default:
	// 			return this.AbilityData.TexturePath
	// 	}
	// }
}
