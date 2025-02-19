import { WrapperClass } from "../../Decorators"
import { EntityManager } from "../../Managers/EntityManager"
import { Building } from "../Base/Building"

@WrapperClass("CDOTA_BaseNPC_LotusPool")
export class LotusPool extends Building {}

export const LotusPools = EntityManager.GetEntitiesByClass(LotusPool)
