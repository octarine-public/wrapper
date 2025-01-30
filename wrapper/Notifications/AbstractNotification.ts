import { Rectangle } from "../Base/Rectangle"
import { Vector3 } from "../Base/Vector3"
import { ImagePath, WrapperPath } from "../Data/PathData"
import { BackgroundCover } from "../Enums/BackgroundCover"
import { SoundSDK } from "../Native/SoundSDK"
import { Entity } from "../Objects/Base/Entity"

export abstract class Notification {
	public readonly UniqueKey: any
	public Cover = BackgroundCover.Octarine

	private TimeToShow = 4 * 1000 // 4 seconds by default

	private IsPlaying = false
	public StopDisplayTime = 0
	public StartDisplayTime = 0
	private sourceEntity: Nullable<Entity>
	private position = new Vector3().Invalidate()
	private playSoundName: Nullable<string> = undefined

	constructor(options?: {
		timeToShow?: number
		playSoundName?: string
		uniqueKey?: any
		position?: Vector3
		sourceEntity?: Entity
	}) {
		this.UniqueKey = options?.uniqueKey
		this.playSoundName = options?.playSoundName
		this.TimeToShow = options?.timeToShow ?? this.TimeToShow
		this.position = options?.position ?? this.position
		this.sourceEntity = options?.sourceEntity
	}

	public get IsExpired() {
		return hrtime() > this.StopDisplayTime
	}

	public get BackgroundCover() {
		switch (this.Cover) {
			case BackgroundCover.Dota2:
				return ImagePath + "/hud/reborn/item_purchase_bg_psd.vtex_c"
			default:
				return WrapperPath + "/scripts_files/menu/background_inactive.svg"
		}
	}

	/**
	 * @returns number min 0, max 255
	 * @example Color.White.SetA(this.Opacity)
	 */
	protected get Opacity() {
		let timeSince = 1000
		const currentTime = hrtime()
		if (this.StartDisplayTime + 500 > currentTime) {
			timeSince = currentTime - this.StartDisplayTime
		} else if (currentTime + 500 > this.StopDisplayTime) {
			timeSince = this.StopDisplayTime - currentTime
		}
		return Math.min((Math.max(timeSince, 0) / 1000) * 2, 1) * 255
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
		if (this.StartDisplayTime === 0) {
			this.StartDisplayTime = hrtime()
		}
		if (this.TimeToShow) {
			this.StopDisplayTime = this.StartDisplayTime + this.TimeToShow
		}
	}

	public PlaySound() {
		if (this.playSoundName === undefined || this.IsPlaying) {
			return
		}
		SoundSDK.EmitStartSoundEvent(this.playSoundName, this.position, this.sourceEntity)
		this.IsPlaying = true
	}
}
