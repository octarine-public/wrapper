import { Menu, MenuBase, MainState } from "../Base/MenuBase"
export const { BaseTree, State } = MenuBase(Menu, "Auto Feed")
export const SwitchUnit = BaseTree.AddSwitcher("Select", ["Only heroes", "All controllable unit"], 1)
const LogicFeedTree = BaseTree.AddNode("Logic Feed")
export let arr_hero = [
	"npc_dota_hero_lycan",
	"npc_dota_hero_lone_druid",
	"npc_dota_hero_furion",
	"npc_dota_hero_windrunner",
	"npc_dota_hero_beastmaster",
	"npc_dota_hero_brewmaster",
	"npc_dota_hero_pudge",
	"npc_dota_hero_queenofpain",
	"npc_dota_hero_antimage",
	"npc_dota_hero_grimstroke",
]
export const LogicFeedHeroState = LogicFeedTree.AddImageSelector("Hero", arr_hero, new Map(arr_hero.map(name => [name, true])))
export const DrawStatus = BaseTree.AddNode("Draw Status")
export const DrawState = DrawStatus.AddToggle("Enable", true)
export const DrawTextSize = DrawStatus.AddSlider("Text Size", 20, 14, 60)

export {
	MainState
}