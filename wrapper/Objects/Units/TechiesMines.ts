import { Vector2 } from "../../Base/Vector2"
import { Vector3 } from "../../Base/Vector3"
import { WrapperClass } from "../../Decorators"
import { EventPriority } from "../../Enums/EventPriority"
import { EntityManager } from "../../Managers/EntityManager"
import { EventsSDK } from "../../Managers/EventsSDK"
import { GetPositionHeight } from "../../Native/WASM"
import { GameState } from "../../Utils/GameState"
import { LocalPlayer } from "../Base/Entity"
import { Modifier } from "../Base/Modifier"
import { Unit } from "../Base/Unit"

@WrapperClass("C_DOTA_NPC_TechiesMines")
export class TechiesMines extends Unit {
	public readonly StartPosition = new Vector3().Invalidate()
	public readonly TargetPosition = new Vector3().Invalidate()
	public readonly LastKnownPosition_ = new Vector3().Invalidate()
	public readonly LastTargetPosition = new Vector3().Invalidate()
	public LastKnownOwnerPositionTick_ = 0

	public get ShouldUnifyOrders(): boolean {
		return false
	}
	public get Position(): Vector3 {
		return this.IsVisible || !this.LastTargetPosition.IsValid
			? super.RealPosition
			: this.LastTargetPosition
	}
}

const modName = "modifier_techies_sticky_bomb_throw"
const mines = EntityManager.GetEntitiesByClass(TechiesMines)

function ModifierRemoved(buff: Modifier) {
	if (buff.Name !== modName) {
		return
	}
	const owner = buff.Parent
	if (owner === undefined) {
		return
	}
	if (owner instanceof TechiesMines) {
		owner.StartPosition.Invalidate()
		owner.TargetPosition.Invalidate()
		owner.LastKnownPosition_.Invalidate()
	}
}
function PostDataUpdate(dt: number) {
	if (LocalPlayer === undefined || dt === 0) {
		return
	}
	for (let i = mines.length - 1; i > -1; i--) {
		const mine = mines[i]
		if (mine.TargetPosition.IsValid || mine.Owner === undefined) {
			continue
		}
		const buff = mine.GetBuffByName(modName)
		if (buff === undefined || buff.Ability === undefined) {
			continue
		}
		let duration = buff.Ability.GetSpecialValue("duration")
		if (mine.Owner.IsVisible) {
			duration /= 2
		}
		if (buff === undefined || buff.Duration !== -1 || buff.ElapsedTime >= duration) {
			continue
		}
		const position = mine.Position
		if (!mine.LastKnownPosition_.IsValid) {
			position.CopyTo(mine.LastKnownPosition_)
			mine.LastKnownOwnerPositionTick_ = GameState.CurrentGameTick
			continue
		}
		if (mine.LastKnownOwnerPositionTick_ === GameState.CurrentGameTick - 1) {
			const velocity3D = position.Subtract(mine.LastKnownPosition_)
			const velocity3DLen = velocity3D.Length
			const velocity = Vector2.FromVector3(
				velocity3D.Normalize()
			).MultiplyScalarForThis(velocity3DLen)
			const timeMoved = buff.ElapsedTime + GameState.TickInterval

			position
				.Subtract(
					Vector3.FromVector2(
						velocity.MultiplyScalar(timeMoved / GameState.TickInterval)
					)
				)
				.CopyTo(mine.StartPosition)
			mine.StartPosition.z = GetPositionHeight(mine.StartPosition)

			position
				.Add(
					Vector3.FromVector2(
						velocity.MultiplyScalar(
							(duration - timeMoved) / GameState.TickInterval
						)
					)
				)
				.CopyTo(mine.TargetPosition)
			mine.TargetPosition.CopyTo(mine.LastTargetPosition)
			mine.TargetPosition.z = GetPositionHeight(mine.TargetPosition)
		}
		mine.LastKnownPosition_.Invalidate()
	}
}

EventsSDK.on("PostDataUpdate", dt => PostDataUpdate(dt), EventPriority.HIGH)

EventsSDK.on("ModifierRemoved", buff => ModifierRemoved(buff), EventPriority.HIGH)
