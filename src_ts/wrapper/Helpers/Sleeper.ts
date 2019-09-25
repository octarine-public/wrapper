// This is temporary solution of updateManager.
import { Game } from "../Managers/EntityManager"

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
 * Sleeper by Date.now()
 */
export class Sleeper extends SleeperBase {
	Sleep(ms: number, key: any, extend: boolean = false): number {
		if (typeof ms !== "number")
			return this.setTime(key, Date.now())

		if (extend && this.updateTime(key, Date.now(), ms))
			return

		return this.setTime(key, Date.now() + ms)
	}
	Sleeping(key: any): boolean {
		let sleepID = this.SleepDB.get(key)
		return sleepID !== undefined && Date.now() < sleepID
	}

	FullReset(): Sleeper {
		this.SleepDB.clear()
		return this
	}
}

/**
 * Sleeper by Game.RawGameTime
 */
export class GameSleeper extends SleeperBase {
	Sleep(ms: number, key: any, extend: boolean = false): number {
		if (typeof ms !== "number")
			return this.setTime(key, Game.RawGameTime)

		if (extend && this.updateTime(key, Game.RawGameTime, ms / 1000))
			return

		return this.setTime(key, Game.RawGameTime + ms / 1000)
	}
	Sleeping(key: any): boolean {
		let sleepID = this.SleepDB.get(key)
		return sleepID !== undefined && Game.RawGameTime < sleepID
	}

	FullReset(): GameSleeper {
		this.SleepDB.clear()
		return this
	}
}
