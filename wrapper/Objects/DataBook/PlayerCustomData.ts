import { Color } from "../../Base/Color"
import { DataTeamPlayer } from "../../Base/DataTeamPlayer"
import { PlayerData } from "../../Base/PlayerData"
import { PlayerTeamData } from "../../Base/PlayerTeamData"
import { Vector3 } from "../../Base/Vector3"
import { ConnectionState } from "../../Enums/ConnectionState"
import { DOTAGameMode } from "../../Enums/DOTAGameMode"
import { DOTAGameState } from "../../Enums/DOTAGameState"
import { LaneSelection } from "../../Enums/LaneSelection"
import { LaneSelectionFlags } from "../../Enums/LaneSelectionFlags"
import { Team } from "../../Enums/Team"
import { GameSleeper } from "../../Helpers/Sleeper"
import { EventsSDK } from "../../Managers/EventsSDK"
import { GameState } from "../../Utils/GameState"
import { Entity, GameRules, LocalPlayer } from "../Base/Entity"
import { Hero } from "../Base/Hero"
import { PlayerResource } from "../Base/PlayerResource"
import { TeamData } from "../Base/TeamData"
import { UnitData } from "./UnitData"

/**
 * ====================================================
 * NOTE: don't import this files into
 * PlayerData.ts
 * PlayerResource.ts
 * DataTeamPlayer.ts
 * PlayerTeamData.ts
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
	/**
	 * @description max cooldown of buyback in seconds
	 */
	public static readonly MaxBuyBackCooldown = 480
	/**
	 * @description Retrieves an array PlayerCustomData.
	 * @return {Array<PlayerCustomData>}
	 */
	public static readonly Array: PlayerCustomData[] = []
	/**
	 * @ignore
	 * @internal
	 * @description internal only for wrapper
	 */
	public static readonly TeamData: TeamData[] = []
	/**
	 * @description Retrieves the player data for the given player ID.
	 * @param {number} playerID - The ID of the player.
	 * @return {PlayerCustomData | undefined}
	 */
	public static get(playerID: number): Nullable<PlayerCustomData> {
		return playerDataCustomMap.get(playerID)
	}
	/**
	 * @description Checks if the given player ID exists in the PlayerCustomData.
	 * @param {number} playerID - The ID of the player to check.
	 * @return {boolean}
	 */
	public static has(playerID: number): boolean {
		return playerDataCustomMap.has(playerID)
	}
	/**
	 * @ignore
	 * @internal
	 * @description internal only for wrapper
	 */
	public static set(playerID: number, hero?: Hero) {
		if (playerID === -1) {
			return
		}
		let playerData = this.get(playerID)
		if (playerData === undefined) {
			playerData = new PlayerCustomData(playerID)
			playerData.PlayerDataChanged(hero)
			this.Array.push(playerData)
			playerDataCustomMap.set(playerID, playerData)
		}
		if (hero !== undefined && hero !== playerData.Hero) {
			playerData.PlayerDataChanged(hero)
		}
	}
	/**
	 * @ignore
	 * @internal
	 * @description internal only for wrapper
	 */
	public static PlayerCustomDataUpdatedAll() {
		for (let index = this.Array.length - 1; index > -1; index--) {
			const playerData = this.Array[index]
			EventsSDK.emit("PlayerCustomDataUpdated", false, playerData)
		}
	}
	/**
	 * @ignore
	 * @internal
	 * @description internal only for wrapper
	 */
	public static Delete(playerID: number) {
		const playerData = this.get(playerID)
		if (playerData === undefined) {
			return false
		}
		playerData.IsValid = false
		this.Array.remove(playerData)
		playerDataCustomMap.delete(playerData.PlayerID)
		EventsSDK.emit("PlayerCustomDataUpdated", false, playerData)
		return true
	}
	/**
	 * @ignore
	 * @internal
	 * @description internal only for wrapper
	 */
	public static DeleteAll() {
		for (let index = this.Array.length - 1; index > -1; index--) {
			const playerData = this.Array[index]
			this.Delete(playerData.PlayerID)
		}
	}

	/** @readonly */
	public IsValid = true

	/** @readonly */
	public Hero: Nullable<Hero>

	/**
	 * @ignore
	 * @internal
	 * @description internal only for wrapper
	 */
	public ItemsGold = 0

	private denyCount = 0
	private lastHitCount = 0
	private reliableGold = 0
	private unreliableGold = 600
	private changeDetectedUnload = false

	private readonly sleeper = new GameSleeper()
	private readonly goldAfterTimeAr: [number, number][] = []
	private readonly counters = new Map<string, GPMCounter>([["GPM", new GPMCounter()]])

	constructor(public readonly PlayerID: number) {}

	/**
	 * @description if after start game player reconnected or reload scripts
	 * @return {boolean}
	 */
	public get IsChangeDetectedUnload(): boolean {
		return this.changeDetectedUnload
	}
	/**
	 *
	 * @description Returns whether the player is the local player.
	 * @return {boolean}
	 */
	public get IsLocalPlayer(): boolean {
		return (LocalPlayer?.PlayerID ?? -1) === this.PlayerID
	}
	/**
	 * @description Check if the player is a spectator.
	 * @return {boolean}
	 */
	public get IsSpectator(): boolean {
		return (
			this.Team === Team.Observer ||
			this.Team === Team.Neutral ||
			this.Team === Team.None ||
			this.Team === Team.Shop
		)
	}
	/**
	 * Returns the connection state of the player.
	 * @description The connection state of the player.
	 * @return {ConnectionState}
	 */
	public get ConnectionState(): ConnectionState {
		return this.PlayerData?.ConnectionState ?? ConnectionState.Unknown
	}
	/**
	 * Returns a boolean indicating whether the connection is in an abandoned state.
	 * @description The value indicating whether the connection is abandoned.
	 * @return {boolean}
	 */
	public get IsAbandoned(): boolean {
		return this.ConnectionState === ConnectionState.Abandoned
	}
	/**
	 * @description Returns a boolean indicating whether the connection is disconnected.
	 * @return {boolean}
	 */
	public get IsDisconnected(): boolean {
		return this.ConnectionState === ConnectionState.Disconnected
	}
	/**
	 * @description Retrieves the name of the hero.
	 * @return {string | undefined}
	 */
	public get HeroName(): Nullable<string> {
		return UnitData.GetHeroNameByID(this.SelectedHeroID)
	}
	/**
	 * @description Retrieve the SteamID associated with this player.
	 * @return {bigint | undefined}
	 */
	public get SteamID(): Nullable<bigint> {
		return this.PlayerData?.SteamID
	}
	/**
	 * @description Returns an array of LaneSelection (roles that the player has selected).
	 * @return {Array<LaneSelection>}
	 */
	public get LaneSelections(): LaneSelection[] {
		return this.LaneSelectionFlags.toMask
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
	/**
	 * @description Returns the player data for the current player.
	 * @return {PlayerData | undefined}
	 */
	public get PlayerData(): Nullable<PlayerData> {
		return PlayerResource?.GetPlayerDataByPlayerID(this.PlayerID)
	}
	/**
	 * @description Returns the player's team data.
	 * @return {PlayerTeamData | undefined}
	 */
	public get PlayerTeamData(): Nullable<PlayerTeamData> {
		return PlayerResource?.GetPlayerTeamDataByPlayerID(this.PlayerID)
	}
	/**
	 * @description Returns the team of the player.
	 * @return {Team}
	 */
	public get Team(): Team {
		return this.PlayerData?.Team ?? Team.None
	}
	/**
	 * @description Returns the color of the player.
	 * @return {Color}
	 */
	public get Color(): Color {
		return (
			(this.Team === Team.Dire
				? Color.PlayerColorDire[this.TeamSlot]
				: Color.PlayerColorRadiant[this.TeamSlot]) ?? Color.Red
		)
	}
	/**
	 * @description Get the name of the player.
	 * @return {string | undefined}
	 */
	public get PlayerName(): Nullable<string> {
		return this.PlayerData?.Name
	}
	/**
	 * Returns the TeamSlot of the PlayerTeamData.
	 * @description The TeamSlot value if PlayerTeamData is defined, otherwise -1.
	 * @return {number}
	 */
	public get TeamSlot(): number {
		return this.PlayerTeamData?.TeamSlot ?? -1
	}
	/**
	 * Get the index of the selected hero.
	 * @description The index of the selected hero, or -1 if no hero is selected.
	 * @return {number}
	 */
	public get SelectedHeroIndex(): number {
		return this.PlayerTeamData?.SelectedHeroIndex ?? -1
	}
	/**
	 * Returns the ID of the selected hero.
	 * @description The ID of the selected hero, or -1 if no hero is selected.
	 * @return {number}
	 */
	public get SelectedHeroID(): number {
		return this.PlayerTeamData?.SelectedHeroID ?? -1
	}
	/**
	 * @description Retrieves the DataTeamPlayer for the current player.
	 * @return {DataTeamPlayer | undefined}
	 */
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
	/**
	 * @description Determines whether the specified entity is an enemy.
	 * @param {Entity} ent - The entity to check. Defaults to undefined.
	 * @return {boolean}
	 */
	public IsEnemy(ent?: Entity): boolean {
		const team = ent?.Team ?? GameState.LocalTeam
		return this.Team !== team
	}
	/**
	 * Calculates the 2D distance between this entity and the target entity.
	 * @description The 2D distance between this entity and the target entity. If the hero is not defined, returns Number.MAX_SAFE_INTEGER.
	 * @param {Entity} target - The target entity to calculate the distance to.
	 * @return {number}
	 */
	public Distance2D(target: Entity): number {
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
		this.TeamChanged()

		if (this.DataTeamPlayer === undefined) {
			this.UpdateCounters()
			this.UpdateGoldAfterTime()
			this.UpdateGPMBetweenPlayers()
		}
	}
	/**
	 * @ignore
	 * @internal
	 * @description internal only for wrapper
	 */
	public PlayerDataChanged(hero?: Hero) {
		if (!this.IsValid) {
			return
		}
		if (hero !== undefined) {
			this.Hero = hero?.IsValid ? hero : undefined
		}
		EventsSDK.emit("PlayerCustomDataUpdated", false, this)
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
		this.counters.forEach((counter, name) => {
			if (name !== "GPM") {
				counter.Update(this)
				return
			}
			if (
				GameRules!.GameState ===
				DOTAGameState.DOTA_GAMERULES_STATE_GAME_IN_PROGRESS
			) {
				counter.Update(this)
			}
		})
	}
	/**
	 * @ignore
	 * @internal
	 */
	protected UpdateGoldAfterTime() {
		const deletedGold: [number, number][] = []
		const arrGoldAfater = this.goldAfterTimeAr
		for (let i = 0, end = arrGoldAfater.length; i < end; i++) {
			const arr = arrGoldAfater[i]
			const [time, gold] = arr
			if (GameState.RawGameTime >= time) {
				deletedGold.push(arr)
				this.unreliableGold += gold
			}
		}
		for (let i = 0, end = deletedGold.length; i < end; i++) {
			const arr = deletedGold[i]
			this.goldAfterTimeAr.remove(arr)
		}
	}
	/**
	 * @ignore
	 * @internal
	 */
	protected UpdateGPMBetweenPlayers() {
		const connectionState = this.ConnectionState
		if (connectionState !== ConnectionState.Abandoned) {
			return
		}
		const gpm = this.counters.get("GPM")
		if (gpm === undefined) {
			return
		}
		const players = PlayerCustomData.Array
		for (let index = players.length - 1; index > -1; index--) {
			const player = players[index]
			if (player.PlayerID === this.PlayerID || player.Team !== this.Team) {
				continue
			}
			const gold = gpm.AbandonedGPM / Math.max(players.length, 1)
			player.ReliableGold += gold
		}
	}

	protected TeamChanged() {
		const playerData = PlayerCustomData.get(this.PlayerID)
		if (playerData?.IsValid && playerData.Team !== this.Team) {
			EventsSDK.emit("PlayerCustomDataUpdated", false, playerData)
		}
	}
}

/**
 * ====================================================
 * NOTE: don't import this file into
 * PlayerData.ts
 * PlayerResource.ts
 * DataTeamPlayer.ts
 * PlayerTeamData.ts
 * ====================================================
 * */
