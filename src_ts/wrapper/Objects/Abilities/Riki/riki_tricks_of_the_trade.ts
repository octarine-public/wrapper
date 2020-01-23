import Ability from "../../Base/Ability"

export default class riki_tricks_of_the_trade extends Ability {
	public NativeEntity: Nullable<C_DOTA_Ability_Riki_TricksOfTheTrade>
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("riki_tricks_of_the_trade", riki_tricks_of_the_trade)
