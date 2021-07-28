import Rectangle from "../Base/Rectangle"
import SoundSDK from "../Native/SoundSDK"

export default abstract class Notification {
	public readonly UniqueKey: any

	private TimeToShow = 4 * 1000 // 4 seconds by default

	private IsPlaying = false
	private stopDisplayTime = 0
	private startDisplayTime = 0
	private playSound: Nullable<string> = undefined
	private playVolume = 0

	constructor(options?: {
		timeToShow?: number
		playSound?: string
		playVolume?: number
		uniqueKey?: any,
	}) {
		this.UniqueKey = options?.uniqueKey
		this.playSound = options?.playSound
		this.playVolume = options?.playVolume ?? 0
		this.TimeToShow = options?.timeToShow ?? this.TimeToShow
	}

	public get IsExpired() {
		return hrtime() > this.stopDisplayTime
	}

	/**
	 * @returns number min 0, max 255
	 * @example Color.White.SetA(this.Opacity)
	 */
	protected get Opacity() {
		let time_since = 1000
		const current_time = hrtime()
		if (this.startDisplayTime + 500 > current_time)
			time_since = current_time - this.startDisplayTime
		else if (current_time + 500 > this.stopDisplayTime)
			time_since = this.stopDisplayTime - current_time
		return Math.min(Math.max(time_since, 0) / 1000 * 2, 1) * 255
	}

	/**
	 * @description permission to click on the notification message, return true if the notification can be clicked else false
	 */
	public abstract OnClick(): boolean

	public abstract Draw(position: Rectangle): void

	/**
	 * don't use method. Please, use global method Notificator.Push(new yourClassName())
	 */
	public PushTime() {
		this.startDisplayTime = hrtime()
		this.stopDisplayTime = this.startDisplayTime + this.TimeToShow
	}

	public PlaySound() {
		if (this.playSound === undefined || this.IsPlaying)
			return
		SoundSDK.PlaySound(this.playSound, this.playVolume)
		this.IsPlaying = true
	}
}
