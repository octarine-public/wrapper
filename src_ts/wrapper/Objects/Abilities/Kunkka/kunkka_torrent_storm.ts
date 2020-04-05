import Ability from "../../Base/Ability"

export default class kunkka_torrent_storm extends Ability {
	public get Duration(): number {
		return this.GetSpecialValue("torrent_duration")
	}

	public get AOERadius(): number {
		return this.GetSpecialValue("torrent_max_distance")
	}
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("kunkka_torrent_storm", kunkka_torrent_storm)
