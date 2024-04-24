import { WrapperClass } from "../../Decorators"
import { EventsSDK } from "../../Managers/EventsSDK"
import { Item } from "../Base/Item"
import { Modifier } from "../Base/Modifier"

@WrapperClass("item_tpscroll")
export class item_tpscroll extends Item {
	public MaxChannelTime_ = 0

	public get MaxChannelTime(): number {
		if (this.MaxChannelTime_ === 0) {
			return this.GetBaseChannelTimeForLevel(this.Level)
		}
		return this.MaxChannelTime_
	}
}

function UpdateMaxChannelTime(modifier: Modifier) {
	if (modifier.Name !== "modifier_teleporting") {
		return
	}
	const owner = modifier.Parent,
		tpScroll = modifier.Ability
	if (owner !== undefined && tpScroll instanceof item_tpscroll) {
		tpScroll.MaxChannelTime_ = modifier.Duration
	}
}

EventsSDK.on("ModifierCreated", mod => UpdateMaxChannelTime(mod))
EventsSDK.on("ModifierChanged", mod => UpdateMaxChannelTime(mod))
EventsSDK.on("ModifierRemoved", mod => UpdateMaxChannelTime(mod))
