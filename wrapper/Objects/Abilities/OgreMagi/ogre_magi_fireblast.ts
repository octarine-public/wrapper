import { WrapperClass } from "../../../Decorators"
import { Ability } from "../../Base/Ability"

@WrapperClass("ogre_magi_fireblast")
export class ogre_magi_fireblast extends Ability implements INuke {
	public IsNuke(): this is INuke {
		return true
	}
	public GetBaseDamageForLevel(level: number): number {
		return this.GetSpecialValue("fireblast_damage", level)
	}
	public GetBaseCastPointForLevel(level: number): number {
		return (
			super.GetBaseCastPointForLevel(level) *
			(1 - this.GetSpecialValue("bonus_cast_speed", level) / 100)
		)
	}
}
