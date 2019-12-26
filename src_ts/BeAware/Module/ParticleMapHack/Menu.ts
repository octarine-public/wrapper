import { Menu, MenuBase } from "../../abstract/Menu.Base"
let MapHack = Menu.AddNode("MapHack")
export const { BaseTree, State } = MenuBase(MapHack, "Particle")
State.SetTooltip("Display position enemy heroes if use ability")

export const DrawRGBA = BaseTree.AddColorPicker("Color")
export const Size = BaseTree.AddSlider("Image/Text Size", 42, 42, 300)
export const ComboBox = BaseTree.AddSwitcher("Render Style", ["Text", "Image"])
export const PMH_Smoke_snd = BaseTree.AddSlider("Smoke volume%", 1, 0, 100)
export const PMH_RenderStateMouseSmoke = BaseTree.AddToggle("Notify \"smoke\" on mouse", true)
