import Color from "../../Base/Color"
import { WrapperClass } from "../../Decorators"
import { RenderMode_t } from "../../Enums/RenderMode_t"
import { MapArea } from "../../Helpers/MapArea"
import CreepPathCorner from "./CreepPathCorner"
import Entity from "./Entity"

@WrapperClass("LaneCreepSpawner")
export default class LaneCreepSpawner extends Entity {
	public Target: Nullable<CreepPathCorner>
	public Lane = MapArea.Middle

	public get IsAlive() {
		return true
	}
	public set CustomGlowColor(_: Nullable<Color>) {
		// N/A for non-networked entities
	}
	public set CustomDrawColor(_: Nullable<[Color, RenderMode_t]>) {
		// N/A for non-networked entities
	}
}
