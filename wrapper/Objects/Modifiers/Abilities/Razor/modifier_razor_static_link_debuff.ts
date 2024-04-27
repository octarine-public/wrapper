import { WrapperClassModifier } from "../../../../Decorators"
import { GameState } from "../../../../Utils/GameState"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_razor_static_link_debuff extends Modifier {
	private creationTime = 0

	public Update(): void {
		super.Update()

		if (this.creationTime === 0) {
			this.creationTime = this.kv.CreationTime ?? 0
		}
	}

	protected SetBonusArmor(specialName = "drain_armor", _subtract = true): void {
		const value = this.GetSpecialValue(specialName)
		this.BonusArmor = -(value * Math.max(this.GetElapsedTime(), 0))
	}

	protected GetElapsedTime(): number {
		return Math.max(GameState.RawGameTime - this.creationTime, 0)
	}
}
