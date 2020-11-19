import Color from "../Base/Color"
import Vector2 from "../Base/Vector2"
import Vector3 from "../Base/Vector3"
import { PARTICLE_RENDER_NAME } from "../Managers/ParticleManager"
import RendererSDK from "../Native/RendererSDK"
import Base, { IMenu } from "./Base"
import Button from "./Button"
import ImageSelector from "./ImageSelector"
import { IMenuColorPicker, IMenuParticlePicker } from "./ITypes"
import KeyBind from "./KeyBind"
import Menu from "./Menu"
import Slider from "./Slider"
import Switcher from "./Switcher"
import Toggle from "./Toggle"

export default class Node extends Base {
	public entries: Base[] = []
	public is_open = false
	public is_hovered = false
	protected readonly node_hovered_color = new Color(21, 24, 22)
	protected readonly node_selected_color = new Color(14, 14, 14, 249)
	protected readonly SizeImageNode = new Vector2(24, 24)
	protected readonly ArrowSize = 36
	protected readonly node_arrow_size = RendererSDK.GetTextSize("»", this.FontName, this.ArrowSize).SubtractScalarY(13)
	protected readonly arrow_offset = this.text_offset.Clone().AddScalarX(15).AddScalarY(this.node_arrow_size.y).AddForThis(this.border_size)
	protected readonly node_arrow_color = new Color(68, 68, 68)
	protected readonly node_selected_arrow_color = new Color(0x40, 0x80, 0xff)
	protected active_element?: Base

	constructor(parent: IMenu, name: string, protected readonly icon_path = "", tooltip = "") {
		super(parent, name, tooltip)
	}

	public get ConfigValue() {
		if (this.entries.length === 0)
			return undefined
		const obj = Object.create(null)
		this.entries.forEach(entry => obj[entry.InternalName] = entry.ConfigValue)
		return obj
	}
	public set ConfigValue(obj) {
		if (obj === undefined)
			return
		this.entries.forEach(entry => entry.ConfigValue = obj[entry.InternalName])
	}
	public OnConfigLoaded() {
		this.entries.forEach(entry => entry.OnConfigLoaded())
	}
	public ApplyLocalization() {
		this.entries.forEach(entry => entry.ApplyLocalization())
		super.ApplyLocalization()
	}
	public Update() {
		this.TotalSize.x =
			RendererSDK.GetTextSize(this.Name, this.FontName, this.FontSize).x
			+ 15
			+ this.node_arrow_size.x
			+ this.SizeImageNode.x
			+ this.border_size.x * 2
			+ this.text_offset.x * 2
			+ (this.icon_path !== "" ? this.SizeImageNode.x : 0)
		super.Update()
	}

