import { GameState, Menu } from "../../../wrapper/Imports"
import { internalUtil } from "../Util"
import { internalSettingsMenu } from "./index"

export const internalChanger = new (class {
	private readonly weather: Menu.Dropdown
	private readonly emoticons: Menu.Toggle
	private readonly riverPaint: Menu.Dropdown

	private readonly treeModelSize: Menu.Slider
	private readonly treeModelMenuNames: Menu.Dropdown

	private readonly riverNames = [
		"Default",
		"Chrome",
		"Dry",
		"Slime",
		"Oil",
		"Electric",
		"Potion",
		"Blood"
	]

	private readonly treePaths = [
		"",
		"models/props_structures/crystal003_refract.vmdl",
		"models/props_structures/pumpkin001.vmdl",
		"models/props_diretide/pumpkin_head.vmdl",
		"models/props_gameplay/pumpkin_bucket.vmdl",
		"maps/journey_assets/props/trees/journey_armandpine/journey_armandpine_02_stump.vmdl",
		"models/props_tree/frostivus_tree.vmdl",
		"models/props_tree/newbloom_tree.vmdl",
		"models/props_tree/mango_tree.vmdl",
		"models/props_tree/ti7/ggbranch.vmdl"
	]

	private readonly treeNames = [
		"Default",
		"Crystal",
		"Pumpkins #1",
		"Pumpkins #2",
		"Pumpkin Buckets",
		"Stumps",
		"Frostivus",
		"New Bloom",
		"Mango",
		"GG Branch"
	]

	private readonly weatherNames = [
		"Default",
		"Snow",
		"Rain",
		"Moonbeam",
		"Pestilence",
		"Harvest",
		"Sirocco",
		"Spring",
		"Ash",
		"Aurora"
	]

	constructor(settings: Menu.Node) {
		const settingsTree = settings.AddNode("Changer", internalUtil.ChangerIcon)
		settingsTree.SortNodes = false

		this.emoticons = settingsTree.AddToggle("Emoticons chat", true)
		this.weather = settingsTree.AddDropdown("Weather", this.weatherNames, 0)
		this.riverPaint = settingsTree.AddDropdown("River", this.riverNames, 0)

		/** Node Trees model */
		this.treeModelMenuNames = settingsTree.AddDropdown("Trees model", this.treeNames)
		this.treeModelSize = settingsTree.AddSlider("Trees size", 1, 0.3, 5, 1)
		/** end Node Trees model */

		settingsTree
			.AddButton("Reset", "Reset settings")
			.OnValue(() => this.OnChangeResetSettings())

		this.treeModelMenuNames.OnValue(call => {
			this.treeModelSize.IsHidden = call.SelectedID === 0
			this.OnChangeTreeModels(call.SelectedID, this.treeModelSize.value)
		})

		this.weather.OnValue(call =>
			internalUtil.SetConVar("cl_weather", call.SelectedID)
		)

		this.riverPaint.OnValue(val =>
			internalUtil.SetConVar("dota_river_type", val.SelectedID)
		)

		this.emoticons.OnValue(call =>
			internalUtil.SetConVar("dota_hud_chat_enable_all_emoticons", call.value)
		)

		this.treeModelSize.OnValue(call => {
			settingsTree.Update()
			this.OnChangeTreeModels(this.treeModelMenuNames.SelectedID, call.value)
		})
	}

	public GameStarted(): void {
		internalUtil.SetConVar("cl_weather", this.weather.SelectedID)
		internalUtil.SetConVar("dota_river_type", this.riverPaint.SelectedID)
		internalUtil.SetConVar("dota_hud_chat_enable_all_emoticons", this.emoticons.value)
		this.OnChangeTreeModels(
			this.treeModelMenuNames.SelectedID,
			this.treeModelSize.value
		)
	}

	protected OnChangeTreeModels(selectedID: number, scale?: number): void {
		if (GameState.IsConnected) {
			SetTreeModel(this.treePaths[selectedID], scale ?? 1)
		}
	}

	protected OnChangeResetSettings(): void {
		this.weather.SelectedID = 0
		this.emoticons.value = true
		this.riverPaint.SelectedID = 0
		this.OnChangeResetSettingsTreeModels()
	}

	protected OnChangeResetSettingsTreeModels(): void {
		this.treeModelSize.value = 1
		this.treeModelSize.IsHidden = true
		this.treeModelMenuNames.SelectedID = 0
		this.OnChangeTreeModels(0, 0)
	}
})(internalSettingsMenu.Tree)
