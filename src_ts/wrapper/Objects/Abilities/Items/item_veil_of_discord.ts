import Item from "../../Base/Item"

export default class item_veil_of_discord extends Item {

	public readonly m_pBaseEntity!: C_DOTA_Item_Veil_Of_Discord

	public get AOERadius(): number {
		return this.GetSpecialValue("debuff_radius")
	}
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("item_veil_of_discord", item_veil_of_discord)
