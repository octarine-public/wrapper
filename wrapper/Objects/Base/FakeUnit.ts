import { Vector3 } from "../../Base/Vector3"
import { EntityManager } from "../../Managers/EntityManager"
import { EventsSDK } from "../../Managers/EventsSDK"
import { PlayerCustomData } from "../DataBook/PlayerCustomData"
import { UnitData } from "../DataBook/UnitData"
import { Entity } from "./Entity"
import { PlayerResource } from "./PlayerResource"
import { Unit } from "./Unit"

export class FakeUnit {
	public readonly PredictedPosition = new Vector3().Invalidate()
	public Name = ""
	public Level = 0
	// NOTE: PlayerCustomData set in -> Managers -> Monitors -> FakeUnitChanged
	/** @readonly */
	public PlayerCustomData: Nullable<PlayerCustomData>
	public LastPredictedPositionUpdate = 0
	public LastRealPredictedPositionUpdate = 0

	constructor(
		public readonly Index: number,
		private serial: number
	) {}

	public get BaseAttackRange(): number {
		return this.Name.includes("npc_dota_")
			? UnitData.GetUnitDataByName(this.Name)?.BaseAttackRange ?? 0
			: 0
	}
	public SerialMatches(serial: number): boolean {
		return serial === 0 || this.serial === 0 || serial === this.serial
	}
	public HandleMatches(handle: number): boolean {
		const index = handle & EntityManager.INDEX_MASK
		const serial = (handle >> EntityManager.INDEX_BITS) & EntityManager.SERIAL_MASK
		if (this.Index !== index) {
			return false
		}
		if (this.serial !== 0) {
			return this.SerialMatches(serial)
		}
		this.serial = serial
		return true
	}
	public EntityMatches(ent: Entity): boolean {
		return ent.HandleMatches((this.serial << EntityManager.INDEX_BITS) | this.Index)
	}
	// idk needed ? if we can find out Name in Player ?
	// Player set in -> Managers -> Monitors -> FakeUnitChanged
	public UpdateName(): void {
		if (this.Name !== "") {
			return
		}
		const data = PlayerResource?.PlayerTeamData?.find(
			x => x !== undefined && this.HandleMatches(x.SelectedHeroIndex)
		)
		if (data !== undefined) {
			this.Name = UnitData.GetHeroNameByID(data.SelectedHeroID)
		}
	}
}
const fakeUnitsMap = new Map<number, FakeUnit>()
export const FakeUnits: FakeUnit[] = []

export function GetPredictionTarget(
	handle: Nullable<Entity | number>
): Nullable<Unit | FakeUnit> {
	if (handle === undefined) {
		return undefined
	}
	if (handle instanceof Entity) {
		return handle instanceof Unit ? handle : undefined
	}
	const index = handle & EntityManager.INDEX_MASK
	const serial = (handle >> EntityManager.INDEX_BITS) & EntityManager.SERIAL_MASK
	if (handle === 0 || index === EntityManager.INDEX_MASK) {
		return undefined
	}
	const ent = EntityManager.EntityByIndex(handle)
	if (ent !== undefined) {
		return ent instanceof Unit ? ent : undefined
	}
	let fakeUnit = fakeUnitsMap.get(index)
	if (fakeUnit === undefined) {
		fakeUnit = new FakeUnit(index, serial)
		fakeUnitsMap.set(index, fakeUnit)
		FakeUnits.push(fakeUnit)
		fakeUnit.UpdateName()
		EventsSDK.emit("FakeUnitCreated", false, fakeUnit)
	}
	return fakeUnit
}

EventsSDK.on("EntityCreated", ent => {
	const fakeUnit = fakeUnitsMap.get(ent.Index)
	if (fakeUnit === undefined) {
		return
	}
	if (fakeUnitsMap.delete(ent.Index)) {
		fakeUnit.PlayerCustomData = undefined
	}
	FakeUnits.remove(fakeUnit)
	EventsSDK.emit("FakeUnitDestroyed", false, fakeUnit)
})

EventsSDK.on("GameEnded", () => {
	fakeUnitsMap.clear()
	FakeUnits.clear()
})

EventsSDK.on("PostDataUpdate", () => {
	for (let index = FakeUnits.length - 1; index > -1; index--) {
		const fakeUnit = FakeUnits[index]
		fakeUnit.UpdateName()
	}
})
