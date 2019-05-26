// This is temporary solution of updateManager.
import { Game } from "../Managers/EntityManager";

/**
 * Sleeper by Date.now()
 */
export class Sleeper {
	
	private SleepDB: { string?: number } = {}
	
	Sleep(ms: number, id: string, extend: boolean = false): number {
		if (typeof ms !== "number")
			return this.SleepDB[id] = Date.now();

		if (extend && this.SleepDB[id] !== undefined && this.SleepDB[id] > Date.now())
			return this.SleepDB[id] += ms;

		return this.SleepDB[id] = Date.now() + ms;
	}
	Sleeping(id: string): boolean {
		let sleepID = this.SleepDB[id];
		return sleepID !== undefined && Date.now() < sleepID;
	}
	
	FullReset(): Sleeper {
		this.SleepDB = {};
		return this;
	}
}

/**
 * Sleeper by Game.RawGameTime
 */
export class GameSleeper {

	private SleepDB: { string?: number } = {}
	
	Sleep(sec: number, id: string, extend: boolean = false): number {
		if (typeof sec !== "number")
			return this.SleepDB[id] = Game.RawGameTime;

		if (extend && this.SleepDB[id] !== undefined && this.SleepDB[id] > Game.RawGameTime)
			return this.SleepDB[id] += sec / 1000;

		return this.SleepDB[id] = Game.RawGameTime + sec / 1000;
	}
	Sleeping(id: string): boolean {
		let sleepID = this.SleepDB[id];
		return sleepID !== undefined && Game.RawGameTime < sleepID;
	}

	FullReset(): GameSleeper {
		this.SleepDB = {};
		return this;
	}
}