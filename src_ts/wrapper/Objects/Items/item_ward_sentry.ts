import Item from "../Base/Item"

export default class item_ward_sentry extends Item {
	public readonly m_pBaseEntity!: CDOTA_Item_SentryWard
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("item_ward_sentry", item_ward_sentry)
