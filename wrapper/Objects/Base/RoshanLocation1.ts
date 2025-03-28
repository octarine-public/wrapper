import { WrapperClass } from "../../Decorators"
import { ERoshanLocation } from "../../Enums/ERoshanLocation"
import { InfoPlayerStartDota } from "./InfoPlayerStartDota"

@WrapperClass("roshan_location_1")
export class RoshanLocation1 extends InfoPlayerStartDota {
	public readonly LocationType = ERoshanLocation.BOT
}
