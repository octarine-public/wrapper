import Item from "../Base/Item"

export default class item_blade_mail extends Item {
	public static readonly ModifierName: string = "modifier_item_blade_mail_reflect"}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("item_blade_mail", item_blade_mail)
