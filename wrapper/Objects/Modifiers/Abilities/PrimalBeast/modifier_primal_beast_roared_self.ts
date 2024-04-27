import { WrapperClassModifier } from "../../../../Decorators"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_primal_beast_roared_self extends Modifier {
	public Update(): void {
		super.Update()
		this.UpdateBonusArmor()
	}

	protected UpdateBonusArmor(): void {
		const owner = this.Parent
		if (owner !== undefined) {
			// update because it add after this buff by stacks
			owner.GetBuffByName("modifier_primal_beast_uproar")?.OnUnitStateChaged()
		}
	}
}
