import { Vector3 } from "../Base/Vector3"
import { CollisionFlag } from "../Enums/CollisionFlag"
import { ESkillShotType } from "../Enums/ESkillShotType"
import { HitChance } from "../Enums/HitChance"
import { Ability } from "../Objects/Base/Ability"
import { Unit } from "../Objects/Base/Unit"
import { CollisionDetector } from "./Collision/CollisionDetector"
import { MEC } from "./Geometry/MEC"
import { IPredictionOverrides, PredictionInput } from "./Input/PredictionInput"
import { PredictionOutput } from "./Output/PredictionOutput"
import { EvasionDetector } from "./Tracking/EvasionDetector"
import { MovementHistory } from "./Tracking/MovementHistory"
import { NeuralMovementPredictor } from "./Tracking/NeuralMovementPredictor"

const MAX_ITERATIONS = 4
const FOG_LOW_THRESHOLD = 2
const FOG_IMPOSSIBLE_THRESHOLD = 5
const NN_MIN_CONFIDENCE = 0.3
const NN_FULL_CONFIDENCE = 0.7

export class PredictionEngine {
	public static GetPrediction(input: PredictionInput): PredictionOutput {
		const target = input.Target
		const source = input.Source

		if (!target.IsValid || !target.IsAlive) {
			return PredictionOutput.Empty()
		}

		const origin = input.RealOrigin
		const range = input.Range

		if (range > 0 && source.Distance2D(target) > range + target.HullRadius + 200) {
			return new PredictionOutput(
				HitChance.Impossible,
				target.Position,
				target.Position,
				[],
				0,
				[]
			)
		}

		const predictedPos = this.getPredictedPosition(input, origin)
		const timeToHit = this.calculateTimeToHit(input, origin, predictedPos)

		let castPosition = predictedPos.Clone()
		if (input.SkillShotType === ESkillShotType.Line && input.Speed > 0) {
			const dir = castPosition.Subtract(origin)
			const dist = dir.Length2D
			if (dist > 0) {
				dir.Normalize()
				const maxDist = range > 0 ? range : dist
				if (dist > maxDist) {
					castPosition = origin.Add(dir.MultiplyScalar(maxDist))
				}
			}
		}

		if (range > 0 && origin.Distance2D(castPosition) > range + 50) {
			return new PredictionOutput(
				HitChance.Impossible,
				castPosition,
				predictedPos,
				[],
				timeToHit,
				[]
			)
		}

		let hitChance = this.calculateHitChance(input, timeToHit)

		const evasionFactor = EvasionDetector.GetEvasionFactor(target)
		if (evasionFactor > 0 && hitChance > HitChance.Low) {
			hitChance = Math.max(hitChance - 1, HitChance.Low) as HitChance
		}

		let collisionObjects: Unit[] = []
		if (input.CollisionFlags !== CollisionFlag.None) {
			if (
				input.SkillShotType === ESkillShotType.Line ||
				input.SkillShotType === ESkillShotType.Cone
			) {
				const result = CollisionDetector.DetectLineCollisions(
					origin,
					castPosition,
					input.Radius,
					input.CollisionFlags,
					input.CollisionTeam_,
					source,
					target,
					input.Speed,
					input.TotalDelay
				)
				collisionObjects = result.Objects
				if (result.Collided) {
					hitChance = HitChance.Impossible
				}
			}
		}

		return new PredictionOutput(
			hitChance,
			castPosition,
			predictedPos,
			collisionObjects,
			timeToHit,
			[]
		)
	}

	public static GetAoEPrediction(
		ability: Ability,
		targets: Unit[],
		overrides?: Partial<IPredictionOverrides>
	): PredictionOutput {
		const owner = ability.Owner
		if (owner === undefined || targets.length === 0) {
			return PredictionOutput.Empty()
		}

		const aoeRadius = overrides?.AoeRadius ?? ability.AOERadius
		const predictedPositions: Vector3[] = []
		const validTargets: Unit[] = []

		for (let i = 0; i < targets.length; i++) {
			const target = targets[i]
			if (!target.IsValid || !target.IsAlive) {
				continue
			}
			const input = PredictionInput.FromAbility(ability, target, overrides)
			const origin = input.RealOrigin
			const pos = this.getPredictedPosition(input, origin)
			predictedPositions.push(pos)
			validTargets.push(target)
		}

		if (predictedPositions.length === 0) {
			return PredictionOutput.Empty()
		}

		if (predictedPositions.length === 1) {
			const singleInput = PredictionInput.FromAbility(
				ability,
				validTargets[0],
				overrides
			)
			return this.GetPrediction(singleInput)
		}

		const mec = MEC.GetMEC(predictedPositions)
		let castPos = mec.Center

		if (mec.Radius > aoeRadius) {
			let bestPos = predictedPositions[0]
			let bestCount = 0
			for (let i = 0; i < predictedPositions.length; i++) {
				let count = 0
				for (let j = 0; j < predictedPositions.length; j++) {
					if (
						predictedPositions[i].Distance2D(predictedPositions[j]) <=
						aoeRadius
					) {
						count++
					}
				}
				if (count > bestCount) {
					bestCount = count
					bestPos = predictedPositions[i]
				}
			}
			castPos = bestPos
		}

		const aoeTargets: Unit[] = []
		for (let i = 0; i < validTargets.length; i++) {
			if (castPos.Distance2D(predictedPositions[i]) <= aoeRadius) {
				aoeTargets.push(validTargets[i])
			}
		}

		const hitChance = aoeTargets.length > 0 ? HitChance.Medium : HitChance.Impossible

		return new PredictionOutput(hitChance, castPos, castPos, [], 0, aoeTargets)
	}

