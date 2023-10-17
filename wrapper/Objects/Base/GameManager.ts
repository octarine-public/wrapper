import { NetworkedBasicField, WrapperClass } from "../../Decorators"
import { EventsSDK } from "../../Managers/EventsSDK"
import { Entity } from "./Entity"

@WrapperClass("CDOTAGameManagerProxy")
export class CGameManager extends Entity {
	@NetworkedBasicField("m_lobbyGameName")
	public LobbyGameName = ""
	@NetworkedBasicField("m_lobbyLeagueID")
	public LobbyLeagueID = 0
	@NetworkedBasicField("m_CurrentHeroAvailable")
	public CurrentHeroAvailable: boolean[] = []

	// need test
	public get IsLobbyGame(): boolean {
		return this.LobbyGameName !== "" || this.LobbyLeagueID !== 0
	}
}

export let GameManager: Nullable<CGameManager>
EventsSDK.on("PreEntityCreated", ent => {
	if (ent instanceof CGameManager) {
		GameManager = ent
	}
})
EventsSDK.on("EntityDestroyed", ent => {
	if (ent instanceof CGameManager) {
		GameManager = undefined
	}
})
