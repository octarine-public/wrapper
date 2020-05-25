import Ability from "../../Base/Ability"
import { WrapperClass } from "../../../Decorators"

@WrapperClass("kunkka_torrent_storm")
export default class kunkka_torrent_storm extends Ability {
	public get Duration(): number {
		return this.GetSpecialValue("torrent_duration")
	}

	public get AOERadius(): number {
		return this.GetSpecialValue("torrent_max_distance")
	}
}
