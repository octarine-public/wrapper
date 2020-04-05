import Ability from "../../Base/Ability"

export default class crystal_maiden_freezing_field extends Ability {

	public ExplosionRadius(): number {
		return this.GetSpecialValue("explosion_radius")
	}
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("crystal_maiden_freezing_field", crystal_maiden_freezing_field)
