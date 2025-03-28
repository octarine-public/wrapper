import { QAngle } from "../../Base/QAngle"
import { Vector3 } from "../../Base/Vector3"
import { EventPriority } from "../../Enums/EventPriority"
import { EntityManager } from "../../Managers/EntityManager"
import { EventsSDK } from "../../Managers/EventsSDK"
import { PlayerCustomData } from "../DataBook/PlayerCustomData"
import { UnitData } from "../DataBook/UnitData"
import { Entity } from "./Entity"
import { PlayerResource } from "./PlayerResource"
import { Unit } from "./Unit"

export class FakeUnit {
	public readonly PredictionAngles = new QAngle().Invalidate()
	public readonly PredictedPosition = new Vector3().Invalidate()

	public Name: string = ""
	public Level: number = 0
	public ModelName: string = ""
	public ParticlePath: string = ""
	public PlayerID: number = -1
	public PredictionMoveSpeed = 0
	public LastPredictedPositionUpdate: number = 0
	public LastRealPredictedPositionUpdate: number = 0

	constructor(
		public readonly Index: number,
		private serial: number
	) {}
	public get Angles() {
		return this.PredictionAngles
	}
	public get PlayerCustomData() {
		return PlayerCustomData.get(this.PlayerID)
	}
	// TODO(?): handle fake modifiers
	public get BaseAttackRange(): number {
		return this.Name.includes("npc_dota_")
			? (UnitData.GetUnitDataByName(this.Name)?.BaseAttackRange ?? 0)
			: 0
	}
	// TODO(?): handle fake modifiers
	public get MoveSpeed(): number {
		return this.Name.includes("npc_dota_")
			? (UnitData.GetUnitDataByName(this.Name)?.BaseMovementSpeed ?? 0)
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

function DeleteFakeUnit(index: number): void {
	const fakeUnit = fakeUnitsMap.get(index)
	if (fakeUnit === undefined) {
		return
	}
	fakeUnit.PlayerID = -1
	FakeUnits.remove(fakeUnit)
	fakeUnitsMap.delete(index)
	EventsSDK.emit("FakeUnitDestroyed", false, fakeUnit)
}

export function GetPredictionTarget(
	handle: Nullable<Entity | number>,
	skipCreateFakeUnit: boolean = false,
	particlePath?: string
): Nullable<Unit | FakeUnit> {
	if (handle === undefined || handle === EntityManager.INVALID_HANDLE) {
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
	if (fakeUnit !== undefined || skipCreateFakeUnit) {
		return fakeUnit
	}
	fakeUnit = new FakeUnit(index, serial)
	fakeUnit.ParticlePath = particlePath ?? ""
	fakeUnitsMap.set(index, fakeUnit)
	FakeUnits.push(fakeUnit)
	fakeUnit.UpdateName()
	EventsSDK.emit("FakeUnitCreated", false, fakeUnit)
	return fakeUnit
}

EventsSDK.on("PostDataUpdate", () => {
	for (let i = FakeUnits.length - 1; i > -1; i--) {
		const unit = FakeUnits[i]
		unit.UpdateName()
	}
})

EventsSDK.on("GameEvent", (name, obj) => {
	if (name === "entity_killed") {
		DeleteFakeUnit(obj.entindex_killed)
	}
})

EventsSDK.on("GameEnded", () => {
	FakeUnits.clear()
	fakeUnitsMap.clear()
})

EventsSDK.on("EntityCreated", ent => DeleteFakeUnit(ent.Index), EventPriority.IMMEDIATE)
