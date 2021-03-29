// https://github.com/EnsageSharp/Ensage.SDK/blob/master/Helpers/Map.cs
import Vector3 from "../Base/Vector3"
import { Team } from "../Enums/Team"
import { WorldPolygon } from "../Geometry/WorldPolygon"
import Creep from "../Objects/Base/Creep"
import { Utf8ArrayToStr } from "../Utils/ArrayBufferUtils"
import readFile from "../Utils/readFile"
import { MapArea } from "./MapArea"

export class DotaMap {
	private static Load(name: string): Vector3[] {
		const file = readFile(`Map/${name}.json`)
		if (file === undefined)
			return []

		const ar: [number, number, number][] = JSON.parse(Utf8ArrayToStr(file))
		return ar.map(([x, y, z]) => new Vector3(x, y, z))
	}
	private static LoadPoly(name: string): WorldPolygon {
		return new WorldPolygon(...DotaMap.Load(name))
	}
	public readonly Top = DotaMap.LoadPoly("Top")
	public readonly Middle = DotaMap.LoadPoly("Middle")
	public readonly Bottom = DotaMap.LoadPoly("Bottom")
	public readonly DireBase = DotaMap.LoadPoly("DireBase")
	public readonly RadiantBase = DotaMap.LoadPoly("RadiantBase")
	public readonly RiverTop = DotaMap.LoadPoly("RiverTop")
	public readonly RiverMiddle = DotaMap.LoadPoly("RiverMiddle")
	public readonly RiverBottom = DotaMap.LoadPoly("RiverBottom")
	public readonly Roshan = DotaMap.LoadPoly("Roshan")
	public readonly DireBottomJungle = DotaMap.LoadPoly("DireBottomJungle")
	public readonly DireTopJungle = DotaMap.LoadPoly("DireTopJungle")
	public readonly RadiantBottomJungle = DotaMap.LoadPoly("RadiantBottomJungle")
	public readonly RadiantTopJungle = DotaMap.LoadPoly("RadiantTopJungle")

	public readonly RadiantTopRoute = DotaMap.Load("RadiantTopRoute")
	public readonly RadiantMiddleRoute = DotaMap.Load("RadiantMiddleRoute")
	public readonly RadiantBottomRoute = DotaMap.Load("RadiantBottomRoute")
	public readonly DireTopRoute = DotaMap.Load("DireTopRoute")
	public readonly DireMiddleRoute = DotaMap.Load("DireMiddleRoute")
	public readonly DireBottomRoute = DotaMap.Load("DireBottomRoute")

	public GetLane(pos: Vector3): MapArea {
		if (this.Top.IsInside(pos))
			return MapArea.Top
		if (this.Middle.IsInside(pos))
			return MapArea.Middle
		if (this.Bottom.IsInside(pos))
			return MapArea.Bottom
		if (this.RadiantBase.IsInside(pos))
			return MapArea.RadiantBase
		if (this.DireBase.IsInside(pos))
			return MapArea.DireBase
		if (this.Roshan.IsInside(pos))
			return MapArea.RoshanPit
		if (this.RiverTop.IsInside(pos))
			return MapArea.RiverTop
		if (this.RiverMiddle.IsInside(pos))
			return MapArea.RiverMiddle
		if (this.RiverBottom.IsInside(pos))
			return MapArea.RiverBottom
		if (this.DireBottomJungle.IsInside(pos))
			return MapArea.DireBottomJungle
		if (this.DireTopJungle.IsInside(pos))
			return MapArea.DireTopJungle
		if (this.RadiantBottomJungle.IsInside(pos))
			return MapArea.RadiantBottomJungle
		if (this.RadiantTopJungle.IsInside(pos))
			return MapArea.RadiantTopJungle
		return MapArea.Unknown
	}
	public GetCreepRoute(unit: Creep, lane: MapArea): Vector3[] {
		switch (unit.Team) {
			case Team.Dire:
				switch (lane) {
					case MapArea.Top:
						return this.DireTopRoute
					case MapArea.Middle:
						return this.DireMiddleRoute
					case MapArea.Bottom:
						return this.DireBottomRoute

					default: return []
				}
			case Team.Radiant:
				switch (lane) {
					case MapArea.Top:
						return this.RadiantTopRoute
					case MapArea.Middle:
						return this.RadiantMiddleRoute
					case MapArea.Bottom:
						return this.RadiantBottomRoute

					default: return []
				}
			default: return []
		}
	}
}
