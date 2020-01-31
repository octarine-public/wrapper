import Entity from "./Entity"
import EventsSDK from "../../Managers/EventsSDK"

export default class CGameManager extends Entity {
	public NativeEntity: Nullable<C_DOTAGameManagerProxy>
	public LobbyGameName = ""
	public LobbyLeagueID = 0
	public StableHeroAvailable: boolean[] = []
	public CurrentHeroAvailable: boolean[] = []
	public CulledHeroes: boolean[] = []

	public get IsEventGame(): boolean {
		return this.NativeEntity?.m_pGameManager?.m_bEventGame ?? false
	}
	public get IsCustomGame(): boolean {
		return this.NativeEntity?.m_pGameManager?.m_bCustomGame ?? false
	}
	// need test
	public get IsLobbyGame(): boolean {
		return this.LobbyGameName !== "" || this.LobbyLeagueID !== 0
	}
}

import { RegisterClass, RegisterFieldHandler } from "wrapper/Objects/NativeToSDK"
RegisterClass("C_DOTAGameManagerProxy", CGameManager)
RegisterFieldHandler(CGameManager, "m_lobbyGameName", (manager, new_value) => manager.LobbyGameName = new_value as string)
RegisterFieldHandler(CGameManager, "m_lobbyLeagueID", (manager, new_value) => manager.LobbyLeagueID = new_value as number)
RegisterFieldHandler(CGameManager, "m_StableHeroAvailable", (manager, new_value) => manager.StableHeroAvailable = new_value as boolean[])
RegisterFieldHandler(CGameManager, "m_CurrentHeroAvailable", (manager, new_value) => manager.CurrentHeroAvailable = new_value as boolean[])
RegisterFieldHandler(CGameManager, "m_CulledHeroes", (manager, new_value) => manager.CulledHeroes = new_value as boolean[])

export let GameManager: Nullable<CGameManager>
EventsSDK.on("EntityCreated", ent => {
	if (ent instanceof CGameManager)
		GameManager = ent
})
EventsSDK.on("EntityDestroyed", ent => {
	if (ent instanceof CGameManager)
		GameManager = undefined
})
