import { Vector3 } from "../../Base/Vector3"
import { Unit } from "../../Objects/Base/Unit"

const NUM_SECTORS = 8
const STOPPED_STATE = NUM_SECTORS
const TOTAL_STATES = NUM_SECTORS + 1
const DECAY_FACTOR = 0.98
const MIN_SAMPLES = 5
const SECTOR_ANGLE = (2 * Math.PI) / NUM_SECTORS

const sectorDirections: Vector3[] = []
for (let i = 0; i < NUM_SECTORS; i++) {
	const angle = i * SECTOR_ANGLE
	sectorDirections.push(new Vector3(Math.cos(angle), Math.sin(angle), 0))
}

interface UnitMarkovState {
	transitions: Float32Array[]
	lastSector: number
	totalTransitions: number
}

export class MarkovMovementPredictor {
	private static readonly states = new Map<number, UnitMarkovState>()

	public static RecordTransition(
		unit: Unit,
		direction: Vector3,
		isMoving: boolean
	): void {
		const index = unit.Index
		let state = this.states.get(index)
		if (state === undefined) {
			state = this.createState()
			this.states.set(index, state)
		}
		const currentSector = isMoving ? this.directionToSector(direction) : STOPPED_STATE
		if (state.lastSector >= 0) {
			this.decayRow(state.transitions[state.lastSector])
			state.transitions[state.lastSector][currentSector] += 1
			state.totalTransitions++
		}
		state.lastSector = currentSector
	}

	public static GetPredictedDirection(
		unit: Unit,
		steps: number = 1
	): { direction: Vector3; confidence: number } {
		const state = this.states.get(unit.Index)
		if (
			state === undefined ||
			state.lastSector < 0 ||
			state.totalTransitions < MIN_SAMPLES
		) {
			return { direction: unit.Forward, confidence: 0 }
		}
		let probs = this.getTransitionProbabilities(state, state.lastSector)
		for (let step = 1; step < steps; step++) {
			probs = this.multiplyProbabilities(state, probs)
		}
		return this.probabilitiesToDirection(probs, state.totalTransitions)
	}

	public static GetPredictedPosition(
		unit: Unit,
		time: number,
		stepInterval: number = 0.15
	): Vector3 {
		const state = this.states.get(unit.Index)
		if (
			state === undefined ||
			state.lastSector < 0 ||
			state.totalTransitions < MIN_SAMPLES ||
			!unit.IsMoving
		) {
			return unit.GetPredictionPosition(time)
		}
		const speed = unit.MoveSpeed
		let pos = unit.Position.Clone()
		let currentSector = state.lastSector
		let remaining = time
		while (remaining > 0) {
			const dt = Math.min(remaining, stepInterval)
			const probs = this.getTransitionProbabilities(state, currentSector)
			const dir = this.probabilitiesToWeightedDirection(probs)
			pos = pos.Add(dir.MultiplyScalar(speed * dt))
			currentSector = this.directionToSector(dir)
			remaining -= dt
		}
		return pos
	}

	public static GetConfidence(unit: Unit): number {
		const state = this.states.get(unit.Index)
		if (state === undefined || state.lastSector < 0) {
			return 0
		}
		const row = state.transitions[state.lastSector]
		let total = 0
		let max = 0
		for (let i = 0; i < TOTAL_STATES; i++) {
			total += row[i]
			if (row[i] > max) {
				max = row[i]
			}
		}
		if (total < MIN_SAMPLES) {
			return 0
		}
		return max / total
	}

	public static Remove(unitIndex: number): void {
		this.states.delete(unitIndex)
	}

	public static Clear(): void {
		this.states.clear()
	}

	private static createState(): UnitMarkovState {
		const transitions: Float32Array[] = []
		for (let i = 0; i < TOTAL_STATES; i++) {
			transitions.push(new Float32Array(TOTAL_STATES))
		}
		return { transitions, lastSector: -1, totalTransitions: 0 }
	}

	private static directionToSector(dir: Vector3): number {
		const angle = Math.atan2(dir.y, dir.x)
		const normalized = angle < 0 ? angle + 2 * Math.PI : angle
		const sector = Math.round(normalized / SECTOR_ANGLE) % NUM_SECTORS
		return sector
	}

	private static decayRow(row: Float32Array): void {
		for (let i = 0; i < TOTAL_STATES; i++) {
			row[i] *= DECAY_FACTOR
		}
	}

	private static getTransitionProbabilities(
		state: UnitMarkovState,
		fromSector: number
	): Float32Array {
		const row = state.transitions[fromSector]
		const probs = new Float32Array(TOTAL_STATES)
		let total = 0
		for (let i = 0; i < TOTAL_STATES; i++) {
			total += row[i]
		}
		if (total === 0) {
			for (let i = 0; i < TOTAL_STATES; i++) {
				probs[i] = 1 / TOTAL_STATES
			}
			return probs
		}
		for (let i = 0; i < TOTAL_STATES; i++) {
			probs[i] = row[i] / total
		}
		return probs
	}

	private static multiplyProbabilities(
		state: UnitMarkovState,
		currentProbs: Float32Array
	): Float32Array {
		const result = new Float32Array(TOTAL_STATES)
		for (let from = 0; from < TOTAL_STATES; from++) {
			if (currentProbs[from] <= 0) {
				continue
			}
			const nextProbs = this.getTransitionProbabilities(state, from)
			for (let to = 0; to < TOTAL_STATES; to++) {
				result[to] += currentProbs[from] * nextProbs[to]
			}
		}
		return result
	}

	private static probabilitiesToDirection(
		probs: Float32Array,
		totalSamples: number
	): { direction: Vector3; confidence: number } {
		let sumX = 0
		let sumY = 0
		let maxProb = 0
		for (let i = 0; i < NUM_SECTORS; i++) {
			sumX += probs[i] * sectorDirections[i].x
			sumY += probs[i] * sectorDirections[i].y
			if (probs[i] > maxProb) {
				maxProb = probs[i]
			}
		}
		const len = Math.sqrt(sumX * sumX + sumY * sumY)
		if (len < 0.001) {
			return { direction: new Vector3(0, 0, 0), confidence: 0 }
		}
		const sampleConfidence = Math.min(totalSamples / 50, 1)
		const confidence = maxProb * sampleConfidence
		return {
			direction: new Vector3(sumX / len, sumY / len, 0),
			confidence
		}
	}

	private static probabilitiesToWeightedDirection(probs: Float32Array): Vector3 {
		let sumX = 0
		let sumY = 0
		for (let i = 0; i < NUM_SECTORS; i++) {
			sumX += probs[i] * sectorDirections[i].x
			sumY += probs[i] * sectorDirections[i].y
		}
		const len = Math.sqrt(sumX * sumX + sumY * sumY)
		if (len < 0.001) {
			return new Vector3(0, 0, 0)
		}
		return new Vector3(sumX / len, sumY / len, 0)
	}
}
