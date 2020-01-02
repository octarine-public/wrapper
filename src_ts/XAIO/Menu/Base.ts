import { Menu as MenuSDK } from "wrapper/Imports"

function SelectLanguage(ru: string, en: string) {
	return LanguageState.selected_id === 0
		? ru
		: en
}

export const Menu = MenuSDK.AddEntry("XAIO")
export const GeneralSettings = Menu.AddNode(" Home settings ")
export const LanguageState = GeneralSettings.AddSwitcher("Language", ["Русский", "English"], 1) //

export const stateGlobal = GeneralSettings.AddToggle(SelectLanguage("Вкл/Выкл скрипт", "Turn on / Turn off script"), true)
export const OrbWalkerState = GeneralSettings.AddToggle("OrbWalker", true)

export function XMenu(rootTree: MenuSDK.Node, name: string, tooltip?: string) {

	const BaseTree = rootTree.AddNode(name)

	const State = tooltip !== undefined
		? BaseTree.AddToggle(SelectLanguage("Вкл/Выкл", "Enable")).SetTooltip(tooltip)
		: BaseTree.AddToggle(SelectLanguage("Вкл/Выкл", "Enable"))

	const ComboTree = BaseTree.AddNode(SelectLanguage("Комбо", "Combo"))
	const ComboKey = ComboTree.AddKeybind(SelectLanguage("Бинд", "Bind Key"), "D")
	const StyleCombo = ComboTree.AddSwitcher(SelectLanguage("Стиль комбо", "Key style"),
		[
			SelectLanguage("Удерживать бинд", "Hold key"),
			SelectLanguage("Вкл/Выкл", "Turn on / Turn off")
		], 0
	)

	const SettingsMenu = BaseTree.AddNode(SelectLanguage("Настройки", "Settings"))
	const DrawingTree = BaseTree.AddNode(SelectLanguage("Отрисовки", "Drawing"))

	return {
		State,
		BaseTree,
		ComboTree,
		ComboKey,
		StyleCombo,
		DrawingTree,
		stateGlobal,
		SettingsMenu,
		NearMouse: SettingsMenu.AddSlider("Near mouse", 500, 50, 1000),
	}
}
