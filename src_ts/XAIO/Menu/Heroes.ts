import { Menu, Color } from "wrapper/Imports"
import { XAIOMenuEntry, XAIOStateGlobal, XAIOSelectLanguage } from "./Base"

export const XAIOMenuHeroesTree = XAIOMenuEntry.AddNode("Combo Heroes")

function StyleSwitch(Tree: Menu.Node) {
	return Tree.AddSwitcher(XAIOSelectLanguage("Стиль", "Style"), [
		XAIOSelectLanguage("Стандартные", "Normal"),
		XAIOSelectLanguage("Верёвка", "Rope"),
		XAIOSelectLanguage("Анимация", "Animation")
	], 2)
}

export function XAIOMenuHero(rootTree: Menu.Node, name: string, tooltip?: string) {

	const XAIOBaseTree = rootTree.AddNode(name)

	const XAIOState = tooltip !== undefined
		? XAIOBaseTree.AddToggle(XAIOSelectLanguage("Вкл | выкл - Героя", "On | off - Hero")).SetTooltip(tooltip)
		: XAIOBaseTree.AddToggle(XAIOSelectLanguage("Вкл | выкл - Героя", "On | off - Hero"))

	const XAIOLinkenBreakTree = XAIOBaseTree.AddNode(XAIOSelectLanguage("Разрушение линки", "Linken's Breaker"))

	const XAIOComboTree = XAIOBaseTree.AddNode(XAIOSelectLanguage("Комбо", "Combo"))
	const XAIOComboKey = XAIOComboTree.AddKeybind(XAIOSelectLanguage("Бинд", "Bind Key"), "D")

	const XAIOStyleCombo = XAIOComboTree.AddSwitcher(XAIOSelectLanguage("Стиль комбо", "Key style"), [
		XAIOSelectLanguage("Удерживать бинд", "Hold key"),
		XAIOSelectLanguage("Вкл | Выкл", "On | off")
	], 0)

	const XAIOSettingsMenu = XAIOBaseTree.AddNode(XAIOSelectLanguage("Настройки", "Settings"))
	const _nearmouse = XAIOSettingsMenu.AddSlider(XAIOSelectLanguage("Ближайший к Мыши (Цель)", "Closest to Mouse (Target)"), 200, 50, 1000)
	const OrbWallker = XAIOSettingsMenu.AddNode("OrbWallker")
	const XAIOOrbWalkerState = OrbWallker.AddToggle(XAIOSelectLanguage("Вкл | выкл", "On | off"), true)
	const XAIOOrbWalkerSwitchState = OrbWallker.AddSwitcher(XAIOSelectLanguage("Двигатся к", "Run to"), [
		XAIOSelectLanguage("цели", "target"),
		XAIOSelectLanguage("мышки", "mouse")
	])

	const XAIOSettingsBladMailTree = XAIOSettingsMenu.AddNode(XAIOSelectLanguage("Проверять на BaldMail", "Checking on BaldMail"))
	const XAIOSettingsBladMailState = XAIOSettingsBladMailTree.AddToggle(XAIOSelectLanguage("Отменить комбо & прочее действие", "Cancel combo & other action"))

	const XAIODrawingTree = XAIOBaseTree.AddNode(XAIOSelectLanguage("Визуальное", "Visual"))
	const XAIORadiusesTree = XAIODrawingTree.AddNode(XAIOSelectLanguage("Радиусы", "Radiuses"))

	const XAIOExtraSettingsRadiuses = XAIORadiusesTree.AddNode(XAIOSelectLanguage("Доп. Настройки", "Extra Settings"))
	const XAIORenderBindKey = XAIOExtraSettingsRadiuses.AddKeybind(XAIOSelectLanguage("Кнопка бинда", "Key bind"))

	const XAIORenderBindKeyStyle = XAIOExtraSettingsRadiuses.AddSwitcher(XAIOSelectLanguage("Стиль показа", "Style display"), [
		XAIOSelectLanguage("Удерживать бинд", "Hold key"),
		XAIOSelectLanguage("Вкл | Выкл", "On | off")
	], 1)

	const XAIORenderOptimizeType = XAIOExtraSettingsRadiuses.AddSwitcher("Render optimize type", ["onDraw", "onTick"])

	const XAIORangeRadiusesStyle = StyleSwitch(XAIOExtraSettingsRadiuses)

	const XAIOAttackRangeRadiusTree = XAIORadiusesTree.AddNode(XAIOSelectLanguage("Радиус Аттаки", "Attack Range"))
	const XAIOAttackRangeRadiusState = XAIOAttackRangeRadiusTree.AddToggle(XAIOSelectLanguage("Вкл | выкл", "On | off"))

	const XAIOAttackRadiusesStyle = StyleSwitch(XAIOAttackRangeRadiusTree)

	const XAIODrawingtargetTree = XAIODrawingTree.AddNode(XAIOSelectLanguage("Настройки цели", "Settings target"))
	const XAIODrawingtargetNode = XAIODrawingtargetTree.AddNode(XAIOSelectLanguage("Линия цели", "Target line"))

	const XIAORadiusColorAttackRange = XAIOAttackRangeRadiusTree.AddColorPicker(XAIOSelectLanguage("Цвет", "Color"), Color.Orange)

	const XIAODrawingtargetState = XAIODrawingtargetNode.AddToggle(XAIOSelectLanguage("Вкл | выкл", "On | off"), true)
	const XIAODrawingtargetLineActive = XAIODrawingtargetNode.AddColorPicker(XAIOSelectLanguage("Цвет при комбо", "Active color by combo"), new Color(0, 173, 0))
	const XIAODrawingtargetLineDeactive = XAIODrawingtargetNode.AddColorPicker(XAIOSelectLanguage("Цвет при выборе цели", "Color when choosing a target"), Color.Yellow)

	return {
		XAIONearMouse: _nearmouse,
		XAIOState,
		XAIOComboKey,
		XAIOBaseTree,
		XAIOComboTree,
		XAIOStyleCombo,
		XAIODrawingTree,
		XAIOSettingsMenu,
		XAIOStateGlobal,
		XAIOLinkenBreakTree,
		XAIORadiusesTree,
		XAIORenderBindKey,
		XAIORenderBindKeyStyle,
		XAIORangeRadiusesStyle,
		XAIODrawingtargetTree,
		XAIODrawingtargetNode,
		XAIOAttackRangeRadiusTree,
		XAIOAttackRadiusesStyle,
		XAIORenderOptimizeType,
		XAIOAttackRangeRadiusState,
		XIAORadiusColorAttackRange,
		XIAODrawingtargetState,
		XAIOSettingsBladMailTree,
		XAIOOrbWalkerState,
		XAIOOrbWalkerSwitchState,
		XAIOSettingsBladMailState,
		XIAODrawingtargetLineActive,
		XIAODrawingtargetLineDeactive
	}
}
