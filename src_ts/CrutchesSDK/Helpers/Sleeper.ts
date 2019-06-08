// This is temporary solution of updateManager.
import { Game } from "../Managers/EntityManager";


class SleeperBase {
	protected SleepDB = new Map<string, number>();
	
	protected setTime(id: string, time: number): number {
		this.SleepDB.set(id, time)
		return time;
	}
	protected updateTime(id: string, timeNow: number, timeExtend: number): boolean {
		let value = this.SleepDB.get(id);
		
		if (value === undefined || value <= timeExtend)
			return false;
		
		this.setTime(id, timeNow += timeExtend);
		return true
	}
}

/**
 * Sleeper by Date.now()
 */
export class Sleeper extends SleeperBase {
	
	Sleep(ms: number, id: string, extend: boolean = false): number {
		if (typeof ms !== "number")
			return this.setTime(id, Date.now());

		if (extend && this.updateTime(id, Date.now(), ms))
			return;

		return this.setTime(id, Date.now() + ms);
	}
	Sleeping(id: string): boolean {
		let sleepID = this.SleepDB.get(id);
		return sleepID !== undefined && Date.now() < sleepID;
	}
	
	FullReset(): Sleeper {
		this.SleepDB.clear();
		return this;
	}
}

/**
 * Sleeper by Game.RawGameTime
 */
export class GameSleeper extends SleeperBase {

	Sleep(ms: number, id: string, extend: boolean = false): number {
		if (typeof ms !== "number")
			return this.setTime(id, Date.now());

		if (extend && this.updateTime(id, Game.RawGameTime, ms))
			return;

		return this.setTime(id, Game.RawGameTime + ms);
	}
	Sleeping(id: string): boolean {
		let sleepID = this.SleepDB.get(id);
		return sleepID !== undefined && Date.now() < sleepID;
	}

	FullReset(): GameSleeper {
		this.SleepDB.clear();
		return this;
	}
}