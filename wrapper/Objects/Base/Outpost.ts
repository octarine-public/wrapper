import { NetworkedBasicField, WrapperClass } from "../../Decorators"
import { Building } from "./Building"

@WrapperClass("CDOTA_BaseNPC_Watch_Tower")
export class Outpost extends Building {
	@NetworkedBasicField("m_szOutpostName")
	public OutpostName = ""

	public get RingRadius(): number {
		return 150
	}
}
