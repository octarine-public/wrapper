import { NetworkedBasicField, WrapperClass } from "../../Decorators"
import Entity from "./Entity"

@WrapperClass("C_DOTA_Item_Rune")
export default class Rune extends Entity {
	@NetworkedBasicField("m_iRuneType")
	public Type = DOTA_RUNES.DOTA_RUNE_INVALID
	@NetworkedBasicField("m_flRuneTime")
	public RuneTime = 0
	@NetworkedBasicField("m_nMapLocationTeam")
	public MapLocationTeam = 0
	@NetworkedBasicField("m_szLocation")
	public Location = ""

	public get RingRadius(): number {
		return 40
	}
}
