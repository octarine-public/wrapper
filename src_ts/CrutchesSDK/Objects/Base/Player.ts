import Vector3 from "../../Base/Vector3";
import ExecuteOrder from "../../Native/ExecuteOrder";
import { default as EntityManager, LocalPlayer, PlayerResource } from "../../Managers/EntityManager";
import Entity from "./Entity"
import Hero from "./Hero"
import Unit from "./Unit";
import Ability from "./Ability";
import Tree from "./Tree";
import Item from "./Item";
import PhysicalItem from "./PhysicalItem";
import Rune from "./Rune";

// move to enum
declare const enum ConnectionState {
	Unknown = 0,
	NotYetConnected = 1,
	Connected = 2,
	Disconnected = 3,
	Abandoned = 4,
	Loading = 5,
	Failed = 6,
}

export default class Player extends Entity {

	m_pBaseEntity: C_DOTAPlayer
	private m_Name: string
	private m_PlayerData: PlayerResourcePlayerData_t
	private m_PlayerTeamData: PlayerResourcePlayerTeamData_t
	
	/**
	 * Only for LocalPlayer
	 */
	get ActiveAbility(): Ability {
		return EntityManager.GetEntityByNative(this.m_pBaseEntity.m_hActiveAbility) as Ability;
	}
	get Assists(): number {
		return this.PlayerTeamData.m_iAssists
	}
	get ButtleBonusRate(): number {
		return this.PlayerTeamData.m_iBattleBonusRate
	}
	// BuybackCooldownTime 		=> NonSpectator
	// BuybackCostTime			=> NonSpectator
	// BuybackGoldLimitTime		=> NonSpectator
	// CameraPosition			=> CameraManager
	// CampsStacked				=> NonSpectator
	// ClaimedDenyCount			=> NonSpectator
	// ClaimedMissCount 		=> NonSpectator
	get CompendiumLevel(): number {
		return this.PlayerTeamData.m_unCompendiumLevel
	}
	get ConnectionState(): ConnectionState {
		return this.PlayerData.m_iConnectionState
	}
	// CreepKillGold			=> NonSpectator
	// CreepsStacked			=> NonSpectator
	// CustomBuybackCooldown	=> NonSpectator
	get Deaths(): number {
		return this.PlayerTeamData.m_iDeaths
	}
	// DenyCount				=> NonSpectator
	// GoldSpentOnSupport		=> NonSpectator
	get HasRandomed(): boolean {
		return this.PlayerTeamData.m_bHasRandomed
	}
	// HasRepicked 				=> PlayerResourcePlayerTeamData_t
	// Healing					=> NonSpectator
	get Hero(): Hero {
		return EntityManager.GetEntityByNative(this.m_pBaseEntity.m_hAssignedHero) as Hero;
	}
	get HeroAssigned(): boolean {
		return this.Hero !== undefined // this.m_pBaseEntity.m_bHeroAssigned // always false;
	}
	// HeroDamage				=> NonSpectator
	// HeroKillGold				=> NonSpectator
	get PlayerID(): number {
		return this.m_pBaseEntity.m_iPlayerID
	}
	// IncomeGold				=> NonSpectator
	get IsAFK(): boolean {
		return this.PlayerTeamData.m_bAFK;
	}
	get IsBattleBonusActive(): boolean {
		return this.PlayerTeamData.m_bBattleBonusActive;
	}
	get IsBroadcaster(): boolean {
		return this.PlayerData.m_bIsBroadcaster;
	}
	get IsFakeClient(): boolean {
		return this.PlayerData.m_bFakeClient;
	}
	get IsFullyJoinedServer(): boolean {
		return this.PlayerData.m_bFullyJoinedServer;
	}
	get IsPredictingVictory(): boolean {
		return this.PlayerTeamData.m_bHasPredictedVictory;
	}
	get IsVoiceChatBanned(): boolean {
		return this.PlayerTeamData.m_bVoiceChatBanned;
	}
	get Kills(): number {
		return this.PlayerTeamData.m_iKills;
	}
	get KillStreak(): number {
		return this.PlayerTeamData.m_iStreak;
	}
	get LastBuybackTime(): number {
		return this.PlayerTeamData.m_iLastBuybackTime;
	}
	// LastHitCount				=> NonSpectator
	// LastHitMultikill			=> NonSpectator
	// LastHitStreak			=> NonSpectator
	get Level(): number {
		return this.PlayerTeamData.m_iLevel;
	}
	// MissCount				=> NonSpectator
	get Name(): string {
		return this.m_Name
			|| this.IsValid && PlayerResource
			? (this.m_Name = PlayerResource.GetNameByPlayerID(this.PlayerID)) : "";
	}
	// NearbyCreepDeathCount	=> NonSpectator
	// ObserverWardsPlaced		=> NonSpectator
	get PlayerData(): PlayerResourcePlayerData_t {
		return this.m_PlayerData
			|| this.IsValid
			? (this.m_PlayerData = PlayerResource.GetPlayerDataByPlayerID(this.PlayerID)) : undefined;
	}
	get PlayerTeamData(): PlayerResourcePlayerTeamData_t {
		return this.m_PlayerTeamData
			|| this.IsValid && PlayerResource
			? (this.m_PlayerTeamData = PlayerResource.GetPlayerTeamDataByPlayerID(this.PlayerID)) : undefined;
	}
	get PlayerSteamID(): bigint {
		return this.m_PlayerData.m_iPlayerSteamID;
	}
	get QueryUnit(): Unit {
		if (!this.m_pBaseEntity.m_bInQuery)
			return undefined;
		return EntityManager.GetEntityByNative(this.m_pBaseEntity.m_hQueryUnit) as Unit;
	}

