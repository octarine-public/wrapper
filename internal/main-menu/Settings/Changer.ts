import { ConVarsSDK, GameState, Menu } from "../../../wrapper/Imports"

export class InternalChanger {
	private readonly weather: Menu.Dropdown
	private readonly emoticons: Menu.Toggle
	private readonly riverPaint: Menu.Dropdown

	private readonly treeModelMenuSize: Menu.Slider
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
		"models/props_tree/ti7/ggbranch.vmdl",
		"models/props_tree/topiary/topiary001.vmdl",
		"github.com/octarine-public/wrapper/scripts_files/models/cube.vmdl"
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
		"GG Branch",
		"Immortal Gardens",
		"Cube"
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

	private readonly tree: Menu.Node

	constructor(settings: Menu.Node) {
		this.tree = settings.AddNode("Changer", "menu/icons/changer.svg")
		this.tree.SortNodes = false

		this.emoticons = this.tree.AddToggle("Emoticons chat", true)
		this.weather = this.tree.AddDropdown("Weather", this.weatherNames, 0)
		this.riverPaint = this.tree.AddDropdown("River", this.riverNames, 0)

		/** Node Trees model */
		this.treeModelMenuNames = this.tree.AddDropdown("Trees model", this.treeNames)
		this.treeModelMenuSize = this.tree.AddSlider("Trees size", 1, 0.3, 5, 1)
		/** end Node Trees model */

		this.tree
			.AddButton("Reset", "Reset settings")
			.OnValue(() => this.ChangeResetSettings())

		this.treeModelMenuNames.OnValue(call => {
			this.treeModelMenuSize.IsHidden = call.SelectedID === 0
			this.ChangeTreeModels(call.SelectedID, this.treeModelMenuSize.value)
		})

		this.weather.OnValue(call => ConVarsSDK.Set("cl_weather", call.SelectedID))
		this.riverPaint.OnValue(val => ConVarsSDK.Set("dota_river_type", val.SelectedID))

		this.emoticons.OnValue(call =>
			ConVarsSDK.Set("dota_hud_chat_enable_all_emoticons", call.value)
		)

		this.treeModelMenuSize.OnValue(call => {
			this.ChangeTreeModels(this.treeModelMenuNames.SelectedID, call.value)
			this.tree.Update()
		})
	}

	public GameStarted(): void {
		ConVarsSDK.Set("cl_weather", this.weather.SelectedID)
		ConVarsSDK.Set("dota_river_type", this.riverPaint.SelectedID)
		ConVarsSDK.Set("dota_hud_chat_enable_all_emoticons", this.emoticons.value)
		this.ChangeTreeModels(
			this.treeModelMenuNames.SelectedID,
			this.treeModelMenuSize.value
		)
	}

	protected ChangeTreeModels(selectedID: number, scale?: number): void {
		if (GameState.IsConnected) {
			SetTreeModel(this.treePaths[selectedID], scale ?? 1)
		}
		this.tree.Update()
	}

	protected ChangeResetSettings(): void {
		this.weather.SelectedID = 0
		this.emoticons.value = true
		this.riverPaint.SelectedID = 0
		this.ChangeResetSettingsTreeModels()
		this.tree.Update()
	}

	protected ChangeResetSettingsTreeModels(): void {
		this.treeModelMenuSize.value = 1
		this.treeModelMenuSize.IsHidden = true
		this.treeModelMenuNames.SelectedID = 0
		this.ChangeTreeModels(0, 0)
	}
}
