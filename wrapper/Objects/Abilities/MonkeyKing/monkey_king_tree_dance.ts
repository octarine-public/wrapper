import { Vector3 } from "../../../Base/Vector3"
import { WrapperClass } from "../../../Decorators"
import { GameActivity } from "../../../Enums/GameActivity"
import { EntityManager } from "../../../Managers/EntityManager"
import { EventsSDK } from "../../../Managers/EventsSDK"
import { GetPositionHeight } from "../../../Native/WASM"
import { GameState } from "../../../Utils/GameState"
import { Ability } from "../../Base/Ability"
import { TempTree, TempTrees } from "../../Base/TempTree"
import { Tree, Trees } from "../../Base/Tree"
import { Unit } from "../../Base/Unit"

@WrapperClass("monkey_king_tree_dance")
export class monkey_king_tree_dance extends Ability {
	public readonly StartPosition = new Vector3().Invalidate()
	public TargetTree: Nullable<Tree | TempTree>
	public PredictedPositionsPerTree: [Vector3, Tree | TempTree, number][] = [] // current position, tree, finished jumping at time
	public StartedJumpingTime = 0
	public EndedJumpingTime = 0
	public IsJumping = false
	public IsJumpingToTree = false

	public get SpringSpeed(): number {
		return this.GetSpecialValue("spring_leap_speed")
	}
	public GetBaseCastRangeForLevel(level: number): number {
		return this.GetSpecialValue("ground_jump_distance", level)
	}
	public GetBaseSpeedForLevel(level: number): number {
		return this.GetSpecialValue("leap_speed", level)
	}
}

function FilterValidTrees(
	ar: (Tree | TempTree)[],
	pos: Vector3,
	castRange: number
): [Vector3, Tree | TempTree, number][] {
	return ar
		.filter(tree => tree.IsAlive && tree.IsInRange(pos, castRange))
		.map(tree => [pos.Clone(), tree, 0])
}

EventsSDK.on("ParticleUpdated", par => {
	if (
		par.PathNoEcon !==
		"particles/units/heroes/hero_monkey_king/monkey_king_jump_trail.vpcf"
	) {
		return
	}

	const cpEnt = par.ControlPointsEnt.get(1)
	if (cpEnt === undefined) {
		return
	}

	const ent = cpEnt[0],
		pos = par.ControlPointsFallback.get(1)
	if (pos === undefined || !(ent instanceof Unit)) {
		return
	}
	const abil = ent.GetAbilityByClass(monkey_king_tree_dance)
	if (abil === undefined) {
		return
	}
	abil.StartedJumpingTime = GameState.RawGameTime
	pos.CopyTo(abil.StartPosition)
	abil.IsJumping = true
	const castAnimation = abil.AbilityData.CastAnimation
	abil.IsJumpingToTree =
		ent.LastActivity === castAnimation ||
		ent.NetworkActivity === castAnimation ||
		ent.LastGestureActivity === GameActivity.ACT_DOTA_MK_TREE_SOAR
	abil.TargetTree = undefined
	const castRange = abil.CastRange
	abil.PredictedPositionsPerTree = [
		...FilterValidTrees(Trees, pos, castRange),
		...FilterValidTrees(TempTrees, pos, castRange)
	]
})

EventsSDK.on("ParticleDestroyed", par => {
	if (
		par.PathNoEcon !==
		"particles/units/heroes/hero_monkey_king/monkey_king_jump_trail.vpcf"
	) {
		return
	}
	const cpEnt = par.ControlPointsEnt.get(1)
	if (cpEnt === undefined) {
		return
	}
	const ent = cpEnt[0]
	if (!(ent instanceof Unit)) {
		return
	}
	const abil = ent.GetAbilityByClass(monkey_king_tree_dance)
	if (abil === undefined) {
		return
	}
	abil.IsJumping = false
	abil.EndedJumpingTime = GameState.RawGameTime
})

