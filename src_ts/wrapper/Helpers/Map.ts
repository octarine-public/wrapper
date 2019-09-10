import { WorldPolygon } from "../Geometry/WorldPolygon"
import { MapArea } from "../Helpers/MapArea"
import { Team } from "../Objects/Base/Team"
import Unit from "../Objects/Base/Unit";
import Vector3 from "../Base/Vector3";
import Creep from "../Objects/Base/Creep";

export class Map {

	private RadiantTopRoute: Array<Vector3> = []
	private RadiantMiddleRoute: Array<Vector3> = []
	private RadiantBottomRoute: Array<Vector3> = []
	private DireTopRoute: Array<Vector3> = []
	private DireMiddleRoute: Array<Vector3> = []
	private DireBottomRoute: Array<Vector3> = []

	public Map() {
		try
		{
			// this.Top = this.Load("Top");
			// this.Middle = this.Load("Middle");
			// this.Bottom = this.Load("Bottom");
			// this.DireBase = this.Load("DireBase");
			// this.RadiantBase = this.Load("RadiantBase");
			// this.River = this.Load("River");
			// this.Roshan = this.Load("Roshan");
			// this.DireBottomJungle = this.Load("DireBottomJungle");
			// this.DireTopJungle = this.Load("DireTopJungle");
			// this.RadiantBottomJungle = this.Load("RadiantBottomJungle");
			// this.RadiantTopJungle = this.Load("RadiantTopJungle");
			// this.RadiantTopRoute = this.LoadRoute("RadiantTopRoute");
			// this.RadiantMiddleRoute = this.LoadRoute("RadiantMiddleRoute");
			// this.RadiantBottomRoute = this.LoadRoute("RadiantBottomRoute");
			// this.DireTopRoute = this.LoadRoute("DireTopRoute");
			// this.DireMiddleRoute = this.LoadRoute("DireMiddleRoute");
			// this.DireBottomRoute = this.LoadRoute("DireBottomRoute");
		}
		catch (error)
		{
			console.log(error)
		}
	 }

	public Bottom: WorldPolygon
	public DireBase: WorldPolygon
	public DireBottomJungle: WorldPolygon
	public DireTopJungle: WorldPolygon
	public Middle: WorldPolygon
	public RadiantBase: WorldPolygon
	public RadiantBottomJungle: WorldPolygon
	public RadiantTopJungle: WorldPolygon
	public River: WorldPolygon
	public Roshan: WorldPolygon
	public Top: WorldPolygon
	
	// public GetLane(unit: Unit): MapArea {
	// 	let pos = unit.NetworkPosition;
	// 	if (this.Top.IsInside(pos)) {
	// 		return MapArea.Top;
	// 	}
	// 	if (this.Middle.IsInside(pos)) {
	// 		return MapArea.Middle;
	// 	}
	// 	if (this.Bottom.IsInside(pos)) {
	// 		return MapArea.Bottom;
	// 	}
	// 	if (this.River.IsInside(pos)) {
	// 		return MapArea.River;
	// 	}
	// 	if (this.RadiantBase.IsInside(pos)) {
	// 		return MapArea.RadiantBase;
	// 	}
	// 	if (this.DireBase.IsInside(pos)) {
	// 		return MapArea.DireBase;
	// 	}
	// 	if (this.Roshan.IsInside(pos)) {
	// 		return MapArea.RoshanPit;
	// 	}
	// 	if (this.DireBottomJungle.IsInside(pos)) {
	// 		return MapArea.DireBottomJungle;
	// 	}
	// 	if (this.DireTopJungle.IsInside(pos)) {
	// 		return MapArea.DireTopJungle;
	// 	}
	// 	if (this.RadiantBottomJungle.IsInside(pos)) {
	// 		return MapArea.RadiantBottomJungle;
	// 	}
	// 	if (this.RadiantTopJungle.IsInside(pos)) {
	// 		return MapArea.RadiantTopJungle;
	// 	}
	// 	return MapArea.Unknown;
	// }
	public GetCreepRoute(unit: Creep, lane: MapArea = MapArea.Unknown): Array<Vector3> {
		let team = unit.Team;
		if (team !== Team.Dire && team !== Team.Radiant) {
			return [];
		}
		if (lane === MapArea.Unknown) {
			//lane = this.GetLane(unit);
		}
		if (lane == MapArea.Top) {
			if (team !== Team.Dire) {
				return this.RadiantTopRoute;
			}
			return this.DireTopRoute;
		}
		else if (lane === MapArea.Middle) {
			if (team !== Team.Dire) {
				return this.RadiantMiddleRoute;
			}
			return this.DireMiddleRoute;
		}
		else {
			if (lane !== MapArea.Bottom) {
				return []
			}
			if (team !== Team.Dire) {
				return this.RadiantBottomRoute;
			}
			return this.DireBottomRoute;
		}
	}
}