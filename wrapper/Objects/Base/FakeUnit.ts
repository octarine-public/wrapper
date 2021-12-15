import Vector3 from "../../Base/Vector3"
import EntityManager from "../../Managers/EntityManager"
import EventsSDK from "../../Managers/EventsSDK"
import GameState from "../../Utils/GameState"
import Entity from "./Entity"
import Unit from "./Unit"

export default class FakeUnit {
	public TPStartTime = -1
	public readonly PredictedPosition = new Vector3().Invalidate()
	public readonly TPStartPosition = new Vector3().Invalidate()
	public readonly TPEndPosition = new Vector3().Invalidate()
	public readonly LastTPStartPosition = new Vector3().Invalidate()
	public readonly LastTPEndPosition = new Vector3().Invalidate()
	private LastRealPredictedPositionUpdate_ = 0
	private LastPredictedPositionUpdate_ = 0

	constructor(
		public readonly Index: number,
		private Serial: number,
	) { }

	public get LastRealPredictedPositionUpdate(): number {
		if (this.TPStartTime !== -1 && this.TPStartPosition.IsValid)
			this.LastRealPredictedPositionUpdate_ = GameState.RawGameTime
		return this.LastRealPredictedPositionUpdate_
	}
	public set LastRealPredictedPositionUpdate(val: number) {
		this.LastRealPredictedPositionUpdate_ = val
	}
	public get LastPredictedPositionUpdate(): number {
		if (this.TPStartTime !== -1 && this.TPStartPosition.IsValid)
			this.LastRealPredictedPositionUpdate_ = GameState.RawGameTime
		return this.LastPredictedPositionUpdate_
	}
	public set LastPredictedPositionUpdate(val: number) {
		this.LastPredictedPositionUpdate_ = val
	}
	public SerialMatches(serial: number): boolean {
		return serial === 0 || this.Serial === 0 || serial === this.Serial
	}
	public HandleMatches(handle: number): boolean {
		const index = handle & EntityManager.INDEX_MASK
		const serial = (handle >> EntityManager.INDEX_BITS) & EntityManager.SERIAL_MASK
		if (this.Index !== index)
			return false
		if (this.Serial !== 0)
			return this.SerialMatches(serial)
		this.Serial = serial
		return true
	}
}
export const FakeUnits = new Map<number, FakeUnit>()

export function GetPredictionTarget(handle: Entity | number): Nullable<Unit | FakeUnit> {
	if (handle instanceof Entity)
		return handle instanceof Unit
			? handle
			: undefined
	if (handle === 0)
		return undefined
	const ent = EntityManager.EntityByIndex(handle)
	if (ent !== undefined)
		return ent instanceof Unit
			? ent
			: undefined
	const index = handle & EntityManager.INDEX_MASK
	const serial = (handle >> EntityManager.INDEX_BITS) & EntityManager.SERIAL_MASK
	let fake_unit = FakeUnits.get(index)
	if (fake_unit === undefined) {
		fake_unit = new FakeUnit(index, serial)
		FakeUnits.set(index, fake_unit)
	}
	return fake_unit
}

EventsSDK.on("EntityCreated", ent => {
	const fake_unit = FakeUnits.get(ent.Index)
	if (fake_unit === undefined)
		return
	FakeUnits.delete(ent.Index)
	if (!(ent instanceof Unit))
		return
	ent.TPStartTime = fake_unit.TPStartTime
	ent.TPStartPosition.CopyFrom(fake_unit.TPStartPosition)
	ent.TPEndPosition.CopyFrom(fake_unit.TPEndPosition)
	ent.LastTPStartPosition.CopyFrom(fake_unit.LastTPStartPosition)
	ent.LastTPEndPosition.CopyFrom(fake_unit.LastTPEndPosition)
})
EventsSDK.on("GameEnded", () => FakeUnits.clear())
