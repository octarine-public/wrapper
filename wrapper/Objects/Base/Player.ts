import { Color } from "../../Base/Color"
import { DataTeamPlayer } from "../../Base/DataTeamPlayer"
import { Vector3 } from "../../Base/Vector3"
import { ReencodeProperty, WrapperClass } from "../../Decorators"
import { DOTAGameMode } from "../../Enums/DOTAGameMode"
import { DOTAGameState } from "../../Enums/DOTAGameState"
import { EShareAbility } from "../../Enums/EShareAbility"
import { LaneSelection } from "../../Enums/LaneSelection"
import { LaneSelectionFlags } from "../../Enums/LaneSelectionFlags"
import { EPropertyType } from "../../Enums/PropertyType"
import { Team } from "../../Enums/Team"
import { GameSleeper } from "../../Helpers/Sleeper"
import { EntityManager } from "../../Managers/EntityManager"
import { ExecuteOrder } from "../../Native/ExecuteOrder"
import { arrayRemove } from "../../Utils/ArrayExtensions"
import { MaskToArrayNumber } from "../../Utils/BitsExtensions"
import { GameState } from "../../Utils/GameState"
import { PlayerCustomData } from "../DataBook/PlayerCustomData"
import { UnitData } from "../DataBook/UnitData"
import { RegisterFieldHandler } from "../NativeToSDK"
import { Entity, GameRules, LocalPlayer } from "./Entity"
import { Hero } from "./Hero"
import { Item } from "./Item"
import { PlayerPawn } from "./PlayerPawn"
import { PlayerResource } from "./PlayerResource"
import { TeamData } from "./TeamData"

/** @ignore */
export class GPMCounter {
	private counter = 1
	private lastUpdate: Nullable<number>

	constructor(
		private gpm?: number,
		private readonly frozenUpdate?: number
	) {}

	public Update(data: Player) {
		const gameTime = GameRules?.GameTime ?? 0
		const rawGameTime = GameState.RawGameTime
		if ((this.frozenUpdate ?? 0) > rawGameTime) {
			return
		}

		this.gpm ??= this.getGPMAtTime(gameTime)
		if (this.lastUpdate !== undefined) {
			this.counter += (this.gpm * (gameTime - this.lastUpdate)) / 60
		}

		this.lastUpdate = gameTime
		const rem = this.counter % 1
		data.ReliableGold += this.counter - rem
		this.counter = rem
	}

	// TODO: need improvement(big time)
	// see https://dota2.fandom.com/wiki/Gold#Periodic_Gold
	private getGPMAtTime(seconds: number): number {
		const baseGPM = 90
		const intervals = Math.floor(seconds) / (4.6 * 60)
		return Math.min(baseGPM + (seconds >= 720 ? seconds / intervals : 0), 150.5)
	}
}

@WrapperClass("CDOTAPlayerController")
export class Player extends Entity {
	public static readonly TeamData = new Set<TeamData>() // TODO remove

	/** @redonly */
	public Hero: Nullable<Hero>

	/** @redonly */
	public Pawn: Nullable<PlayerPawn>

	/** @redonly */
	public QuickBuyItems: number[] = []

	/**
	 * @ignore
	 * @internal
	 */
	public ItemsGold = 0 // TODO remove

	/**
	 * @ignore
	 * @internal
	 */
	public hero_ = -1
	/**
	 * @ignore
	 * @internal
	 */
	public pawn_ = -1
	/**
	 * @ignore
	 * @internal
	 */
	public playerID_ = -1

	/** @ignore */
	private denyCount = 0 // TODO remove
	private lastHitCount = 0 // TODO remove

	private reliableGold = 0 // TODO remove
	/** base start gold */
	private unreliableGold = 600 // TODO remove

	private readonly maxBuyBackCooldown = 480 // TODO remove
	private readonly sleeper = new GameSleeper() // TODO remove
	private readonly goldAfterTimeAr: [number, number][] = [] // TODO remove
	private readonly counters = new Map<string, GPMCounter>([["GPM", new GPMCounter()]]) // TODO remove

	public get IsSpectator(): boolean {
		return (
			this.Team === Team.Observer ||
			this.Team === Team.Neutral ||
			this.Team === Team.None ||
			this.Team === Team.Shop
		)
	}

