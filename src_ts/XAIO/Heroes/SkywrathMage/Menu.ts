import { Color } from "wrapper/Imports"
import { XIAOlinkenItemsMenu } from "../../Core/bootstrap"
import { menu_ability, menu_items, menu_projectile, array_sky_radiuses_menu } from "./Data"
import { XAIOMenuHero, XAIOSelectLanguage, XAIOMenuHeroesTree } from "XAIO/Menu/Menu"

export const {
	XAIOState,
	XAIOBaseTree,
	XAIONearMouse,
	XAIOComboTree,
	XAIOComboKey,
	XAIOStateGlobal,
	XAIOSettingsMenu,
	XAIOLinkenBreakTree,
	XAIODrawingTree,
	XAIORadiusesTree,
	XAIORangeRadiusesStyle,
	XAIODrawingtargetTree,
	XAIODrawingtargetNode,
	XAIOStyleCombo,
	XAIOAttackRangeRadiusTree,
	XAIOAttackRangeRadiusState,
	XAIOAttackRadiusesStyle,
	XIAORadiusColorAttackRange,
	XIAODrawingtargetState,
	XIAODrawingtargetLineActive,
	XIAODrawingtargetLineDeactive,
	XAIORenderBindKey,
	XAIORenderBindKeyStyle,
	XAIORenderOptimizeType,
	XAIOSettingsBladMailTree,
	XAIOSettingsBladMailState,
	XAIOOrbWalkerState,
	XAIOOrbWalkerSwitchState,
} = XAIOMenuHero(XAIOMenuHeroesTree, "Skywrath Mage")

/**
 * @____________MenuCombo____________
*/
export const AbilityMenu = XAIOComboTree.AddImageSelector(
	XAIOSelectLanguage("Cпособности", "Ability"),
	menu_ability,
	new Map(menu_ability.map(name => [name, true]))
)

export const ItemsMenu = XAIOComboTree.AddImageSelector(
	XAIOSelectLanguage("Предметы", "Items"),
	menu_items,
	new Map(menu_items.map(name => [name, name !== "item_blink"]))
)

const SmartArcaneBolt = XAIOBaseTree.AddNode(XAIOSelectLanguage("Умный Arcane Bolt", "Smart Arcane Bolt"))
export const SmartArcaneBoltKey = SmartArcaneBolt.AddKeybind("Spam Arcane Bolt")
export const SmartArcaneAutoBoltState = SmartArcaneBolt.AddToggle(XAIOSelectLanguage("Авто Arcane Bolt - Вкл | выкл", "Auto Arcane Bolt - On | off"), true)
export const SmartArcaneOwnerHP = SmartArcaneBolt.AddSlider("Min HP % To Auto Bolt", 20, 0, 100)

const SmartConShot = XAIOBaseTree.AddNode(XAIOSelectLanguage("Умный Concussive Shot", "Smart Concussive Shot"))
export const SmartConShotFail = SmartConShot.AddToggle("Without Fail", true)
export const SmartConShotOnlyTarget = SmartConShot.AddToggle("Without Fail Target")
export const SmartConShotRadius = SmartConShot.AddSlider(XAIOSelectLanguage("Использовать в радиусе", "Use in Radius"), 1600, 800, 10000)

/**
 * @____________MenuAutoCombo____________
*/
const SkyAutoCombo = XAIOBaseTree.AddNode(XAIOSelectLanguage("Авто комбо", "Auto Combo"))
export const SkyAutoComboState = SkyAutoCombo.AddToggle(XAIOSelectLanguage("Вкл | выкл", "On | off"), true)
export const SkyAutoComboDisableWhen = SkyAutoCombo.AddToggle(XAIOSelectLanguage("Отключить при комбо", "Disable When Combo"), true)
export const SkyAutoComboMinHPpercent = SkyAutoCombo.AddSlider(XAIOSelectLanguage("Мин. ХП% для авто комбо", "Min HP % To Auto Combo"), 0, 0, 100)

