import { WrapperClass } from "../../Decorators"
import { ERoshanLocation } from "../../Enums/ERoshanLocation"
import { InfoPlayerStartDota } from "./InfoPlayerStartDota"

@WrapperClass("roshan_location_2")
export class RoshanLocation2 extends InfoPlayerStartDota {
	public readonly LocationType = ERoshanLocation.TOP
}
