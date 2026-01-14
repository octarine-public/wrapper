import {
	Color,
	ConVarsSDK,
	GameState,
	ImageData,
	Menu,
	PathData
} from "../../../wrapper/Imports"

class TreeModelInfo {
	constructor(
		public readonly nameUI: string,
		public readonly modelPath = "",
		public readonly maxScale = 1,
		public readonly canChangeColor = false,
		public readonly zeroRotation = false,
		public readonly heightOffset = 0
	) {}
}
class EmblemInfo {
	constructor(
		public readonly nameUI: string,
		public readonly defID: number
	) {}
}
export class InternalChanger {
	private treeIdx = 0
	private treeScaleVal = 1
	private treeColorVal = Color.Gray

	private readonly node: Menu.Node

	private readonly weather: Menu.Dropdown
	private readonly emoticons: Menu.Toggle
	private readonly riverPaint: Menu.Dropdown

	private readonly treeChanger: Menu.Node
	private readonly treeMenuNames: Menu.Dropdown
	private readonly treeScale: Menu.Slider
	private readonly treeColor: Menu.ColorPicker

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

	private readonly treeData: TreeModelInfo[] = [
		new TreeModelInfo("Default"),
		new TreeModelInfo(
			"Simple Cube",
			PathData.WrapperPath + "/scripts_files/models/cube.vmdl",
			1.0,
			true,
			true,
			-64
		),
		new TreeModelInfo(
			"Minecraft Cube",
			PathData.WrapperPath + "/scripts_files/models/minecraft_cube.vmdl",
			1.0,
			false,
			true,
			-64
		),
		new TreeModelInfo("Pumpkins#1", "models/props_structures/pumpkin001.vmdl"),
		new TreeModelInfo("Pumpkins#2", "models/props_diretide/pumpkin_head.vmdl", 3.0),
		new TreeModelInfo(
			"Immortal Gardens",
			"models/props_tree/topiary/topiary001.vmdl",
			1.0,
			true,
			true
		),
		new TreeModelInfo("GG Branch", "models/props_tree/ti7/ggbranch.vmdl", 1.0, true),
		new TreeModelInfo("Pumpkin Buckets", "models/props_gameplay/pumpkin_bucket.vmdl"),
		new TreeModelInfo(
			"Crystal",
			"models/props_structures/crystal003_refract.vmdl",
			1.0,
			true
		),
		new TreeModelInfo(
			"Stumps",
			"maps/journey_assets/props/trees/journey_armandpine/journey_armandpine_02_stump.vmdl",
			3.2
		),
		new TreeModelInfo("Frostivus", "models/props_tree/frostivus_tree.vmdl"),
		new TreeModelInfo("New Bloom", "models/props_tree/newbloom_tree.vmdl", 0.7),
		new TreeModelInfo("Mango", "models/props_tree/mango_tree.vmdl", 0.7)
	]
	private readonly emblemsData: EmblemInfo[] = [
		new EmblemInfo("Default", 0),
		new EmblemInfo("None", -1),

		new EmblemInfo("Diretide - Red", 18393),
		new EmblemInfo("Diretide - Green", 18394),
		new EmblemInfo("Diretide - Blue", 18379),
		new EmblemInfo("Diretide - Yellow", 13453)
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
		this.node = settings.AddNode("Changer", "menu/icons/changer.svg")
		this.node.SortNodes = false

		this.emoticons = this.node
			.AddToggle("Emoticons chat", false, "Use own risk!")
			.OnValue(t => ConVarsSDK.Set("dota_hud_chat_enable_all_emoticons", t.value))

		this.weather = this.node
			.AddDropdown("Weather", this.weatherNames, 0, "Use own risk!")
			.OnValue(t => ConVarsSDK.Set("cl_weather", t.SelectedID))

		this.riverPaint = this.node
			.AddDropdown("River", this.riverNames, 0, "Use own risk!")
			.OnValue(t => ConVarsSDK.Set("dota_river_type", t.SelectedID))

		const inventoryChanger = this.node.AddNode("Inventory")
		inventoryChanger.SortNodes = false
		// inventoryChanger.IsHidden = true

		const inventoryState = inventoryChanger.AddToggle("State", true)
		inventoryState.executeOnAdd = false
		inventoryState.OnValue(c => SetChangerEnabled(c.value))
		inventoryState.executeOnAdd = true

		const inventoryEmblem = inventoryChanger.AddDropdown(
			"Emblem attack effect",
			this.emblemsData.map(data => data.nameUI)
		)
		inventoryEmblem.executeOnAdd = false
		inventoryEmblem.OnValue(c => {
			SetEmblemAttackEffectOverride(this.emblemsData[c.SelectedID].defID)
		})
		inventoryEmblem.executeOnAdd = true
		inventoryEmblem.UseOneLine = false

		const prismaticNode = inventoryChanger.AddNode("Prismatic Gems")
		prismaticNode.SortNodes = false
		// save settings
		const prismaticColor = prismaticNode.AddColorPicker("Color")
		prismaticNode.AddButton("Obtain").OnValue(() => {
			const color = prismaticColor.SelectedColor
			AddPrismaticGem(color.r, color.g, color.b)
		})

		const greevilNode = inventoryChanger.AddNode("Greevils")
		// save settings
		greevilNode.SortNodes = false

		const quas = greevilNode.AddSlider("Quas", 0, 0, 3)
		const wex = greevilNode.AddSlider("Wex", 0, 0, 3)
		const exort = greevilNode.AddSlider("Exort", 0, 0, 3)
		const unusual = greevilNode.AddSlider("Unusual", 0, 0, 3)
		const shadow = greevilNode.AddToggle("Shadow")
		greevilNode.AddButton("Obtain").OnValue(() => {
			AddGreevil(
				quas.value,
				wex.value,
				exort.value,
				shadow.value ? 1 : 0,
				unusual.value
			)
		})

		this.treeChanger = this.node.AddNode("Trees", ImageData.Icons.icon_svg_tree_alt)
		this.treeChanger.SortNodes = false
		this.treeMenuNames = this.treeChanger.AddDropdown(
			"Tree models",
			this.treeData.map(data => {
				return data.nameUI
			})
		)
		this.treeMenuNames.UseOneLine = false

		this.treeScale = this.treeChanger.AddSlider("Size", this.treeScaleVal, 0.5, 1, 1)
		this.treeColor = this.treeChanger.AddColorPicker("Colors", this.treeColorVal)

		this.treeMenuNames.OnValue(c => {
			this.treeIdx = c.SelectedID
			this.UpdateTreeChangerNode()
			this.UpdateTreeModels()
		})

		this.treeScale.OnValue(c => {
			this.treeScaleVal = c.value
			this.UpdateTreeModels()
		})
		this.treeColor.OnValue(c => {
			this.treeColorVal = c.SelectedColor
			this.UpdateTreeModels()
		})
	}

