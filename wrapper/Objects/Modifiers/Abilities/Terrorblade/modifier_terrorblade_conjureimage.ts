import { WrapperClassModifier } from "../../../../Decorators"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_terrorblade_conjureimage extends Modifier {
	public UnitPropertyChanged(changed?: boolean): boolean {
		const owner = this.Parent
		if (owner !== undefined) {
			owner.IsReflection_ = true
		}
		return super.UnitPropertyChanged(changed)
	}
}
