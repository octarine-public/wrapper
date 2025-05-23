import { Vector3 } from "../../../Base/Vector3"
import { NetworkedBasicField, WrapperClass } from "../../../Decorators"
import { GameState } from "../../../Utils/GameState"
import { Ability } from "../../Base/Ability"

@WrapperClass("ringmaster_tame_the_beasts")
export class ringmaster_tame_the_beasts extends Ability implements INuke {
	@NetworkedBasicField("m_vStartLocation")
	public readonly StartLocation = new Vector3().Invalidate()

	public get AOERadius(): number {
		return this.calculateByTime(
			super.MinAOERadius,
			super.AOERadius,
			this.ChannelEndTime
		)
	}
	public IsNuke(): this is INuke {
		return true
	}
	public GetMultiplier(level = this.Level): number {
		const minMultiplier = 1
		const maxMultiplier = this.GetSpecialValue("max_multiplier", level)
		return this.calculateByTime(minMultiplier, maxMultiplier, this.ChannelTime)
	}
	public GetBaseAOERadiusForLevel(level: number): number {
		return this.GetSpecialValue("start_width", level)
	}
	public GetBaseMinAOERadiusForLevel(level: number): number {
		return this.GetSpecialValue("end_width", level)
	}
	private calculateByTime(min: number, max: number, time: number): number {
		return this.IsChanneling
			? Math.max(min, min + (max - min) * (time + GameState.TickInterval))
			: min
	}
}
