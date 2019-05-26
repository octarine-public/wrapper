import Entity from "../Base/Entity";
import Player from "../Base/Player";
import EntityManager from "../../Managers/EntityManager";
import Courier from "../Base/Courier";

class PlayerResource extends Entity {
	
	m_pBaseEntity: C_DOTA_PlayerResource
	
	get Names(): string[] {
		let playerResource = this.m_pBaseEntity;
		
		return playerResource !== undefined ? playerResource.m_iszName : [];
	}
	get AllPlayers(): Player[] {
		let playerResource = this.m_pBaseEntity;
		
		return playerResource !== undefined 
			? EntityManager.GetEntitiesByNative(this.m_pBaseEntity.m_playerIDToPlayer) as Player[] 
			: [];
	}
	get PlayerTeamData(): PlayerResourcePlayerTeamData_t[] {
		let playerResource = this.m_pBaseEntity;
		
		return playerResource !== undefined 
			? playerResource.m_vecPlayerTeamData 
			: [];
	}
	get PlayerData(): PlayerResourcePlayerData_t[] {
		let playerResource = this.m_pBaseEntity;
		
		return playerResource !== undefined 
			? playerResource.m_vecPlayerData 
			: [];
	}
	get TeamCouriers(): Courier[][] {
		let playerResource = this.m_pBaseEntity;
		
		if (playerResource === undefined)
			return [];
		
		let couriers: Courier[][] = [];
		
		playerResource.m_hTeamCouriers.forEach(cours =>
			couriers.push(EntityManager.GetEntitiesByNative(cours) as Courier[]))
		
		return couriers;
	}
	get PlayerCouriers(): Courier[][] {
		let playerResource = this.m_pBaseEntity;
		
		if (playerResource === undefined)
			return [];
			
		let couriers: Courier[][] = [];

		playerResource.m_hPlayerCouriers.forEach(cours =>
			couriers.push(EntityManager.GetEntitiesByNative(cours) as Courier[]))

		return couriers;
	}
	
	GetNameByPlayerID(playerID: number): string {
		let playerResource = this.m_pBaseEntity;
		
		return playerResource !== undefined ? this.m_pBaseEntity.m_iszName[playerID] : undefined;
	}
	GetPlayerByPlayerID(playerID: number): Player {
		let playerResource = this.m_pBaseEntity;
		
		return playerResource !== undefined 
			? EntityManager.GetEntityByNative(this.m_pBaseEntity.m_playerIDToPlayer[playerID]) as Player
			: undefined;
	}
	GetPlayerTeamDataByPlayerID(playerID: number): PlayerResourcePlayerTeamData_t {
		let playerResource = this.m_pBaseEntity;
		
		return playerResource !== undefined ? this.PlayerTeamData[playerID] : undefined;
	}
	GetPlayerDataByPlayerID(playerID: number): PlayerResourcePlayerData_t {
		let playerResource = this.m_pBaseEntity;
		
		return playerResource !== undefined ? this.PlayerData[playerID] : undefined;
	}
	GetPlayerCouriersByPlayerID(playerID: number): Courier[] {
		let playerResource = this.m_pBaseEntity;
		
		return playerResource !== undefined
			? EntityManager.GetEntitiesByNative(this.m_pBaseEntity.m_hPlayerCouriers[playerID]) as Courier[]
			: [];
	}
}

export default new PlayerResource();