import { WrapperClass } from "../../Decorators"
import Unit from "./Unit"

@WrapperClass("C_DOTA_NPC_TechiesMines")
export default class TechiesMines extends Unit {
	public get ShouldUnifyOrders(): boolean {
		return false
	}
}
