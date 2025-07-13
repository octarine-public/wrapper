import { WrapperClass } from "../../../Decorators"
import { Ability } from "../../Base/Ability"
import { AbilityData } from "../../DataBook/AbilityData"

@WrapperClass("monkey_king_mischief")
export class monkey_king_mischief extends Ability {
	constructor(
		public readonly Index: number,
		serial: number,
		name: string
	) {
		super(Index, serial, name)
		AbilityData.ShouldBeDrawable.add(name)
	}
	public get ShouldBeDrawable(): boolean {
		return super.ShouldBeDrawable || this.AbilityData.ShouldBeDrawable
	}
}
