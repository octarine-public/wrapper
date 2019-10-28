import { Menu } from "wrapper/Imports"
//import { DrawDestroyAll } from "./Renderer"
let menu = Menu.AddEntry(["Heroes","Intelligence", "Tinker"]),
active = menu.AddToggle("Active", false),
mainCombo = menu.AddNode("Combo"),//COMBO
comboKey = mainCombo.AddKeybind("Combo Key"),
blindn = mainCombo.AddNode("Blink Settings"),
abils = mainCombo.AddImageSelector(
    "Abilities",
    [
        "tinker_laser",
        "tinker_heat_seeking_missile",
        "tinker_rearm"
    ], new Map<string, boolean>([
        ["tinker_laser", true],
        ["tinker_heat_seeking_missile", true],
        ["tinker_rearm", true],
    ]),
),
items = mainCombo.AddImageSelector(
    "Items",
    [
        "item_sheepstick",
        "item_ethereal_blade",
        "item_dagon_5",
        "item_veil_of_discord",
        "item_orchid",
        "item_bloodthorn",
        "item_shivas_guard",
        "item_nullifier",
        "item_lotus_orb",
        "item_rod_of_atos",
        "item_guardian_greaves",
        "item_ghost",
        "item_glimmer_cape"
    ], new Map<string, boolean>([
        ["item_sheepstick", true],
        ["item_ethereal_blade", true],
        ["item_dagon_5", true],
        ["item_veil_of_discord", true],
        ["item_orchid", true],
        ["item_bloodthorn", true],
        ["item_shivas_guard", true],
        ["item_nullifier", true],
        ["item_lotus_orb", true],
        ["item_rod_of_atos", true],
        ["item_guardian_greaves", true],
        ["item_ghost", true],
        ["item_glimmer_cape", true]
    ]),
),
helpF = mainCombo.AddToggle("Cast Lotus On Allies",true),
bmcheck = mainCombo.AddToggle("Check for BladeMail", true),
rockSp = menu.AddNode("Spam"),//SPAMMING
spamKey = rockSp.AddKeybind("Rocket Spam Key"),
spamItems = rockSp.AddImageSelector(
    "Items ",
    [
        "item_ghost",
        "item_glimmer_cape",
        "item_bottle",
        "item_guardian_greaves"
    ], new Map<string, boolean>([
        ["item_ghost", true],
        ["item_glimmer_cape", true],
        ["item_bottle", true],
        ["item_guardian_greaves", true]
    ]),
),
spamBlink = rockSp.AddToggle("Follow/Blink to cursor(rockets)", false),
marshKey = rockSp.AddKeybind("Marsh Spam Key"),
marshItems = rockSp.AddImageSelector(
    "Items ",
    [
        "item_ghost",
        "item_glimmer_cape",
        "item_bottle",
        "item_guardian_greaves"
    ], new Map<string, boolean>([
        ["item_ghost", true],
        ["item_glimmer_cape", true],
        ["item_bottle", true],
        ["item_guardian_greaves", true]
    ]),
),
marshBlink = rockSp.AddToggle("Follow/Blink to cursor(marsh)", false),//SPAM
autoS = menu.AddNode("Auto Use"),
rocketrearmFailsw = autoS.AddToggle("Rocket and Rearm failswitch"),
autoSoul = autoS.AddToggle("Auto use soulring before r"),
ezKill = autoS.AddToggle("Auto Ethereal+dagon", true),
blinkKey = menu.AddKeybind("Fast blink Key"),
cursorRadius = menu.AddSlider("Nearest cursor radius", 200, 100, 1000),
soulTresh = menu.AddSlider("HP Percent Threshold for soulring", 20, 0, 99),
// autop = menu.AddNode("Auto Pushing"),
// autoKey = autop.AddKeybind("Push Key"),
// autoMarsh = autop.AddSlider("N marshes", 2, 1, 4),
// TinkerPushCreeps = autop.AddSlider("Min creeps",3,1,5),
// TinkerPushEnemies = autop.AddSlider("Max enemy heroes", 0,0,5),
// TinkerPushAllies = autop.AddSlider("Max friendly heroes",0,0,5),
// TinkerPushSave = autop.AddToggle("Only Save TP", true),
// TinkerPushDef = autop.AddToggle("Auto disable if enemy near", true),
// TinkerPushJungle = autop.AddToggle("Farm Jungle", true),
// smartRegen = autop.AddToggle("Smart Regen", false),
linken_settings = mainCombo.AddNode("Linken&Lotus settings"),
popLinkV = linken_settings.AddToggle("Pop Linken"),
popLinkItems = linken_settings.AddImageSelector(
    "Pop Linken with",
    [
        "tinker_laser",//
        "item_sheepstick",//
        "item_dagon_5",//
        "item_nullifier",//
        "item_cyclone",//
        "item_rod_of_atos",//
        "item_force_staff",
        "item_orchid",//
        "item_bloodthorn",//
        "item_force_staff",//
        "item_ethereal_blade"//

    ],
),
blinkV = blindn.AddToggle("Enable Blink"),
blinkM = blindn.AddSwitcher("Blink to", ["Safe dist","Laser Range Cursor", "Smart Mode"],1),
blinkRadius = blindn.AddSlider("Safe distance from enemy", 200, 0, 500),
drawable = menu.AddNode("Drawable"),
drawTargetParticle = drawable.AddToggle("Draw Line To Target"),
tarpCol = drawable.AddNode("Line Color"),
RedT = tarpCol.AddSlider("red", 20,0,255),
GreenT = tarpCol.AddSlider("green", 255,0,255),
BlueT = tarpCol.AddSlider("blue",100,0,255),
blinkPart = drawable.AddToggle("Draw blink partice",true),
bootRange = drawable.AddToggle("Draw blink range when tping",true),
TargetCalculator = drawable.AddToggle("Procast Counter on all heroes", true),//x5 - left of manabar
RocketCounter = drawable.AddToggle("Rocket counter on all heroes", true),
EzCalc = drawable.AddToggle("Ethereal+Dagon Dmg on target", true),//ezk:
ProcastCalc = drawable.AddToggle("Combo Dmg on target", true),//com:
panel = drawable.AddToggle("Draw Panel"),
statusPosX = drawable.AddSlider("Pos X (%)", 73, 0, 100),
statusPosY = drawable.AddSlider("Pos Y (%)", 88, 0, 100)
export {
    menu
,active 
,spamBlink 
,comboKey 
,spamKey 
,blinkKey 
,marshBlink
,marshKey 
,rocketrearmFailsw 
,autoSoul 
,cursorRadius 
,soulTresh 
// ,autop 
// ,autoKey 
// ,autoMarsh
// ,TinkerPushCreeps 
// ,TinkerPushEnemies
// ,TinkerPushAllies 
// ,TinkerPushSave   
// ,TinkerPushDef    
// ,TinkerPushJungle 
// ,smartRegen 
,linken_settings 
,popLinkV 
,popLinkItems 
,bmcheck 
,blindn 
,blinkV
,blinkM
,blinkRadius 
,mainCombo  
,abils 
,items 
,helpF 
,drawable 
,drawTargetParticle 
,statusPosX 
,statusPosY 
,ezKill
,RedT
,GreenT
,BlueT
,TargetCalculator
,ProcastCalc 
,EzCalc
,RocketCounter
,spamItems
,marshItems
,panel
,blinkPart
,bootRange
}