import { WrapperClass } from "../../Decorators"
import { Building } from "../Base/Building"

@WrapperClass("CDOTA_BaseNPC_NeutralItemStash")
export class NeutralItemStash extends Building {
	public get RingRadius(): number {
		return 110
	}
}
