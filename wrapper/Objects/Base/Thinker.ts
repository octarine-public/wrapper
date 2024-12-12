import { WrapperClass } from "../../Decorators"
import { EntityManager } from "../../Managers/EntityManager"
import { Unit } from "./Unit"

@WrapperClass("npc_dota_thinker")
export class Thinker extends Unit {}

export const Thinkers = EntityManager.GetEntitiesByClass(Thinker)