	/**
	 * @description Get the steamID of the player.
	 * @returns {bigint | undefined}
	 */
	public get SteamID(): Nullable<bigint> {
		return PlayerCustomData.get(this.PlayerID)?.SteamID
	}
	/**
	 * @description Get the name of the player.
	 * @returns {string | undefined}
	 */
	public get PlayerName(): Nullable<string> {
		return PlayerCustomData.get(this.PlayerID)?.PlayerName
	}
	/**
	 * The LaneSelectionFlags for the player.
	 * @description Returns the LaneSelectionFlags for the player.
	 * @return {LaneSelectionFlags}
	 */
	public get LaneSelectionFlags(): LaneSelectionFlags {
		const pTeamData = this.PlayerTeamData
		if (pTeamData === undefined) {
			return LaneSelectionFlags.None
		}
		return pTeamData.PlayerDraftPreferredRoles || pTeamData.LaneSelectionFlags
	}
	/**
	 * @description Returns array the selected player roles.
	 * @return {Array<LaneSelection>}
	 */
	public get LaneSelections(): LaneSelection[] {
		return MaskToArrayNumber(this.LaneSelectionFlags)
	}
	/**
	 * TODO: need test
	 * @description Determines whether the player chooses a hero
	 * @return {boolean}
	 */
	public get IsPreparedSelectionHero(): boolean {
		return (this.PlayerTeamData?.SelectedHeroID ?? -1) === 0
	}
	/**
	 * @description Checks if the instance is the local player.
	 * @returns {boolean}
	 */
	public get IsLocalPlayer(): boolean {
		return this === LocalPlayer
	}
	// TODO: description
	public get EventsData() {
		return this.PlayerTeamData?.PlayerEventsData ?? []
	}
	/**
	 * @description Returns the number of available salutes (tips player) for the hero.
	 * @returns {number}
	 */
	public get AvailableSalutes(): number {
		return this.EventsData.find(data => data.EventID === 19)?.AvailableSalutes ?? 0
	}
	/**
	 * @description Get the playerID of the player.
	 * @returns {number | -1}
	 */
	public get PlayerID(): number {
		return this.Hero?.PlayerID ?? this.playerID_
	}
	/**
	 * Retrieves the team slot of the hero.
	 * @description The team slot of the hero. If the hero's team data is not available, return -1.
	 * @returns {number}
	 */
	public get TeamSlot(): number {
		return this.PlayerTeamData?.TeamSlot ?? -1
	}
	/**
	 * The color of the hero.
	 * @description Returns the color of the hero based on their team.
	 * @returns {Color}
	 */
	public get PlayerColor(): Color {
		return (
			(this.Team === Team.Dire
				? Color.PlayerColorDire[this.TeamSlot]
				: Color.PlayerColorRadiant[this.TeamSlot]) ?? Color.Red
		)
	}
	/**
	 * @description Gets the name of the hero.
	 * @returns {string | undefined}
	 */
	public get HeroName(): Nullable<string> {
		return (
			this.Hero?.Name ??
			UnitData.GetHeroNameByID(this.PlayerTeamData?.SelectedHeroID ?? -1)
		)
	}
	/**
	 * @description Gets the respawn position for the hero.
	 * @returns {Vector3 | undefined}
	 */
	public get RespawnPosition(): Nullable<Vector3> {
		return PlayerResource?.RespawnPositions[this.PlayerID]
	}
	/**
	 * @description Retrieves the PlayerTeamData for the player.
	 */
	public get PlayerTeamData() {
		return PlayerResource?.GetPlayerTeamDataByPlayerID(this.PlayerID)
	}
	/**
	 * Retrieves the DataTeamPlayer for the current player.
	 * @description The  for the current player. If the player is a spectator,
	 * the DataTeamPlayer of the player's team and slot is returned. If the player is not
	 * an enemy, the DataTeamPlayer of the first team and slot is returned. Otherwise, `undefined` is returned.
	 * @return {DataTeamPlayer}
	 */
	public get DataTeamPlayer(): Nullable<DataTeamPlayer> {
		const arr = Array.from(Player.TeamData)
		if (LocalPlayer?.IsSpectator) {
			return arr.find(x => x.Team === this.Team)?.DataTeam[this.TeamSlot]
		}
		if (this.IsEnemy()) {
			return
		}
		return arr[0]?.DataTeam[this.TeamSlot]
	}
	/**
	 * @description Returns the net worth of the hero.
	 * @returns {number}
	 */
	public get NetWorth(): number {
		return this.DataTeamPlayer === undefined || this.IsEnemy()
			? (this.reliableGold + this.unreliableGold + this.ItemsGold) >> 0
			: this.DataTeamPlayer.NetWorth
	}
	/**
	 * @description Returns the reliable gold amount for the hero.
	 * @returns {number}
	 */
	public get ReliableGold(): number {
		return this.DataTeamPlayer === undefined || this.IsEnemy()
			? this.reliableGold
			: this.DataTeamPlayer.ReliableGold
	}
	/** @ignore */
	public set ReliableGold(value) {
		if (this.IsEnemy()) {
			this.reliableGold = value
		}
	}
	/**
	 * @description Returns the unreliable gold amount for the hero.
	 * @returns {number}
	 */
	public get UnreliableGold(): number {
		return this.DataTeamPlayer === undefined || this.IsEnemy()
			? this.unreliableGold
			: this.DataTeamPlayer.UnreliableGold
	}
	/** @ignore */
	public set UnreliableGold(value) {
		if (this.IsEnemy()) {
			this.unreliableGold = value
		}
	}
	/**
	 * @description Returns the deny count of the hero.
	 * @returns {number}
	 */
	public get DenyCount(): number {
		return this.DataTeamPlayer === undefined || this.IsEnemy()
			? this.denyCount
			: this.DataTeamPlayer.DenyCount
	}
	/** @ignore */
	public set DenyCount(value) {
		if (this.IsEnemy()) {
			this.denyCount = value
		}
	}
	/**
	 * @description Returns the last hit count of the hero.
	 * @returns {number}
	 */
	public get LastHitCount(): number {
		return this.DataTeamPlayer === undefined || this.IsEnemy()
			? this.lastHitCount
			: this.DataTeamPlayer.LastHitCount
	}
	/** @ignore */
	public set LastHitCount(value) {
		if (this.IsEnemy()) {
			this.lastHitCount = value
		}
	}
	/**
	 * see: https://dota2.fandom.com/wiki/Gold#Buyback
	 * @description Returns the buyback cost based on the net worth of the player.
	 * @returns {number}
	 */
	public get BuyBackCost(): number {
		return Math.floor(200 + this.NetWorth / 13)
	}
	/**
	 * @description Calculate the gold loss on death.
	 * @returns {number}
	 */
	public get GoldLossOnDeath(): number {
		return Math.round(Math.min(this.UnreliableGold, this.NetWorth / 40))
	}
	/**
	 * @description Returns the time of the last salute sent by the hero's PlayerTeamData.
	 * @returns {number}
	 */
	public get TimeOfLastSaluteSent(): number {
		return this.PlayerTeamData?.TimeOfLastSaluteSent ?? 0
	}
	/**
	 * @description Determines if the hero has enough gold to perform a buyback.
	 * @returns {boolean}
	 */
	public get HasGoldForBuyBack(): boolean {
		return this.ReliableGold + this.UnreliableGold >= this.BuyBackCost
	}
	/**
	 * The remaining cooldown time in seconds.
	 * @description Returns the remaining cooldown time for the buyback.
	 * @returns {number}
	 */
	public get BuyBackColdown(): number {
		return this.DataTeamPlayer === undefined || this.IsEnemy()
			? this.sleeper.RemainingSleepTime(this.HeroName + "_" + this.PlayerID)
			: Math.max(this.DataTeamPlayer.BuybackCooldownTime - GameState.RawGameTime, 0)
	}
	/**
	 * @description Determines if the hero has randomed.
	 * @returns {boolean}
	 */
	public get HasRandomed(): boolean {
		return this.PlayerTeamData?.HasRandomed ?? false
	}

