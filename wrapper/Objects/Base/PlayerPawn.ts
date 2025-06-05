import { Color } from "../../Base/Color"
import { NetworkedBasicField, WrapperClass } from "../../Decorators"
import { RenderMode } from "../../Enums/RenderMode"
import { EntityManager } from "../../Managers/EntityManager"
import { Entity } from "./Entity"

@WrapperClass("CDOTAPlayerPawn")
export class PlayerPawn extends Entity {
	@NetworkedBasicField("m_bAutoMarkForBuy")
	public readonly AutoMarkForBuy: boolean = false
	@NetworkedBasicField("m_bBuybackProtectionEnabled")
	public readonly BuybackProtectionEnabled: boolean = false
	@NetworkedBasicField("m_vecControlledUnits")
	public readonly ControlledUnits: number[] = []

	public set CustomGlowColor(_: Nullable<Color>) {
		// N/A for non-networked entities
	}
	public set CustomDrawColor(_: Nullable<[Color, RenderMode]>) {
		// N/A for non-networked entities
	}
}

export const PlayerPawns = EntityManager.GetEntitiesByClass(PlayerPawn)
