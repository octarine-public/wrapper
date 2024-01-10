import { WrapperClassModifier } from "../../../../Decorators"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_wisp_tether_haste extends Modifier {
	public readonly IsBuff = true

	protected SetMoveSpeedAmplifier(specialName = "movespeed", subtract = false): void {
		super.SetMoveSpeedAmplifier(specialName, subtract)
	}

	// TODO: #MoveSpeed
	// protected SetFixedMoveSpeed(_specialName?: string, _subtract = false): void {
	// 	this.updateFixedSpeed()
	// }

	// private updateFixedSpeed(remove = false): void {
	// 	const owner = this.Parent
	// 	const caster = this.Caster
	// 	if (caster === undefined || owner === undefined) {
	// 		return
	// 	}
	// 	const buff = caster.GetBuffByName("modifier_wisp_tether")
	// 	if (buff === undefined || buff.Parent !== caster) {
	// 		return
	// 	}
	// 	if (remove) {
	// 		this.isEmited = false
	// 		buff.MoveSpeedFixed = 0
	// 		return
	// 	}

	// 	buff.MoveSpeedFixed = owner.Speed
	// 	buff.OnUnitStateChaged()

	// 	if (!this.isEmited) {
	// 		ModifierManager.EmitToPostDataUpdate(this, this.PostDataUpdate)
	// 		this.isEmited = true
	// 	}
	// }
}
