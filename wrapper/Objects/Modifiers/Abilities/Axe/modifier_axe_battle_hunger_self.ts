import { WrapperClassModifier } from "../../../../Decorators"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_axe_battle_hunger_self extends Modifier {
	public OnScepterChanged(): void {
		this.SetBonusArmor()
	}

	protected SetBonusArmor(
		specialName = "scepter_armor_change",
		_subtract = false
	): void {
		const numberOfEnemies = this.StackCount / 2
		const stackCount = Math.max(numberOfEnemies, 0)
		this.BonusArmor = this.GetSpecialValue(specialName) * stackCount
	}
}
