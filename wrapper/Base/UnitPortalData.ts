import { EntityManager } from "../Managers/EntityManager"
import { EventsSDK } from "../Managers/EventsSDK"
import { TaskManager } from "../Managers/TaskManager"
import { Unit } from "../Objects/Base/Unit"
import { GameState } from "../Utils/GameState"
import { PortalPoint } from "./PortalPoint"
import { Vector3 } from "./Vector3"

export class UnitPortalData {
	public IsValid = true
	public IsCanceled = false
	public MaxDuration: number = 3
	public AbilityName: string = "item_tpscroll"
	public ForceEmit: [boolean, number] = [true, GameState.TickInterval * 1000]
	public readonly EndPosition = new Vector3().Invalidate()
	public readonly StartPosition = new Vector3().Invalidate()

	private targetIndex: number = -1
	private lastCreateTime: number = 0

	constructor(private readonly casterIndex: number) {
		this.lastCreateTime = GameState.RawGameTime
	}
	public get Caster() {
		return EntityManager.EntityByIndex<Unit>(this.casterIndex)
	}
	public get Target() {
		return EntityManager.EntityByIndex<Unit>(this.targetIndex)
	}
	public get RemainingTime() {
		return this.lastCreateTime + this.MaxDuration - GameState.RawGameTime
	}
	public IsValidPoint(point: PortalPoint) {
		if (point.IsExpired || point.InternalSkipIteration) {
			return false
		}
		if (point.Team !== this.Caster?.Team) {
			return false
		}
		return point.EndPosition.Distance2D(this.EndPosition) <= PortalPoint.CheckDistance
	}
	public UpdateData(
		entIndex: Nullable<number>,
		startPosition: Vector3,
		endPosition: Vector3
	) {
		this.lastCreateTime = GameState.RawGameTime
		this.targetIndex = entIndex ?? -1
		this.EndPosition.CopyFrom(endPosition)
		this.StartPosition.CopyFrom(startPosition)
	}
	public UpdateDuration(
		pointsData: PortalPoint[],
		skipIteration?: boolean,
		duration?: number
	) {
		this.lastCreateTime = GameState.RawGameTime
		if (skipIteration) {
			this.MaxDuration = duration ?? this.MaxDuration
			this.forceOrBeginEmit()
			return
		}
		let maxDuration = duration ?? this.MaxDuration
		const arr = pointsData.filter(x => this.IsValidPoint(x))
		if (arr.length === 2) {
			maxDuration += 2
		} else if (arr.length > 2) {
			maxDuration += 2 + 0.5 * (arr.length - 2)
		}
		this.MaxDuration = maxDuration
		this.forceOrBeginEmit()
	}
	private forceOrBeginEmit() {
		if (this.ForceEmit[0]) {
			EventsSDK.emit("UnitPortalChanged", false, this)
			return
		}
		TaskManager.Begin(
			() => EventsSDK.emit("UnitPortalChanged", false, this),
			this.ForceEmit[1]
		)
	}
}
