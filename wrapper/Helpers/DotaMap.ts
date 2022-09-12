import Vector2 from "../Base/Vector2"
import Vector3 from "../Base/Vector3"
import { MapArea } from "../Enums/MapArea"
import { MaterialFlags } from "../Enums/MaterialFlags"
import { Team } from "../Enums/Team"
import { GetPositionHeight } from "../Native/WASM"
import { Buildings } from "../Objects/Base/Building"
import CreepPathCorner, { CreepPathCorners } from "../Objects/Base/CreepPathCorner"
import { Fountains } from "../Objects/Base/Fountain"
import { orderBy, orderByFirst } from "../Utils/ArrayExtensions"

export default new (class DotaMap {
	public IsRiver(pos: Vector3 | Vector2): boolean {
		const main_height = GetPositionHeight(pos)
		return GetPositionHeight(pos, MaterialFlags.None) > main_height
	}
	public GetPathCornerNearestTeam(corner: CreepPathCorner): Team {
		return orderByFirst(Buildings, building => corner.Distance2D(building))?.Team ?? Team.None
	}
	public GetMapArea(pos: Vector3 | Vector2, ignore_bases = false): [MapArea, Team] {
		if (!ignore_bases)
			for (const fountain of Fountains)
				if (fountain.Distance2D(pos) < 4500)
					return [MapArea.Base, fountain.Team]
		// TODO: MapArea.RoshanPit
		const nearest_corners = orderBy(
			CreepPathCorners.filter(corner => corner.Spawner !== undefined),
			corner => corner.Distance2D(pos),
		)
		if (nearest_corners.length === 0)
			return [MapArea.Unknown, Team.None]
		const nearest_corner = nearest_corners[0]
		if (this.IsRiver(pos))
			switch (nearest_corner.Spawner!.Lane) {
				case MapArea.Top:
					return [MapArea.RiverTop, Team.Neutral]
				case MapArea.Middle:
					return [MapArea.RiverMiddle, Team.Neutral]
				case MapArea.Bottom:
					return [MapArea.RiverBottom, Team.Neutral]
			}
		if (nearest_corner.Distance2D(pos) < 1550)
			return [nearest_corner.Spawner!.Lane, this.GetPathCornerNearestTeam(nearest_corner)]
		const corner1 = nearest_corner,
			corner2 = nearest_corners.find(corner => corner.Spawner?.Lane !== corner1.Spawner?.Lane)
		if (corner2 === undefined)
			return [MapArea.Unknown, Team.None]
		const lane1 = corner1.Spawner!.Lane,
			lane2 = corner2.Spawner!.Lane,
			team = this.GetPathCornerNearestTeam(corner1)
		if (
			(lane1 === MapArea.Top && lane2 === MapArea.Middle)
			|| (lane2 === MapArea.Top && lane1 === MapArea.Middle)
		)
			return [MapArea.TopJungle, team]
		if (
			(lane1 === MapArea.Bottom && lane2 === MapArea.Middle)
			|| (lane2 === MapArea.Bottom && lane1 === MapArea.Middle)
		)
			return [MapArea.BottomJungle, team]
		if (lane1 === MapArea.Top || lane2 === MapArea.Top)
			return [MapArea.TopJungle, team]
		if (lane1 === MapArea.Bottom || lane2 === MapArea.Bottom)
			return [MapArea.BottomJungle, team]
		return [MapArea.Unknown, Team.None]
	}
	public GetCreepCurrentTarget(position: Vector3 | Vector2, team: Team, lane = MapArea.Unknown): Nullable<CreepPathCorner> {
		const nearest_corner = orderByFirst(
			CreepPathCorners.filter(corner => (
				corner.Team === team
				&& (lane === MapArea.Unknown || corner.Spawner?.Lane === lane)
			)),
			corner => corner.Distance2D(position),
		)
		if (
			nearest_corner === undefined
			|| nearest_corner.Referencing.size === 0
		)
			return nearest_corner?.Target
		if (nearest_corner.Target === undefined)
			return nearest_corner
		const next_corner = nearest_corner.Target,
			next_delta = Math.abs((
				nearest_corner.Distance2D(position)
				+ next_corner.Distance2D(position)
			) - nearest_corner.Distance2D(next_corner))
		for (const prev_corner of nearest_corner.Referencing) {
			if (Math.abs((
				nearest_corner.Distance2D(position)
				+ prev_corner.Distance2D(position)
			) - nearest_corner.Distance2D(prev_corner)) < next_delta)
				return nearest_corner
		}
		return next_corner
	}
})()
