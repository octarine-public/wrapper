import Ability from "../../Base/Ability"

export default class broodmother_spawn_spiderlings extends Ability {

	public get Speed(): number {
		return this.GetSpecialValue("projectile_speed")
	}
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("broodmother_spawn_spiderlings", broodmother_spawn_spiderlings)
