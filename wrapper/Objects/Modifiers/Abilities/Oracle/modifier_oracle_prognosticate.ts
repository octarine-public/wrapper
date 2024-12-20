import { WrapperClassModifier } from "../../../../Decorators"
import { DOTA_RUNES } from "../../../../Enums/DOTA_RUNES"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_oracle_prognosticate extends Modifier {
	public get CurrentLocation() {
		return this.NetworkArmor
	}
	public get CurrentRuneType(): DOTA_RUNES {
		return this.NetworkDamage
	}
	public get NextLocation() {
		return this.NetworkMovementSpeed
	}
	public get NextSpawnTime() {
		return this.NetworkFadeTime
	}
}