	private UpdateTreeChangerNode(): void {
		const data = this.treeData[this.treeIdx]

		this.treeColor.IsHidden = !data.canChangeColor
		this.treeScale.IsHidden = this.treeIdx === 0

		this.treeChanger.Update(true)
	}

	public GameStarted(): void {
		ConVarsSDK.Set("cl_weather", this.weather.SelectedID)
		ConVarsSDK.Set("dota_river_type", this.riverPaint.SelectedID)
		ConVarsSDK.Set("dota_hud_chat_enable_all_emoticons", this.emoticons.value)
		this.UpdateTreeModels()
	}

	protected UpdateTreeModels(): void {
		if (!GameState.IsConnected) {
			return
		}
		const data = this.treeData[this.treeIdx]
		SetTreeModel(
			data.modelPath,
			data.maxScale * this.treeScaleVal,
			data.heightOffset,
			data.zeroRotation,
			data.canChangeColor ? this.treeColorVal.toUint32() : 0
		)
		this.node.Update()
	}

	protected ChangeResetSettingsTreeModels(): void {
		this.treeMenuNames.SelectedID = 0
		this.treeScale.value = this.treeScale.defaultValue
		this.treeColor.SelectedColor.CopyFrom(this.treeColor.defaultColor)
		this.treeMenuNames.TriggerOnValueChangedCBs()
	}
}
