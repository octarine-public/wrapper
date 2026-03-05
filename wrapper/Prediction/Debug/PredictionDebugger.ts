import { Color } from "../../Base/Color"
import { Vector3 } from "../../Base/Vector3"
import { ESkillShotType } from "../../Enums/ESkillShotType"
import { HitChance } from "../../Enums/HitChance"
import { ParticlesSDK } from "../../Managers/ParticleManager"
import { RendererSDK } from "../../Native/RendererSDK"
import { Entity } from "../../Objects/Base/Entity"
import { PredictionInput } from "../Input/PredictionInput"
import { PredictionOutput } from "../Output/PredictionOutput"
import { NeuralMovementPredictor } from "../Tracking/NeuralMovementPredictor"

const KEY_PREFIX = "prediction_debug"

export class PredictionDebugger {
	public static Enabled = false
	private static lastCollisionCount = 0

	public static Draw(
		input: PredictionInput,
		output: PredictionOutput,
		particleManager: ParticlesSDK
	): void {
		if (!this.Enabled) {
			return
		}
		const source = input.Source
		const origin = input.RealOrigin
		const castPos = output.CastPosition
		const predictedPos = output.PredictedPosition
		const hitChance = output.HitChance_

		const lineColor = this.getHitChanceColor(hitChance)

		particleManager.DrawLine(`${KEY_PREFIX}_line`, source as Entity, castPos, {
			Position: origin,
			Color: lineColor,
			Width: 80
		})

		particleManager.DrawCircle(
			`${KEY_PREFIX}_target`,
			source as Entity,
			input.Target.HullRadius + 10,
			{ Position: predictedPos, Color: Color.Yellow }
		)

		if (input.Radius > 0 && input.SkillShotType === ESkillShotType.Line) {
			particleManager.DrawCircle(
				`${KEY_PREFIX}_cast`,
				source as Entity,
				input.Radius,
				{ Position: castPos, Color: lineColor }
			)
		}

		if (input.AoeRadius > 0 && this.isAoeType(input.SkillShotType)) {
			particleManager.DrawCircle(
				`${KEY_PREFIX}_aoe`,
				source as Entity,
				input.AoeRadius,
				{ Position: castPos, Color: Color.Aqua }
			)
		}

		const collisions = output.CollisionObjects
		const speed = input.Speed
		const delay = input.TotalDelay
		for (let i = 0; i < collisions.length; i++) {
			const unit = collisions[i]
			const currentPos = unit.Position
			const dist = origin.Distance2D(currentPos)
			const timeToReach = speed > 0 ? delay + dist / speed : 0
			const colPredicted =
				unit.IsMoving && timeToReach > 0
					? unit.GetPredictionPosition(timeToReach)
					: currentPos

			particleManager.DrawCircle(
				`${KEY_PREFIX}_col_${i}`,
				source,
				unit.HullRadius + 5,
				{ Position: colPredicted, Color: Color.Red }
			)

			if (unit.IsMoving && currentPos.Distance2D(colPredicted) > 5) {
				particleManager.DrawLine(
					`${KEY_PREFIX}_col_dir_${i}`,
					source,
					colPredicted,
					{ Position: currentPos, Color: new Color(255, 100, 100), Width: 80 }
				)
			}
		}
		for (let i = collisions.length; i < this.lastCollisionCount; i++) {
			particleManager.DestroyByKey(`${KEY_PREFIX}_col_${i}`)
			particleManager.DestroyByKey(`${KEY_PREFIX}_col_dir_${i}`)
		}
		this.lastCollisionCount = collisions.length

		const nnResult = NeuralMovementPredictor.GetPredictedDirection(input.Target)
		const nnConfidence = NeuralMovementPredictor.GetConfidence(input.Target)

		if (nnConfidence > 0 && input.Target.IsMoving) {
			const timeToHit =
				speed > 0 ? delay + origin.Distance2D(predictedPos) / speed : delay
			const nnPos = NeuralMovementPredictor.GetPredictedPosition(
				input.Target,
				timeToHit
			)

			particleManager.DrawCircle(
				`${KEY_PREFIX}_nn_pos`,
				source as Entity,
				input.Target.HullRadius + 8,
				{ Position: nnPos, Color: Color.Aqua }
			)

			if (predictedPos.Distance2D(nnPos) > 10) {
				particleManager.DrawLine(
					`${KEY_PREFIX}_nn_diff`,
					source as Entity,
					nnPos,
					{ Position: predictedPos, Color: new Color(0, 200, 255) }
				)
			}

			const nnDirEnd = input.Target.Position.Add(
				nnResult.direction.MultiplyScalar(150)
			)
			particleManager.DrawLine(`${KEY_PREFIX}_nn_dir`, source as Entity, nnDirEnd, {
				Position: input.Target.Position,
				Color: Color.Aqua
			})
		} else {
			particleManager.DestroyByKey(`${KEY_PREFIX}_nn_pos`)
			particleManager.DestroyByKey(`${KEY_PREFIX}_nn_diff`)
			particleManager.DestroyByKey(`${KEY_PREFIX}_nn_dir`)
		}

		this.drawHitChanceText(castPos, hitChance, collisions.length, nnConfidence)
	}

