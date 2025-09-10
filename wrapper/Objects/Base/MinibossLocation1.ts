import { WrapperClass } from "../../Decorators"
import { ETormentorLocation } from "../../Enums/ETormentorLocation"
import { InfoPlayerStartDota } from "./InfoPlayerStartDota"

@WrapperClass("miniboss_location_1")
export class MinibossLocation1 extends InfoPlayerStartDota {
	public readonly LocationType = ETormentorLocation.TORMENTOR_LOCATION_BOT
}
