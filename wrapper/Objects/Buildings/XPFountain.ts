import { WrapperClass } from "../../Decorators"
import { EntityManager } from "../../Managers/EntityManager"
import { Building } from "../Base/Building"

@WrapperClass("CDOTA_BaseNPC_XP_Fountain")
export class XPFountain extends Building {}

export const XPFountains = EntityManager.GetEntitiesByClass(XPFountain)