	public static GetInterceptPosition(
		source: Unit,
		target: Unit,
		sourceSpeed: number
	): Vector3 | undefined {
		if (sourceSpeed <= 0 || !target.IsMoving) {
			return target.Position
		}
		const targetSpeed = target.MoveSpeed
		const targetPos = target.Position
		const sourcePos = source.Position
		const targetDir = target.Forward

		let lastTime = 0
		for (let iter = 0; iter < MAX_ITERATIONS; iter++) {
			const iterDist = sourcePos.Distance2D(targetPos)
			const iterTime = iterDist / sourceSpeed
			const interceptPos = targetPos.Add(
				targetDir.MultiplyScalar(targetSpeed * iterTime)
			)
			const newDist = sourcePos.Distance2D(interceptPos)
			const newTime = newDist / sourceSpeed
			if (Math.abs(newTime - iterTime) < 0.01) {
				return interceptPos
			}
			lastTime = newTime
		}

		const fallbackTime =
			lastTime > 0 ? lastTime : sourcePos.Distance2D(targetPos) / sourceSpeed
		return target.GetPredictionPosition(fallbackTime)
	}

	private static getPredictedPosition(
		input: PredictionInput,
		origin: Vector3
	): Vector3 {
		const target = input.Target
		const speed = input.Speed
		const delay = input.TotalDelay

		if (!target.IsMoving && !target.IsStunned && !target.IsRooted) {
			return target.Position
		}

		if (target.IsStunned || target.IsRooted || !target.IsMoving) {
			return target.GetPredictionPosition(delay)
		}

		if (speed <= 0) {
			return target.GetPredictionPosition(delay)
		}

		let linearPos = target.Position
		for (let i = 0; i < MAX_ITERATIONS; i++) {
			const dist = origin.Distance2D(linearPos)
			const iterTime = delay + dist / speed
			linearPos = target.GetPredictionPosition(iterTime)
		}

		const nnConfidence = NeuralMovementPredictor.GetConfidence(target)
		if (nnConfidence < NN_MIN_CONFIDENCE) {
			return linearPos
		}

		const totalTime = delay + origin.Distance2D(linearPos) / speed
		const nnPos = NeuralMovementPredictor.GetPredictedPosition(target, totalTime)
		const blend = Math.min(nnConfidence / NN_FULL_CONFIDENCE, 1)
		return new Vector3(
			linearPos.x * (1 - blend) + nnPos.x * blend,
			linearPos.y * (1 - blend) + nnPos.y * blend,
			linearPos.z * (1 - blend) + nnPos.z * blend
		)
	}

	private static calculateTimeToHit(
		input: PredictionInput,
		origin: Vector3,
		predictedPos: Vector3
	): number {
		const speed = input.Speed
		const delay = input.TotalDelay
		if (speed <= 0) {
			return delay
		}
		return delay + origin.Distance2D(predictedPos) / speed
	}

	private static calculateHitChance(
		input: PredictionInput,
		timeToHit: number
	): HitChance {
		const target = input.Target

		if (!target.IsVisible) {
			const fogTime = MovementHistory.GetLastSeenTime(target)
			if (fogTime > FOG_IMPOSSIBLE_THRESHOLD) {
				return HitChance.Impossible
			}
			if (fogTime > FOG_LOW_THRESHOLD) {
				return HitChance.Low
			}
		}

		if (target.IsStunned || target.IsRooted) {
			return HitChance.Immobile
		}

		if (target.IsChanneling) {
			return HitChance.VeryHigh
		}

		if (!target.IsMoving) {
			const stopDuration = MovementHistory.GetStopDuration(target)
			if (stopDuration > 0.5) {
				return HitChance.VeryHigh
			}
			if (stopDuration > 0.2) {
				return HitChance.High
			}
		}

		const nnConf = NeuralMovementPredictor.GetConfidence(target)
		const directionChanges = MovementHistory.GetDirectionChanges(target)

		if (directionChanges <= 1 && nnConf >= NN_FULL_CONFIDENCE) {
			return HitChance.VeryHigh
		}

		if (directionChanges <= 1) {
			return HitChance.High
		}

		if (timeToHit < 0.25) {
			return nnConf >= NN_MIN_CONFIDENCE ? HitChance.VeryHigh : HitChance.High
		}

		if (timeToHit < 0.5) {
			return HitChance.High
		}

		if (nnConf < NN_MIN_CONFIDENCE && directionChanges >= 2) {
			return HitChance.Low
		}

		return HitChance.Medium
	}
}
