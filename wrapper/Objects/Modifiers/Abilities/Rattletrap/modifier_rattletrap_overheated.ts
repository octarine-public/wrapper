import { WrapperClassModifier } from "../../../../Decorators"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_rattletrap_overheated extends Modifier {
	protected SetBonusAttackSpeed(_specialName?: string, subtract = false): void {
		const value = -100 // no special value data
		this.BonusAttackSpeed = subtract ? value * -1 : value
	}

	protected SetMoveSpeedAmplifier(_specialName: string, subtract: boolean): void {
		const value = -100 // no special value data
		this.BonusMoveSpeedAmplifier = (subtract ? value * -1 : value) / 100
	}
}
