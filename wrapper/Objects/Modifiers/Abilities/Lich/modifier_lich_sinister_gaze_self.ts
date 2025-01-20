import { WrapperClassModifier } from "../../../../Decorators"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_lich_sinister_gaze_self extends Modifier implements IChannel {
	public readonly ChannelModifierName = this.Name
	public get ForceVisible(): boolean {
		return true
	}
	public IsChannel(): this is IChannel {
		return true
	}
}