	public static Destroy(particleManager: ParticlesSDK): void {
		particleManager.DestroyByKey(`${KEY_PREFIX}_line`)
		particleManager.DestroyByKey(`${KEY_PREFIX}_target`)
		particleManager.DestroyByKey(`${KEY_PREFIX}_cast`)
		particleManager.DestroyByKey(`${KEY_PREFIX}_aoe`)
		particleManager.DestroyByKey(`${KEY_PREFIX}_nn_pos`)
		particleManager.DestroyByKey(`${KEY_PREFIX}_nn_diff`)
		particleManager.DestroyByKey(`${KEY_PREFIX}_nn_dir`)
		for (let i = 0; i < 20; i++) {
			particleManager.DestroyByKey(`${KEY_PREFIX}_col_${i}`)
			particleManager.DestroyByKey(`${KEY_PREFIX}_col_dir_${i}`)
		}
		this.lastCollisionCount = 0
	}

	private static getHitChanceColor(hitChance: HitChance): Color {
		switch (hitChance) {
			case HitChance.Immobile:
				return Color.Green
			case HitChance.VeryHigh:
				return new Color(0, 200, 0)
			case HitChance.High:
				return Color.Yellow
			case HitChance.Medium:
				return new Color(255, 165, 0)
			case HitChance.Low:
				return new Color(255, 100, 0)
			case HitChance.Impossible:
				return Color.Red
			default:
				return Color.White
		}
	}

	private static drawHitChanceText(
		position: Vector3,
		hitChance: HitChance,
		collisionCount: number,
		nnConfidence: number
	): void {
		const screenPos = RendererSDK.WorldToScreen(position)
		if (screenPos === undefined) {
			return
		}
		let text = this.hitChanceToString(hitChance)
		if (collisionCount > 0) {
			text += ` [${collisionCount} col]`
		}
		if (nnConfidence > 0) {
			text += ` NN:${Math.round(nnConfidence * 100)}%`
		}
		const color = this.getHitChanceColor(hitChance)
		RendererSDK.Text(text, screenPos, color)
	}

	private static hitChanceToString(hitChance: HitChance): string {
		switch (hitChance) {
			case HitChance.Impossible:
				return "Impossible"
			case HitChance.Low:
				return "Low"
			case HitChance.Medium:
				return "Medium"
			case HitChance.High:
				return "High"
			case HitChance.VeryHigh:
				return "VeryHigh"
			case HitChance.Immobile:
				return "Immobile"
			default:
				return "Unknown"
		}
	}

	private static isAoeType(type: ESkillShotType): boolean {
		return (
			type === ESkillShotType.AreaOfEffect ||
			type === ESkillShotType.RangedAreaOfEffect ||
			type === ESkillShotType.Circle
		)
	}
}
