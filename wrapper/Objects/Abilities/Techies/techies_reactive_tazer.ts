import { WrapperClass } from "../../../Decorators"
import { Ability } from "../../Base/Ability"

@WrapperClass("techies_reactive_tazer")
export class techies_reactive_tazer extends Ability {
	public GetBaseDamageForLevel(level: number): number {
		return this.GetSpecialValue("shard_damage", level)
	}
}
