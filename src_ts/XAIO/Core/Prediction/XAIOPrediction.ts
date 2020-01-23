import { Hero, Unit, Creep, Collision, CollisionObject, Ability, item_blink, EntityManager } from "wrapper/Imports"
import { HasMask } from "wrapper/Utils/BitsExtensions"

import {
	XAIOGame,
	XAIOInput,
	XAIOutput,
	XAIOHitChance,
	XAIOSkillshotType,
	XAIOCollisionTypes,
} from "../bootstrap"

let GameData = new XAIOGame()

export default class XAIOPrediction {

	public GetPrediction(
		abil: Ability,
		owner: Unit,
		target: Unit,
		linePadding: boolean = false,
		skillShotType: XAIOSkillshotType = XAIOSkillshotType.Line,
		collisionTypes: XAIOCollisionTypes = XAIOCollisionTypes.AllUnits,
		AreaOfEffect: boolean = false,
		AreaOfEffectTargets: Unit[] = []
	): XAIOutput {

		return this.PredictionInit(new XAIOInput(
			target,
			owner,
			abil.CastPoint + this.ActivationDelay(abil) + (GameData.Ping / 1000),
			abil.AOERadius,
			collisionTypes,
			abil.CastRange + target.HullRadius + (!linePadding ? 0 : abil.AOERadius),
			!abil.HasBehavior(DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_NO_TARGET),
			skillShotType,
			abil.Speed,
			abil instanceof item_blink
		))
	}

	private ActivationDelay(abil: Ability) {
		return abil.GetSpecialValue("activation_delay") ?? 0
	}

	private PredictionInit(input: XAIOInput) {

		let simplePrediction = this.GetSimplePrediction(input)

		this.GetProperCastPosition(input, simplePrediction)

		if (input.SkillShotType == XAIOSkillshotType.Line && !input.AreaOfEffect && input.UseBlink) {
			let tar_pos = simplePrediction.TargetPosition
			simplePrediction.BlinkLinePosition = tar_pos.Extend(input.Caster.Position.Subtract(tar_pos), 200)
			simplePrediction.CastPosition = simplePrediction.TargetPosition
		}

		if (!this.CheckRange(input, simplePrediction))
			return simplePrediction

		this.CheckCollision(input, simplePrediction)
		return simplePrediction

	}

	private GetSimplePrediction(input: XAIOInput) {

		let predictionOutput = new XAIOutput()

		let num = input.Delay
		let caster = input.Caster
		let target = input.Target
		let position = input.Target.Position

		predictionOutput.Target = target

		if (target === caster) {
			predictionOutput.HitChance = XAIOHitChance.High
			predictionOutput.TargetPosition = position
			predictionOutput.CastPosition = position
			return predictionOutput
		}

		if (input.RequiresToTurn)
			num += caster.TurnTime(position)

		if (input.Speed > 0)
			num += caster.Distance(position) / input.Speed


		let predictedPosition = target.VelocityWaypoint(num)

		predictionOutput.TargetPosition = predictedPosition
		predictionOutput.CastPosition = predictedPosition

		if (!target.IsVisible)
			predictionOutput.HitChance = XAIOHitChance.Low
		else if (target.IsStunned || target.IsRooted)
			predictionOutput.HitChance = XAIOHitChance.Immobile
		else if (target.NetworkActivity !== GameActivity_t.ACT_DOTA_RUN && !caster.IsVisibleForEnemies)
			predictionOutput.HitChance = XAIOHitChance.High
		else
			predictionOutput.HitChance = ((num > 0.5) ? XAIOHitChance.Medium : XAIOHitChance.High)

		return predictionOutput
	}