	// ReliableGold				=> NonSpectator
	get RespawnSeconds(): number {
		return this.PlayerTeamData.m_iRespawnSeconds;
	}
	// RoshanKills				=> NonSpectator
	// RunePickups				=> NonSpectator
	get SelectedHeroId(): HeroID_t {
		return this.PlayerTeamData.m_nSelectedHeroID;
	}
	get SelectedUnits(): Entity[] {

		let selected: Entity[] = [];

		let selUnits = this.m_pBaseEntity.m_nSelectedUnits;
		if (selUnits.length > 0) {
			selUnits.forEach(unitNative => {
				let unit = EntityManager.GetEntityByNative(unitNative);
				if (unit !== undefined)
					selected.push(unit);
			})
		}
		return selected;
	}
	// SentryWardsPlaced		=> NonSpectator
	// SharedGold				=> NonSpectator

	// Stuns					=> NonSpectator
	// TeamSlot					=> NonSpectator
	get TotalEarnedGold(): number {
		return this.m_pBaseEntity.m_iTotalEarnedGold;
	}
	get TotalEarnedXP(): number {
		return this.m_pBaseEntity.m_iTotalEarnedXP;
	}
	// TowerKills				=> NonSpectator
	// UnreliableGold			=> NonSpectator
	// WardsDestroyed			=> NonSpectator
	// WardsPurchased			=> NonSpectator

	static get QuickBuyItems(): number[] {
		return LocalPlayer !== undefined 
			? LocalPlayer.m_pBaseEntity.m_quickBuyItems : [];
	}
	// StickyItemId ??

	static PrepareOrder(order: {
		orderType: dotaunitorder_t,
		target?: Entity | number,
		position?: Vector3,
		ability?: Ability,
		orderIssuer?: PlayerOrderIssuer_t,
		unit?: Unit,
		queue?: boolean,
		showEffects?: boolean
	}) {
		return ExecuteOrder.fromObject(order).ExecuteOrder()
	}

	static OrderNone(unit: Unit, queue?: boolean, showEffects?: boolean) {
		return this.PrepareOrder({ orderType: dotaunitorder_t.DOTA_UNIT_ORDER_NONE, unit, queue, showEffects });
	}
	/**
	 * Only for LocalPlayer
	 */
	static Buyback(queue?: boolean, showEffects?: boolean) {
		this.PrepareOrder({ orderType: dotaunitorder_t.DOTA_UNIT_ORDER_BUYBACK, queue, showEffects });
	}
	/**
	 * Only for LocalPlayer
	 */
	static Glyph(queue?: boolean, showEffects?: boolean) {
		this.PrepareOrder({ orderType: dotaunitorder_t.DOTA_UNIT_ORDER_GLYPH, queue, showEffects });
	}
	/**
	 * Only for LocalPlayer
	 */
	static CastRiverPaint(position: Vector3, queue?: boolean, showEffects?: boolean) {
		this.PrepareOrder({ orderType: dotaunitorder_t.DOTA_UNIT_ORDER_CAST_RIVER_PAINT, position, queue, showEffects });
	}
	/**
	 * Only for LocalPlayer
	 */
	static PreGameAdgustItemAssigment(ItemID: number, queue?: boolean, showEffects?: boolean) {
		this.PrepareOrder({ orderType: dotaunitorder_t.DOTA_UNIT_ORDER_PREGAME_ADJUST_ITEM_ASSIGNMENT, target: ItemID, queue, showEffects });
	}
	/**
	 * Only for LocalPlayer
	 */
	static Scan(position: Vector3, queue?: boolean, showEffects?: boolean) {
		return this.PrepareOrder({ orderType: dotaunitorder_t.DOTA_UNIT_ORDER_RADAR, position, queue, showEffects });
	}
}