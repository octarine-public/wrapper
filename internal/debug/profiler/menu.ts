import { Color, Menu } from "../../../wrapper/Imports"

export class ProfilerMenu {
	public readonly State: Menu.Toggle
	public readonly GroupByFile: Menu.Toggle
	public readonly SortBy: Menu.Dropdown
	public readonly Window: Menu.Slider
	public readonly MaxRows: Menu.Slider
	public readonly Color: Menu.ColorPicker
	public readonly Reset: Menu.Button

	private readonly icon = "images/icons/error-bug.svg"
	private readonly tree = Menu.AddEntry("Settings")
	private readonly node = this.tree.AddNode("Script Profiler", this.icon)

	constructor() {
		this.node.SortNodes = false
		this.State = this.node.AddToggle("State", false)
		this.GroupByFile = this.node.AddToggle(
			"Group by file",
			true,
			"On: sum every handler of a script.\nOff: split per event handler."
		)
		this.SortBy = this.node.AddDropdown("Sort by", [
			"ms / sec",
			"avg ms",
			"max ms",
			"calls / sec"
		])
		this.Window = this.node.AddSlider(
			"Window (sec)",
			1,
			1,
			10,
			0,
			"Sampling window length in seconds.\n" +
				"Longer: steadier numbers, catches rarer max spikes.\n" +
				"Shorter: reacts faster but noisier."
		)
		this.MaxRows = this.node.AddSlider("Max rows", 15, 5, 40)
		this.Color = this.node.AddColorPicker("Header color", Color.White)
		this.Reset = this.node.AddButton("Reset")
	}
}
