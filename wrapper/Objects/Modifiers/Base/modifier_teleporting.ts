import { WrapperClassModifier } from "../../../Decorators"
import { Modifier } from "../../Base/Modifier"

@WrapperClassModifier()
export class modifier_teleporting extends Modifier implements IChannel {
	public readonly IsHidden = false
	public readonly ChannelModifierName = this.Name

	public get ForceVisible(): boolean {
		return true
	}
	public IsChannel(): this is IChannel {
		return true
	}
}
