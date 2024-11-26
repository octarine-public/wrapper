import { WrapperClass } from "../../../Decorators"
import { invoker_spell_extends } from "./invoker_spell_extends"

@WrapperClass("invoker_deafening_blast_ad")
export class invoker_deafening_blast_ad extends invoker_spell_extends {
	public GetBaseDamageForLevel(level: number): number {
		return this.GetSpecialValue("damage", level)
	}
}
