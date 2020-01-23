import Ability from "../../Base/Ability"

export default class legion_commander_press_the_attack extends Ability {
	public NativeEntity: Nullable<C_DOTA_Ability_Legion_Commander_PressTheAttack>
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("legion_commander_press_the_attack", legion_commander_press_the_attack)
