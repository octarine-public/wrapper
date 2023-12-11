import { Color } from "../../Base/Color"
import { WrapperClass } from "../../Decorators"
import { RenderMode } from "../../Enums/RenderMode"
import { EntityManager } from "../../Managers/EntityManager"
import { Entity } from "./Entity"

@WrapperClass("CDOTAPlayerPawn")
export class PlayerPawn extends Entity {
	public set CustomGlowColor(_: Nullable<Color>) {
		// N/A for non-networked entities
	}
	public set CustomDrawColor(_: Nullable<[Color, RenderMode]>) {
		// N/A for non-networked entities
	}
}

export const PlayerPawns = EntityManager.GetEntitiesByClass(PlayerPawn)
