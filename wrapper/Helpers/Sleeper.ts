import GameState from "../Utils/GameState"

/**
 * Sleeper by hrtime()
 */
export class Sleeper {
	protected SleepDB = new Map<any, number>()

	protected get TickCount(): number {
		return hrtime()
	}
	public Sleep(ms: number, key: any): number {
		if (typeof ms !== "number")
			ms = 0
		return this.setTime(key, this.TickCount + ms)
	}
	public RemainingSleepTime(key: any): number {
		const endTime = this.SleepDB.get(key)
		if (endTime === undefined)
			return 0
		const ticks = this.TickCount
		if (endTime < ticks) {
			this.SleepDB.delete(key)
			return 0
		}
		return endTime - ticks
	}
	public StartTime(key: any): number {
		const endTime = this.SleepDB.get(key)
		if (endTime === undefined)
			return 0
		return endTime
	}
	public Sleeping(key: any): boolean {
		return this.RemainingSleepTime(key) > 0
	}
	public FullReset(): this {
		this.SleepDB.clear()
		return this
	}
	public ResetKey(key: any): void {
		this.SleepDB.delete(key)
	}

	protected setTime(key: any, time: number): number {
		this.SleepDB.set(key, time)
		return time
	}
}

/**
 * Sleeper by Game.RawGameTime
 */
export class GameSleeper extends Sleeper {
	protected get TickCount(): number {
		return GameState.RawGameTime * 1000
	}
}

export class TickSleeper {
	public lastSleepTickCount = 0

	public get Sleeping(): boolean {
		return this.TickCount < this.lastSleepTickCount
	}
	public get RemainingSleepTime(): number {
		return Math.max(this.lastSleepTickCount - this.TickCount, 0)
	}
	private get TickCount(): number {
		return GameState.RawGameTime * 1000
	}
	public Sleep(duration: number): void {
		this.lastSleepTickCount = this.TickCount + duration
	}
	public ResetTimer(): void {
		this.lastSleepTickCount = 0
	}
}
