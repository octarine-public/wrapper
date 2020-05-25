import Unit from "./Unit"
import { WrapperClass, NetworkedBasicField } from "../../Decorators"

@WrapperClass("C_DOTA_BaseNPC_Building")
export default class Building extends Unit {
	@NetworkedBasicField("m_iHeroStatueOwnerPlayerID")
	public HeroStatueOwnerPlayerID = -1
	@NetworkedBasicField("m_bHeroStatue")
	public IsHeroStatue = false
}
