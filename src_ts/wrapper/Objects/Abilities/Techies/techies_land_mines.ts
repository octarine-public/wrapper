import Ability from "../../Base/Ability"

export default class techies_land_mines extends Ability {
	public NativeEntity: Nullable<CDOTA_Ability_Techies_LandMines>
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("techies_land_mines", techies_land_mines)
