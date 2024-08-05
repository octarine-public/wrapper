import {
	ConVarsSDK,
	Events,
	EventsSDK,
	Menu,
	MenuLanguageID,
	SOType
} from "../../../wrapper/Imports"

const enum CSODOTALobbyState {
	UI = 0,
	READYUP = 4,
	SERVERSETUP = 1,
	RUN = 2,
	POSTGAME = 3,
	NOTREADY = 5,
	SERVERASSIGN = 6
}

/** Main menu manager  */
new (class CInternalMainMenu {
	private acceptTime = -1
	private readonly tree = Menu.AddEntry("Main")
	private readonly acceptDelay = this.tree.AddSlider(
		"AutoAccept delay",
		26,
		0,
		28,
		0,
		"Delay on auto accept,\nyou can disable it by setting slider to max value"
	)
	private readonly fowConvars = this.tree.AddToggle(
		"FoW hacks",
		true,
		"Such as seeing TPs in the world, having no fog, etc"
	)

	constructor() {
		EventsSDK.on("Draw", this.Draw.bind(this))
		Events.on("SetLanguage", this.SetLanguage.bind(this))
		EventsSDK.on("SharedObjectChanged", this.SharedObjectChanged.bind(this))

		this.tree
			.AddToggle("Trigger keybinds in chat", false)
			.OnValue(toggle => (Menu.Base.triggerOnChat = toggle.value))
	}

	protected Draw(): void {
		this.updateAutoAccept()
		ConVarsSDK.Set("fog_override", 0)
		ConVarsSDK.Set("fow_client_visibility", 0)
		ConVarsSDK.Set("fog_enable", !this.fowConvars.value)
	}

	protected SharedObjectChanged(
		_typeID: SOType,
		_reason: number,
		msg: RecursiveMap
	): void {
		if (msg.get("state") === CSODOTALobbyState.READYUP && this.acceptTime === -1) {
			this.acceptTime = hrtime()
		} else if (
			this.acceptTime !== -1 &&
			msg.get("state") !== CSODOTALobbyState.READYUP
		) {
			this.acceptTime = -1
		}
	}

	protected SetLanguage(language: MenuLanguageID): void {
		switch (language) {
			default:
			case MenuLanguageID.english:
				Menu.Localization.PreferredUnitName = "english"
				break
			case MenuLanguageID.russian:
				Menu.Localization.PreferredUnitName = "russian"
				break
			case MenuLanguageID.chinese:
				Menu.Localization.PreferredUnitName = "chinese"
				break
		}
	}

	private updateAutoAccept() {
		if (this.acceptTime === -1) {
			return
		}
		const elepsedTime = (hrtime() - this.acceptTime) / 1000
		if (elepsedTime > this.acceptDelay.max) {
			this.acceptTime = -1
			return
		}
		if (this.acceptDelay.value - elepsedTime > 0) {
			return
		}
		AcceptMatch()
		this.acceptTime = -1
	}
})()
