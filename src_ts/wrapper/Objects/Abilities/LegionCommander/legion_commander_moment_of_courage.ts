import Ability from "../../Base/Ability"

export default class legion_commander_moment_of_courage extends Ability {
	public NativeEntity: Nullable<C_DOTA_Ability_Legion_Commander_MomentOfCourage>
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("legion_commander_moment_of_courage", legion_commander_moment_of_courage)
