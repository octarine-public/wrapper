import Vector3 from "../../Base/Vector3"
import EntityManager from "../../Managers/EntityManager"
import EventsSDK from "../../Managers/EventsSDK"
import { arrayRemove } from "../../Utils/ArrayExtensions"
import GameState from "../../Utils/GameState"
import UnitData from "../DataBook/UnitData"
import Entity from "./Entity"
import { PlayerResource } from "./PlayerResource"
import Unit from "./Unit"

export default class FakeUnit {
	public TPStartTime = -1
	public readonly PredictedPosition = new Vector3().Invalidate()
	public readonly TPStartPosition = new Vector3().Invalidate()
	public readonly TPEndPosition = new Vector3().Invalidate()
	public readonly LastTPStartPosition = new Vector3().Invalidate()
	public readonly LastTPEndPosition = new Vector3().Invalidate()
	public Name = ""
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
	public async UpdateName(): Promise<void> {
		if (this.Name !== "")
			return
		const data = PlayerResource?.PlayerTeamData?.find(x => this.HandleMatches(x.SelectedHeroIndex))
		if (data !== undefined)
			this.Name = await UnitData.GetHeroNameByID(data.SelectedHeroID)
	}
}
const FakeUnitsMap = new Map<number, FakeUnit>()
export const FakeUnits: FakeUnit[] = []

export async function GetPredictionTarget(handle: Entity | number): Promise<Nullable<Unit | FakeUnit>> {
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
	let fake_unit = FakeUnitsMap.get(index)
	if (fake_unit === undefined) {
		fake_unit = new FakeUnit(index, serial)
		FakeUnitsMap.set(index, fake_unit)
		FakeUnits.push(fake_unit)
		await fake_unit.UpdateName()
	}
	return fake_unit
}

EventsSDK.on("EntityCreated", ent => {
	const fake_unit = FakeUnitsMap.get(ent.Index)
	if (fake_unit === undefined)
		return
	FakeUnitsMap.delete(ent.Index)
	arrayRemove(FakeUnits, fake_unit)
	if (!(ent instanceof Unit))
		return
	ent.TPStartTime = fake_unit.TPStartTime
	ent.TPStartPosition.CopyFrom(fake_unit.TPStartPosition)
	ent.TPEndPosition.CopyFrom(fake_unit.TPEndPosition)
	ent.LastTPStartPosition.CopyFrom(fake_unit.LastTPStartPosition)
	ent.LastTPEndPosition.CopyFrom(fake_unit.LastTPEndPosition)
})
EventsSDK.on("GameEnded", () => {
	FakeUnitsMap.clear()
	FakeUnits.splice(0)
})

EventsSDK.on("PostDataUpdate", async () => {
	for (const fake_unit of FakeUnits)
		await fake_unit.UpdateName()
})
