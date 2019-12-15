import EntityManager from "../../Managers/EntityManager"
import Courier from "../Base/Courier"
import Player from "../Base/Player"

declare namespace globalThis {
	var PlayerResource: PlayerResourceClass
}

// NOTICE: because shadow name + need for globalThis. idk another way
class PlayerResourceClass {
	public m_pBaseEntity: C_DOTA_PlayerResource | undefined

	public get Names(): string[] {
		if (this.m_pBaseEntity === undefined)
			return []
		return this.m_pBaseEntity.m_iszName
	}
	public get AllPlayers(): Player[] {
		if (this.m_pBaseEntity === undefined)
			return []
		return EntityManager.GetEntitiesByNative(this.m_pBaseEntity.m_playerIDToPlayer) as Player[]
	}
	public get PlayerTeamData(): PlayerResourcePlayerTeamData_t[] {
		if (this.m_pBaseEntity === undefined)
			return []
		return this.m_pBaseEntity.m_vecPlayerTeamData
	}
	public get PlayerData(): PlayerResourcePlayerData_t[] {
		if (this.m_pBaseEntity === undefined)
			return []
		return this.m_pBaseEntity.m_vecPlayerData
	}
	public get TeamCouriers(): Courier[][] {
		if (this.m_pBaseEntity === undefined)
			return []
		// loop-optimizer: FORWARD
		return this.m_pBaseEntity.m_hTeamCouriers.map(ar => EntityManager.GetEntitiesByNative(ar)) as Courier[][]
	}
	public get PlayerCouriers(): Courier[][] {
		if (this.m_pBaseEntity === undefined)
			return []
		// loop-optimizer: FORWARD
		return this.m_pBaseEntity.m_hPlayerCouriers.map(ar => EntityManager.GetEntitiesByNative(ar)) as Courier[][]
	}
	public get PlayerNames(): string[] {
		if (this.m_pBaseEntity === undefined)
			return []
		return this.m_pBaseEntity.m_iszName
	}

	public GetNameByPlayerID(playerID: number): string {
		if (this.m_pBaseEntity === undefined)
			return ""
		return this.m_pBaseEntity.m_iszName[playerID]
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
}

// NOTICE: because shadow name + need for globalThis. idk another way
const _PlayerResource = new PlayerResourceClass()

export default globalThis.PlayerResource = _PlayerResource
