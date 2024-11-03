import { WrapperClassModifier } from "../../../../Decorators"
import { modifier_shredder_chakram_debuff } from "./modifier_shredder_chakram_debuff"

@WrapperClassModifier()
export class modifier_shredder_chakram_debuff_2 extends modifier_shredder_chakram_debuff {
	// see: modifier_shredder_chakram_debuff
	protected UpdateSpecialValues(): void {
		this.cachedSlow = this.GetSpecialValue("slow", "shredder_chakram_2")
	}
}
