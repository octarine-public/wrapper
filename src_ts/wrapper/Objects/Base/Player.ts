import Vector2 from "../../Base/Vector2"
import Vector3 from "../../Base/Vector3"
import { Team } from "../../Enums/Team"
import { default as EntityManager, LocalPlayer } from "../../Managers/EntityManager"
import ExecuteOrder from "../../Native/ExecuteOrder"
import Ability from "./Ability"
import Entity from "./Entity"
import Hero from "./Hero"
import Unit from "./Unit"
import { ConnectionState } from "../../Enums/ConnectionState"
import { dotaunitorder_t } from "../../Enums/dotaunitorder_t"
import PlayerResource from "../GameResources/PlayerResource"

export default class Player extends Entity {
	static get QuickBuyItems(): number[] {
		return LocalPlayer !== undefined ? LocalPlayer.m_pBaseEntity.m_quickBuyItems : []
	}
	public static PrepareOrder(order: {
		orderType: dotaunitorder_t,
		target?: Entity | number,
		position?: Vector3 | Vector2,
		ability?: Ability,
		orderIssuer?: PlayerOrderIssuer_t,
		unit?: Unit,
		queue?: boolean,
		showEffects?: boolean,
	}): ExecuteOrder {
		return ExecuteOrder.fromObject(order).ExecuteQueued()
	}

	/**
	 * Only for LocalPlayer
	 */
	public static Buyback(queue?: boolean, showEffects?: boolean): ExecuteOrder {
		return this.PrepareOrder({ orderType: dotaunitorder_t.DOTA_UNIT_ORDER_BUYBACK, queue, showEffects })
	}
	/**
	 * Only for LocalPlayer
	 */
	public static Glyph(queue?: boolean, showEffects?: boolean): ExecuteOrder {
		return this.PrepareOrder({ orderType: dotaunitorder_t.DOTA_UNIT_ORDER_GLYPH, queue, showEffects })
	}
	/**
	 * Only for LocalPlayer
	 */
	public static CastRiverPaint(position: Vector3 | Vector2, queue?: boolean, showEffects?: boolean): ExecuteOrder {
		return this.PrepareOrder({ orderType: dotaunitorder_t.DOTA_UNIT_ORDER_CAST_RIVER_PAINT, position, queue, showEffects })
	}
	/**
	 * Only for LocalPlayer
	 */
	public static PreGameAdgustItemAssigment(ItemID: number, queue?: boolean, showEffects?: boolean): ExecuteOrder {
		return this.PrepareOrder({ orderType: dotaunitorder_t.DOTA_UNIT_ORDER_PREGAME_ADJUST_ITEM_ASSIGNMENT, target: ItemID, queue, showEffects })
	}
	/**
	 * Only for LocalPlayer
	 */
	public static Scan(position: Vector3 | Vector2, queue?: boolean, showEffects?: boolean): ExecuteOrder {
		return this.PrepareOrder({ orderType: dotaunitorder_t.DOTA_UNIT_ORDER_RADAR, position, queue, showEffects })
	}

	public readonly m_pBaseEntity!: C_DOTAPlayer
	public PlayerID = this.m_pBaseEntity.m_iPlayerID
	public Hero_: Hero | CEntityIndex
	private m_Name: string = ""
	private m_PlayerData: PlayerResourcePlayerData_t | undefined
	private m_PlayerTeamData: PlayerResourcePlayerTeamData_t | undefined

	constructor(m_pBaseEntity: C_BaseEntity) {
		super(m_pBaseEntity)
		this.Hero_ = this.m_pBaseEntity.m_hAssignedHero
	}

