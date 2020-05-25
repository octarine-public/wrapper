import Building from "./Building"
import { WrapperClass, NetworkedBasicField } from "../../Decorators"

@WrapperClass("C_DOTA_BaseNPC_Watch_Tower")
export default class Outpost extends Building {
	@NetworkedBasicField("m_szOutpostName")
	public OutpostName = ""
}
