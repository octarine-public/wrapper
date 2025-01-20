import { WrapperClassModifier } from "../../../../Decorators"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_riki_tricks_of_the_trade_phase
	extends Modifier
	implements IChannel
{
	public readonly ChannelModifierName = this.Name
	public get ForceVisible(): boolean {
		return true
	}
	public IsChannel(): this is IChannel {
		return true
	}
}
