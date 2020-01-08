import Item from "../Base/Item"

export default class item_helm_of_the_dominator extends Item {
	public readonly m_pBaseEntity!: C_DOTA_Item_HelmOfTheDominator
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("item_helm_of_the_dominator", item_helm_of_the_dominator)
