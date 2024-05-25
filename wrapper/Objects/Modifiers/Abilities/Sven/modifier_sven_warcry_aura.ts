import { WrapperClassModifier } from "../../../../Decorators"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_sven_warcry_aura extends Modifier {
	protected SetBonusArmor(
		specialName = this.Caster === this.Parent ? "shard_passive_armor" : undefined,
		subtract = false
	): void {
		super.SetBonusArmor(specialName, subtract)
	}
}
