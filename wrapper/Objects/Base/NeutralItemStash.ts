import { WrapperClass } from "../../Decorators"
import Building from "./Building"

@WrapperClass("CDOTA_BaseNPC_NeutralItemStash")
export default class NeutralItemStash extends Building {
	public get RingRadius(): number {
		return 150
	}
}
