// import { Menu as MenuSDK, Color } from "wrapper/Imports";
// import InitAbility from "./Extends/Abilities";
// import InitItems from "./Extends/Items";

// const Items = new InitItems
// const Abilities = new InitAbility

// const Menu = MenuSDK.AddEntry(["Heroes", "Anti-Mage"])
// export const State = Menu.AddToggle("Enable")

// const arrayAbility: string[] = [
// 	Abilities.Blink.toString()
// 	// maybe someday valve will add something. P.S. Who am I kidding lOl
// ]
// const arrayItems: string[] = [
// 	Items.Manta.toString(),
// 	Items.Nullifier.toString(),
// 	Items.Sheeps.toString(),
// 	Items.DiffusalBlade.toString(),
// 	Items.BladeMail.toString(),
// 	Items.LotusOrb.toString(),
// 	Items.BlackKingBar.toString(),
// 	Items.Mjollnir.toString(),
// 	Items.Satanic.toString(),
// 	Items.Medallion.toString(),
// 	Items.SolarCrest.toString(),
// 	Items.UrnOfShadows.toString(),
// 	Items.RodofAtos.toString(),
// 	Items.SpiritVesel.toString(),
// 	Items.Orchid.toString(),
// 	Items.Bloodthorn.toString(),
// 	Items.Shivas.toString(),
// 	Items.Nullifier.toString(),
// 	Items.Armlet.toString(),
// ]

// const Combo = Menu.AddNode("Combo")
// export const ComboKeyItem = Combo.AddKeybind("Bind Key", "D")
// const ComboHitAndRunTree = Combo.AddNode("HitAndRun")
// export const ComboHitAndRunAttack = ComboHitAndRunTree.AddToggle("Auto attack", true)
// export const TypeHitAndRun = ComboHitAndRunTree.AddSwitcher("Type Run", ["Run to target", "Run to cursor", "None"])
// export const StyleCombo = Combo.AddSwitcher("Key Style", ["Hold key", "Turn on / Turn off"])
// export const СomboAbility = Combo.AddImageSelector("Abilities", arrayAbility, new Map(arrayAbility.map(name => [name, true])))
// export const СomboItems = Combo.AddImageSelector("Items", arrayItems, new Map(arrayItems.map(name => [name, true])))

// const DodgerTree = Menu.AddNode("Dodger")

// const arrayLinkenBreak: string[] = [
// 	Items.DiffusalBlade.toString(),
// 	Items.RodofAtos.toString(),
// 	Items.Sheeps.toString(),
// 	Items.Orchid.toString(),
// 	Items.Nullifier.toString(),
// 	Items.Bloodthorn.toString(),
// 	Items.HeavensHalberd.toString(),
// 	Items.ForceStaff.toString(),
// 	Items.Cyclone.toString(),
// 	Items.HurricanePike.toString(),
// ]

// const SettingTarget = Menu.AddNode("Settings")
// export const NearMouse = SettingTarget.AddSlider("Near Mouse (Range)", 800, 100, 1000)
// export const LinkenBreakerToggler = SettingTarget.AddImageSelector("Linken break", arrayLinkenBreak, new Map(arrayLinkenBreak.map(name => [name, true])))
// export const BladeMailItem = SettingTarget.AddToggle("Cancel Combo/Harras if there is enemy Blade Mail", false)

// const DrawingMenu = Menu.AddNode("Drawing")
// export const RadiusTree = DrawingMenu.AddNode("Radius")
// export const Radius = RadiusTree.AddImageSelector("Select", [
// 	Abilities.Blink.toString(),
// 	Abilities.ManaVoid.toString(),
// ])
// export const AttackRangeRadiusTree = RadiusTree.AddNode("Attack Range")
// export const AttackRangeRadius = AttackRangeRadiusTree.AddToggle("Enable")
// export const RadiusColorAttackRange = AttackRangeRadiusTree.AddColorPicker("Color", Color.Yellow)
// export const BlinkRadiusItemColor = RadiusTree.AddColorPicker("Blink", Color.White)
// export const BurningArmyRadiusColor = RadiusTree.AddColorPicker("Mana Void", Color.White)
// export const DrawTargetItem = DrawingMenu.AddToggle("Draw Target", true)
