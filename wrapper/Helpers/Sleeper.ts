import { GameRules } from "../Objects/Base/Entity"
import GameState from "../Utils/GameState"

class SleeperBase {
	protected SleepDB = new Map<any, number>()

	protected setTime(key: any, time: number): number {
		this.SleepDB.set(key, time)
		return time
	}
	protected updateTime(key: any, timeNow: number, timeExtend: number): boolean {
		let value = this.SleepDB.get(key)

		if (value === undefined || value <= timeExtend)
			return false

		this.setTime(key, timeNow += timeExtend)
		return true
	}
}

/**
 * Sleeper by hrtime()
 */
export class Sleeper extends SleeperBase {
	public Sleep(ms: number, key: any, extend: boolean = false): number {
		if (extend && this.updateTime(key, hrtime(), ms))
			return ms

		return this.setTime(key, hrtime() + ms)
	}
	public Sleeping(key: any): boolean {
		let sleepID = this.SleepDB.get(key)
		return sleepID !== undefined && hrtime() < sleepID
	}

	public FullReset(): Sleeper {
		this.SleepDB.clear()
		return this
	}
}

/**
 * Sleeper by Game.RawGameTime
 */
export class GameSleeper extends SleeperBase {
	public Sleep(ms: number, key: any, extend: boolean = false): number {
		if (typeof ms !== "number")
			return this.setTime(key, GameState.RawGameTime)

		let time = GameState.RawGameTime
		if (extend && this.updateTime(key, time, ms / 1000))
			return ms

		return this.setTime(key, time + ms / 1000)
	}
	public Sleeping(key: any): boolean {
		let sleepID = this.SleepDB.get(key)
		return sleepID !== undefined && GameState.RawGameTime < sleepID
	}

	public FullReset(): GameSleeper {
		this.SleepDB.clear()
		return this
	}
}

export class TickSleeper {
	public lastSleepTickCount = 0

	public get Sleeping(): boolean {
		return this.TickCount < this.lastSleepTickCount
	}
	private get TickCount(): number {
		if (!GameRules?.IsInGame)
			return 0
		return GameRules!.RawGameTime * 1000
	}
	public Sleep(duration: number): void {
		this.lastSleepTickCount = this.TickCount + duration
	}
	public ResetTimer() {
		this.lastSleepTickCount = 0
	}
}
