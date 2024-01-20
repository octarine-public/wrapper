import { ConVarsSDK, GameState, ImageData, Menu } from "../../../wrapper/Imports"

export class InternalChanger {
	private readonly weather: Menu.Dropdown
	private readonly emoticons: Menu.Toggle
	private readonly riverPaint: Menu.Dropdown
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

	private readonly treeData: [string, number][] = [
		["", 1],
		["models/props_structures/crystal003_refract.vmdl", 1.0],
		["models/props_structures/pumpkin001.vmdl", 1.0],
		["models/props_diretide/pumpkin_head.vmdl", 3.0],
		["models/props_gameplay/pumpkin_bucket.vmdl", 1.0],
		[
			"maps/journey_assets/props/trees/journey_armandpine/journey_armandpine_02_stump.vmdl",
			3.2
		],
		["models/props_tree/frostivus_tree.vmdl", 1],
		["models/props_tree/newbloom_tree.vmdl", 0.7],
		["models/props_tree/mango_tree.vmdl", 0.7],
		["models/props_tree/ti7/ggbranch.vmdl", 1.0],
		["models/props_tree/topiary/topiary001.vmdl", 1.0],
		[ImageData.Paths.Wrapper + "/scripts_files/models/minecraft_cube.vmdl", 1.0],
		[ImageData.Paths.Wrapper + "/scripts_files/models/cube.vmdl", 1.0]
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
		"Minecraft Cube",
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

		this.treeModelMenuNames = this.tree.AddDropdown("Trees model", this.treeNames)

		this.tree
			.AddButton("Reset", "Reset settings")
			.OnValue(() => this.ChangeResetSettings())

		this.treeModelMenuNames.OnValue(call => {
			this.ChangeTreeModels(call.SelectedID)
		})

		this.weather.OnValue(call => ConVarsSDK.Set("cl_weather", call.SelectedID))
		this.riverPaint.OnValue(val => ConVarsSDK.Set("dota_river_type", val.SelectedID))

		this.emoticons.OnValue(call =>
			ConVarsSDK.Set("dota_hud_chat_enable_all_emoticons", call.value)
		)
	}

	public GameStarted(): void {
		ConVarsSDK.Set("cl_weather", this.weather.SelectedID)
		ConVarsSDK.Set("dota_river_type", this.riverPaint.SelectedID)
		ConVarsSDK.Set("dota_hud_chat_enable_all_emoticons", this.emoticons.value)
		this.ChangeTreeModels(this.treeModelMenuNames.SelectedID)
	}

	protected ChangeTreeModels(selectedID: number): void {
		if (!GameState.IsConnected) {
			return
		}
		SetTreeModel(
			this.treeData[selectedID][0],
			this.treeData[selectedID][1],
			selectedID >= 11 ? -64 : 0,
			selectedID >= 10
		)
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
		this.treeModelMenuNames.SelectedID = 0
		this.ChangeTreeModels(0)
	}
}
