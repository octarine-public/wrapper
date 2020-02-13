import { Menu as MenuSDK } from "wrapper/Imports"

export const Menu = MenuSDK.AddEntry(["Visual", "Radiuses"])
export const stateMain = Menu.AddToggle("State")
