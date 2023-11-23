import { EntityPropertiesNode } from "../../Base/EntityProperties"
import { PlayerData } from "../../Base/PlayerData"
import { PlayerEventData } from "../../Base/PlayerEventData"
import { PlayerTeamData } from "../../Base/PlayerTeamData"
import { Vector3 } from "../../Base/Vector3"
import { WrapperClass } from "../../Decorators"
import { Team } from "../../Enums/Team"
import { EntityManager } from "../../Managers/EntityManager"
import { EventsSDK } from "../../Managers/EventsSDK"
import { RegisterFieldHandler } from "../../Objects/NativeToSDK"
import { Entity } from "../Base/Entity"
import { InfoPlayerStartBadGuys } from "./InfoPlayerStartBadGuys"
import { InfoPlayerStartGoodGuys } from "./InfoPlayerStartGoodGuys"

@WrapperClass("CDOTA_PlayerResource")
export class CPlayerResource extends Entity {
	public PlayerData: Nullable<PlayerData>[] = []
	public RespawnPositions: Nullable<Vector3>[] = []
	public PlayerTeamData: Nullable<PlayerTeamData>[] = []

	public GetPlayerDataByPlayerID(playerID: number): Nullable<PlayerData> {
		return this.PlayerData[playerID]
	}
	public GetPlayerTeamDataByPlayerID(playerID: number): Nullable<PlayerTeamData> {
		return this.PlayerTeamData[playerID]
	}
}

RegisterFieldHandler(CPlayerResource, "m_vecPlayerData", (playerResource, newVal) => {
	playerResource.PlayerData = (newVal as EntityPropertiesNode[]).map(
		map => new PlayerData(map)
	)
	UpdateRespawnPositions(playerResource)
	EventsSDK.emit("PlayerResourceUpdated", false, playerResource)
})

RegisterFieldHandler(CPlayerResource, "m_vecPlayerTeamData", (playerResource, newVal) => {
	playerResource.PlayerTeamData = (newVal as EntityPropertiesNode[]).map(map => {
		const retMap = new PlayerTeamData(map)
		retMap.PlayerEventsData = (
			(retMap.properties.get("m_vecPlayerEventData") as Nullable<
				EntityPropertiesNode[]
			>) ?? []
		).map(newMap => new PlayerEventData(newMap))
		return retMap
	})
	UpdateRespawnPositions(playerResource)
	EventsSDK.emit("PlayerResourceUpdated", false, playerResource)
})

export let PlayerResource: Nullable<CPlayerResource>
EventsSDK.on("PreEntityCreated", ent => {
	if (ent instanceof CPlayerResource) {
		PlayerResource = ent
	}
})

EventsSDK.on("EntityDestroyed", ent => {
	if (ent instanceof CPlayerResource) {
		PlayerResource = undefined
	}
})

const BadGuysSpawners = EntityManager.GetEntitiesByClass(InfoPlayerStartBadGuys)
const GoodGuysSpawners = EntityManager.GetEntitiesByClass(InfoPlayerStartGoodGuys)

function GetTeamDeaths(playerResource: CPlayerResource, team: Team) {
	let deaths = 0
	for (let i = 0; i < playerResource.PlayerData.length; i++) {
		const teamData = playerResource.PlayerTeamData[i]
		const playerData = playerResource.PlayerData[i]
		if (
			teamData !== undefined &&
			playerData !== undefined &&
			playerData.Team === team
		) {
			deaths += teamData.Deaths
		}
	}
	return deaths
}

function GetNextSpawn(playerResource: CPlayerResource, team: Team) {
	let res = GetTeamDeaths(playerResource, team) + 5
	for (let i = 0, end = playerResource.PlayerData.length; i < end; i++) {
		const data = playerResource.PlayerData[i]
		if (data?.Team === team) {
			res++
		}
	}
	return res
}

function UpdateRespawnPositions(playerResource: CPlayerResource) {
	const playerSpawners = GoodGuysSpawners.concat(BadGuysSpawners)

	// TODO find better way (for now just use Set)
	const arrSet = new Set(playerSpawners.map(x => x.SpawnerTeam))
	for (const [team, positions] of [...arrSet.keys()].map(
		team_ =>
			[
				team_,
				playerSpawners.filter(x => x.SpawnerTeam === team_).map(x => x.Position)
			] as [Team, Vector3[]]
	)) {
		const ar: [number, number][] = []
		const nextSpawn = GetNextSpawn(playerResource, team)

		for (let i = 0; i < playerResource.PlayerTeamData.length; i++) {
			const teamData = playerResource.PlayerTeamData[i]
			const playerData = playerResource.PlayerData[i]
			if (playerData === undefined || teamData === undefined) {
				playerResource.RespawnPositions[i] = undefined
				continue
			}
			if (playerData.Team !== team) {
				continue
			}
			const respawnTime = teamData.RespawnSeconds
			if (respawnTime < 0) {
				playerResource.RespawnPositions[i] = undefined
				continue
			}
			ar.push([respawnTime, i])
		}
		const sorted = ar.sort(([a], [b]) => a - b)
		for (let i = 0; i < sorted.length; i++) {
			const playerID = sorted[i][1]
			playerResource.RespawnPositions[playerID] =
				positions.length !== 0
					? positions[(nextSpawn - (ar.length - i - 1)) % positions.length]
					: undefined
		}
	}
}
