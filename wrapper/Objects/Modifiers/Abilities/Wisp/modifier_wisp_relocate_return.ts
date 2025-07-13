import { WrapperClassModifier } from "../../../../Decorators"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_wisp_relocate_return extends Modifier implements IBuff {
	public readonly IsHidden = false
	public readonly BuffModifierName = this.Name

	public get ForceVisible(): boolean {
		return true
	}
	public Update(force?: boolean): void {
		super.Update(force)
		this.InternalDuration = this.Ability?.MaxDuration ?? 0
	}
	public IsBuff(): this is IBuff {
		return true
	}
}
