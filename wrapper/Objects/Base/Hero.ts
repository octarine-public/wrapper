import { Color } from "../../Base/Color"
import { PlayerTeamData } from "../../Base/PlayerTeamData"
import { Vector3 } from "../../Base/Vector3"
import { DamageAmplifyPerIntellectPrecent } from "../../Data/GameData"
import { NetworkedBasicField, WrapperClass } from "../../Decorators"
import { EPropertyType } from "../../Enums/PropertyType"
import { Team } from "../../Enums/Team"
import { EntityManager } from "../../Managers/EntityManager"
import { EventsSDK } from "../../Managers/EventsSDK"
import { RegisterFieldHandler } from "../../Objects/NativeToSDK"
import { FakeUnit, GetPredictionTarget } from "./FakeUnit"
import { HeroTeamData } from "./HeroTeamData"
import { PlayerResource } from "./PlayerResource"
import { Unit } from "./Unit"

@WrapperClass("CDOTA_BaseNPC_Hero")
export class Hero extends Unit {
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

	public HeroTeamData: Nullable<HeroTeamData>

	private readonly colorRadiant: Color[] = [
		new Color(51, 117, 255),
		new Color(102, 255, 191),
		new Color(191, 0, 191),
		new Color(243, 240, 11),
		new Color(255, 107, 0)
	]

	private readonly colorDire: Color[] = [
		new Color(254, 134, 194),
		new Color(161, 180, 71),
		new Color(101, 217, 247),
		new Color(0, 131, 33),
		new Color(164, 105, 0)
	]

	/**
	 * Returns the color of the hero based on their team.
	 *
	 * @returns {Color} The color of the hero.
	 */
	public get PlayerColor(): Color {
		return this.Team === Team.Dire
			? this.colorDire[this.TeamSlot]
			: this.colorRadiant[this.TeamSlot]
	}
	/**
	 * Determines if the object is a hero.
	 *
	 * @returns {boolean} true if the object is a hero, false otherwise.
	 */
	public get IsHero(): boolean {
		return true
	}
	/**
	 * Returns the HeroID of this unit.
	 *
	 * @returns {number} The HeroID of this unit.
	 */
	public get HeroID(): number {
		return this.UnitData.HeroID
	}
	/**
	 * Checks if the hero is an illusion.
	 *
	 * @returns {boolean} - Returns true if the hero is an illusion, false otherwise.
	 */
	public get IsIllusion(): boolean {
		return this.ReplicatingOtherHeroModel !== undefined
	}
	/**
	 * Gets the respawn position for the hero.
	 *
	 * @returns {Vector3 | undefined} The respawn position for the hero.
	 */
	public get RespawnPosition(): Nullable<Vector3> {
		return PlayerResource?.RespawnPositions[this.PlayerID]
	}
	/**
	 * Retrieves the team slot of the hero.
	 *
	 * @returns {number} The team slot of the hero. If the hero's team data is not available, returns -1.
	 */
	public get TeamSlot(): number {
		return this.PlayerTeamData?.TeamSlot ?? -1
	}
	/**
	 * Get the name of the player.
	 *
	 * @returns {string | undefined} The name of the player.
	 */
	public get PlayerName(): Nullable<string> {
		return PlayerResource?.PlayerData[this.PlayerID]?.Name
	}
	/**
	 * Retrieves the team data for the hero.
	 *
	 * @returns {PlayerTeamData | undefined} The team data for the hero.
	 */
	public get PlayerTeamData(): Nullable<PlayerTeamData> {
		return PlayerResource?.PlayerTeamData[this.PlayerID]
	}

	public get SpellAmplification(): number {
		return (
			super.SpellAmplification +
			(this.TotalIntellect * DamageAmplifyPerIntellectPrecent) / 100
		)
	}
}

export const Heroes = EntityManager.GetEntitiesByClass(Hero)

RegisterFieldHandler(Hero, "m_hReplicatingOtherHeroModel", (ent, newVal) => {
	const id = newVal as number
	ent.ReplicatingOtherHeroModel = GetPredictionTarget(id)
})

EventsSDK.on("PreEntityCreated", ent => {
	if (!(ent instanceof Unit)) {
		return
	}
	for (const hero of Heroes) {
		if (hero.ReplicatingOtherHeroModel?.EntityMatches(ent)) {
			hero.ReplicatingOtherHeroModel = ent
		}
	}
})

EventsSDK.on("EntityDestroyed", ent => {
	if (!(ent instanceof Unit)) {
		return
	}
	for (const hero of Heroes) {
		if (hero.ReplicatingOtherHeroModel === ent) {
			hero.ReplicatingOtherHeroModel = undefined
		}
	}
})
