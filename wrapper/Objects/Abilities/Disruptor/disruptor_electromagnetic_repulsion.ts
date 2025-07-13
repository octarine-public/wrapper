import { WrapperClass } from "../../../Decorators"
import { Ability } from "../../Base/Ability"
import { AbilityData } from "../../DataBook/AbilityData"

@WrapperClass("disruptor_electromagnetic_repulsion")
export class disruptor_electromagnetic_repulsion extends Ability {
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
}
