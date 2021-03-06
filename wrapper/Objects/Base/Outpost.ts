import { NetworkedBasicField, WrapperClass } from "../../Decorators"
import Building from "./Building"

@WrapperClass("CDOTA_BaseNPC_Watch_Tower")
export default class Outpost extends Building {
	@NetworkedBasicField("m_szOutpostName")
	public OutpostName = ""
}
