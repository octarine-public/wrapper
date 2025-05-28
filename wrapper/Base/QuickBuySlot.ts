import { QuickBuyPurchasable } from "../Enums/EQuickBuyPurchasable"
import { EPropertyType } from "../Enums/PropertyType"
import { EntityPropertiesNode } from "./EntityProperties"

export class QuickBuySlot {
	constructor(public readonly properties: EntityPropertiesNode) {}

	public get AbilityID(): number {
		return this.properties.get("m_nAbilityID", EPropertyType.INT32) ?? -1
	}
	public get TopLevelItem(): number {
		return this.properties.get("m_nTopLevelItem", EPropertyType.INT32) ?? -1
	}
	public get TopLevelItemAbilityID(): number {
		return this.properties.get("m_nTopLevelItemAbilityID", EPropertyType.INT32) ?? -1
	}
	public get PurchasableState(): QuickBuyPurchasable {
		return this.properties.get("m_ePurchasableState", EPropertyType.INT32) ?? -1
	}
	public get MarkedForBuy(): boolean {
		return this.properties.get("m_bMarkedForBuy") ?? false
	}
	public get PurchasableAccumState(): QuickBuyPurchasable {
		return this.properties.get("m_ePurchasableAccumState", EPropertyType.INT32) ?? -1
	}
}
