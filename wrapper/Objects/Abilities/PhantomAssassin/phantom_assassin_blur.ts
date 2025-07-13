import { WrapperClass } from "../../../Decorators"
import { Ability } from "../../Base/Ability"
import { AbilityData } from "../../DataBook/AbilityData"

@WrapperClass("phantom_assassin_blur")
export class phantom_assassin_blur extends Ability {
	constructor(
		public readonly Index: number,
		serial: number,
		name: string
	) {
		super(Index, serial, name)
		AbilityData.ShouldBeDrawable.add(this.Name)
	}
	public get ShouldBeDrawable(): boolean {
		return super.ShouldBeDrawable || this.AbilityData.ShouldBeDrawable
	}
	public GetBaseAOERadiusForLevel(level: number): number {
		return this.GetSpecialValue("radius", level)
	}
	public GetMaxDurationForLevel(level: number): number {
		return this.GetSpecialValue("duration", level)
	}
}
