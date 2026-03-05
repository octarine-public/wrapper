import { Vector3 } from "../../Base/Vector3"
import { Unit } from "../../Objects/Base/Unit"

const HISTORY_SIZE = 4
const INPUT_SIZE = HISTORY_SIZE * 2 + 3
const HIDDEN1_SIZE = 16
const HIDDEN2_SIZE = 8
const OUTPUT_SIZE = 2
const LEARNING_RATE = 0.01
const LOSS_EMA_ALPHA = 0.05
const MIN_SAMPLES = 8
const MAX_SPEED_NORM = 600

class SimpleNN {
	private readonly sizes: number[]
	private readonly weights: Float32Array[]
	private readonly biases: Float32Array[]
	private readonly zValues: Float32Array[]
	private readonly aValues: Float32Array[]

	constructor(layerSizes: number[]) {
		this.sizes = layerSizes
		this.weights = []
		this.biases = []
		this.zValues = []
		this.aValues = []
		for (let l = 1; l < layerSizes.length; l++) {
			const fanIn = layerSizes[l - 1]
			const fanOut = layerSizes[l]
			const scale = Math.sqrt(2 / (fanIn + fanOut))
			const w = new Float32Array(fanOut * fanIn)
			for (let i = 0; i < w.length; i++) {
				w[i] = (Math.random() * 2 - 1) * scale
			}
			this.weights.push(w)
			this.biases.push(new Float32Array(fanOut))
			this.zValues.push(new Float32Array(fanOut))
			this.aValues.push(new Float32Array(fanOut))
		}
	}

	public Forward(input: Float32Array): Float32Array {
		let prev = input
		for (let l = 0; l < this.weights.length; l++) {
			const rows = this.sizes[l + 1]
			const cols = this.sizes[l]
			const w = this.weights[l]
			const b = this.biases[l]
			const z = this.zValues[l]
			const a = this.aValues[l]
			for (let r = 0; r < rows; r++) {
				let sum = b[r]
				const offset = r * cols
				for (let c = 0; c < cols; c++) {
					sum += w[offset + c] * prev[c]
				}
				z[r] = sum
				a[r] = l < this.weights.length - 1 ? Math.tanh(sum) : sum
			}
			prev = a
		}
		return this.aValues[this.aValues.length - 1]
	}

	public Train(input: Float32Array, target: Float32Array, lr: number): number {
		const output = this.Forward(input)
		const numLayers = this.weights.length
		const deltas: Float32Array[] = []
		for (let l = 0; l < numLayers; l++) {
			deltas.push(new Float32Array(this.sizes[l + 1]))
		}
		let loss = 0
		const outLayer = numLayers - 1
		const outSize = this.sizes[numLayers]
		for (let i = 0; i < outSize; i++) {
			const err = output[i] - target[i]
			deltas[outLayer][i] = err
			loss += err * err
		}
		loss /= outSize
		for (let l = outLayer - 1; l >= 0; l--) {
			const rows = this.sizes[l + 1]
			const nextRows = this.sizes[l + 2]
			const nextW = this.weights[l + 1]
			const a = this.aValues[l]
			const delta = deltas[l]
			const nextDelta = deltas[l + 1]
			for (let r = 0; r < rows; r++) {
				let sum = 0
				for (let nr = 0; nr < nextRows; nr++) {
					sum += nextW[nr * rows + r] * nextDelta[nr]
				}
				const tanhVal = a[r]
				delta[r] = sum * (1 - tanhVal * tanhVal)
			}
		}
		for (let l = 0; l < numLayers; l++) {
			const rows = this.sizes[l + 1]
			const cols = this.sizes[l]
			const w = this.weights[l]
			const b = this.biases[l]
			const delta = deltas[l]
			const prevA = l === 0 ? input : this.aValues[l - 1]
			for (let r = 0; r < rows; r++) {
				const offset = r * cols
				const d = delta[r]
				for (let c = 0; c < cols; c++) {
					w[offset + c] -= lr * d * prevA[c]
				}
				b[r] -= lr * d
			}
		}
		return loss
	}
}

interface UnitNNState {
	network: SimpleNN
	dirBuffer: Float32Array
	lastSpeed: number
	lastMoving: number
	lastRotDiff: number
	prevInput: Float32Array | undefined
	bufferCount: number
	totalSamples: number
	recentLoss: number
}

export class NeuralMovementPredictor {
	private static readonly states = new Map<number, UnitNNState>()

	public static RecordTransition(
		unit: Unit,
		direction: Vector3,
		isMoving: boolean,
		rotationDifference: number = 0
	): void {
		const index = unit.Index
		let state = this.states.get(index)
		if (state === undefined) {
			state = this.createState()
			this.states.set(index, state)
		}
		const target = new Float32Array([direction.x, direction.y])
		if (state.prevInput !== undefined && state.totalSamples >= HISTORY_SIZE) {
			const loss = state.network.Train(state.prevInput, target, LEARNING_RATE)
			state.recentLoss =
				state.recentLoss * (1 - LOSS_EMA_ALPHA) + loss * LOSS_EMA_ALPHA
		}
		this.pushDirection(state, direction.x, direction.y)
		state.lastSpeed = Math.min(unit.MoveSpeed / MAX_SPEED_NORM, 1)
		state.lastMoving = isMoving ? 1 : 0
		state.lastRotDiff = Math.max(-1, Math.min(rotationDifference / 180, 1))
		state.prevInput = this.buildInput(state)
		state.totalSamples++
	}