	private GetProperCastPosition(input: XAIOInput, output: XAIOutput): void {

		if (input.SkillShotType === XAIOSkillshotType.RangedAreaOfEffect || input.SkillShotType === XAIOSkillshotType.AreaOfEffect)
			return

		if (input.SkillShotType == XAIOSkillshotType.Line && input.UseBlink)
			return

		let radius = input.Radius

		if (radius <= 0)
			return

		let position = input.Caster.Position,
			castPosition = output.CastPosition,
			num = position.Distance(castPosition),
			castRange = input.Range

		if (castRange >= num)
			return

		castPosition.Extend(input.Caster.Position.Subtract(castPosition), Math.min(num - castRange, radius))

		if (output.AoeTargetsHit.length === 0)
			return

		let num2 = Math.max(...output.AoeTargetsHit!.map(x => x.TargetPosition!.Distance2D(castPosition))) // length, for enemy aoe targetHit

		if (num2 <= radius)
			return

		num = position.Distance2D(castPosition)

		output.CastPosition = position.Extend(input.Caster.Position.Subtract(position), num + (num2 - radius))
	}

	private CheckRange(input: XAIOInput, output: XAIOutput): boolean {
		if (input.Radius >= Number.MAX_SAFE_INTEGER || input.Range >= Number.MAX_SAFE_INTEGER) {
			return true
		}
		if (input.SkillShotType == XAIOSkillshotType.AreaOfEffect) {
			if (output.TargetPosition!.Distance2D(output.CastPosition) > input.Radius) {
				output.HitChance = XAIOHitChance.Impossible
				return false
			}
			return true
		} else if (input.UseBlink && input.SkillShotType == XAIOSkillshotType.Line) {
			if (input.Caster.Distance(output.CastPosition) > input.Range + input.Range) {
				output.HitChance = XAIOHitChance.Impossible
				return false
			}
			return true
		}
		else {
			if (input.Caster.Distance(output.CastPosition) > input.Range && (input.SkillShotType == XAIOSkillshotType.RangedAreaOfEffect
				|| input.Caster.Distance(output.TargetPosition!) > input.Range)) {
				output.HitChance = XAIOHitChance.Impossible
				return false
			}
			return true
		}
	}

	private CheckCollision(input: XAIOInput, output: XAIOutput): void {
		if (input.CollisionTypes === XAIOCollisionTypes.None)
			return

		let list: Unit[] = []
		let list2: CollisionObject[] = []

		let caster = input.Caster
		let scanRange = caster.Distance(output.CastPosition)

		let source: Unit[] = EntityManager.GetEntitiesByClasses<Unit>([Hero, Creep]).filter(x =>
			x !== caster
			&& x !== input.Target
			&& x.IsAlive
			&& x.IsVisible
			&& x.Distance2D(caster) < scanRange
		)

		if (HasMask(input.CollisionTypes, XAIOCollisionTypes.AllyCreeps))
			source.map(x => x instanceof Creep && !x.IsEnemy(caster) && list.push(x))

		if (HasMask(input.CollisionTypes, XAIOCollisionTypes.EnemyCreeps))
			source.map(x => x instanceof Creep && x.IsEnemy(caster) && list.push(x))

		if (HasMask(input.CollisionTypes, XAIOCollisionTypes.AllyHeroes))
			source.map(x => x instanceof Hero && !x.IsEnemy(caster) && list.push(x))

		if (HasMask(input.CollisionTypes, XAIOCollisionTypes.EnemyHeroes))
			source.map(x => x instanceof Hero && x.IsEnemy(caster) && list.push(x))


		list.forEach(unit => {
			let input2 = new XAIOInput(
				unit,
				input.Caster,
				input.Delay,
				input.Radius,
				input.CollisionTypes,
				input.Range,
				input.RequiresToTurn,
				input.SkillShotType,
				input.Speed,
				input.UseBlink,
				input.AreaOfEffect,
				input.AreaOfEffectTargets
			)
			list2.push(new CollisionObject(unit, this.GetSimplePrediction(input2).TargetPosition?.toVector2(), unit.HullRadius))
		})
		if (Collision.GetCollision(caster.Position.toVector2(), output.CastPosition.toVector2(), input.Radius, list2).Collides)
			output.HitChance = XAIOHitChance.Impossible
	}
}