const abils = EntityManager.GetEntitiesByClass(monkey_king_tree_dance)
EventsSDK.on("PostDataUpdate", dt => {
	for (let i = abils.length - 1; i > -1; i--) {
		const abil = abils[i]
		const owner = abil.Owner
		if (owner === undefined || !owner.IsAlive) {
			abil.TargetTree = undefined
			continue
		}

		if (
			owner.IsVisible &&
			owner.HasBuffByName("modifier_monkey_king_arc_to_ground")
		) {
			abil.TargetTree = undefined
			abil.IsJumpingToTree = false
			abil.StartPosition.Invalidate()
			abil.PredictedPositionsPerTree.clear()
			continue
		}
		const isJumpingTree =
			abil.IsJumpingToTree ||
			owner.LastGestureActivity === GameActivity.ACT_DOTA_MK_TREE_SOAR
		if (abil.TargetTree !== undefined || !isJumpingTree) {
			continue
		}
		const startPos = abil.StartPosition
		if (!startPos.IsValid) {
			continue
		}
		const finishedJumping =
				!abil.IsJumping &&
				Math.abs(GameState.RawGameTime - abil.EndedJumpingTime) <
					GameState.TickInterval / 10,
			finishedJumpingTrees: (Tree | TempTree)[] = []
		const leapSpeedBase = abil.GetSpecialValue("leap_speed"),
			groundJumpDistance = abil.GetSpecialValue("ground_jump_distance")
		for (let j = abil.PredictedPositionsPerTree.length - 1; j > -1; j--) {
			const predictedAr = abil.PredictedPositionsPerTree[j]
			const [currentPos, tree, timeFinished] = predictedAr
			if (timeFinished !== 0) {
				continue
			}
			const targetPos = tree.Position
			{
				// update horizontal motion
				const leapSpeed =
					leapSpeedBase +
					(abil.StartPosition.Distance2D(targetPos) * 400) / groundJumpDistance
				const distanceLeft = currentPos.Distance2D(targetPos)
				const velocity = currentPos
					.GetDirection2DTo(targetPos)
					.MultiplyScalarForThis(leapSpeed * dt)
				currentPos.AddForThis(velocity)
				if (
					velocity.Length + owner.HullRadius + /* valve(tm) magic */ 5 >=
					distanceLeft
				) {
					currentPos.z = GetPositionHeight(currentPos)
					predictedAr[2] = GameState.RawGameTime
					if (finishedJumping) {
						finishedJumpingTrees.push(tree)
					}
				}
			}
			if (predictedAr[2] === 0) {
				// update vertical motion
				const mul =
					1 - targetPos.Distance2D(currentPos) / targetPos.Distance2D(startPos)
				currentPos.z =
					startPos.z +
					(targetPos.z - startPos.z) * mul +
					Math.sin(mul * Math.PI) *
						Math.min(200, targetPos.Distance2D(startPos) / 3)
				const groundHeight = GetPositionHeight(currentPos)
				if (currentPos.z < groundHeight) {
					currentPos.z = groundHeight
				}
			}
		}
		if (finishedJumpingTrees.length === 1) {
			abil.TargetTree = finishedJumpingTrees[0]
		}

		if (!abil.IsJumping) {
			continue
		}

		// further code relies on owner visibility, so we should skip it if owner isn't visible
		if (!owner.IsVisible) {
			continue
		}
		const heroAngle = owner.NetworkedRotationRad
		const bestPredictedPos = abil.PredictedPositionsPerTree.filter(ar => {
			if (ar[2] !== 0) {
				return false
			}
			const diff =
				((heroAngle -
					abil.StartPosition.GetDirectionTo(ar[1].Position).Angle +
					Math.PI) %
					(Math.PI * 2)) -
				Math.PI
			const maxDiff = 0.05 // 0.05rad = 2.8deg
			return Math.abs(diff < -Math.PI ? diff + 2 * Math.PI : diff) < maxDiff
		}).orderByFirst(ar => owner.NetworkedPosition.Distance(ar[0]))

		if (bestPredictedPos !== undefined) {
			abil.TargetTree = bestPredictedPos[1]
		}
	}
})
