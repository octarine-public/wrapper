// import { Vector2 } from "../../Base/Vector2"
// import { CollisionTeam, CollisionTypes } from "../../Enums/CollisionTypes"
// import { HitChance } from "../../Enums/HitChance"
// import { SkillShotType } from "../../Enums/SkillShotType"
// import { Creep } from "../../Objects/Base/Creep"
// import { Entity } from "../../Objects/Base/Entity"
// import { Hero } from "../../Objects/Base/Hero"
// import { Unit, Units } from "../../Objects/Base/Unit"
// import { GetCollision } from "./Collision/Collision"
// import { CollisionObject } from "./Collision/CollisionObject"
// import { IPrediction } from "./IPrediction"
// import { PredictionInput } from "./Objects/PredictionInput"
// import { PredictionOutput } from "./Objects/PredictionOutput"

// implements IPrediction

export class Prediction {
	// public GetPrediction(_input: PredictionInput) {
	// 	/** @todo */
	// 	const output = new PredictionOutput()
	// 	return output
	// }
	// public GetSimplePrediction(input: PredictionInput): PredictionOutput {
	// 	const output = new PredictionOutput()
	// 	const caster = input.Caster
	// 	const target = (output.Target = input.Target)
	// 	const casterPosition = caster.Position
	// 	const targetPosition = target.Position
	// 	const targetIsVisible = target.IsVisible
	// 	let totalDelay = input.Delay
	// 	if (target === caster) {
	// 		output.HitChance = HitChance.High
	// 		output.CastPosition.CopyFrom(targetPosition)
	// 		output.TargetPosition.CopyFrom(targetPosition)
	// 		return output
	// 	}
	// 	if (input.RequiresToTurn && !target.IsCharge) {
	// 		/** TODO transfer to prediction projectile */
	// 		totalDelay += caster.GetTurnTime(targetPosition)
	// 	}
	// 	if (input.Speed > 0) {
	// 		// const extraRadius = !input.ExtraRangeFromCaster ? input.Radius * 4 : input.ExtraRangeFromCaster
	// 		const extraPos = casterPosition.Extend2D(targetPosition, 0)
	// 		totalDelay += extraPos.Distance2D(targetPosition) / input.Speed
	// 	}
	// 	const position = this.getPosition(target, totalDelay)
	// 	output.CastPosition.CopyFrom(position)
	// 	output.TargetPosition.CopyFrom(position)
	// 	if (!targetIsVisible) {
	// 		output.HitChance = HitChance.Low
	// 		return output
	// 	}
	// 	if (target.IsStunned || target.IsRooted || target.IsHexed) {
	// 		output.HitChance = HitChance.Immobile
	// 		return output
	// 	}
	// 	if (!target.IsMoving && !caster.IsVisibleForEnemies()) {
	// 		output.HitChance = HitChance.High
	// 		return output
	// 	}
	// 	output.HitChance = totalDelay > 0.5 ? HitChance.Medium : HitChance.High
	// 	return output
	// }
	// private getAreaOfEffect(_input: PredictionInput, _output: PredictionOutput) {
	// 	/** @todo */
	// }
	// private getPosition(
	// 	target: Entity,
	// 	totalDelay: number,
	// 	useUntilWall = true,
	// 	forceMovement = false
	// ) {
	// 	if (!(target instanceof Unit)) {
	// 		return target.Position
	// 	}
	// 	if (target.TPEndPosition.IsValid) {
	// 		return target.TPEndPosition
	// 	}
	// 	if (target.IsVisible) {
	// 		return target.GetPredictionPosition(totalDelay, useUntilWall, forceMovement)
	// 	}
	// 	return target.Position
	// }
	// private checkRange(input: PredictionInput, output: PredictionOutput) {
	// 	if (input.Radius >= 9999999 || input.Range >= 9999999) {
	// 		return true
	// 	}
	// 	if (input.SkillShotType === SkillShotType.AreaOfEffect) {
	// 		if (output.TargetPosition.Distance2D(output.CastPosition) > input.Radius) {
	// 			output.HitChance = HitChance.Impossible
	// 			return false
	// 		}
	// 		return true
	// 	}
	// 	const extend2D = input.Caster.Position.Extend2D(
	// 		output.CastPosition,
	// 		input.ExtraRangeFromCaster
	// 	)
	// 	if (input.UseBlink && input.SkillShotType === SkillShotType.Line) {
	// 		if (
	// 			extend2D.Distance2D(output.CastPosition) >
	// 			input.CastRange + input.Range
	// 		) {
	// 			output.HitChance = HitChance.Impossible
	// 			return false
	// 		}
	// 		return true
	// 	}
	// 	if (
	// 		extend2D.Distance2D(output.CastPosition) > input.CastRange &&
	// 		(input.SkillShotType === SkillShotType.RangedAreaOfEffect ||
	// 			extend2D.Distance2D(output.TargetPosition) > input.Range)
	// 	) {
	// 		output.HitChance = HitChance.Impossible
	// 		return false
	// 	}
	// 	return true
	// }
	// private checkCollision(input: PredictionInput, output: PredictionOutput) {
	// 	if (input.CollisionTypes === CollisionTypes.None) {
	// 		return
	// 	}
	// 	const caster = input.Caster
	// 	const target = output.Target
	// 	const movingObjects: Unit[] = []
	// 	const collisionObjects: CollisionObject[] = []
	// 	const distance2D = caster.Distance2D(output.CastPosition)
	// 	const allUnits = Units.filter(
	// 		x =>
	// 			(x.IsCreep || x.IsHero) &&
	// 			x.IsAlive &&
	// 			x.IsVisible &&
	// 			x !== caster &&
	// 			x !== target &&
	// 			x.Distance2D(caster) < distance2D
	// 	)
	// 	if (input.CollisionTypes.hasMask(CollisionTypes.Creeps)) {
	// 		if (input.CollisionTeam.hasMask(CollisionTeam.Enemy)) {
	// 			movingObjects.push(...this.filterUnits(allUnits, Creep, true))
	// 		}
	// 		if (input.CollisionTeam.hasMask(CollisionTeam.Ally)) {
	// 			movingObjects.push(...this.filterUnits(allUnits, Creep, false))
	// 		}
	// 	}
	// 	if (input.CollisionTypes.hasMask(CollisionTypes.Heroes)) {
	// 		if (input.CollisionTeam.hasMask(CollisionTeam.Enemy)) {
	// 			movingObjects.push(...this.filterUnits(allUnits, Hero, true))
	// 		}
	// 		if (input.CollisionTeam.hasMask(CollisionTeam.Ally)) {
	// 			movingObjects.push(...this.filterUnits(allUnits, Hero, false))
	// 		}
	// 	}
	// 	for (let index = 0, end = movingObjects.length; index < end; index++) {
	// 		const unit = movingObjects[index]
	// 		const objInput = new PredictionInput()
	// 		objInput.Target = unit
	// 		objInput.Delay = input.Delay
	// 		objInput.Speed = input.Speed
	// 		objInput.Caster = input.Caster
	// 		objInput.Radius = input.Radius
	// 		objInput.CastRange = input.CastRange
	// 		objInput.RequiresToTurn = input.RequiresToTurn
	// 		const predictedPos = this.GetSimplePrediction(objInput)
	// 		const v2Position = Vector2.FromVector3(predictedPos.TargetPosition)
	// 		collisionObjects.push(
	// 			new CollisionObject(unit, v2Position, unit.HullRadius + 10)
	// 		)
	// 	}
	// 	const collisionResult = GetCollision(
	// 		Vector2.FromVector3(
	// 			caster.Position.Extend2D(output.CastPosition, input.ExtraRangeFromCaster)
	// 		),
	// 		Vector2.FromVector3(output.CastPosition),
	// 		input.Radius,
	// 		collisionObjects
	// 	)
	// 	if (collisionResult.Collides) {
	// 		output.HitChance = HitChance.Impossible
	// 	}
	// }
	// private getProperCastPosition(input: PredictionInput, output: PredictionOutput) {
	// 	if (
	// 		input.SkillShotType === SkillShotType.RangedAreaOfEffect ||
	// 		input.SkillShotType === SkillShotType.AreaOfEffect
	// 	) {
	// 		return
	// 	}
	// 	if (input.SkillShotType === SkillShotType.Line && input.UseBlink) {
	// 		return
	// 	}
	// 	const radius = input.Radius
	// 	if (!(radius > 0)) {
	// 		return
	// 	}
	// 	let castPosition = output.CastPosition
	// 	const caster = input.Caster
	// 	const range = input.CastRange
	// 	const casterPosition = caster.Position.Extend2D(
	// 		castPosition,
	// 		input.ExtraRangeFromCaster
	// 	)
	// 	let distance = casterPosition.Distance2D(castPosition)
	// 	if (range >= distance) {
	// 		return
	// 	}
	// 	castPosition = castPosition.Extend2D(
	// 		casterPosition,
	// 		Math.min(distance - range, radius)
	// 	)
	// 	if (output.AoeTargetsHit.length > 1) {
	// 		const maxDistance = Math.max(
	// 			...output.AoeTargetsHit.map(x =>
	// 				x.TargetPosition.Distance2D(castPosition)
	// 			)
	// 		)
	// 		if (maxDistance > radius) {
	// 			distance = casterPosition.Distance2D(castPosition)
	// 			castPosition = casterPosition.Extend2D(
	// 				castPosition,
	// 				distance + (maxDistance - radius)
	// 			)
	// 		}
	// 	}
	// 	output.CastPosition.CopyFrom(castPosition)
	// }
	// private filterUnits(
	// 	allUnits: Unit[],
	// 	constructor: Constructor<Unit>,
	// 	isEnemy: boolean
	// ) {
	// 	const units: Unit[] = []
	// 	for (let index = allUnits.length - 1; index > -1; index--) {
	// 		const unit = allUnits[index]
	// 		if (unit instanceof constructor && (unit.IsEnemy() || !isEnemy)) {
	// 			units.push(unit)
	// 		}
	// 	}
	// 	return units
	// }
}
