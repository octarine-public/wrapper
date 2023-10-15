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
import { HeroTeamData } from "../DataBook/HeroTeamData"
import { FakeUnit, GetPredictionTarget } from "./FakeUnit"
import { PlayerResource } from "./PlayerResource"
import { Unit } from "./Unit"

@WrapperClass("CDOTA_BaseNPC_Hero")
export class Hero extends Unit {
	private static readonly colorRadiant: Color[] = [
		new Color(0x33, 0x75, 0xff),
		new Color(0x66, 0xff, 0xbf),
		new Color(0xbf, 0x0, 0xbf),
		new Color(0xf3, 0xf0, 0xb),
		new Color(0xff, 0x6b, 0x0)
	]
	private static readonly colorDire: Color[] = [
		new Color(0xfe, 0x86, 0xc2),
		new Color(0xa1, 0xb4, 0x47),
		new Color(0x65, 0xd9, 0xf7),
		new Color(0x0, 0x83, 0x21),
		new Color(0xa4, 0x69, 0x0)
	]
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

	public HeroTeamData: Nullable<HeroTeamData>
	public ReplicatingOtherHeroModel: Nullable<Unit | FakeUnit>

	/**
	 * Returns the color of the hero based on their team.
	 *
	 * @returns {Color} The color of the hero.
	 */
	public get PlayerColor(): Color {
		return this.Team === Team.Dire
			? Hero.colorDire[this.TeamSlot]
			: Hero.colorRadiant[this.TeamSlot]
	}
	/**
	 * @deprecated use instanceof Hero
	 * Determines if the Hero is a hero.
	 * @returns {boolean} true if the Hero is a hero, false otherwise.
	 */
	public get IsHero(): boolean {
		return true
	}
	/**
	 * Returns whether the hero is a real hero.
	 * A hero is considered real if it is not a clone or an illusion.
	 *
	 * @returns {boolean} True if the hero is a real hero, false otherwise.
	 */
	public get IsRealHero(): boolean {
		return !this.IsClone && !this.IsIllusion
	}
	/**
	 * Get the ID of the hero.
	 *
	 * @returns {number} The ID of the hero.
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
	 * @returns {number} The team slot of the hero. If the hero's team data is not available, return -1.
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
