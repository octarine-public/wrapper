import { DataTeamPlayer } from "../../Base/DataTeamPlayer"
import { DOTAGameMode } from "../../Enums/DOTAGameMode"
import { Team } from "../../Enums/Team"
import { GameSleeper } from "../../Helpers/Sleeper"
import { EntityManager } from "../../Managers/EntityManager"
import { EventsSDK } from "../../Managers/EventsSDK"
import * as ArrayExtensions from "../../Utils/ArrayExtensions"
import { GameState } from "../../Utils/GameState"
import { Entity, GameRules } from "../Base/Entity"
import { Hero } from "../Base/Hero"
import { TeamData } from "../Base/TeamData"
import { item_philosophers_stone } from "../Items/item_philosophers_stone"

/** @ignore */
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

	private readonly counter = new GPMCounter()
	private readonly sleeper = new GameSleeper()
	private readonly goldAfterTimeAr: [number, number][] = []

	private gpm = 90
	private denyCount = 0
	private lastHitCount = 0

	private reliableGold = 0
	private unreliableGold = 600 /** base start gold */
	private philosopherStoneCounter: Nullable<GPMCounter>

	/** @ignore */
	constructor(private readonly Owner: Hero) {
		this.ReCalculateUnreliableGold()
	}

	/**
	 * @description Returns the number of available salutes (tips player) for the hero.
	 * @returns {number}
	 */
	public get AvailableSalutes(): number {
		return (
			this.Owner.PlayerTeamData?.PlayerEventsData.find(data => data.EventID === 19)
				?.AvailableSalutes ?? 0
		)
	}
	/**
	 * @description Returns the buyback cost based on the net worth of the player.
	 * @returns {number}
	 */
	public get BuyBackCost(): number {
		return Math.floor(200 + this.NetWorth / 13)
	}
	/**
	 * @description Returns the deny count of the hero.
	 * @returns {number}
	 */
	public get DenyCount(): number {
		return this.Player === undefined || this.IsEnemy
			? this.denyCount
			: this.Player.DenyCount
	}
	/** @ignore */
	public set DenyCount(value) {
		if (this.IsEnemy) {
			this.denyCount = value
		}
	}
	/**
	 * @description Returns the last hit count of the hero.
	 * @returns {number}
	 */
	public get LastHitCount(): number {
		return this.Player === undefined || this.IsEnemy
			? this.lastHitCount
			: this.Player.LastHitCount
	}
	/** @ignore */
	public set LastHitCount(value) {
		if (this.IsEnemy) {
			this.lastHitCount = value
		}
	}
	/**
	 * @description Returns the net worth of the hero.
	 * @returns {number}
	 */
	public get NetWorth(): number {
		return this.Player === undefined || this.IsEnemy
			? this.reliableGold + this.unreliableGold
			: this.Player.NetWorth
	}
	/**
	 * @description Returns the reliable gold amount for the hero.
	 * @returns {number}
	 */
	public get ReliableGold(): number {
		return this.Player === undefined || this.IsEnemy
			? this.reliableGold
			: this.Player.ReliableGold
	}
	/** @ignore */
	public set ReliableGold(value) {
		if (this.IsEnemy) {
			this.reliableGold = value
		}
	}
	/**
	 * @description Returns the unreliable gold amount for the hero.
	 * @returns {number}
	 */
	public get UnreliableGold(): number {
		return this.Player === undefined || this.IsEnemy
			? this.unreliableGold
			: this.Player.UnreliableGold
	}
	/** @ignore */
	public set UnreliableGold(value) {
		if (this.IsEnemy) {
			this.unreliableGold = value
		}
	}
	/**
	 * @description Returns the time of the last salute sent by the hero's PlayerTeamData.
	 * @returns {number}
	 */
	public get TimeOfLastSaluteSent(): number {
		return this.Owner.PlayerTeamData?.TimeOfLastSaluteSent ?? 0
	}
	/**
	 * @description Determines if the hero has enough gold to perform a buyback.
	 * @returns {boolean}
	 */
	public get HasGoldForBuyBack(): boolean {
		return this.ReliableGold + this.UnreliableGold >= this.BuyBackCost
	}
	/** @ignore */
	protected get IsEnemy() {
		return this.Owner.IsEnemy() && GameState.LocalTeam !== Team.Observer
	}
	/** @ignore */
	public SetBuyBack(ms: number) {
		this.sleeper.Sleep(ms, this.Owner.PlayerID)
		this.SubtractGold(this.BuyBackCost)
	}
	/*** @ignore */
	public AddGoldAfterTime(sec: number, count: number) {
		this.goldAfterTimeAr.push([GameState.RawGameTime + sec, count])
	}
	/** @ignore */
	public PostDataUpdate() {
		if (this.IsEnemy) {
			this.UpdateGoldPerMinute()
			this.UpdateGoldAfterTime()
			this.UpdatePhilosophersStone()
		}
		if (this.TeamData === undefined && !this.IsEnemy) {
			this.TeamData = EntityManager.GetEntitiesByClass(TeamData).find(
				x => x.Team === this.Owner.Team
			)
		}
		if (this.TeamData !== undefined && this.Player === undefined && !this.IsEnemy) {
			this.Player = this.TeamData.DataTeam[this.Owner.TeamSlot]
		}
	}
	/** @ignore */
	protected SubtractGold(amount: number) {
		if (this.Player === undefined || !this.IsEnemy) {
			return
		}
		const unreliableCost = Math.min(this.unreliableGold, amount)
		this.unreliableGold -= unreliableCost
		this.reliableGold -= amount - unreliableCost
	}
	/** @ignore */
	protected UpdateGoldAfterTime() {
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
	/** @ignore */
	protected UpdateGoldPerMinute() {
		if (GameRules === undefined || GameRules.IsPaused) {
			return
		}
		if (GameRules.GameMode !== DOTAGameMode.DOTA_GAMEMODE_EVENT) {
			this.counter.Update(this, this.gpm, true)
		}
	}
	/** @ignore */
	protected UpdatePhilosophersStone() {
		if (GameRules === undefined || GameRules.IsPaused) {
			return
		}
		if (GameRules.GameMode === DOTAGameMode.DOTA_GAMEMODE_EVENT) {
			return
		}
		const itemStone = this.Owner.GetAbilityByClass(item_philosophers_stone)
		if (itemStone === undefined || !itemStone.IsUsable) {
			this.philosopherStoneCounter = undefined
			return
		}
		let counter = this.philosopherStoneCounter
		if (counter === undefined) {
			counter = new GPMCounter()
			this.philosopherStoneCounter = counter
		}
		counter.Update(this, itemStone.GetSpecialValue("bonus_gpm"), false)
	}
	/** @ignore */
	protected ReCalculateUnreliableGold() {
		if (GameRules === undefined || !this.Owner.IsEnemy()) {
			return
		}

		// TODO: rework
		if (this.unreliableGold > 600 && GameRules.GameTime < 200) {
			return
		}

		for (const item of this.Owner.TotalItems) {
			if (item === undefined) {
				continue
			}
			if (item.Cost > 0) {
				this.unreliableGold += item.Cost
			}
		}
	}
}

/** @ignore */
const heroes: Hero[] = []

/** @ignore */
function PostDataUpdate() {
	for (const hero of heroes) {
		hero.HeroTeamData?.PostDataUpdate()
	}
}
/** @ignore */
function EntityCreated(ent: Entity) {
	// TODO add check ent.IsClone
	if (ent instanceof Hero && !ent.IsIllusion) {
		ent.HeroTeamData = new HeroTeamData(ent)
		heroes.push(ent)
	}
}
/** @ignore */
function EntityDestroyed(ent: Entity) {
	if (ent instanceof Hero) {
		ArrayExtensions.arrayRemove(heroes, ent)
	}
}

EventsSDK.on("PostDataUpdate", PostDataUpdate, Number.MIN_SAFE_INTEGER)

EventsSDK.on("EntityCreated", EntityCreated, Number.MIN_SAFE_INTEGER)

EventsSDK.on("EntityDestroyed", EntityDestroyed)
