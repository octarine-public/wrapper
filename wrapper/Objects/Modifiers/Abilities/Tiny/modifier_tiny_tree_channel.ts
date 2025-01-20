import { WrapperClassModifier } from "../../../../Decorators"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_tiny_tree_channel extends Modifier implements IBuff, IChannel {
	public readonly IsHidden = false
	public readonly BuffModifierName = this.Name
	public readonly ChannelModifierName = this.Name

	public IsBuff(): this is IBuff {
		return true
	}
	public IsChannel(): this is IChannel {
		return true
	}
}
