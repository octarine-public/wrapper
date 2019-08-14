import EntityManager from "../../Managers/EntityManager"
import Courier from "../Base/Courier"
import Entity from "../Base/Entity"
import Player from "../Base/Player"

class PlayerResource extends Entity {
	public readonly m_pBaseEntity: C_DOTA_PlayerResource

	public get Names(): string[] {
		let playerResource = this.m_pBaseEntity

		return playerResource !== undefined ? playerResource.m_iszName : []
	}
	public get AllPlayers(): Player[] {
		let playerResource = this.m_pBaseEntity

		return playerResource !== undefined
			? EntityManager.GetEntitiesByNative(playerResource.m_playerIDToPlayer) as Player[]
			: []
	}
	public get PlayerTeamData(): PlayerResourcePlayerTeamData_t[] {
		let playerResource = this.m_pBaseEntity

		return playerResource !== undefined
			? playerResource.m_vecPlayerTeamData
			: []
	}
	public get PlayerData(): PlayerResourcePlayerData_t[] {
		let playerResource = this.m_pBaseEntity

		return playerResource !== undefined
			? playerResource.m_vecPlayerData
			: []
	}
	public get TeamCouriers(): Courier[][] {
		let playerResource = this.m_pBaseEntity

		if (playerResource === undefined)
			return []

		let couriers: Courier[][] = []

		playerResource.m_hTeamCouriers.forEach(cours =>
			couriers.push(EntityManager.GetEntitiesByNative(cours) as Courier[]))

		return couriers
	}
	public get PlayerCouriers(): Courier[][] {
		let playerResource = this.m_pBaseEntity

		if (playerResource === undefined)
			return []

		let couriers: Courier[][] = []

		playerResource.m_hPlayerCouriers.forEach(cours =>
			couriers.push(EntityManager.GetEntitiesByNative(cours) as Courier[]))

		return couriers
	}

	public GetNameByPlayerID(playerID: number): string {
		let playerResource = this.m_pBaseEntity

		return playerResource !== undefined ? playerResource.m_iszName[playerID] : ""
	}
	public GetPlayerByPlayerID(playerID: number): Player {
		let playerResource = this.m_pBaseEntity

		return playerResource !== undefined
			? EntityManager.GetEntityByNative(playerResource.m_playerIDToPlayer[playerID], true) as Player
			: undefined
	}
	public GetPlayerTeamDataByPlayerID(playerID: number): PlayerResourcePlayerTeamData_t {
		let playerResource = this.m_pBaseEntity

		return playerResource !== undefined ? this.PlayerTeamData[playerID] : undefined
	}
	public GetPlayerDataByPlayerID(playerID: number): PlayerResourcePlayerData_t {
		let playerResource = this.m_pBaseEntity

		return playerResource !== undefined ? this.PlayerData[playerID] : undefined
	}
	public GetPlayerCouriersByPlayerID(playerID: number): Courier[] {
		let playerResource = this.m_pBaseEntity

		return playerResource !== undefined
			? EntityManager.GetEntitiesByNative(this.m_pBaseEntity.m_hPlayerCouriers[playerID]) as Courier[]
			: []
	}
}

export default global.PlayerResource = new PlayerResource()
