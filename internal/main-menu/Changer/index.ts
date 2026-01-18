import { EventsSDK, Menu } from "../../../wrapper/Imports"
import { InternalChanger } from "./changer"

new (class CInternalChanger {
	private readonly main = Menu.AddEntry("Changer")
	private readonly cChanger = new InternalChanger(this.main)

	constructor() {
		EventsSDK.on("GameStarted", this.GameStarted.bind(this))
	}

	protected GameStarted() {
		this.cChanger.GameStarted()
	}
})()
