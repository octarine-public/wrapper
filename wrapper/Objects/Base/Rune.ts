import { NetworkedBasicField, WrapperClass } from "../../Decorators"
import { DOTA_RUNES } from "../../Enums/DOTA_RUNES"
import Entity from "./Entity"

@WrapperClass("CDOTA_Item_Rune")
export default class Rune extends Entity {
	@NetworkedBasicField("m_iRuneType")
	public Type = DOTA_RUNES.DOTA_RUNE_INVALID
	@NetworkedBasicField("m_flRuneTime")
	public RuneTime = 0
	@NetworkedBasicField("m_nMapLocationTeam")
	public MapLocationTeam = 0
	@NetworkedBasicField("m_szLocation")
	public Location = ""
}
