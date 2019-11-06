import Color from "../Base/Color"
import Vector2 from "../Base/Vector2"
import Vector3 from "../Base/Vector3"
import RendererSDK from "../Native/RendererSDK"
import Base from "./Base"
import Button from "./Button"
import ImageSelectror from "./ImageSelector"
import KeyBind from "./KeyBind"
import Menu from "./Menu"
import Slider from "./Slider"
import Switcher from "./Switcher"
import Toggle from "./Toggle"

interface IMenu {
	entries: Node[]
}

export default class Node extends Base {
	public parent: Node | IMenu
	public entries: Base[] = []
	public is_open = false
	public is_hovered = false
	protected readonly node_hovered_color = new Color(21, 24, 22)
	protected readonly node_selected_color = new Color(14, 14, 14, 249)
	protected readonly ArrowSize = 36
	protected readonly node_arrow_size = RendererSDK.GetTextSize("»", this.FontName, this.ArrowSize, FontFlags_t.ANTIALIAS).AddScalarY(-6)
	protected readonly arrow_offset = this.text_offset.Clone().AddScalarX(15).AddScalarY(this.node_arrow_size.y).AddForThis(this.border_size)
	protected readonly node_arrow_color = new Color(68, 68, 68)
	protected readonly node_selected_arrow_color = new Color(0x40, 0x80, 0xff)
	protected active_element: Base
	protected readonly MousePosition = new Vector2()

	constructor(name: string, tooltip?: string) {
		super(name)
		this.tooltip = tooltip
		this.TotalSize_.x =
			RendererSDK.GetTextSize(this.name, this.FontName, this.FontSize, FontFlags_t.ANTIALIAS).x
			+ 15
			+ this.node_arrow_size.x
			+ this.border_size.x * 2
			+ this.text_offset.x * 2
	}

	public get ConfigValue() {
		if (this.entries.length === 0)
			return undefined
		let obj = Object.create(null)
		this.entries.forEach(entry => obj[entry.name] = entry.ConfigValue)
		return obj
	}
	public set ConfigValue(obj) {
		if (obj === undefined)
			return
		this.entries.forEach(entry => entry.ConfigValue = obj[entry.name])
	}

	public Render(): void {
		super.Render()
		RendererSDK.FilledRect(this.Position.Add(this.border_size), this.TotalSize.Subtract(this.border_size.MultiplyScalar(2)), this.is_open ? this.node_selected_color : this.is_hovered ? this.node_hovered_color : this.background_color)
		RendererSDK.Text(this.name, this.Position.Add(this.border_size).AddForThis(this.text_offset), this.FontColor, this.FontName, this.FontSize, FontFlags_t.ANTIALIAS)
		RendererSDK.Text("»", this.Position.Add(this.TotalSize).SubtractForThis(this.arrow_offset), this.is_open ? this.node_selected_arrow_color : this.node_arrow_color, this.FontName, this.ArrowSize, FontFlags_t.ANTIALIAS)
		if (!this.is_open)
			return

		// loop-optimizer: KEEP
		this.entries.forEach(entry => entry.Render())
	}

	public OnMouseLeftDown(): boolean {
		if (this.Rect.Contains(this.MousePosition))
			return false
		if (!this.is_open)
			return true
		return this.active_element === undefined && !this.entries.some(entry => {
			if (entry.OnMouseLeftDown())
				return false
			this.active_element = entry
			return true
		})
	}
	public OnMouseLeftUp(): boolean {
		if (this.Rect.Contains(this.MousePosition)) {
			this.is_open = !this.is_open
			if (this.is_open)
				this.parent.entries.filter(entry => entry !== this && entry instanceof Node).forEach((node: Node) => node.is_open = false)
			return false
		}
		if (this.active_element === undefined)
			return true
		let ret = this.active_element.OnMouseLeftUp()
		this.active_element = undefined
		Menu.UpdateConfig()
		return ret
	}
	public OnMousePositionChanged(MousePosition: Vector2): boolean {
		this.is_hovered = this.Rect.Contains(this.MousePosition)
		super.OnMousePositionChanged(MousePosition)
		if (this.active_element !== undefined)
			return this.active_element.OnMousePositionChanged(MousePosition)
		if (!this.is_open)
			return !this.is_hovered
		let entry_contains = false
		// loop-optimizer: KEEP
		this.entries.forEach(entry => entry_contains = !entry.OnMousePositionChanged(MousePosition) || entry_contains)
		return !entry_contains && !this.is_hovered
	}
	public UpdateEntriesPositions(): void {
		let max_width = this.entries.reduce((prev, entry) => Math.max(prev, entry.TotalSize_.x), 0)
		let current_pos = this.Position.Clone().AddScalarX(this.TotalSize.x + 4)
		let total_y = this.entries.reduce((prev, cur) => prev + cur.TotalSize.y, 0)
		if (current_pos.y + total_y > RendererSDK.WindowSize.y)
			current_pos.y = RendererSDK.WindowSize.y - total_y
		// loop-optimizer: FORWARD
		this.entries.forEach(entry => {
			entry.TotalSize.x = max_width
			current_pos.CopyTo(entry.Position)
			current_pos.AddScalarY(entry.TotalSize.y)
			if (entry instanceof Node)
				entry.UpdateEntriesPositions()
		})
	}

