import { WrapperClass } from "../../Decorators"
import { Building } from "./Building"

@WrapperClass("CDOTA_BaseNPC_NeutralItemStash")
export class NeutralItemStash extends Building {
	public get RingRadius(): number {
		return 110
	}
}
