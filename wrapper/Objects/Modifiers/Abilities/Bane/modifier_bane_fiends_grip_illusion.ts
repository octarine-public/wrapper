import { WrapperClassModifier } from "../../../../Decorators"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_bane_fiends_grip_illusion extends Modifier {
	public UnitPropertyChanged(changed?: boolean): boolean {
		const owner = this.Parent
		if (owner !== undefined) {
			owner.IsReflection_ = true
		}
		return super.UnitPropertyChanged(changed)
	}
}
