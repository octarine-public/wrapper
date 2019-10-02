import { Menu } from "wrapper/Imports"
//import { DrawDestroyAll } from "./Renderer"
let menu = Menu.AddEntry(["Heroes","Intelligence", "Tinker"]),
active = menu.AddToggle("Active", false),
mainCombo = menu.AddNode("Combo"),//COMBO
comboKey = mainCombo.AddKeybind("Combo Key"),
blindn = mainCombo.AddNode("Blink Settings"),
abils = mainCombo.AddImageSelector(
    "Active abilities",
    [
        "tinker_laser",
        "tinker_heat_seeking_missile",
        "tinker_rearm",
    ],
),
items = mainCombo.AddImageSelector(
    "Active items",
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
    ],
),
helpF = mainCombo.AddToggle("Cast Lotus On Allies",true),
etherD = mainCombo.AddToggle("Cast Damage Only in Ethereal", true),//COMBO
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
    ],
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
    ],
),
marshBlink = rockSp.AddToggle("Follow/Blink to cursor(marsh)", false),//SPAM
autoS = menu.AddNode("Auto Use"),
rocketrearmFailsw = autoS.AddToggle("Rocket and Rearm failswitch"),
autoSoul = autoS.AddToggle("Auto use soulring before r"),
ezKill = autoS.AddToggle("Auto Killsteal", true),
blinkKey = menu.AddKeybind("Fast blink Key"),
cursorRadius = menu.AddSlider("Nearest cursor radius", 200, 100, 1000),
soulTresh = menu.AddSlider("HP Percent Threshold for soulring", 20, 0, 99),
autop = menu.AddNode("Auto Pushing"),
autoKey = autop.AddKeybind("Push Key"),
autoMarsh = autop.AddSlider("N marshes", 2, 1, 4),
TinkerPushCreeps = autop.AddSlider("Min creeps",3,1,5),
TinkerPushEnemies = autop.AddSlider("Max enemy heroes", 0,0,5),
TinkerPushAllies = autop.AddSlider("Max friendly heroes",0,0,5),
TinkerPushSave = autop.AddToggle("Only Save TP", true),
TinkerPushDef = autop.AddToggle("Auto disable if enemy near", true),
TinkerPushJungle = autop.AddToggle("Farm Jungle", true),
smartRegen = autop.AddToggle("Smart Regen", false),
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
popLotusV = linken_settings.AddToggle("Pop Lotus"),
popLotusItems = linken_settings.AddImageSelector(
    "Pop Lotus with",
    [
        "tinker_laser",//
        "item_dagon_5",//
        "item_ethereal_blade",//
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
targetCalc = drawable.AddNode("Target Draw"),
TargetCalculator = drawable.AddToggle("Draw Procast Counter on all heroes", true),//x5 - left of manabar
RocketCounter = drawable.AddToggle("Draw rocket counter on all heroes", true),
EzCalc = targetCalc.AddToggle("Draw Ethereal+Dagon Dmg", true),//ezk:
ProcastCalc = targetCalc.AddToggle("Draw Combo Damage", true),//com:
panel = drawable.AddToggle("Draw Panel"),
//hitcounter = targetCalc.AddToggle("Draw hit counter", true),
statusPosX = drawable.AddSlider("Position X (%)", 19, 0, 100),
statusPosY = drawable.AddSlider("Position Y (%)", 4, 0, 100)
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
,autop 
,autoKey 
,autoMarsh
,TinkerPushCreeps 
,TinkerPushEnemies
,TinkerPushAllies 
,TinkerPushSave   
,TinkerPushDef    
,TinkerPushJungle 
,smartRegen 
,linken_settings 
,popLinkV 
,popLinkItems 
,popLotusV
,popLotusItems
,bmcheck 
,blindn 
,blinkV
,blinkM
,blinkRadius 
,mainCombo  
,abils 
,items 
,helpF 
,etherD 
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
}