import { WrapperClass } from "../../Decorators"
import { Building } from "../Base/Building"

@WrapperClass("CDOTA_BaseNPC_Fort")
export class Fort extends Building {
	public get RingRadius(): number {
		return 300
	}
}
