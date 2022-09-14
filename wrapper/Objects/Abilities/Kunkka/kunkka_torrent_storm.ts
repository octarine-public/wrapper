import { WrapperClass } from "../../../Decorators"
import { Ability } from "../../Base/Ability"

@WrapperClass("kunkka_torrent_storm")
export class kunkka_torrent_storm extends Ability {
	public get Duration(): number {
		return this.GetSpecialValue("torrent_duration")
	}
	public GetAOERadiusForLevel(level: number): number {
		return this.GetSpecialValue("torrent_max_distance", level)
	}
}
