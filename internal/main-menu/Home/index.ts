import { ConVarsSDK, Menu, MenuLanguageID, SOType } from "../../../wrapper/Imports"

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
export const internalHomeMenu = new (class {
	private acceptTime = -1
	private readonly FowConvars: Menu.Toggle
	private readonly AcceptDelay: Menu.Slider

	constructor() {
		const treeMenu = Menu.AddEntry("Main")

		this.AcceptDelay = treeMenu.AddSlider(
			"AutoAccept delay",
			26,
			0,
			28,
			0,
			"Delay on auto accept,\nyou can disable it by setting slider to max value"
		)

		this.FowConvars = treeMenu.AddToggle(
			"FoW hacks",
			true,
			"Such as seeing TPs in the world, having no fog, etc"
		)

		treeMenu
			.AddToggle("Trigger keybinds in chat", false)
			.OnValue(toggle => (Menu.Base.triggerOnChat = toggle.value))
	}

	public Draw(): void {
		this.UpdateConvars()
		this.UpdateAutoAccept()
	}

	public SharedObjectChanged(_id: SOType, obj: RecursiveMap): void {
		if (obj.get("state") === CSODOTALobbyState.READYUP && this.acceptTime === -1) {
			this.acceptTime = hrtime()
		} else if (
			this.acceptTime !== -1 &&
			obj.get("state") !== CSODOTALobbyState.READYUP
		) {
			this.acceptTime = -1
		}
	}

	public SetLanguage(language: MenuLanguageID): void {
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

	protected UpdateConvars() {
		ConVarsSDK.Set("fog_override", 0)
		ConVarsSDK.Set("fow_client_visibility", 0)
		ConVarsSDK.Set("fog_enable", !this.FowConvars.value)
	}

	protected UpdateAutoAccept() {
		if (this.acceptTime === -1) {
			return
		}
		const elepsedTime = (hrtime() - this.acceptTime) / 1000
		if (elepsedTime > this.AcceptDelay.max) {
			this.acceptTime = -1
			return
		}
		if (this.AcceptDelay.value - elepsedTime > 0) {
			return
		}
		AcceptMatch()
		this.acceptTime = -1
	}
})()
