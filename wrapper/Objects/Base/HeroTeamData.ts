import { DataTeamPlayer } from "../../Base/DataTeamPlayer"
import { DOTAGameMode } from "../../Enums/DOTAGameMode"
import { Team } from "../../Enums/Team"
import { GameSleeper } from "../../Helpers/Sleeper"
import { EntityManager } from "../../Managers/EntityManager"
import { EventsSDK } from "../../Managers/EventsSDK"
import * as ArrayExtensions from "../../Utils/ArrayExtensions"
import { GameState } from "../../Utils/GameState"
import { Entity, GameRules } from "./Entity"
import { Hero } from "./Hero"
import { TeamData } from "./TeamData"

/**
 * @ignore
 * @internal
 */
class GPMCounter {
	private counter = 0
	private lastUpdate: Nullable<number>

	public Update(data: HeroTeamData, gpm: number, isPassive: boolean) {
		if (isPassive && this.lastUpdate === undefined) {
			this.counter += (gpm * (GameRules?.GameTime ?? 0)) / 60
			this.lastUpdate = GameState.RawGameTime
		}

		if (this.lastUpdate !== undefined) {
			this.counter += (gpm * (GameState.RawGameTime - this.lastUpdate)) / 60
		}

		this.lastUpdate = GameState.RawGameTime
		const rem = this.counter % 1
		data.ReliableGold += this.counter - rem
		this.counter = rem
	}
}

export class HeroTeamData {
	protected Player: Nullable<DataTeamPlayer>
	protected TeamData: Nullable<TeamData>

	private gpm = 90
	private denyCount = 0
	private lastHitCount = 0

	private reliableGold = 0
	private unreliableGold = 690

	private readonly counter = new GPMCounter()
	private readonly sleeper = new GameSleeper()
	private readonly goldAfterTimeAr: [number, number][] = []

	// private philosopherStoneCounter: Nullable<GPMCounter>

	/**
	 * @ignore
	 * @internal
	 */
	constructor(private readonly hero: Hero) {
		this.ReCalculateUnreliableGold()
	}

	/**
	 * Returns the number of available salutes (tips player) for the hero.
	 *
	 * @return {number} The number of available salutes (tips player).
	 */
	public get AvailableSalutes(): number {
		return (
			this.hero.PlayerTeamData?.PlayerEventsData.find(data => data.EventID === 19)
				?.AvailableSalutes ?? 0
		)
	}
	/**
	 * Returns the buyback cost based on the net worth of the player.
	 *
	 * @return {number} The buyback cost.
	 */
	public get BuyBackCost(): number {
		return Math.floor(200 + this.NetWorth / 13)
	}
	/**
	 * Returns the deny count of the hero.
	 *
	 * @return {number} The deny count of the hero.
	 */
	public get DenyCount(): number {
		return this.Player === undefined || this.IsEnemy
			? this.denyCount
			: this.Player.DenyCount
	}
	/**
	 * @ignore
	 * @internal
	 */
	public set DenyCount(value) {
		if (this.IsEnemy) {
			this.denyCount = value
		}
	}
	/**
	 * Returns the last hit count of the hero.
	 *
	 * @return {number} The last hit count of the hero.
	 */
	public get LastHitCount(): number {
		return this.Player === undefined || this.IsEnemy
			? this.lastHitCount
			: this.Player.LastHitCount
	}
	/**
	 * @ignore
	 * @internal
	 */
	public set LastHitCount(value) {
		if (this.IsEnemy) {
			this.lastHitCount = value
		}
	}
	/**
	 * Returns the net worth of the hero.
	 *
	 * @return {number} The net worth of the hero.
	 */
	public get NetWorth(): number {
		return this.Player === undefined || this.IsEnemy
			? this.reliableGold + this.unreliableGold
			: this.Player.NetWorth
	}
	/**
	 * Returns the reliable gold amount for the hero.
	 *
	 * @return {number} The reliable gold amount for the hero.
	 */
	public get ReliableGold(): number {
		return this.Player === undefined || this.IsEnemy
			? this.reliableGold
			: this.Player.ReliableGold
	}
	/**
	 * @ignore
	 * @internal
	 */
	public set ReliableGold(value) {
		if (this.IsEnemy) {
			this.reliableGold = value
		}
	}
	/**
	 * Returns the unreliable gold amount for the hero.
	 *
	 * @return {number} The unreliable gold amount for the hero.
	 */
	public get UnreliableGold(): number {
		return this.Player === undefined || this.IsEnemy
			? this.unreliableGold
			: this.Player.UnreliableGold
	}
	/**
	 * @ignore
	 * @internal
	 */
	public set UnreliableGold(value) {
		if (this.IsEnemy) {
			this.unreliableGold = value
		}
	}
	/**
	 * Returns the time of the last salute sent by the hero's PlayerTeamData.
	 *
	 * @return {number} The time of the last salute sent, or 0 if no salute has been sent.
	 */
	public get TimeOfLastSaluteSent(): number {
		return this.hero.PlayerTeamData?.TimeOfLastSaluteSent ?? 0
	}
	/**
	 * Determines if the hero has enough gold to perform a buyback.
	 *
	 * @return {boolean} Returns true if the hero has enough gold to perform a buyback, false otherwise.
	 */
	public get HasGoldForBuyBack(): boolean {
		return this.ReliableGold + this.UnreliableGold >= this.BuyBackCost
	}