	public AddToggle(name: string, default_value: boolean = false, tooltip?: string): Toggle {
		let toggle = new Toggle(name, default_value, tooltip)
		this.entries.push(toggle)
		this.SortEntries()
		Menu.ForwardConfig()
		Menu.PositionDirty = true
		return toggle
	}
	public AddSlider(name: string, default_value = 0, min = 0, max = 100, tooltip?: string): Slider {
		let slider = new Slider(name, default_value, min, max, tooltip)
		this.entries.push(slider)
		this.SortEntries()
		Menu.ForwardConfig()
		Menu.PositionDirty = true
		return slider
	}
	public AddSliderFloat(name: string, default_value = 0, min = 0, max = 100, tooltip?: string): Slider {
		return this.AddSlider(name, default_value, min, max, tooltip)
	}
	public AddNode(name: string, tooltip?: string): Node {
		let node = this.entries.find(entry => entry instanceof Node && entry.name === name) as Node
		if (node !== undefined)
			return node
		node = new Node(name, tooltip)
		node.parent = this
		this.entries.push(node)
		this.SortEntries()
		Menu.ForwardConfig()
		Menu.PositionDirty = true
		return node
	}
	public AddSwitcher(name: string, values: string[], default_value = 0): Switcher {
		let switcher = new Switcher(name, values, default_value)
		this.entries.push(switcher)
		this.SortEntries()
		Menu.ForwardConfig()
		Menu.PositionDirty = true
		return switcher
	}
	public AddVector2(name: string, vector: Vector2, minVector?: Vector2, maxVector?: Vector2) {

		let node = this.AddNode(name);

		if (typeof minVector === "number")
			minVector = new Vector2(minVector, minVector);

		if (!(minVector instanceof Vector2))
			minVector = new Vector2(0, 0);

		if (typeof maxVector === "number")
			maxVector = new Vector2(maxVector, maxVector);

		if (!(maxVector instanceof Vector2))
			maxVector = new Vector2(95, 95);

		const X = node.AddSlider("Position: X", vector.x, minVector.x, maxVector.x);
		const Y = node.AddSlider("Position: Y", vector.y, minVector.y, maxVector.y);

		return {
			node, X, Y,
			get Vector() {
				return new Vector2(X.value, Y.value);
			},
			set Vector(vector: Vector2) {
				X.value = vector.x;
				Y.value = vector.y;
			},
		}
	}
	public AddVector3(name: string, vector: Vector3, minVector?: Vector3, maxVector?: Vector3) {

		let node = this.AddNode(name);

		if (typeof minVector === "number")
			minVector = new Vector3(minVector, minVector, minVector);

		if (!(minVector instanceof Vector3))
			minVector = new Vector3(0, 0);

		if (typeof maxVector === "number")
			maxVector = new Vector3(maxVector, maxVector, maxVector);

		if (!(maxVector instanceof Vector3))
			maxVector = new Vector3(95, 95);

		const X = node.AddSlider("Position: X", vector.x, minVector.x, maxVector.x);
		const Y = node.AddSlider("Position: Y", vector.y, minVector.y, maxVector.y);
		const Z = node.AddSlider("Position: Z", vector.z, minVector.z, maxVector.z);

		return {
			node, X, Y, Z,
			get Vector() {
				return new Vector3(X.value, Y.value, Z.value);
			},
			set Vector(vector: Vector3) {
				X.value = vector.x;
				Y.value = vector.y;
				Z.value = vector.z;
			},
		}
	}
	public AddColorPicker(name: string, color: Color = new Color(0, 255, 0), tooltip?: string) {
		let node = this.AddNode(name) as Node
		const R = node.AddSlider("Red", color.r, 0, 255)
		const G = node.AddSlider("Green", color.g, 0, 255)
		const B = node.AddSlider("Blue", color.b, 0, 255)
		const A = node.AddSlider("Alpha", color.a, 0, 255)
		return {
			R, G, B, A,
			get Color(): Color {
				return new Color(R.value, G.value, B.value, A.value)
			},
			OnValue(this: Color) { return this },
		}
	}
	public AddKeybind(name: string, default_key = "", tooltip?: string) {
		let keybind = new KeyBind(name, default_key, tooltip)
		this.entries.push(keybind)
		this.SortEntries()
		Menu.ForwardConfig()
		Menu.PositionDirty = true
		return keybind
	}
	public AddImageSelector(name: string, values: string[], default_values = new Map<string, boolean>(), tooltip?: string) {
		let image_selector = new ImageSelectror(name, values, default_values, tooltip)
		this.entries.push(image_selector)
		this.SortEntries()
		Menu.ForwardConfig()
		Menu.PositionDirty = true
		return image_selector
	}
	public AddButton(name: string, tooltip?: string): Button {
		let button = new Button(name, tooltip)
		this.entries.push(button)
		this.SortEntries()
		Menu.ForwardConfig()
		Menu.PositionDirty = true
		return button
	}

	private SortEntries(): void {
		this.entries = this.entries.sort((a, b) => a instanceof Node && b instanceof Node ? a.name.localeCompare(b.name) : 0)
	}
}
