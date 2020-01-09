export default class XAIOSleeper {
	// ms seconds sleeper
	private sleepTime: number = 0
	private sleeping: boolean = false

	public Sleeper(seconds: number) {
		this.Sleep(seconds)
	}

	public Sleep(seconds: number) {
		this.sleepTime = Game.RawGameTime + seconds
		this.sleeping = true
	}

	public get IsSleeping(): boolean {
		if (this.sleeping)
			this.sleeping = (Game.RawGameTime < this.sleepTime)

		return this.sleeping
	}

	public get RemainingSleepTime(): number {
		if (!this.sleeping)
			return 0
		return this.sleepTime - Game.RawGameTime
	}

	public SleepUntil(rawGameTime: number) {
		this.sleepTime = rawGameTime
		this.sleeping = true
	}

	public Reset() {
		this.sleepTime = 0
		this.sleeping = false
	}

	public ExtendSleep(seconds: number) {
		let rawGameTime = Game.RawGameTime
		if (this.sleepTime > rawGameTime) {
			this.sleepTime += seconds
		}
		else {
			this.sleepTime = rawGameTime + seconds
		}
		this.sleeping = true
	}
}