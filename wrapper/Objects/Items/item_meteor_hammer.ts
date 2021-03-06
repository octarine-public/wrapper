import { WrapperClass } from "../../Decorators"
import Item from "../Base/Item"

@WrapperClass("item_meteor_hammer")
export default class item_meteor_hammer extends Item {
	public get ActivationDelay() {
		return this.GetSpecialValue("land_time")
	}
	public GetAOERadiusForLevel(level: number): number {
		return this.GetSpecialValue("impact_radius", level)
	}
}
