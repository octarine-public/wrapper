import { Menu } from "wrapper/Imports"
export function XAIOSelectLanguage(ru: string, en: string) {
	return XAIOLanguageState.selected_id === 0 ? ru : en
}
export const XAIOMenuEntry = Menu.AddEntry("XAIO")
export const XAIOGeneralSettings = XAIOMenuEntry.AddNode("AIO Settings")

export const XAIOLanguageState = XAIOGeneralSettings.AddSwitcher("Language", ["Русский", "English"], 1)
export const XAIOStateGlobal = XAIOGeneralSettings.AddToggle(XAIOSelectLanguage("XAIO - Вкл | выкл", "XAIO - On | off"), true)
