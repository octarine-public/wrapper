import Item from "../Base/Item"

export default class item_assault extends Item {
	public static readonly AuraModifierName: string = "modifier_item_assault_negative_armor"}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("item_assault", item_assault)
