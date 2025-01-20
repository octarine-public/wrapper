import { WrapperClassModifier } from "../../../../Decorators"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_keeper_of_the_light_illuminate
	extends Modifier
	implements IBuff, IChannel
{
	public readonly BuffModifierName = this.Name
	public readonly ChannelModifierName = this.Name

	public IsBuff(): this is IBuff {
		return true
	}
	public IsChannel(): this is IChannel {
		return true
	}
}
