import { Menu, SOType } from "../../../wrapper/Imports"
import { InternalLanguageID, internalUtil } from "../Util"

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

	public SetLanguage(language: InternalLanguageID): void {
		switch (language) {
			default:
			case InternalLanguageID.english:
				Menu.Localization.PreferredUnitName = "english"
				break
			case InternalLanguageID.russian:
				Menu.Localization.PreferredUnitName = "russian"
				break
			case InternalLanguageID.chinese:
				Menu.Localization.PreferredUnitName = "chinese"
				break
		}
	}

	protected UpdateConvars() {
		internalUtil.SetConVar("fog_enable", !this.FowConvars.value)
		internalUtil.SetConVar("fog_override", 0)
		internalUtil.SetConVar("fow_client_visibility", 0)
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
