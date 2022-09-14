import { NetworkedBasicField, WrapperClass } from "../../../Decorators"
import { BrawlActive } from "../../../Enums/BrawlActive"
import { Ability } from "../../Base/Ability"

@WrapperClass("brewmaster_drunken_brawler")
export class brewmaster_drunken_brawler extends Ability {
	@NetworkedBasicField("m_iBrawlActive")
	public BrawlActive = BrawlActive.EARTH_FIGHTER
}
