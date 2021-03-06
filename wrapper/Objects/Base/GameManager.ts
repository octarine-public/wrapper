import { NetworkedBasicField, WrapperClass } from "../../Decorators"
import EventsSDK from "../../Managers/EventsSDK"
import Entity from "./Entity"

@WrapperClass("CDOTAGameManagerProxy")
export default class CGameManager extends Entity {
	@NetworkedBasicField("m_lobbyGameName")
	public LobbyGameName = ""
	@NetworkedBasicField("m_lobbyLeagueID")
	public LobbyLeagueID = 0
	@NetworkedBasicField("m_StableHeroAvailable")
	public StableHeroAvailable: boolean[] = []
	@NetworkedBasicField("m_CurrentHeroAvailable")
	public CurrentHeroAvailable: boolean[] = []
	@NetworkedBasicField("m_CulledHeroes")
	public CulledHeroes: boolean[] = []

	// need test
	public get IsLobbyGame(): boolean {
		return this.LobbyGameName !== "" || this.LobbyLeagueID !== 0
	}
}

export let GameManager: Nullable<CGameManager>
EventsSDK.on("PreEntityCreated", ent => {
	if (ent instanceof CGameManager)
		GameManager = ent
})
EventsSDK.on("EntityDestroyed", ent => {
	if (ent instanceof CGameManager)
		GameManager = undefined
})
