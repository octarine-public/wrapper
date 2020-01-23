import Ability from "../../Base/Ability"

export default class courier_go_to_enemy_secretshop extends Ability {
	public readonly NativeEntity!: C_DOTA_Ability_Courier_GoToEnemySecretShop
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("courier_go_to_enemy_secretshop", courier_go_to_enemy_secretshop)
