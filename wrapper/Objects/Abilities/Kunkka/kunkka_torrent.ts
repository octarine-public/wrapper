import { Vector3 } from "../../../Base/Vector3"
import { WrapperClass } from "../../../Decorators"
import { Ability } from "../../Base/Ability"
import { Unit } from "../../Base/Unit"

@WrapperClass("kunkka_torrent")
export class kunkka_torrent extends Ability {
	public GetBaseAOERadiusForLevel(level: number): number {
		return this.GetSpecialValue("radius", level)
	}
	public GetBaseActivationDelayForLevel(level: number): number {
		return this.GetSpecialValue("delay", level)
	}
	public GetBaseDamageForLevel(level: number): number {
		return this.GetSpecialValue("torrent_damage", level)
	}
	public GetCastDelay(
		_unit?: Unit | Vector3,
		_movement: boolean = false,
		_directionalMovement: boolean = false,
		_currentTurnRate: boolean = true
	): number {
		return this.CastDelay
	}
}
