import Ability from "../../Base/Ability"

export default class tinker_march_of_the_machines extends Ability {
	public NativeEntity: Nullable<C_DOTA_Ability_Tinker_MarchOfTheMachines>
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("tinker_march_of_the_machines", tinker_march_of_the_machines)
