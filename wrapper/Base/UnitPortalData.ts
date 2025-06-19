import { EntityManager } from "../Managers/EntityManager"
import { EventsSDK } from "../Managers/EventsSDK"
import { Unit } from "../Objects/Base/Unit"
import { GameState } from "../Utils/GameState"
import { PortalPoint } from "./PortalPoint"
import { Vector3 } from "./Vector3"

export class UnitPortalData {
	public IsValid = true
	public readonly EndPosition = new Vector3().Invalidate()

	private targetIndex: number = -1
	constructor(private readonly index: number) {}

	public get Caster() {
		return EntityManager.EntityByIndex<Unit>(this.index)
	}
	public get Target() {
		return EntityManager.EntityByIndex<Unit>(this.targetIndex)
	}
	public UpdateData(entIndex: Nullable<number>, endPosition: Vector3) {
		this.targetIndex = entIndex ?? -1
		this.EndPosition.CopyFrom(endPosition)
	}
	public UpdateDuration(pointsData: PortalPoint[]) {
		const point = this.findPoint(pointsData)
		if (point === undefined) {
			return
		}

		++point.Count

		if (point.Count === 2) {
			point.MaxDuration += 2
		}
		if (point.Count > 2) {
			point.MaxDuration += 0.5
		}
		if (this.Caster !== undefined) {
			const filter = pointsData.filter(x => this.isValidPoint(x))
			this.Caster.TPLastMaxDuration = Math.max(...filter.map(x => x.MaxDuration))
		}
		EventsSDK.emit("UnitTPChanged", false, point)
	}
	private isValidPoint(point: PortalPoint) {
		if (point.IsExpired || point.InternalSkipIteration) {
			return false
		}
		if (point.Team !== this.Caster?.Team) {
			return false
		}
		const distance2D = this.EndPosition.Distance2D(point.EndPosition)
		return distance2D <= PortalPoint.CheckDistance
	}
	private findPoint(pointsData: PortalPoint[]) {
		if (GameState.IsDemo) {
			return undefined
		}
		return pointsData
			.toOrderByDescending(
				x => x.Count,
				y => this.EndPosition.Distance2D(y.EndPosition)
			)
			.find(x => this.isValidPoint(x))
	}
}
