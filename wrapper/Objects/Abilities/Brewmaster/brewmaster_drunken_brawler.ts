import { AbilityImagePath } from "../../../Data/PathData"
import { NetworkedBasicField, WrapperClass } from "../../../Decorators"
import { BrawlActive } from "../../../Enums/BrawlActive"
import { Ability } from "../../Base/Ability"

@WrapperClass("brewmaster_drunken_brawler")
export class brewmaster_drunken_brawler extends Ability {
	@NetworkedBasicField("m_iBrawlActive")
	public BrawlActive = BrawlActive.EARTH_FIGHTER

	public get TexturePath(): string {
		switch (this.BrawlActive) {
			case BrawlActive.EARTH_FIGHTER:
				return AbilityImagePath + "/brewmaster_drunken_brawler_earth_png.vtex_c"
			case BrawlActive.STORM_FIGHTER:
				return AbilityImagePath + "/brewmaster_drunken_brawler_storm_png.vtex_c"
			case BrawlActive.FIRE_FIGHTER:
				return AbilityImagePath + "/brewmaster_drunken_brawler_fire_png.vtex_c"
			case BrawlActive.VOID_FIGHTER:
				return AbilityImagePath + "/brewmaster_drunken_brawler_void_png.vtex_c"
			default:
				return super.TexturePath
		}
	}
}
