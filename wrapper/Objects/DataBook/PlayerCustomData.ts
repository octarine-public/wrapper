import { Color } from "../../Base/Color"
import { DataTeamPlayer } from "../../Base/DataTeamPlayer"
import { Vector3 } from "../../Base/Vector3"
import { ConnectionState } from "../../Enums/ConnectionState"
import { DOTAGameMode } from "../../Enums/DOTAGameMode"
import { DOTAGameState } from "../../Enums/DOTAGameState"
import { LaneSelection } from "../../Enums/LaneSelection"
import { LaneSelectionFlags } from "../../Enums/LaneSelectionFlags"
import { Team } from "../../Enums/Team"
import { GameSleeper } from "../../Helpers/Sleeper"
import { EventsSDK } from "../../Managers/EventsSDK"
import { arrayRemove } from "../../Utils/ArrayExtensions"
import { MaskToArrayNumber } from "../../Utils/BitsExtensions"
import { GameState } from "../../Utils/GameState"
import { Entity, GameRules, LocalPlayer } from "../Base/Entity"
import { Hero } from "../Base/Hero"
import { PlayerResource } from "../Base/PlayerResource"
import { TeamData } from "../Base/TeamData"
import { UnitData } from "./UnitData"

/**
 * ====================================================
 * NOTE: don't import this file into PlayerResource.ts
 * ====================================================
 * */

/**
 * @ignore
 * @internal
 */
const playerDataCustomMap = new Map<number, PlayerCustomData>()

/**
 * @ignore
 * @internal
 */
export class GPMCounter {
	public AbandonedGPM = 0

	private counter = 1
	private lastUpdate: Nullable<number>

	constructor(
		private gpm?: number,
		private readonly frozenUpdate?: number
	) {}