	/**
	 * Only for LocalPlayer
	 */
	get ActiveAbility(): Ability {
		return EntityManager.GetEntityByNative(this.m_pBaseEntity.m_hActiveAbility) as Ability
	}
	get Assists(): number {
		return this.PlayerTeamData?.m_iAssists ?? 0
	}
	get IsSpectator(): boolean {
		return this.Team === Team.Observer || this.Team === Team.Neutral || this.Team === Team.None || this.Team === Team.Undefined
	}
	get ButtleBonusRate(): number {
		return this.PlayerTeamData?.m_iBattleBonusRate ?? 0
	}
	// BuybackCooldownTime 		=> NonSpectator
	// BuybackCostTime			=> NonSpectator
	// BuybackGoldLimitTime		=> NonSpectator
	// CameraPosition			=> CameraManager
	// CampsStacked				=> NonSpectator
	// ClaimedDenyCount			=> NonSpectator
	// ClaimedMissCount 		=> NonSpectator
	get CompendiumLevel(): number {
		return this.PlayerTeamData?.m_unCompendiumLevel ?? 0
	}
	get ConnectionState(): ConnectionState {
		return this.PlayerData?.m_iConnectionState ?? ConnectionState.Unknown
	}
	// CreepKillGold			=> NonSpectator
	// CreepsStacked			=> NonSpectator
	// CustomBuybackCooldown	=> NonSpectator
	get Deaths(): number {
		return this.PlayerTeamData?.m_iDeaths ?? 0
	}
	// DenyCount				=> NonSpectator
	// GoldSpentOnSupport		=> NonSpectator
	get HasRandomed(): boolean {
		return this.PlayerTeamData?.m_bHasRandomed ?? false
	}
	// HasRepicked 				=> PlayerResourcePlayerTeamData_t
	// Healing					=> NonSpectator
	get Hero(): Nullable<Hero> {
		if (this.Hero_ instanceof Hero)
			return this.Hero_
		this.Hero_ = (EntityManager.GetEntityByNative(this.Hero_) as Hero) ?? this.Hero_
		if (this.Hero_ instanceof Entity)
			return this.Hero_

		return undefined
	}
	get HeroAssigned(): boolean {
		return this.Hero !== undefined && this.Hero.IsValid
	}
	// HeroDamage				=> NonSpectator
	// HeroKillGold				=> NonSpectator
	// IncomeGold				=> NonSpectator
	get IsAFK(): boolean {
		return this.PlayerTeamData?.m_bAFK ?? false
	}
	get IsBattleBonusActive(): boolean {
		return this.PlayerTeamData?.m_bBattleBonusActive ?? false
	}
	get IsBroadcaster(): boolean {
		return this.PlayerData?.m_bIsBroadcaster ?? false
	}
	get IsFakeClient(): boolean {
		return this.PlayerData?.m_bFakeClient ?? false
	}
	get IsFullyJoinedServer(): boolean {
		return this.PlayerData?.m_bFullyJoinedServer ?? false
	}
	get IsPredictingVictory(): boolean {
		return this.PlayerTeamData?.m_bHasPredictedVictory ?? false
	}
	get IsVoiceChatBanned(): boolean {
		return this.PlayerTeamData?.m_bVoiceChatBanned ?? false
	}
	get Kills(): number {
		return this.PlayerTeamData?.m_iKills ?? 0
	}
	get KillStreak(): number {
		return this.PlayerTeamData?.m_iStreak ?? 0
	}
	get LastBuybackTime(): number {
		return this.PlayerTeamData?.m_iLastBuybackTime ?? 0
	}
	// LastHitCount				=> NonSpectator
	// LastHitMultikill			=> NonSpectator
	// LastHitStreak			=> NonSpectator
	get Level(): number {
		return this.PlayerTeamData?.m_iLevel ?? 0
	}
	get GameName(): string {
		return this.PlayerData?.m_iszPlayerName ?? ""
	}
	// MissCount				=> NonSpectator
	get Name(): string {
		return this.m_Name
			|| this.IsValid && PlayerResource
			? (this.m_Name = PlayerResource.GetNameByPlayerID(this.PlayerID)) : ""
	}
	// NearbyCreepDeathCount	=> NonSpectator
	// ObserverWardsPlaced		=> NonSpectator
	get PlayerData(): PlayerResourcePlayerData_t | undefined {
		return this.m_PlayerData
			|| this.IsValid
			? (this.m_PlayerData = PlayerResource.GetPlayerDataByPlayerID(this.PlayerID)) : undefined
	}
	get PlayerTeamData(): PlayerResourcePlayerTeamData_t | undefined {
		return this.m_PlayerTeamData
			|| this.IsValid && PlayerResource
			? (this.m_PlayerTeamData = PlayerResource.GetPlayerTeamDataByPlayerID(this.PlayerID)) : undefined
	}
	get PlayerSteamID(): bigint {
		return this.PlayerData?.m_iPlayerSteamID ?? 0n
	}
	get QueryUnit(): Unit {
		return EntityManager.GetEntityByNative(this.m_pBaseEntity.m_hQueryUnit) as Unit
	}
	// ReliableGold				=> NonSpectator
	get RespawnSeconds(): number {
		return this.PlayerTeamData?.m_iRespawnSeconds ?? 0
	}
	// RoshanKills				=> NonSpectator
	// RunePickups				=> NonSpectator
	get SelectedHeroId(): number {
		return this.PlayerTeamData?.m_nSelectedHeroID ?? 0
	}
	get SelectedUnits(): Entity[] {

		let selected: Entity[] = []

		let selUnits = this.m_pBaseEntity.m_nSelectedUnits
		// NOTICE: need test w/o check undefined

		// loop-optimizer: FORWARD
		selUnits.forEach(unitNative => {
			let unit = EntityManager.GetEntityByNative(unitNative)
			if (unit !== undefined)
				selected.push(unit)
		})

		return selected
	}
	// SentryWardsPlaced		=> NonSpectator
	// SharedGold				=> NonSpectator

	// Stuns					=> NonSpectator
	// TeamSlot					=> NonSpectator
	get TotalEarnedGold(): number {
		return this.m_pBaseEntity.m_iTotalEarnedGold
	}
	get TotalEarnedXP(): number {
		return this.m_pBaseEntity.m_iTotalEarnedXP
	}
	// TowerKills				=> NonSpectator
	// UnreliableGold			=> NonSpectator
	// WardsDestroyed			=> NonSpectator
	// WardsPurchased			=> NonSpectator
	// StickyItemId ??
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("C_DOTAPlayer", Player)
