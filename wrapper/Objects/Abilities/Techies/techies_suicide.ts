import { Vector2 } from "../../../Base/Vector2"
import { Vector3 } from "../../../Base/Vector3"
import { WrapperClass } from "../../../Decorators"
import { EventPriority } from "../../../Enums/EventPriority"
import { EntityManager } from "../../../Managers/EntityManager"
import { EventsSDK } from "../../../Managers/EventsSDK"
import { GetPositionHeight } from "../../../Native/WASM"
import { Modifier } from "../../../Objects/Base/Modifier"
import { GameState } from "../../../Utils/GameState"
import { Ability } from "../../Base/Ability"
import { LocalPlayer } from "../../Base/Entity"
import { Unit } from "../../Base/Unit"

@WrapperClass("techies_suicide")
export class techies_suicide extends Ability implements INuke {
	public readonly StartPosition = new Vector3().Invalidate()
	public readonly TargetPosition = new Vector3().Invalidate()
	public readonly LastKnownOwnerPosition_ = new Vector3().Invalidate()
	public LastKnownOwnerPositionTick_ = 0

	public IsNuke(): this is INuke {
		return true
	}
	public GetBaseAOERadiusForLevel(level: number): number {
		return this.GetSpecialValue("radius", level)
	}
	public GetBaseDamageForLevel(level: number): number {
		return this.GetSpecialValue("damage", level)
	}
	public GetBaseActivationDelayForLevel(level: number): number {
		return this.GetSpecialValue("duration", level)
	}
	public GetRawDamage(target: Unit): number {
		const owner = this.Owner
		if (owner === undefined || this.Level === 0) {
			return 0
		}
		const multiplier = this.GetSpecialValue("hp_dmg")
		let baseDamage = super.GetRawDamage(target)
		if (multiplier !== 0) {
			baseDamage += (owner.MaxHP * multiplier) / 100
		}
		return baseDamage
	}
}

const abils = EntityManager.GetEntitiesByClass(techies_suicide)

function ModifierRemoved(buff: Modifier) {
	if (buff.Name !== "modifier_techies_suicide_leap") {
		return
	}
	if (buff.Ability instanceof techies_suicide) {
		buff.Ability.StartPosition.Invalidate()
		buff.Ability.TargetPosition.Invalidate()
		buff.Ability.LastKnownOwnerPosition_.Invalidate()
	}
}
function PostDataUpdate(dt: number) {
	if (LocalPlayer === undefined || dt === 0) {
		return
	}

	for (let i = abils.length - 1; i > -1; i--) {
		const abil = abils[i]
		if (abil.TargetPosition.IsValid) {
			continue
		}
		const owner = abil.Owner
		if (owner === undefined || !owner.IsVisible) {
			continue
		}
		const buff = owner.GetBuffByName("modifier_techies_suicide_leap")
		const duration = abil.GetSpecialValue("duration")
		if (buff === undefined || buff.Duration !== -1 || buff.ElapsedTime >= duration) {
			continue
		}
		if (abil.LastKnownOwnerPosition_.IsValid) {
			if (abil.LastKnownOwnerPositionTick_ === GameState.CurrentGameTick - 1) {
				const velocity3D = owner.Position.Subtract(abil.LastKnownOwnerPosition_)
				const velocity3DLen = velocity3D.Length
				const velocity = Vector2.FromVector3(
					velocity3D.Normalize()
				).MultiplyScalarForThis(velocity3DLen)
				const timeMoved = buff.ElapsedTime + GameState.TickInterval

				owner.Position.Subtract(
					Vector3.FromVector2(
						velocity.MultiplyScalar(timeMoved / GameState.TickInterval)
					)
				).CopyTo(abil.StartPosition)
				abil.StartPosition.z = GetPositionHeight(abil.StartPosition)

				owner.Position.Add(
					Vector3.FromVector2(
						velocity.MultiplyScalar(
							(duration - timeMoved) / GameState.TickInterval
						)
					)
				).CopyTo(abil.TargetPosition)
				abil.TargetPosition.z = GetPositionHeight(abil.TargetPosition)
			}
			abil.LastKnownOwnerPosition_.Invalidate()
		} else {
			owner.Position.CopyTo(abil.LastKnownOwnerPosition_)
			abil.LastKnownOwnerPositionTick_ = GameState.CurrentGameTick
		}
	}
}

EventsSDK.on("PostDataUpdate", dt => PostDataUpdate(dt), EventPriority.HIGH)

EventsSDK.on("ModifierRemoved", buff => ModifierRemoved(buff), EventPriority.HIGH)
