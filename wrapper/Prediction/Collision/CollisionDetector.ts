import { Vector3 } from "../../Base/Vector3"
import { CollisionFlag } from "../../Enums/CollisionFlag"
import { CollisionTeam } from "../../Enums/CollisionTypes"
import { EntityManager } from "../../Managers/EntityManager"
import { Creep } from "../../Objects/Base/Creep"
import { Hero } from "../../Objects/Base/Hero"
import { Rune } from "../../Objects/Base/Rune"
import { Unit } from "../../Objects/Base/Unit"
import { SkillShotGeometry } from "../Geometry/SkillShotGeometry"
import { CollisionResult } from "./CollisionResult"

export class CollisionDetector {
	public static DetectLineCollisions(
		start: Vector3,
		end: Vector3,
		radius: number,
		collisionFlags: number,
		collisionTeam: CollisionTeam,
		source: Unit,
		excludeTarget?: Unit,
		speed: number = 0,
		delay: number = 0
	): CollisionResult {
		if (collisionFlags === CollisionFlag.None) {
			return CollisionResult.None()
		}
		const hitObjects: Unit[] = []
		let firstHitPos = end
		let firstHitDistSqr = start.DistanceSqr2D(end)

		if (collisionFlags.hasMask(CollisionFlag.Heroes)) {
			this.checkUnits(
				EntityManager.GetEntitiesByClass(Hero),
				start,
				end,
				radius,
				collisionTeam,
				source,
				excludeTarget,
				hitObjects,
				speed,
				delay
			)
		}
		if (collisionFlags.hasMask(CollisionFlag.Creeps)) {
			this.checkUnits(
				EntityManager.GetEntitiesByClass(Creep),
				start,
				end,
				radius,
				collisionTeam,
				source,
				excludeTarget,
				hitObjects,
				speed,
				delay
			)
		}
		if (collisionFlags.hasMask(CollisionFlag.Runes)) {
			const runes = EntityManager.GetEntitiesByClass(Rune)
			for (let i = 0, len = runes.length; i < len; i++) {
				const rune = runes[i]
				if (!rune.IsValid || !rune.IsVisible) {
					continue
				}
				const runePos = rune.Position
				if (
					SkillShotGeometry.LineCircleIntersection(
						start,
						end,
						runePos,
						radius + 16
					)
				) {
					const distSqr = start.DistanceSqr2D(runePos)
					if (distSqr < firstHitDistSqr) {
						firstHitDistSqr = distSqr
						firstHitPos = runePos
					}
				}
			}
		}
		if (hitObjects.length > 0) {
			hitObjects.orderBy(u => start.DistanceSqr2D(u.Position))
			firstHitPos = hitObjects[0].Position
		}
		return new CollisionResult(hitObjects.length > 0, hitObjects, firstHitPos)
	}

	public static DetectCircleCollisions(
		center: Vector3,
		radius: number,
		collisionFlags: number,
		collisionTeam: CollisionTeam,
		source: Unit
	): Unit[] {
		if (collisionFlags === CollisionFlag.None) {
			return []
		}
		const result: Unit[] = []
		if (collisionFlags.hasMask(CollisionFlag.Heroes)) {
			this.checkUnitsInCircle(
				EntityManager.GetEntitiesByClass(Hero),
				center,
				radius,
				collisionTeam,
				source,
				result
			)
		}
		if (collisionFlags.hasMask(CollisionFlag.Creeps)) {
			this.checkUnitsInCircle(
				EntityManager.GetEntitiesByClass(Creep),
				center,
				radius,
				collisionTeam,
				source,
				result
			)
		}
		return result
	}

	private static checkUnits(
		units: Unit[],
		start: Vector3,
		end: Vector3,
		radius: number,
		collisionTeam: CollisionTeam,
		source: Unit,
		excludeTarget: Unit | undefined,
		out: Unit[],
		speed: number,
		delay: number
	): void {
		for (let i = 0, len = units.length; i < len; i++) {
			const unit = units[i]
			if (!unit.IsValid || !unit.IsAlive || !unit.IsVisible) {
				continue
			}
			if (unit === source || unit === excludeTarget) {
				continue
			}
			if (unit.HasNoCollision) {
				continue
			}
			if (!this.matchesTeam(unit, source, collisionTeam)) {
				continue
			}
			const unitPos = this.predictUnitPosition(unit, start, speed, delay)
			const unitRadius = unit.ProjectileCollisionSize
			if (
				SkillShotGeometry.LineCircleIntersection(
					start,
					end,
					unitPos,
					radius + unitRadius
				)
			) {
				out.push(unit)
			}
		}
	}

	private static predictUnitPosition(
		unit: Unit,
		start: Vector3,
		speed: number,
		delay: number
	): Vector3 {
		if (speed <= 0 || !unit.IsMoving) {
			return unit.Position
		}
		const dist = start.Distance2D(unit.Position)
		const timeToReach = delay + dist / speed
		return unit.GetPredictionPosition(timeToReach)
	}

	private static checkUnitsInCircle(
		units: Unit[],
		center: Vector3,
		radius: number,
		collisionTeam: CollisionTeam,
		source: Unit,
		out: Unit[]
	): void {
		for (let i = 0, len = units.length; i < len; i++) {
			const unit = units[i]
			if (!unit.IsValid || !unit.IsAlive || !unit.IsVisible) {
				continue
			}
			if (unit === source) {
				continue
			}
			if (!this.matchesTeam(unit, source, collisionTeam)) {
				continue
			}
			if (
				SkillShotGeometry.CirclesIntersect(
					center,
					radius,
					unit.Position,
					unit.HullRadius
				)
			) {
				out.push(unit)
			}
		}
	}

	private static matchesTeam(
		unit: Unit,
		source: Unit,
		collisionTeam: CollisionTeam
	): boolean {
		switch (collisionTeam) {
			case CollisionTeam.All:
				return true
			case CollisionTeam.Enemy:
				return unit.IsEnemy(source)
			case CollisionTeam.Ally:
				return !unit.IsEnemy(source)
			default:
				return true
		}
	}
}
