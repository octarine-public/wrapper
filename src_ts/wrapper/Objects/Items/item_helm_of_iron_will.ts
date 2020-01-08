import Item from "../Base/Item"

export default class item_helm_of_iron_will extends Item {
	public readonly m_pBaseEntity!: C_DOTA_Item_HelmOfIronWill
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("item_helm_of_iron_will", item_helm_of_iron_will)
