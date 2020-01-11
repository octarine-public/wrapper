import EntityManager from "../../Managers/EntityManager"
import Courier from "../Base/Courier"
import Player from "../Base/Player"

export default new (class PlayerResource {
	public m_pBaseEntity: C_DOTA_PlayerResource | undefined

	public get AllPlayers(): Player[] {
		return EntityManager.GetEntitiesByNative(this.m_pBaseEntity?.m_playerIDToPlayer ?? []) as Player[]
	}
	public get PlayerTeamData(): PlayerResourcePlayerTeamData_t[] {
		return this.m_pBaseEntity?.m_vecPlayerTeamData ?? []
	}
	public get PlayerData(): PlayerResourcePlayerData_t[] {
		return this.m_pBaseEntity?.m_vecPlayerData ?? []
	}
	public get TeamCouriers(): Courier[][] {
		let ar = this.m_pBaseEntity?.m_hTeamCouriers
		if (ar === undefined)
			return []
		// loop-optimizer: FORWARD
		return ar.map(ar => EntityManager.GetEntitiesByNative(ar)) as Courier[][]
	}
	public get PlayerCouriers(): Courier[][] {
		let ar = this.m_pBaseEntity?.m_hPlayerCouriers
		if (ar === undefined)
			return []
		// loop-optimizer: FORWARD
		return ar.map(ar => EntityManager.GetEntitiesByNative(ar)) as Courier[][]
	}
	public get PlayerNames(): string[] {
		return this.m_pBaseEntity?.m_iszName ?? []
	}

	public GetNameByPlayerID(playerID: number): string {
		return this.PlayerNames[playerID] ?? ""
	}
	public GetPlayerCouriersByPlayerID(playerID: number): Courier[] {
		if (this.m_pBaseEntity === undefined)
			return []
		return EntityManager.GetEntitiesByNative(this.m_pBaseEntity.m_hPlayerCouriers[playerID]) as Courier[]
	}

	public GetPlayerTeamDataByPlayerID(playerID: number): PlayerResourcePlayerTeamData_t | undefined {
		return this.PlayerTeamData[playerID]
	}
	public GetPlayerDataByPlayerID(playerID: number): PlayerResourcePlayerData_t | undefined {
		return this.PlayerData[playerID]
	}
	public GetPlayerNameByPlayerID(playerID: number): string {
		return this.PlayerNames[playerID] ?? ""
	}
})()
