import { WrapperClass } from "../../Decorators"
import { EntityManager } from "../../Managers/EntityManager"
import { Entity } from "./Entity"

@WrapperClass("CDOTAPlayerPawn")
export class PlayerPawn extends Entity {}

export const PlayerPawns = EntityManager.GetEntitiesByClass(PlayerPawn)
