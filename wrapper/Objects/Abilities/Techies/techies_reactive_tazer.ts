import { WrapperClass } from "../../../Decorators"
import { Ability } from "../../Base/Ability"

@WrapperClass("CDOTA_Ability_Techies_ReactiveTazer")
export class techies_reactive_tazer extends Ability {
	public GetBaseDamageForLevel(level: number): number {
		return this.GetSpecialValue("shard_damage", level)
	}
}
