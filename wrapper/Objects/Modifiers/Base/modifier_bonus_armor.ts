import { WrapperClassModifier } from "../../../Decorators"
import { Modifier } from "../../Base/Modifier"

@WrapperClassModifier()
export class modifier_bonus_armor extends Modifier {
	// don't have special ability ...
	protected SetBonusArmor(_specialName?: string, _subtract = false): void {
		// don't have special data ...
		// added armor bonus by statues in map dota
		this.BonusArmor = 2
	}
}
