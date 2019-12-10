import { Menu as MenuSDK } from "wrapper/Imports"
const Menu = MenuSDK.AddEntry(["Utility", "Courier Controller"])
export const State = Menu.AddToggle("State")
export const deliverState = Menu.AddToggle("Auto deliver")
export const StateBestPos = Menu.AddToggle("Courier best position", true)
export const autoShieldTree = Menu.AddNode("Auto safe")
export const autoShieldState = autoShieldTree.AddToggle("Enable", true)
export const autoShieldTimer = autoShieldTree.AddSlider("Interval between delivery (sec)", 5, 5, 60)
// const AutoUseTree = Menu.AddNode("Auto Use Items")
// export const StateAutoUse = AutoUseTree.AddToggle("Enable", true)
// let arrayItems: string[] = [
// 	"item_hand_of_midas"
// ]
// export const AutoUseItem = AutoUseTree.AddImageSelector("Items", arrayItems, new Map(arrayItems.map(name => [name, true])))
