import { Vector2 } from "../Base/Vector2"
import { Vector3 } from "../Base/Vector3"
import { MapArea } from "../Enums/MapArea"
import { Team } from "../Enums/Team"
import { Buildings } from "../Objects/Base/Building"
import {
	CreepPathCorner,
	CreepPathCorners
} from "../Objects/Base/CreepPathCorner"
import { Fountains } from "../Objects/Base/Fountain"
import { orderBy, orderByFirst } from "../Utils/ArrayExtensions"

export function IsRiver(pos: Vector3 | Vector2): boolean {
	return WorldUtils.IsPointUnderWater(pos.x, pos.y)
}
export function GetPathCornerNearestTeam(corner: CreepPathCorner): Team {
	return (
		orderByFirst(Buildings, building => corner.Distance2D(building))?.Team ??
		Team.None
	)
}
export function GetMapArea(
	pos: Vector3 | Vector2,
	ignoreBases = false
): [MapArea, Team] {
	if (!ignoreBases)
		for (const fountain of Fountains)
			if (fountain.Distance2D(pos) < 4500) return [MapArea.Base, fountain.Team]
	// TODO: MapArea.RoshanPit
	const nearestCorners = orderBy(
		CreepPathCorners.filter(corner => corner.Spawner !== undefined),
		corner => corner.Distance2D(pos)
	)
	if (nearestCorners.length === 0) return [MapArea.Unknown, Team.None]
	const nearestCorner = nearestCorners[0]
	if (IsRiver(pos))
		switch (nearestCorner.Spawner!.Lane) {
			case MapArea.Top:
				return [MapArea.RiverTop, Team.Neutral]
			case MapArea.Middle:
				return [MapArea.RiverMiddle, Team.Neutral]
			case MapArea.Bottom:
				return [MapArea.RiverBottom, Team.Neutral]
		}
	if (nearestCorner.Distance2D(pos) < 1550)
		return [
			nearestCorner.Spawner!.Lane,
			GetPathCornerNearestTeam(nearestCorner)
		]
	const corner1 = nearestCorner,
		corner2 = nearestCorners.find(
			corner => corner.Spawner?.Lane !== corner1.Spawner?.Lane
		)
	if (corner2 === undefined) return [MapArea.Unknown, Team.None]
	const lane1 = corner1.Spawner!.Lane,
		lane2 = corner2.Spawner!.Lane,
		team = GetPathCornerNearestTeam(corner1)
	if (
		(lane1 === MapArea.Top && lane2 === MapArea.Middle) ||
		(lane2 === MapArea.Top && lane1 === MapArea.Middle)
	)
		return [MapArea.TopJungle, team]
	if (
		(lane1 === MapArea.Bottom && lane2 === MapArea.Middle) ||
		(lane2 === MapArea.Bottom && lane1 === MapArea.Middle)
	)
		return [MapArea.BottomJungle, team]
	if (lane1 === MapArea.Top || lane2 === MapArea.Top)
		return [MapArea.TopJungle, team]
	if (lane1 === MapArea.Bottom || lane2 === MapArea.Bottom)
		return [MapArea.BottomJungle, team]
	return [MapArea.Unknown, Team.None]
}
export function GetCreepCurrentTarget(
	position: Vector3 | Vector2,
	team: Team,
	lane = MapArea.Unknown
): Nullable<CreepPathCorner> {
	const nearestCorner = orderByFirst(
		CreepPathCorners.filter(
			corner =>
				corner.Team === team &&
				(lane === MapArea.Unknown || corner.Spawner?.Lane === lane)
		),
		corner => corner.Distance2D(position)
	)
	if (nearestCorner === undefined || nearestCorner.Referencing.size === 0)
		return nearestCorner?.Target
	if (nearestCorner.Target === undefined) return nearestCorner
	const nextCorner = nearestCorner.Target,
		nextDelta = Math.abs(
			nearestCorner.Distance2D(position) +
				nextCorner.Distance2D(position) -
				nearestCorner.Distance2D(nextCorner)
		)
	for (const prevCorner of nearestCorner.Referencing) {
		if (
			Math.abs(
				nearestCorner.Distance2D(position) +
					prevCorner.Distance2D(position) -
					nearestCorner.Distance2D(prevCorner)
			) < nextDelta
		)
			return nearestCorner
	}
	return nextCorner
}
