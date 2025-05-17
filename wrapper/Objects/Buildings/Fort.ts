import { Vector2 } from "../../Base/Vector2"
import { WrapperClass } from "../../Decorators"
import { ScaleHeight } from "../../GUI/Helpers"
import { Building } from "../Base/Building"

@WrapperClass("CDOTA_BaseNPC_Fort")
export class Fort extends Building {
	public get RingRadius(): number {
		return 300
	}
	public get HealthBarSize(): Vector2 {
		return new Vector2(ScaleHeight(435), ScaleHeight(9))
	}
	public get HealthBarPositionCorrection() {
		return new Vector2(this.HealthBarSize.x / 2, ScaleHeight(62))
	}
}
