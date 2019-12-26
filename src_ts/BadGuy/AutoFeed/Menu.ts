import { Menu, MenuBase } from "../Base/MenuBase"
export const { BaseTree, State } = MenuBase(Menu, "Auto Feed")
export const SwitchUnit = BaseTree.AddSwitcher("Select", ["Only heroes", "All controllable unit"], 1)
const LogicFeedTree = BaseTree.AddNode("Logic Feed")
let arr_hero = ["npc_dota_hero_lycan", "npc_dota_hero_lone_druid", "npc_dota_hero_furion"]
export const LogicFeedHeroState = LogicFeedTree.AddImageSelector("Hero", arr_hero, new Map(arr_hero.map(name => [name, true])))
export const DrawStatus = BaseTree.AddNode("Draw Status")
export const DrawState = DrawStatus.AddToggle("Enable", true)
export const DrawTextSize = DrawStatus.AddSlider("Text Size", 20, 14, 60)