	public Update(data: PlayerCustomData) {
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
		this.AbandonedGPM = data.IsAbandoned ? this.counter - rem : 0
		data.ReliableGold += !data.IsAbandoned ? this.counter - rem : 0
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

export class PlayerCustomData {
	public static readonly MaxBuyBackCooldown = 480
	public static readonly TeamData = new Set<TeamData>()

	public static get(playerID: number) {
		return playerDataCustomMap.get(playerID)
	}

	public static has(playerID: number) {
		return playerDataCustomMap.has(playerID)
	}

	public static set(playerID: number, hero?: Hero) {
		if (playerID === -1) {
			return
		}
		let playerData = this.get(playerID)
		if (playerData === undefined) {
			playerData = new PlayerCustomData(playerID)
			playerData.PlayerDataChanged(hero)
			playerDataCustomMap.set(playerID, playerData)
			EventsSDK.emit("PlayerCustomDataUpdated", false, playerData)
		}
		if (hero !== undefined && hero !== playerData.Hero) {
			playerData.PlayerDataChanged(hero)
			EventsSDK.emit("PlayerCustomDataUpdated", false, playerData)
		}
	}

	public static get Array() {
		return Array.from(playerDataCustomMap.values())
	}

	public static Delete(playerID: number) {
		const playerData = this.get(playerID)
		if (playerData === undefined) {
			return false
		}
		playerData.IsValid = false
		EventsSDK.emit("PlayerCustomDataUpdated", false, playerData)
		playerDataCustomMap.delete(playerData.PlayerID)
		return true
	}

	public static DeleteAll() {
		for (const playerData of this.Array) {
			this.Delete(playerData.PlayerID)
		}
	}

	/** @readonly */
	public IsValid = true
	/** @readonly */
	public Hero: Nullable<Hero>
	/**
	 * @internal
	 * @ignore
	 */
	public ItemsGold = 0
	private readonly sleeper = new GameSleeper()
	private readonly goldAfterTimeAr: [number, number][] = []
	private readonly counters = new Map<string, GPMCounter>([["GPM", new GPMCounter()]])

	private denyCount = 0
	private lastHitCount = 0
	private reliableGold = 0
	private unreliableGold = 600
	private changeDetectedUnload = false

	constructor(public readonly PlayerID: number) {}

	public get IsChangeDetectedUnload() {
		return this.changeDetectedUnload
	}

	public get IsLocalPlayer() {
		return (LocalPlayer?.PlayerID ?? -1) === this.PlayerID
	}
	public get IsSpectator() {
		return (
			this.Team === Team.Observer ||
			this.Team === Team.Neutral ||
			this.Team === Team.None ||
			this.Team === Team.Shop
		)
	}
	public get ConnectionState() {
		return this.PlayerData?.ConnectionState ?? ConnectionState.Unknown
	}
	public get IsAbandoned() {
		return this.ConnectionState === ConnectionState.Abandoned
	}
	public get IsDisconnected() {
		return this.ConnectionState === ConnectionState.Disconnected
	}
	public get HeroName(): Nullable<string> {
		return UnitData.GetHeroNameByID(this.PlayerTeamData?.SelectedHeroID ?? -1)
	}
	public get SteamID(): Nullable<bigint> {
		return this.PlayerData?.SteamID
	}
	public get LaneSelections(): LaneSelection[] {
		return MaskToArrayNumber(this.LaneSelectionFlags)
	}
	public get LaneSelectionFlags(): LaneSelectionFlags {
		const pTeamData = this.PlayerTeamData
		if (pTeamData === undefined) {
			return LaneSelectionFlags.None
		}
		return pTeamData.PlayerDraftPreferredRoles || pTeamData.LaneSelectionFlags
	}
	/**
	 * @description Gets the respawn position for the player.
	 * @return {Vector3 | undefined}
	 */
	public get RespawnPosition(): Nullable<Vector3> {
		return PlayerResource?.RespawnPositions[this.PlayerID]
	}
	/**
	 * @description Returns the reliable gold amount for the player.
	 * @returns {number}
	 */
	public get ReliableGold(): number {
		return this.DataTeamPlayer === undefined
			? this.reliableGold
			: this.DataTeamPlayer.ReliableGold
	}
	/** @ignore */
	public set ReliableGold(value) {
		if (this.DataTeamPlayer === undefined) {
			this.reliableGold = value
		}
	}
	/**
	 * @description Returns the unreliable gold amount for the player.
	 * @returns {number}
	 */
	public get UnreliableGold(): number {
		return this.DataTeamPlayer === undefined
			? this.unreliableGold
			: this.DataTeamPlayer.UnreliableGold
	}
	/** @ignore */
	public set UnreliableGold(value) {
		if (this.DataTeamPlayer === undefined) {
			this.unreliableGold = value
		}
	}
	/**
	 * @description Returns the deny count of the player.
	 * @returns {number}
	 */
	public get DenyCount(): number {
		return this.DataTeamPlayer === undefined
			? this.denyCount
			: this.DataTeamPlayer.DenyCount
	}
	/** @ignore */
	public set DenyCount(value) {
		if (this.DataTeamPlayer === undefined) {
			this.denyCount = value
		}
	}
	/**
	 * @description Returns the last hit count of the player.
	 * @returns {number}
	 */
	public get LastHitCount(): number {
		return this.DataTeamPlayer === undefined
			? this.lastHitCount
			: this.DataTeamPlayer.LastHitCount
	}
	/** @ignore */
	public set LastHitCount(value) {
		if (this.DataTeamPlayer === undefined) {
			this.lastHitCount = value
		}
	}
	public get PlayerData() {
		return PlayerResource?.GetPlayerDataByPlayerID(this.PlayerID)
	}
	public get PlayerTeamData() {
		return PlayerResource?.GetPlayerTeamDataByPlayerID(this.PlayerID)
	}
	public get Team() {
		return this.PlayerData?.Team ?? Team.None
	}
	public get Color() {
		return (
			(this.Team === Team.Dire
				? Color.PlayerColorDire[this.TeamSlot]
				: Color.PlayerColorRadiant[this.TeamSlot]) ?? Color.Red
		)
	}
	public get PlayerName(): Nullable<string> {
		return this.PlayerData?.Name
	}
	public get TeamSlot(): number {
		return this.PlayerTeamData?.TeamSlot ?? -1
	}
	public get SelectedHeroIndex(): number {
		return this.PlayerTeamData?.SelectedHeroIndex ?? -1
	}
	public get SelectedHeroID(): number {
		return this.PlayerTeamData?.SelectedHeroID ?? -1
	}
	public get DataTeamPlayer(): Nullable<DataTeamPlayer> {
		const arr = Array.from(PlayerCustomData.TeamData)
		if (arr.length > 1) {
			return arr.find(x => x.Team === this.Team)?.DataTeam[this.TeamSlot]
		}
		if (!this.IsEnemy()) {
			return arr[0]?.DataTeam[this.TeamSlot]
		}
	}
	/**
	 * TODO: need test
	 * @description Determines whether the player chooses a hero
	 * @return {boolean}
	 */
	public get IsPreparedSelectionHero(): boolean {
		return (this.PlayerTeamData?.SelectedHeroID ?? -1) === 0
	}
	public get EventsData() {
		return this.PlayerTeamData?.PlayerEventsData ?? []
	}
	/**
	 * @description Returns the number of available salutes (tips player) for the player.
	 * @returns {number}
	 */
	public get AvailableSalutes(): number {
		return this.EventsData.find(data => data.EventID === 19)?.AvailableSalutes ?? 0
	}
	/**
	 * @description Returns the net worth of the player.
	 * @returns {number}
	 */
	public get NetWorth(): number {
		if (this.DataTeamPlayer !== undefined) {
			return this.DataTeamPlayer.NetWorth
		}
		return Math.floor(
			Math.max(this.reliableGold, 0) + this.unreliableGold + this.ItemsGold
		)
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
		return this.IsDisabled
			? false
			: this.ReliableGold + this.UnreliableGold >= this.BuyBackCost
	}
	/**
	 * The remaining cooldown time in seconds.
	 * @description Returns the remaining cooldown time for the buyback.
	 * @returns {number}
	 */
	public get BuyBackColdown(): number {
		return this.DataTeamPlayer === undefined
			? this.sleeper.RemainingSleepTime(this.PlayerID) / 1000
			: Math.max(this.DataTeamPlayer.BuybackCooldownTime - GameState.RawGameTime, 0)
	}
	/**
	 * @description Determines if the hero has randomed.
	 * @returns {boolean}
	 */
	public get HasRandomed(): boolean {
		return this.PlayerTeamData?.HasRandomed ?? false
	}
	protected get IsDisabled() {
		return this.DataTeamPlayer === undefined && this.changeDetectedUnload
	}
	public IsEnemy(ent?: Entity) {
		const team = ent?.Team ?? GameState.LocalTeam
		return this.Team !== team
	}
	public Distance2D(target: Entity) {
		return this.Hero?.Distance2D(target) ?? Number.MAX_SAFE_INTEGER
	}
	/**
	 * @ignore
	 * @internal
	 * @description internal only for wrapper
	 */
	public AddCounter(key: string, counter = new GPMCounter()): void {
		if (!this.counters.has(key)) {
			this.counters.set(key, counter)
			counter.Update(this)
		}
	}
	/**
	 * @ignore
	 * @internal
	 * @description internal only for wrapper
	 */
	public DeleteCounter(key: string) {
		this.counters.delete(key)
	}
	/**
	 * @ignore
	 * @internal
	 * @description internal only for wrapper
	 */
	public AddGoldAfterTime(goldCount: number, sec: number) {
		this.goldAfterTimeAr.push([GameState.RawGameTime + sec, goldCount])
	}
	/**
	 * @ignore
	 * @internal
	 * @description internal only for wrapper
	 */
	public SubtractGold(amount: number) {
		if (this.DataTeamPlayer === undefined) {
			const unreliableCost = Math.min(this.unreliableGold, amount)
			this.unreliableGold -= unreliableCost

			if (!this.IsDisabled) {
				this.reliableGold -= amount - unreliableCost
			}
		}
	}
	/**
	 * @ignore
	 * @internal
	 * @description internal only for wrapper
	 */
	public SetBuyBack() {
		this.SubtractGold(this.BuyBackCost)
		this.sleeper.Sleep(PlayerCustomData.MaxBuyBackCooldown * 1000, this.PlayerID)
	}
	/**
	 * @ignore
	 * @internal
	 * @description internal only for wrapper
	 */
	public PostDataUpdate() {
		if (this.DataTeamPlayer === undefined) {
			this.UpdateCounters()
			this.UpdateGoldAfterTime()
		}
	}
	/**
	 * @ignore
	 * @internal
	 * @description internal only for wrapper
	 */
	public PlayerDataChanged(hero?: Hero) {
		if (hero !== undefined) {
			this.Hero = hero?.IsValid ? hero : undefined
		}
	}
	/**
	 * @ignore
	 * @internal
	 * @description internal only for wrapper (if user call reload or reconnect server)
	 */
	public ChangeDetectedUnload() {
		if (GameRules === undefined || GameRules.IsBanPhase) {
			return
		}
		if (GameRules.GameState !== DOTAGameState.DOTA_GAMERULES_STATE_GAME_IN_PROGRESS) {
			return
		}
		const isTime = GameRules.GameTime !== 0
		const isGold = this.unreliableGold <= 600
		this.changeDetectedUnload = isGold && isTime

		if (isGold && isTime) {
			this.goldAfterTimeAr.slice(0)
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
	/**
	 * @ignore
	 * @internal
	 */
	protected UpdateGPMBetweenPlayers() {
		const connectionState = this.PlayerData?.ConnectionState
		if (
			connectionState === undefined ||
			connectionState !== ConnectionState.Abandoned
		) {
			return
		}
		const gpm = this.counters.get("GPM")
		if (gpm === undefined) {
			return
		}
		const players = PlayerCustomData.Array.filter(
			x => x.PlayerID !== this.PlayerID && x.Team === this.Team
		)
		for (const playerData of players) {
			const gold = gpm.AbandonedGPM / Math.max(players.length, 1)
			playerData.ReliableGold += gold
		}
	}
}

/**
 * ====================================================
 * NOTE: don't import this file into PlayerResource.ts
 * ====================================================
 * */
