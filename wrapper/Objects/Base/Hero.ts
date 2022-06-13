import Vector3 from "../../Base/Vector3"
import { DamageAmplifyPerIntellectPrecent } from "../../Data/GameData"
import { NetworkedBasicField, WrapperClass } from "../../Decorators"
import { EPropertyType } from "../../Enums/PropertyType"
import { Team } from "../../Enums/Team"
import EntityManager from "../../Managers/EntityManager"
import EventsSDK from "../../Managers/EventsSDK"
import GameState from "../../Utils/GameState"
import FakeUnit, { GetPredictionTarget } from "./FakeUnit"
import InfoPlayerStartDota from "./InfoPlayerStartDota"
import { PlayerResource } from "./PlayerResource"
import Unit from "./Unit"

@WrapperClass("CDOTA_BaseNPC_Hero")
export default class Hero extends Unit {
	@NetworkedBasicField("m_iAbilityPoints")
	public AbilityPoints = 0
	@NetworkedBasicField("m_iCurrentXP")
	public CurrentXP = 0
	@NetworkedBasicField("m_bReincarnating")
	public IsReincarnating = false
	@NetworkedBasicField("m_iPlayerID", EPropertyType.INT32)
	public PlayerID = 0
	@NetworkedBasicField("m_iRecentDamage")
	public RecentDamage = 0
	@NetworkedBasicField("m_flRespawnTime")
	public RespawnTime = 0
	@NetworkedBasicField("m_flRespawnTimePenalty")
	public RespawnTimePenalty = 0
	@NetworkedBasicField("m_flSpawnedAt")
	public SpawnedAt = 0
	@NetworkedBasicField("m_flAgility")
	public Agility = 0
	@NetworkedBasicField("m_flIntellect")
	public Intellect = 0
	@NetworkedBasicField("m_flStrength")
	public Strength = 0
	@NetworkedBasicField("m_flAgilityTotal")
	public TotalAgility = 0
	@NetworkedBasicField("m_flIntellectTotal")
	public TotalIntellect = 0
	@NetworkedBasicField("m_flStrengthTotal")
	public TotalStrength = 0
	public ReplicatingOtherHeroModel: Nullable<Unit | FakeUnit>
	public RespawPosition = new Vector3().Invalidate()
	@NetworkedBasicField("m_flStartSequenceCycle")
	public StartSequenceCycle = 0
	public StartSequenceCyclePrev = -1
	public IsVisibleForEnemies = false

	public get IsHero(): boolean {
		return true
	}
	public get HeroID(): number {
		return this.UnitData.HeroID
	}
	public get IsIllusion(): boolean {
		return this.ReplicatingOtherHeroModel !== undefined
	}
	public get SpellAmplification(): number {
		return super.SpellAmplification + (this.TotalIntellect * DamageAmplifyPerIntellectPrecent / 100)
	}
}

export const Heroes = EntityManager.GetEntitiesByClass(Hero)

import { RegisterFieldHandler } from "wrapper/Objects/NativeToSDK"
RegisterFieldHandler(Hero, "m_hReplicatingOtherHeroModel", async (ent, new_val) => {
	const id = new_val as number
	ent.ReplicatingOtherHeroModel = await GetPredictionTarget(id)
})

function GetEnemyDeaths() {
	let deaths = 0
	if (PlayerResource === undefined)
		return deaths
	for (let i = 0; i < PlayerResource.PlayerData.length; i++) {
		const team_data = PlayerResource.PlayerTeamData[i]
		if (team_data !== undefined && PlayerResource.PlayerData[i].Team !== GameState.LocalTeam)
			deaths += team_data.Deaths
	}
	return deaths
}

function GetNextSpawn(team: Team) {
	if (PlayerResource === undefined)
		return 0
	const playerData = PlayerResource.PlayerData
	const enemyTeam = playerData.filter(data => data.Team !== team).length
	return enemyTeam + GetEnemyDeaths() + 4
}

function SetRespawn(hero: Hero) {
	if (PlayerResource === undefined || hero.Team === GameState.LocalTeam)
		return

	const positions = EntityManager.GetEntitiesByClass(InfoPlayerStartDota)
		.filter(x => x.SpawnerTeam === hero.Team).map(x => x.Position)

	const ar: [number, Hero][] = []
	const next_spawn = GetNextSpawn(hero.Team)

	for (let i = 0; i < PlayerResource.PlayerTeamData.length; i++) {
		const team_data = PlayerResource.PlayerTeamData[i]
		if (PlayerResource.PlayerData[i].Team === hero.Team)
			continue
		let respawn_time = hero.RespawnTime - GameState.RawGameTime
		if (respawn_time <= 0)
			respawn_time = team_data.RespawnSeconds
		if (respawn_time <= 0)
			continue
		ar.push([respawn_time, hero])
	}
	const sorts = ar.sort((a, b) => b[0] - a[0])
	for (let i = 0; i < sorts.length; i++) {
		const [_, hero_] = sorts[i]
		const position = positions[positions.length !== 0 ? (next_spawn - (ar.length - i - 1)) % positions.length : 0]
		if (position !== undefined) {
			// not sense from "Predicted Position" is he checked visible
			hero_.RespawPosition = position
		}
	}
}

EventsSDK.on("PreEntityCreated", ent => {
	if (!(ent instanceof Unit))
		return
	for (const hero of Heroes)
		if (hero.ReplicatingOtherHeroModel?.EntityMatches(ent))
			hero.ReplicatingOtherHeroModel = ent
})

EventsSDK.on("EntityDestroyed", ent => {
	if (!(ent instanceof Unit))
		return
	for (const hero of Heroes)
		if (hero.ReplicatingOtherHeroModel === ent)
			hero.ReplicatingOtherHeroModel = undefined
})

EventsSDK.on("LifeStateChanged", hero => {
	if (!(hero instanceof Hero))
		return
	if (!hero.IsAlive) {
		SetRespawn(hero)
	} else
		hero.RespawPosition.Invalidate()
})

EventsSDK.on("GameEvent", async (name, obj) => {
	if (name !== "dota_buyback")
		return
	const entity = EntityManager.EntityByIndex(obj.entindex)
	if (entity instanceof Hero)
		SetRespawn(entity)
})

EventsSDK.on("PostDataUpdate", async () => {
	for (const hero of Heroes) {
		const old_visibility = hero.IsVisibleForEnemies
		hero.IsVisibleForEnemies = hero.StartSequenceCyclePrev === 0 && hero.StartSequenceCycle === 0
		hero.StartSequenceCyclePrev = hero.StartSequenceCycle
		if (old_visibility !== hero.IsVisibleForEnemies)
			await EventsSDK.emit("TeamVisibilityChanged", false, hero)
	}
})
