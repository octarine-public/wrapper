import { Team } from "../Enums/Team"
import { EntityManager } from "../Managers/EntityManager"
import { Unit } from "../Objects/Base/Unit"
import { GameState } from "../Utils/GameState"
import { Vector3 } from "./Vector3"

export class PortalPoint {
	public static readonly CheckDistance = 1600

	public IsValid = true
	public Team: Team = Team.None
	public RecentTime: number = 0
	public readonly CreateTime: number = 0

	public InternalSkipIteration: boolean = false
	public InternalSkipEmitNotify: boolean = false

	private readonly maxRecentTime = 25 // sec

	constructor(
		public readonly StartPosition: Vector3,
		public readonly EndPosition: Vector3,
		private readonly index: number
	) {
		this.CreateTime = GameState.RawGameTime
		this.UpdateData(this.Caster, this.EndPosition)
	}
	public get IsExpired() {
		return GameState.RawGameTime > this.RecentTime
	}
	public get Caster() {
		return EntityManager.EntityByIndex<Unit>(this.index)
	}
	protected UpdateData(caster: Nullable<Unit>, endPosition: Vector3) {
		this.Team = caster?.Team ?? Team.None
		this.EndPosition.CopyFrom(endPosition)
		this.RecentTime = GameState.RawGameTime + this.maxRecentTime
	}
}
