import { WrapperClass } from "../../Decorators"
import EntityManager from "../../Managers/EntityManager"
import Building from "./Building"

@WrapperClass("CDOTA_Unit_Fountain")
export default class Fountain extends Building {
	public get RingRadius(): number {
		return 300
	}
	public get IsGloballyTargetable(): boolean {
		return true
	}
}
export const Fountains = EntityManager.GetEntitiesByClass(Fountain)
