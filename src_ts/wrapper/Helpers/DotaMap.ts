// https://github.com/EnsageSharp/Ensage.SDK/blob/master/Helpers/Map.cs
import Vector3 from "../Base/Vector3"
import { WorldPolygon } from "../Geometry/WorldPolygon"
import { Utf8ArrayToStr, readFile } from "../Utils/Utils"
import Creep from "../Objects/Base/Creep"
import Unit from "../Objects/Base/Unit"
import { MapArea } from "./MapArea"
import { Team } from "../Enums/Team"

export class DotaMap {
	private static Load(name: string): Vector3[] {
		const file = readFile(`Map/${name}.json`)
		if (file === undefined)
			return []

		let ar: [number, number, number][] = JSON.parse(Utf8ArrayToStr(new Uint8Array(file)))
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
	public readonly River = DotaMap.LoadPoly("River")
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
	constructor(public unit: Unit) { }

	public get GetLane(): MapArea {
		let pos = this.unit.Position
		if (this.Top.IsInside(pos))
			return MapArea.Top
		if (this.Middle.IsInside(pos))
			return MapArea.Middle
		if (this.Bottom.IsInside(pos))
			return MapArea.Bottom
		if (this.River.IsInside(pos))
			return MapArea.River
		if (this.RadiantBase.IsInside(pos))
			return MapArea.RadiantBase
		if (this.DireBase.IsInside(pos))
			return MapArea.DireBase
		if (this.Roshan.IsInside(pos))
			return MapArea.RoshanPit
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
	public GetCreepRoute(unit: Creep, lane: MapArea = this.GetLane): Vector3[] {
		switch (unit.Team) {
			case Team.Dire:
				switch (lane) {
					case MapArea.Top:
						return this.DireTopRoute
					case MapArea.Middle:
						return this.DireMiddleRoute
					case MapArea.Bottom:
						return this.DireBottomRoute
				}
				break
			case Team.Radiant:
				switch (lane) {
					case MapArea.Top:
						return this.RadiantTopRoute
					case MapArea.Middle:
						return this.RadiantMiddleRoute
					case MapArea.Bottom:
						return this.RadiantBottomRoute
				}
				break
		}
		return []
	}
}