	public Render(): void {
		super.Render()
		this.is_hovered = this.Rect.Contains(this.MousePosition)
		const TextPos = this.Position.Add(this.border_size).AddForThis(this.text_offset).AddScalarY(this.FontSize)
		RendererSDK.FilledRect(this.Position.Add(this.border_size), this.TotalSize.Subtract(this.border_size.MultiplyScalar(2)), this.is_open ? this.node_selected_color : this.is_hovered ? this.node_hovered_color : this.background_color)

		if (this.icon_path !== "") {
			TextPos.AddScalarX(this.SizeImageNode.x)
			RendererSDK.Image(this.icon_path, this.Position.Add(this.border_size).AddForThis(this.text_offset).SubtractScalarX(5), -1, this.SizeImageNode)
		}

		RendererSDK.Text(this.Name, TextPos, this.FontColor, this.FontName, this.FontSize)
		RendererSDK.Text("»", this.Position.Add(this.TotalSize).SubtractForThis(this.arrow_offset), this.is_open ? this.node_selected_arrow_color : this.node_arrow_color, this.FontName, this.ArrowSize)
		if (!this.is_open)
			return

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
				this.parent.entries.forEach(entry => {
					if (entry instanceof Node && entry !== this)
						entry.is_open = false
				})
			return false
		}
		if (this.active_element === undefined)
			return true
		const ret = this.active_element.OnMouseLeftUp()
		this.active_element = undefined
		Menu.UpdateConfig()
		return ret
	}
	public UpdateEntriesPositions(): void {
		const max_width = this.entries.reduce((prev, entry) => Math.max(prev, entry.TotalSize.x), 0),
			current_pos = this.Position.Clone().AddScalarX(this.TotalSize.x + 4),
			total_y = this.entries.reduce((prev, cur) => prev + cur.TotalSize.y, 0)
		if (current_pos.y + total_y > RendererSDK.WindowSize.y)
			current_pos.y = RendererSDK.WindowSize.y - total_y
		this.entries.forEach(entry => {
			entry.TotalSize.x = max_width
			current_pos.CopyTo(entry.Position)
			current_pos.AddScalarY(entry.TotalSize.y)
			if (entry instanceof Node)
				entry.UpdateEntriesPositions()
		})
	}
	public AddToggle(name: string, default_value: boolean = false, tooltip = ""): Toggle {
		return this.AddEntry(new Toggle(this, name, default_value, tooltip))
	}
	public AddSlider(name: string, default_value = 0, min = 0, max = 100, tooltip = ""): Slider {
		return this.AddEntry(new Slider(this, name, default_value, min, max, tooltip))
	}
	public AddNode(name: string, icon_path = "", tooltip = ""): Node {
		const node = this.entries.find(entry => entry instanceof Node && entry.InternalName === name) as Node
		if (node !== undefined)
			return node
		return this.AddEntry(new Node(this, name, icon_path, tooltip))
	}
	public AddSwitcher(name: string, values: string[], default_value = 0, tooltip = ""): Switcher {
		return this.AddEntry(new Switcher(this, name, values, default_value, tooltip))
	}
	public AddKeybind(name: string, default_key = "", tooltip = "") {
		return this.AddEntry(new KeyBind(this, name, default_key, tooltip))
	}
	public AddImageSelector(name: string, values: string[], default_values = new Map<string, boolean>(), tooltip = "") {
		return this.AddEntry(new ImageSelector(this, name, values, default_values, tooltip))
	}
	public AddButton(name: string, tooltip = ""): Button {
		return this.AddEntry(new Button(this, name, tooltip))
	}

	public AddVector2(name: string, vector: Vector2, minVector?: Vector2 | number, maxVector?: Vector2 | number) {
		const node = this.AddNode(name)

		if (typeof minVector === "number")
			minVector = new Vector2(minVector, minVector)

		if (!(minVector instanceof Vector2))
			minVector = new Vector2(0, 0)

		if (typeof maxVector === "number")
			maxVector = new Vector2(maxVector, maxVector)

		if (!(maxVector instanceof Vector2))
			maxVector = new Vector2(95, 95)

		const X = node.AddSlider("Position: X", vector.x, minVector.x, maxVector.x)
		const Y = node.AddSlider("Position: Y", vector.y, minVector.y, maxVector.y)

		return {
			node, X, Y,
			get Vector() {
				return new Vector2(X.value, Y.value)
			},
			set Vector({ x, y }: Vector2) {
				X.value = x
				Y.value = y
			},
		}
	}
	public AddVector3(name: string, vector: Vector3, minVector?: Vector3 | number, maxVector?: Vector3 | number) {
		const node = this.AddNode(name)

		if (typeof minVector === "number")
			minVector = new Vector3(minVector, minVector, minVector)

		if (!(minVector instanceof Vector3))
			minVector = new Vector3(0, 0)

		if (typeof maxVector === "number")
			maxVector = new Vector3(maxVector, maxVector, maxVector)

		if (!(maxVector instanceof Vector3))
			maxVector = new Vector3(95, 95)

		const X = node.AddSlider("Position: X", vector.x, minVector.x, maxVector.x)
		const Y = node.AddSlider("Position: Y", vector.y, minVector.y, maxVector.y)
		const Z = node.AddSlider("Position: Z", vector.z, minVector.z, maxVector.z)

		return {
			node, X, Y, Z,
			get Vector() {
				return new Vector3(X.value, Y.value, Z.value)
			},
			set Vector({ x, y, z }: Vector3) {
				X.value = x
				Y.value = y
				Z.value = z
			}
		}
	}
	public AddColorPicker(name: string, color: Color = new Color(0, 255, 0), tooltip = ""): IMenuColorPicker {
		const node = this.AddNode(name)

		const R = node.AddSlider("Red", color.r, 0, 255)
		const G = node.AddSlider("Green", color.g, 0, 255)
		const B = node.AddSlider("Blue", color.b, 0, 255)
		const A = node.AddSlider("Alpha", color.a, 0, 255)

		return {
			Node: node,
			R, G, B, A,
			get Color(): Color {
				return new Color(R.value, G.value, B.value, A.value)
			},
			set Color({ r, g, b, a }: Color) {
				R.value = r
				G.value = g
				B.value = b
				A.value = a
			}
		}
	}

	public AddParticlePicker(
		name: string,
		color: Color | number = new Color(0, 255, 0),
		render: PARTICLE_RENDER_NAME[],
		addStateToTree?: boolean[]
	): IMenuParticlePicker {
		const node = this.AddNode(name)

		let State: Nullable<Toggle>

		if (addStateToTree !== undefined && addStateToTree[0]) {
			State = node.AddToggle("State", addStateToTree[1])
		}

		if (typeof color === "number")
			color = new Color(color, color, color)

		const R = node.AddSlider("Color: R (red)", color.r, 0, 255)
		const G = node.AddSlider("Color: G (green)", color.g, 0, 255)
		const B = node.AddSlider("Color: B (blue)", color.b, 0, 255)
		const A = node.AddSlider("Opacity (alpha)", color.a, 1, 255)

		const Width = node.AddSlider("Width", 15, 1, 150)
		const Style = node.AddSwitcher("Style", render)

		return {
			Node: node,
			State,
			R, G, B, A,
			Width, Style,
			get Color(): Color {
				return new Color(R.value, G.value, B.value, A.value)
			},
			set Color({ r, g, b, a }: Color) {
				R.value = r
				G.value = g
				B.value = b
				A.value = a
			}
		}
	}

	private AddEntry<T extends Base>(entry: T): T {
		this.entries.push(entry)
		this.SortEntries()
		Menu.ForwardConfigASAP = true
		Menu.PositionDirty = true
		return entry
	}

	private SortEntries(): void {
		this.entries = this.entries.sort((a, b) => a instanceof Node && b instanceof Node ? a.Name.localeCompare(b.Name) : 0)
	}
}
