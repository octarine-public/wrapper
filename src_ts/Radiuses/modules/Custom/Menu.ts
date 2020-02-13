import { Menu } from "../../base/MenuBase"


export const CustomMenu = Menu.AddNode("Custom Radiuses")

export const CustomCount = CustomMenu.AddSlider("Amount", 3, 1, 9)