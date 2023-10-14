import { Rectangle } from "../Base/Rectangle"
import { Vector3 } from "../Base/Vector3"
import { BackgroundCover } from "../Enums/BackgroundCover"
import { SoundSDK } from "../Native/SoundSDK"
import { Entity } from "../Objects/Base/Entity"

export abstract class Notification {
	public readonly UniqueKey: any
	public Cover = BackgroundCover.Octarine

	private TimeToShow = 4 * 1000 // 4 seconds by default

	private IsPlaying = false
	private stopDisplayTime = 0
	private startDisplayTime = 0
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
		return hrtime() > this.stopDisplayTime
	}

	public get BackgroundCover() {
		switch (this.Cover) {
			case BackgroundCover.Dota2:
				return "panorama/images/hud/reborn/item_purchase_bg_psd.vtex_c"
			default:
				return "github.com/octarine-public/wrapper/scripts_files/menu/header.svg"
		}
	}

	/**
	 * @returns number min 0, max 255
	 * @example Color.White.SetA(this.Opacity)
	 */
	protected get Opacity() {
		let timeSince = 1000
		const currentTime = hrtime()
		if (this.startDisplayTime + 500 > currentTime) {
			timeSince = currentTime - this.startDisplayTime
		} else if (currentTime + 500 > this.stopDisplayTime) {
			timeSince = this.stopDisplayTime - currentTime
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
		this.startDisplayTime = hrtime()
		this.stopDisplayTime = this.startDisplayTime + this.TimeToShow
	}

	public PlaySound() {
		if (this.playSoundName === undefined || this.IsPlaying) {
			return
		}
		SoundSDK.EmitStartSoundEvent(this.playSoundName, this.position, this.sourceEntity)
		this.IsPlaying = true
	}
}
