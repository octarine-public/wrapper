import { Menu, MenuBase } from "../../abstract/Menu.Base"
let MapHack = Menu.AddNode("MapHack")
export const { BaseTree, State } = MenuBase(MapHack, "Techies Mines")
export const Size = BaseTree.AddSlider("Image/Text Size", 42, 42, 300)
export const DrawRGBA = BaseTree.AddColorPicker("Text Color")
State.SetTooltip("Display position enemy heroes if use ability")
