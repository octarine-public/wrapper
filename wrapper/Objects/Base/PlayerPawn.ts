import { Color } from "../../Base/Color"
import { EntityPropertiesNode } from "../../Base/EntityProperties"
import { QuickBuySlot } from "../../Base/QuickBuySlot"
import { NetworkedBasicField, WrapperClass } from "../../Decorators"
import { RenderMode } from "../../Enums/RenderMode"
import { EntityManager } from "../../Managers/EntityManager"
import { RegisterFieldHandler } from "../NativeToSDK"
import { Entity } from "./Entity"

@WrapperClass("CDOTAPlayerPawn")
export class PlayerPawn extends Entity {
	@NetworkedBasicField("m_bAutoMarkForBuy")
	public readonly AutoMarkForBuy: boolean = false
	@NetworkedBasicField("m_bBuybackProtectionEnabled")
	public readonly BuybackProtectionEnabled: boolean = false
	@NetworkedBasicField("m_vecControlledUnits")
	public readonly ControlledUnits: number[] = []
	public ItemSlots: QuickBuySlot[] = []

	public set CustomGlowColor(_: Nullable<Color>) {
		// N/A for non-networked entities
	}
	public set CustomDrawColor(_: Nullable<[Color, RenderMode]>) {
		// N/A for non-networked entities
	}
}

RegisterFieldHandler(PlayerPawn, "m_vecItemSlots", (player, newVal) => {
	player.ItemSlots = (newVal as EntityPropertiesNode[]).map(x => new QuickBuySlot(x))
})

export const PlayerPawns = EntityManager.GetEntitiesByClass(PlayerPawn)