export const ACAbilityMenu = SkyAutoCombo.AddImageSelector(
	XAIOSelectLanguage("Cпособности", "Ability"),
	menu_ability,
	new Map(menu_ability.map(name => [name, true]))
)

export const ACItemsMenu = SkyAutoCombo.AddImageSelector(
	XAIOSelectLanguage("Предметы", "Items"),
	menu_items,
	new Map(menu_items.map(name => [name, name !== "item_blink"]))
)


/**
 * @____________MenuLinkenBreak____________
*/
export let XIAOSkylinkenAbility: string[] = [
	"skywrath_mage_arcane_bolt",
	"skywrath_mage_ancient_seal"
]

export const LinkenBreakAbilityItems = XAIOLinkenBreakTree.AddImageSelector(
	XAIOSelectLanguage("Cпособности & Предметы", "Ability & Items"),
	[...XIAOlinkenItemsMenu, ...XIAOSkylinkenAbility],
	new Map([...XIAOlinkenItemsMenu, ...XIAOSkylinkenAbility].map(name => [name, true]))
)

/**
 * @____________MenuVisual____________
*/
export const SkyRangeRadiusesSelector = XAIORadiusesTree.AddImageSelector(
	XAIOSelectLanguage("Радиусы", "Radiuses"), array_sky_radiuses_menu,
	new Map(array_sky_radiuses_menu.map(name => [name, true]))
)

export const BlinkRadiusItemColor = XAIORadiusesTree.AddColorPicker("Blink", Color.RoyalBlue)
export const ArcaneBoltRadiusColor = XAIORadiusesTree.AddColorPicker("Arcane Bolt", Color.RoyalBlue)
export const ConcussiveShotRadiusColor = XAIORadiusesTree.AddColorPicker("Concussive Shot", Color.RoyalBlue)
export const AncientSealRadiusColor = XAIORadiusesTree.AddColorPicker("Ancient Seal", Color.RoyalBlue)
export const MysticFlareRadiusColor = XAIORadiusesTree.AddColorPicker("Mystic Flare", Color.RoyalBlue)

export const SkyDrawingtargetStateShot = XAIODrawingtargetTree.AddToggle(XAIOSelectLanguage("Concusive Индикатор", "Concusive Indicator"))
export const SkyConShotPositionZ = XAIODrawingtargetTree.AddSlider("Concusive: " + XAIOSelectLanguage("Высота", "height"), 310, 310, 1000)

export const DrawingtextMenu = XAIODrawingTree.AddNode(XAIOSelectLanguage("Информационная панель", "Info Panel"))
export const SkyPanelTextItem = DrawingtextMenu.AddToggle(XAIOSelectLanguage("Вкл | выкл", "On | off"), true)
export const SkyPanelTextSize = DrawingtextMenu.AddSlider(XAIOSelectLanguage("Размер шрифта", "Size text"), 18, 8, 100)
export const SkyPanelTextXItem = DrawingtextMenu.AddSlider(XAIOSelectLanguage("Позиция: X", "Position: X"), 18, 1, 100)
export const SkyPanelTextYItem = DrawingtextMenu.AddSlider(XAIOSelectLanguage("Позиция: Y", "Position: Y"), 87, 1, 100)

/**
 * @______________Settings________________
 */
export const SkyBlink = XAIOSettingsMenu.AddSlider(XAIOSelectLanguage("Blink расстояние от врага", "Blink distance from enemy"), 400, 0, 1200)

export const SkyProjectileItems = XAIOSettingsMenu.AddImageSelector(
	XAIOSelectLanguage("Ждать прожектайлы для MysticFlare", "Await projectile for mysticflare"),
	menu_projectile,
	new Map(menu_projectile.map(name => [name, true]))
)

export const SkyUseCycloneBladMailState = XAIOSettingsBladMailTree.AddToggle(XAIOSelectLanguage("Использовать еул", "Use cyclone"))