	public static GetPredictedDirection(unit: Unit): {
		direction: Vector3
		confidence: number
	} {
		const state = this.states.get(unit.Index)
		if (
			state === undefined ||
			state.totalSamples < MIN_SAMPLES ||
			state.prevInput === undefined
		) {
			return { direction: unit.Forward, confidence: 0 }
		}
		const output = state.network.Forward(state.prevInput)
		const len = Math.sqrt(output[0] * output[0] + output[1] * output[1])
		if (len < 0.001) {
			return { direction: unit.Forward, confidence: 0 }
		}
		return {
			direction: new Vector3(output[0] / len, output[1] / len, 0),
			confidence: this.lossToConfidence(state)
		}
	}

	public static GetPredictedPosition(
		unit: Unit,
		time: number,
		stepInterval: number = 0.15
	): Vector3 {
		const state = this.states.get(unit.Index)
		if (
			state === undefined ||
			state.totalSamples < MIN_SAMPLES ||
			!unit.IsMoving ||
			state.prevInput === undefined
		) {
			return unit.GetPredictionPosition(time)
		}
		const speed = unit.MoveSpeed
		const pos = unit.Position.Clone()
		const tempBuf = new Float32Array(state.dirBuffer)
		const tempSpeed = state.lastSpeed
		const tempInput = new Float32Array(INPUT_SIZE)
		let remaining = time
		while (remaining > 0) {
			const dt = Math.min(remaining, stepInterval)
			this.fillInput(tempInput, tempBuf, tempSpeed, 1, 0)
			const output = state.network.Forward(tempInput)
			const len = Math.sqrt(output[0] * output[0] + output[1] * output[1])
			if (len < 0.001) {
				break
			}
			const dx = output[0] / len
			const dy = output[1] / len
			pos.x += dx * speed * dt
			pos.y += dy * speed * dt
			this.shiftBuffer(tempBuf, dx, dy)
			remaining -= dt
		}
		return pos
	}

	public static GetConfidence(unit: Unit): number {
		const state = this.states.get(unit.Index)
		if (state === undefined || state.totalSamples < MIN_SAMPLES) {
			return 0
		}
		return this.lossToConfidence(state)
	}

	public static Remove(unitIndex: number): void {
		this.states.delete(unitIndex)
	}

	public static Clear(): void {
		this.states.clear()
	}

	private static createState(): UnitNNState {
		return {
			network: new SimpleNN([INPUT_SIZE, HIDDEN1_SIZE, HIDDEN2_SIZE, OUTPUT_SIZE]),
			dirBuffer: new Float32Array(HISTORY_SIZE * 2),
			lastSpeed: 0,
			lastMoving: 0,
			lastRotDiff: 0,
			prevInput: undefined,
			bufferCount: 0,
			totalSamples: 0,
			recentLoss: 1
		}
	}

	private static pushDirection(state: UnitNNState, dx: number, dy: number): void {
		const buf = state.dirBuffer
		for (let i = 0; i < (HISTORY_SIZE - 1) * 2; i++) {
			buf[i] = buf[i + 2]
		}
		const last = (HISTORY_SIZE - 1) * 2
		buf[last] = dx
		buf[last + 1] = dy
		if (state.bufferCount < HISTORY_SIZE) {
			state.bufferCount++
		}
	}

	private static shiftBuffer(buf: Float32Array, dx: number, dy: number): void {
		for (let i = 0; i < (HISTORY_SIZE - 1) * 2; i++) {
			buf[i] = buf[i + 2]
		}
		const last = (HISTORY_SIZE - 1) * 2
		buf[last] = dx
		buf[last + 1] = dy
	}

	private static buildInput(state: UnitNNState): Float32Array {
		const input = new Float32Array(INPUT_SIZE)
		this.fillInput(
			input,
			state.dirBuffer,
			state.lastSpeed,
			state.lastMoving,
			state.lastRotDiff
		)
		return input
	}

	private static fillInput(
		input: Float32Array,
		dirBuf: Float32Array,
		speed: number,
		moving: number,
		rotDiff: number
	): void {
		for (let i = 0; i < HISTORY_SIZE * 2; i++) {
			input[i] = dirBuf[i]
		}
		input[HISTORY_SIZE * 2] = speed
		input[HISTORY_SIZE * 2 + 1] = moving
		input[HISTORY_SIZE * 2 + 2] = rotDiff
	}

	private static lossToConfidence(state: UnitNNState): number {
		const sampleFactor = Math.min(state.totalSamples / 50, 1)
		const lossFactor = Math.max(1 - state.recentLoss * 2, 0)
		return sampleFactor * lossFactor
	}
}
