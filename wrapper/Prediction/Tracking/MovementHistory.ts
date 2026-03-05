import { Vector3 } from "../../Base/Vector3"
import { EntityManager } from "../../Managers/EntityManager"
import { EventsSDK } from "../../Managers/EventsSDK"
import { Entity } from "../../Objects/Base/Entity"
import { Unit } from "../../Objects/Base/Unit"
import { GameState } from "../../Utils/GameState"
import { NeuralMovementPredictor } from "./NeuralMovementPredictor"

interface MovementEntry {
	Position: Vector3
	Direction: Vector3
	Time: number
	IsVisible: boolean
}

export class MovementHistory {
	public static readonly MaxEntries = 30
	private static readonly sampleInterval = 0.15
	private static readonly entries = new Map<number, MovementEntry[]>()
	private static readonly directionChangeThreshold = 0.7

	public static Update(unit: Unit): void {
		const index = unit.Index
		let list = this.entries.get(index)
		if (list === undefined) {
			list = []
			this.entries.set(index, list)
		}
		const now = GameState.RawGameTime
		const last = list.length > 0 ? list[list.length - 1] : undefined
		if (last !== undefined && now - last.Time < this.sampleInterval) {
			return
		}
		const pos = unit.Position.Clone()
		let dir: Vector3
		if (last !== undefined) {
			const dx = pos.x - last.Position.x
			const dy = pos.y - last.Position.y
			const len = Math.sqrt(dx * dx + dy * dy)
			dir = len > 1 ? new Vector3(dx / len, dy / len, 0) : unit.Forward.Clone()
		} else {
			dir = unit.Forward.Clone()
		}
		list.push({
			Position: pos,
			Direction: dir,
			Time: now,
			IsVisible: unit.IsVisible
		})
		NeuralMovementPredictor.RecordTransition(
			unit,
			dir,
			unit.IsMoving,
			unit.RotationDifference
		)
		if (list.length > this.MaxEntries) {
			list.shift()
		}
	}
	public static GetDirectionChanges(unit: Unit): number {
		const list = this.entries.get(unit.Index)
		if (list === undefined || list.length < 2) {
			return 0
		}
		let changes = 0
		for (let i = 1; i < list.length; i++) {
			const prev = list[i - 1].Direction
			const curr = list[i].Direction
			const dot = prev.x * curr.x + prev.y * curr.y
			const prevLen = Math.sqrt(prev.x * prev.x + prev.y * prev.y)
			const currLen = Math.sqrt(curr.x * curr.x + curr.y * curr.y)
			if (prevLen > 0 && currLen > 0) {
				const normalized = dot / (prevLen * currLen)
				if (normalized < this.directionChangeThreshold) {
					changes++
				}
			}
		}
		return changes
	}
	public static GetAverageDirection(unit: Unit): Vector3 {
		const list = this.entries.get(unit.Index)
		if (list === undefined || list.length === 0) {
			return unit.Forward
		}
		let sumX = 0
		let sumY = 0
		for (let i = 0; i < list.length; i++) {
			sumX += list[i].Direction.x
			sumY += list[i].Direction.y
		}
		const len = Math.sqrt(sumX * sumX + sumY * sumY)
		if (len === 0) {
			return unit.Forward
		}
		return new Vector3(sumX / len, sumY / len, 0)
	}
	public static GetLastSeenTime(unit: Unit): number {
		const list = this.entries.get(unit.Index)
		if (list === undefined || list.length === 0) {
			return 0
		}
		for (let i = list.length - 1; i >= 0; i--) {
			if (list[i].IsVisible) {
				return GameState.RawGameTime - list[i].Time
			}
		}
		return Number.MAX_SAFE_INTEGER
	}
	public static GetStopDuration(unit: Unit): number {
		if (unit.IsMoving) {
			return 0
		}
		const list = this.entries.get(unit.Index)
		if (list === undefined || list.length < 2) {
			return 0
		}
		const now = GameState.RawGameTime
		const currentPos = unit.Position
		for (let i = list.length - 1; i >= 0; i--) {
			if (currentPos.Distance2D(list[i].Position) > 5) {
				return now - list[i].Time
			}
		}
		return now - list[0].Time
	}
	public static Remove(unitIndex: number): void {
		this.entries.delete(unitIndex)
	}
	public static Clear(): void {
		this.entries.clear()
	}
}

EventsSDK.on("PostDataUpdate", () => {
	const units = EntityManager.GetEntitiesByClass(Unit)
	for (let i = 0, len = units.length; i < len; i++) {
		const unit = units[i]
		if (unit.IsValid && unit.IsAlive && unit.IsVisible) {
			MovementHistory.Update(unit)
		}
	}
})

EventsSDK.on("EntityDestroyed", (entity: Entity) => {
	if (entity instanceof Unit) {
		MovementHistory.Remove(entity.Index)
		NeuralMovementPredictor.Remove(entity.Index)
	}
})

EventsSDK.on("GameEnded", () => {
	MovementHistory.Clear()
	NeuralMovementPredictor.Clear()
})