	protected get IsEnemy() {
		return this.hero.IsEnemy() && GameState.LocalTeam !== Team.Observer
	}
	/**
	 * @ignore
	 * @internal
	 */
	public SetBuyBack(ms: number) {
		this.sleeper.Sleep(ms, this.hero.PlayerID)
		this.SubtractGold(this.BuyBackCost)
	}
	/**
	 * @ignore
	 * @internal
	 */
	public AddGoldAfterTime(sec: number, count: number) {
		this.goldAfterTimeAr.push([GameState.RawGameTime + sec, count])
	}
	/**
	 * @ignore
	 * @internal
	 */
	public PostDataUpdate() {
		if (this.TeamData === undefined && !this.IsEnemy) {
			this.TeamData = EntityManager.GetEntitiesByClass(TeamData).find(
				x => x.Team === this.hero.Team
			)
		}

		if (this.TeamData !== undefined && this.Player === undefined && !this.IsEnemy) {
			this.Player = this.TeamData.DataTeam[this.hero.TeamSlot]
		}
	}
	/**
	 * @ignore
	 * @internal
	 */
	protected SubtractGold(amount: number) {
		if (this.Player === undefined || !this.IsEnemy) {
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
	protected UpdateGoldByTime() {
		const deletedGold: [number, number][] = []
		for (const ar of this.goldAfterTimeAr) {
			const [time, gold] = ar
			if (GameState.RawGameTime >= time) {
				deletedGold.push(ar)
				this.UnreliableGold += gold
			}
		}
		for (const ar of deletedGold) {
			ArrayExtensions.arrayRemove(this.goldAfterTimeAr, ar)
		}
	}
	/**
	 * @ignore
	 * @internal
	 */
	protected ReCalculateUnreliableGold() {
		if (GameRules === undefined || !this.hero.IsEnemy()) {
			return
		}

		if (this.unreliableGold > 690 && GameRules.GameTime < 200) {
			return
		}

		for (const item of this.hero.TotalItems) {
			if (item === undefined) {
				continue
			}
			if (item.Cost > 0) {
				this.unreliableGold += item.Cost
			}
		}
	}
	/**
	 * @ignore
	 * @internal
	 */
	protected GoldPerMinute() {
		if (GameRules === undefined || GameRules.IsPaused) {
			return
		}
		if (GameRules.GameMode !== DOTAGameMode.DOTA_GAMEMODE_EVENT) {
			this.counter.Update(this, this.gpm, true)
		}
	}

	// TODO
	// protected PhilosophersStone() {
	// 	if (this.IsEvent || GameRules?.IsPaused) {
	// 		return
	// 	}

	// 	const Item = this.hero.GetAbilityByClass(item_philosophers_stone)
	// 	if (Item === undefined || !Item.IsUsable) {
	// 		this.philosopherStoneCounter = undefined
	// 		return
	// 	}

	// 	let counter = this.philosopherStoneCounter
	// 	if (counter === undefined) {
	// 		counter = new GPMCounter()
	// 		this.philosopherStoneCounter = counter
	// 	}

	// 	counter.Update(this, Item.GetSpecialValue("bonus_gpm"), false)
	// }
}

/**
 * @ignore
 * @internal
 */
const heroes: Hero[] = []

/**
 * @ignore
 * @internal
 */
function PostDataUpdate() {
	for (const hero of heroes) {
		hero.HeroTeamData?.PostDataUpdate()
	}
}
/**
 * @ignore
 * @internal
 */
function EntityCreated(ent: Entity) {
	// TODO add check ent.IsClone
	if (ent instanceof Hero && !ent.IsIllusion) {
		ent.HeroTeamData = new HeroTeamData(ent)
		heroes.push(ent)
	}
}
/**
 * @ignore
 * @internal
 */
function EntityDestroyed(ent: Entity) {
	if (ent instanceof Hero) {
		ArrayExtensions.arrayRemove(heroes, ent)
	}
}

EventsSDK.on("PostDataUpdate", PostDataUpdate, Number.MIN_SAFE_INTEGER)

EventsSDK.on("EntityCreated", EntityCreated, Number.MIN_SAFE_INTEGER)

EventsSDK.on("EntityDestroyed", EntityDestroyed)
