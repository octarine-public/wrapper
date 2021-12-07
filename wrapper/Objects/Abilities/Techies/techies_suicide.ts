import Vector2 from "../../../Base/Vector2"
import Vector3 from "../../../Base/Vector3"
import { WrapperClass } from "../../../Decorators"
import EntityManager from "../../../Managers/EntityManager"
import EventsSDK from "../../../Managers/EventsSDK"
import { GetPositionHeight } from "../../../Native/WASM"
import GameState from "../../../Utils/GameState"
import Ability from "../../Base/Ability"
import { LocalPlayer } from "../../Base/Entity"

@WrapperClass("techies_suicide")
export default class techies_suicide extends Ability {
	public readonly StartPosition = new Vector3().Invalidate()
	public readonly TargetPosition = new Vector3().Invalidate()
	public readonly LastKnownOwnerPosition_ = new Vector3().Invalidate()
	public LastKnownOwnerPositionTime_ = 0
}

const abils = EntityManager.GetEntitiesByClass(techies_suicide)
EventsSDK.on("PostDataUpdate", () => {
	if (LocalPlayer === undefined || LocalPlayer.Hero === undefined)
		return

	for (const abil of abils) {
		if (abil.TargetPosition.IsValid)
			continue

		const owner = abil.Owner
		if (owner === undefined)
			continue

		const buff = owner.GetBuffByName("modifier_techies_suicide_leap")
		const buff_end_time = 0.72
		if (buff === undefined || buff.Duration !== -1 || buff.ElapsedTime > buff_end_time)
			continue
		if (abil.LastKnownOwnerPosition_.IsValid) {
			if (abil.LastKnownOwnerPositionTime_ > GameState.RawGameTime - 0.04) {
				const velocity_3d = owner.Position.Subtract(abil.LastKnownOwnerPosition_)
				const velocity = Vector2.FromVector3(velocity_3d.Clone().Normalize()).MultiplyScalarForThis(velocity_3d.Length)
				const time_moved = buff.ElapsedTime - (1 / 30)

				owner.Position.Subtract(Vector3.FromVector2(velocity.MultiplyScalar(time_moved * 30))).CopyTo(abil.StartPosition)
				abil.StartPosition.z = GetPositionHeight(abil.StartPosition)

				owner.Position.Add(Vector3.FromVector2(velocity.MultiplyScalar((buff_end_time - time_moved) * 30 + 1))).CopyTo(abil.TargetPosition)
				abil.TargetPosition.z = GetPositionHeight(abil.TargetPosition)
			}
			abil.LastKnownOwnerPosition_.Invalidate()
		} else {
			owner.Position.CopyTo(abil.LastKnownOwnerPosition_)
			abil.LastKnownOwnerPositionTime_ = GameState.RawGameTime
		}
	}
})

EventsSDK.on("ModifierRemoved", buff => {
	if (buff.Name !== "modifier_techies_suicide_leap")
		return

	const parent = buff.Parent
	if (parent === undefined)
		return

	const abil = parent.GetAbilityByClass(techies_suicide)
	if (abil !== undefined) {
		abil.StartPosition.Invalidate()
		abil.TargetPosition.Invalidate()
		abil.LastKnownOwnerPosition_.Invalidate()
	}
})
