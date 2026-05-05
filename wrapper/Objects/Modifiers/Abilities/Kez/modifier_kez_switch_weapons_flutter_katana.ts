import { WrapperClassModifier } from "../../../../Decorators"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_kez_switch_weapons_flutter_katana
	extends Modifier
	implements IBuff
{
	public readonly IsHidden: boolean = false
	public readonly BuffModifierName: string = this.Name

	public IsBuff(): this is IBuff {
		return true
	}
}
