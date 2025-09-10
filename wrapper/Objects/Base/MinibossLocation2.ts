import { WrapperClass } from "../../Decorators"
import { ETormentorLocation } from "../../Enums/ETormentorLocation"
import { InfoPlayerStartDota } from "./InfoPlayerStartDota"

@WrapperClass("miniboss_location_2")
export class MinibossLocation2 extends InfoPlayerStartDota {
	public readonly LocationType = ETormentorLocation.TORMENTOR_LOCATION_TOP
}
