import { WrapperClass } from "../../../Decorators"
import { Ability } from "../../Base/Ability"

@WrapperClass("dawnbreaker_solar_guardian")
export class dawnbreaker_solar_guardian extends Ability {
	public GetBaseAOERadiusForLevel(level: number): number {
		return this.GetSpecialValue("radius", level)
	}
	public GetMaxDurationForLevel(level: number): number {
		let channelTime = this.GetBaseChannelTimeForLevel(level),
			airTime = this.GetSpecialValue("airtime_duration", level)
		if (this.OwnerHasScepter) {
			airTime = this.GetSpecialValue("airtime_scepter_bonus", level)
			channelTime = this.GetSpecialValue("scepter_channel_time", level)
		}
		return channelTime + airTime
	}
}
