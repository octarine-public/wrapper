import { WrapperClassModifier } from "../../../../Decorators"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_skeleton_king_bone_guard extends Modifier implements IBuff {
	public readonly IsHidden = false
	public readonly BuffModifierName = this.Name
	public IsBuff(): this is IBuff {
		return this.StackCount !== 0
	}
}
