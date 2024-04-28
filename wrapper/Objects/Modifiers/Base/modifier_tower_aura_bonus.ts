import { WrapperClassModifier } from "../../../Decorators"
import { Modifier } from "../../Base/Modifier"

@WrapperClassModifier()
export class modifier_tower_aura_bonus extends Modifier {
	protected SetBonusArmor(_specialName?: string, _subtract = false): void {
		this.BonusArmor = this.NetworkArmor
	}
}
