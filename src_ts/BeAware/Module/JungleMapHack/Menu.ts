import { Menu, MenuBase } from "../../abstract/Menu.Base"
let MapHack = Menu.AddNode("MapHack")
export const { State, BaseTree } = MenuBase(MapHack, "Jungle")
export const ImageSizeWorld = BaseTree.AddSlider("Image world size", 64, 32, 150)
export const ImageSizeMinimap = BaseTree.AddSlider("Image minimap size", 64, 24, 150)
State.SetTooltip("Display position whwn enemy is farming jungle")