	public CannotUseItem(item: Item): boolean {
		return (
			item.Shareability === EShareAbility.ITEM_NOT_SHAREABLE &&
			this.PlayerID !== item.PurchaserID
		)
	}

	public Buyback(queue?: boolean, showEffects?: boolean): void {
		return ExecuteOrder.Buyback(queue, showEffects)
	}

	public Glyph(queue?: boolean, showEffects?: boolean): void {
		return ExecuteOrder.Glyph(queue, showEffects)
	}

	public CastRiverPaint(
		position: Vector3,
		queue?: boolean,
		showEffects?: boolean
	): void {
		return ExecuteOrder.CastRiverPaint(position, queue, showEffects)
	}

	public PreGameAdjustItemAssigment(
		itemID: number,
		queue?: boolean,
		showEffects?: boolean
	): void {
		return ExecuteOrder.PreGameAdjustItemAssigment(itemID, queue, showEffects)
	}

	public Scan(position: Vector3, queue?: boolean, showEffects?: boolean): void {
		return ExecuteOrder.Scan(position, queue, showEffects)
	}
	/**
	 * @ignore
	 * @internal
	 */
	public PostDataUpdate() {
		if (this.IsEnemy()) {
			this.UpdateCounters()
			this.UpdateGoldAfterTime()
		}
	}
	/**
	 * @ignore
	 * @internal
	 */
	public AddGoldAfterTime(count: number, sec: number) {
		this.goldAfterTimeAr.push([GameState.RawGameTime + sec, count])
	}
	/**
	 * @ignore
	 * @internal
	 */
	public SubtractGold(amount: number) {
		if (this.DataTeamPlayer !== undefined || !this.IsEnemy()) {
			return
		}
		const unreliableCost = Math.min(this.unreliableGold, amount)
		this.unreliableGold -= unreliableCost
		this.reliableGold -= amount - unreliableCost
	}
	/**
	 * @ignore
	 * @internal
	 */
	public SetBuyBack() {
		this.SubtractGold(this.BuyBackCost)
		this.sleeper.Sleep(
			this.maxBuyBackCooldown * 1000,
			this.HeroName + "_" + this.PlayerID
		)
	}
	/**
	 * @ignore
	 * @internal
	 */
	public UpdateProperties(entity: Nullable<Hero | PlayerPawn>) {
		if (entity instanceof Hero) {
			if (entity.HandleMatches(this.hero_)) {
				this.Hero = !entity.IsValid ? undefined : entity
				PlayerCustomData.set(this.PlayerID, entity)
			}
		}
		if (entity instanceof PlayerPawn) {
			if (entity.HandleMatches(this.pawn_)) {
				this.Pawn = !entity.IsValid ? undefined : entity
			}
		}
	}
	/**
	 * @ignore
	 * @internal
	 */
	public DeleteCounter(key: string) {
		this.counters.delete(key)
	}
	/**
	 * @ignore
	 * @internal
	 */
	public SetCounter(key: string, counter = new GPMCounter()) {
		if (!this.counters.has(key)) {
			this.counters.set(key, counter)
			counter.Update(this)
		}
	}
	/**
	 * @ignore
	 * @internal
	 */
	protected UpdateCounters() {
		if (
			GameRules === undefined ||
			GameRules.GameMode === DOTAGameMode.DOTA_GAMEMODE_EVENT
		) {
			return
		}

		for (const [name, counter] of this.counters) {
			if (name !== "GPM") {
				counter.Update(this)
				continue
			}
			if (
				GameRules.GameState ===
				DOTAGameState.DOTA_GAMERULES_STATE_GAME_IN_PROGRESS
			) {
				counter.Update(this)
			}
		}
	}
	/**
	 * @ignore
	 * @internal
	 */
	protected UpdateGoldAfterTime() {
		const deletedGold: [number, number][] = []
		for (const ar of this.goldAfterTimeAr) {
			const [time, gold] = ar
			if (GameState.RawGameTime >= time) {
				deletedGold.push(ar)
				this.unreliableGold += gold
			}
		}
		for (const ar of deletedGold) {
			arrayRemove(this.goldAfterTimeAr, ar)
		}
	}
}

RegisterFieldHandler(Player, "m_quickBuyItems", (player, newVal) => {
	player.QuickBuyItems = (newVal as bigint[]).map(val => Number(val >> 1n))
})

RegisterFieldHandler(Player, "m_nPlayerID", (player, newVal) => {
	player.playerID_ = ReencodeProperty(newVal, EPropertyType.INT32) as number
	PlayerCustomData.set(player.PlayerID)
})

RegisterFieldHandler(Player, "m_hPawn", (player, newVal) => {
	player.pawn_ = ReencodeProperty(newVal, EPropertyType.UINT32) as number
	player.UpdateProperties(EntityManager.EntityByIndex<PlayerPawn>(player.pawn_))
})

RegisterFieldHandler(Player, "m_hAssignedHero", (player, newVal) => {
	player.hero_ = newVal as number
	player.UpdateProperties(EntityManager.EntityByIndex<Hero>(player.hero_))
})

export const Players = EntityManager.GetEntitiesByClass(Player)
