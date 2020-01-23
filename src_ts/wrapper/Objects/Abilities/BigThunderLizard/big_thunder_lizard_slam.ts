import Ability from "../../Base/Ability"

export default class big_thunder_lizard_slam extends Ability {
	public NativeEntity: Nullable<C_DOTA_Ability_BigThunderLizard_Slam>
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("big_thunder_lizard_slam", big_thunder_lizard_slam)
