import Ability from "../../Base/Ability"

export default class broodmother_insatiable_hunger extends Ability {
	public readonly NativeEntity!: C_DOTA_Ability_Broodmother_InsatiableHunger
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("broodmother_insatiable_hunger", broodmother_insatiable_hunger)
