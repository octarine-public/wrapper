import { Team } from "../Enums/Team"
import { EntityManager } from "../Managers/EntityManager"
import { EventsSDK } from "../Managers/EventsSDK"
import { Unit } from "../Objects/Base/Unit"
import { GameState } from "../Utils/GameState"
import { Vector3 } from "./Vector3"

export class PortalPoint {
	public static readonly CheckDistance = 1600

	public IsValid = true
	public IsKeenTeleport: boolean = false

	public Count: number = 0
	public Team: Team = Team.None
	public RecentTime: number = 0
	public MaxDuration: number = 3
	public AbilityName: string = "item_teleport"

	public InternalSkipIteration: boolean = false
	public InternalSkipEmitNotify: boolean = false

	private readonly maxRecentTime = 25 // sec

	constructor(
		public readonly StartPosition: Vector3,
		public readonly EndPosition: Vector3,
		private readonly index: number
	) {
		this.UpdateData(this.Caster, this.EndPosition, !this.EndPosition.IsValid)
	}
	public get IsExpired() {
		return GameState.RawGameTime > this.RecentTime
	}
	public get Caster() {
		return EntityManager.EntityByIndex<Unit>(this.index)
	}
	protected UpdateData(
		caster: Nullable<Unit>,
		endPosition: Vector3,
		skipEmit: boolean = false
	) {
		this.Team = caster?.Team ?? Team.None
		this.EndPosition.CopyFrom(endPosition)
		this.RecentTime = GameState.RawGameTime + this.maxRecentTime

		if (!skipEmit) {
			EventsSDK.emit("UnitTPChanged", false, this)
		}
	}
}
