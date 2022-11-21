import { Color } from "../../Base/Color"
import { WrapperClass } from "../../Decorators"
import { MapArea } from "../../Enums/MapArea"
import { RenderMode } from "../../Enums/RenderMode"
import { CreepPathCorner } from "./CreepPathCorner"
import { Entity } from "./Entity"

@WrapperClass("LaneCreepSpawner")
export class LaneCreepSpawner extends Entity {
	public Target: Nullable<CreepPathCorner>
	public Lane = MapArea.Middle

	public get IsAlive() {
		return true
	}
	public set CustomGlowColor(_: Nullable<Color>) {
		// N/A for non-networked entities
	}
	public set CustomDrawColor(_: Nullable<[Color, RenderMode]>) {
		// N/A for non-networked entities
	}
}
