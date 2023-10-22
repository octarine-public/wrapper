import { DataTeamPlayer } from "../../Base/DataTeamPlayer"
import { DOTAGameMode } from "../../Enums/DOTAGameMode"
import { DOTAGameState } from "../../Enums/DOTAGameState"
import { Team } from "../../Enums/Team"
import { GameSleeper } from "../../Helpers/Sleeper"
import { EntityManager } from "../../Managers/EntityManager"
import { arrayRemove } from "../../Utils/ArrayExtensions"
import { GameState } from "../../Utils/GameState"
import { GameRules } from "../Base/Entity"
import { Hero } from "../Base/Hero"
import { TeamData } from "../Base/TeamData"
import { item_philosophers_stone } from "../Items/item_philosophers_stone"

/** @ignore */
class GPMCounter {
	private counter = 1
	private lastUpdate: Nullable<number>

	public Update(data: HeroTeamData, isPassive: boolean, gpm?: number) {
		const gameTime = GameRules?.GameTime ?? 0

		gpm ??= this.getGPMAtTime(gameTime / 60)

		if (isPassive && this.lastUpdate === undefined) {
			this.counter += (gpm * gameTime) / 60
			this.lastUpdate = gameTime
		}

		if (this.lastUpdate !== undefined) {
			this.counter += (gpm * (gameTime - this.lastUpdate)) / 60
		}

		this.lastUpdate = gameTime
		const rem = this.counter % 1
		data.ReliableGold += this.counter - rem
		this.counter = rem
	}

	// see https://dota2.fandom.com/wiki/Gold#Periodic_Gold
	private getGPMAtTime(time: number): number {
		switch (true) {
			case time >= 12 && time < 15:
				return 94.6
			case time >= 15 && time < 17:
				return 95.7
			case time >= 17 && time < 30:
				return 96.6
			case time >= 30 && time < 45:
				return 99.8
			default:
				return 90
		}
	}
}

export class HeroTeamData {
	protected Player: Nullable<DataTeamPlayer>
	protected TeamData: Nullable<TeamData>

	private readonly counter = new GPMCounter()
	private readonly sleeper = new GameSleeper()
	private readonly goldAfterTimeAr: [number, number][] = []

	private denyCount = 0
	private lastHitCount = 0
	private readonly maxBuyBackCooldown = 480 // seconds

	private reliableGold = 0
	private unreliableGold = 700 /** base start gold */
	private philosopherStoneCounter: Nullable<GPMCounter>

	/** @ignore */
	constructor(public readonly Owner: Hero) {
		this.ReCalculateUnreliableGold()
	}

	public get EventsData() {
		return this.Owner.PlayerTeamData?.PlayerEventsData ?? []
	}

	/**
	 * @description Returns the number of available salutes (tips player) for the hero.
	 * @returns {number}
	 */
	public get AvailableSalutes(): number {
		return this.EventsData.find(data => data.EventID === 19)?.AvailableSalutes ?? 0
	}
	/**
	 * @description Returns the buyback cost based on the net worth of the player.
	 * @returns {number}
	 */
	public get BuyBackCost(): number {
		return 200 + this.NetWorth / 13
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
	protected get InProgress() {
		return (
			(GameRules?.GameState ?? DOTAGameState.DOTA_GAMERULES_STATE_INIT) ===
			DOTAGameState.DOTA_GAMERULES_STATE_GAME_IN_PROGRESS
		)
	}
	/** @ignore */
	protected get IsEnemy() {
		return this.Owner.IsEnemy() && GameState.LocalTeam !== Team.Observer
	}
	/** @ignore */
	public SetBuyBack() {
		this.sleeper.Sleep(this.maxBuyBackCooldown * 1000, this.Owner.PlayerID)
		this.SubtractGold(this.BuyBackCost)
	}
	/*** @ignore */
	public AddGoldAfterTime(count: number, sec: number) {
		this.goldAfterTimeAr.push([GameState.RawGameTime + sec, count])
	}
	/** @ignore */
	public SubtractGold(amount: number) {
		if (this.Player === undefined || !this.IsEnemy) {
			return
		}
		const unreliableCost = Math.min(this.unreliableGold, amount)
		this.unreliableGold -= unreliableCost
		this.reliableGold -= amount - unreliableCost
	}
	/** @ignore */
	public UpdateTick() {
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
			arrayRemove(this.goldAfterTimeAr, ar)
		}
	}
	/** @ignore */
	protected UpdateGoldPerMinute() {
		if (GameRules === undefined || !this.InProgress) {
			return
		}
		if (GameRules.GameMode !== DOTAGameMode.DOTA_GAMEMODE_EVENT) {
			this.counter.Update(this, true)
		}
	}
	/** @ignore */
	protected UpdatePhilosophersStone() {
		if (GameRules === undefined) {
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
		counter.Update(this, false, itemStone.GetSpecialValue("bonus_gpm"))
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
