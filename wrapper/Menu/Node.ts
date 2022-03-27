import Color from "../Base/Color"
import Vector2 from "../Base/Vector2"
import Vector3 from "../Base/Vector3"
import GUIInfo from "../GUI/GUIInfo"
import EventsSDK from "../Managers/EventsSDK"
import { PARTICLE_RENDER_NAME } from "../Managers/ParticleManager"
import RendererSDK from "../Native/RendererSDK"
import Base, { IMenu } from "./Base"
import Button from "./Button"
import ColorPicker from "./ColorPicker"
import Dropdown from "./Dropdown"
import ImageSelector from "./ImageSelector"
import { IMenuParticlePicker } from "./ITypes"
import KeyBind from "./KeyBind"
import Slider from "./Slider"
import Toggle from "./Toggle"

export default class Node extends Base {
	public static OnWindowSizeChanged(): void {
		Node.arrow_size.x = GUIInfo.ScaleWidth(Node.orig_arrow_size.x)
		Node.arrow_size.y = GUIInfo.ScaleHeight(Node.orig_arrow_size.y)
		Node.arrow_offset.x = GUIInfo.ScaleWidth(8)
		Node.arrow_offset.y = GUIInfo.ScaleHeight(8)
		Node.arrow_text_gap = GUIInfo.ScaleWidth(10)
		Node.icon_size.x = GUIInfo.ScaleWidth(24)
		Node.icon_size.y = GUIInfo.ScaleHeight(24)
		Node.icon_offset.x = GUIInfo.ScaleWidth(12)
		Node.icon_offset.y = GUIInfo.ScaleHeight(8)
		Node.text_offset_.x = GUIInfo.ScaleWidth(15)
		Node.text_offset_.y = GUIInfo.ScaleHeight(14)
		Node.text_offset_with_icon.x = GUIInfo.ScaleWidth(48)
		Node.text_offset_with_icon.y = GUIInfo.ScaleHeight(14)
	}

	private static readonly arrow_active_path = "menu/arrow_active.svg"
	private static readonly arrow_inactive_path = "menu/arrow_inactive.svg"
	private static readonly orig_arrow_size = RendererSDK.GetImageSize(Node.arrow_inactive_path)
	private static readonly arrow_size = new Vector2()
	private static readonly arrow_offset = new Vector2()
	private static arrow_text_gap = 0
	private static readonly icon_size = new Vector2()
	private static readonly icon_offset = new Vector2()
	private static readonly text_offset_ = new Vector2(15, 14)
	private static readonly text_offset_with_icon = new Vector2()

	public entries: Base[] = []
	public save_unused_configs = false
	public sort_nodes = true
	protected config_storage = Object.create(null)
	protected active_element?: Base
	protected is_open_ = false
	protected readonly text_offset = Node.text_offset_

	constructor(parent: IMenu, name: string, private icon_path_ = "", tooltip = "") {
		super(parent, name, tooltip)
	}

	public get is_open(): boolean {
		return this.is_open_
	}
	public set is_open(val: boolean) {
		if (this.is_open_ === val)
			return
		if (!val)
			this.OnMouseLeftUp(true)
		this.is_open_ = val
		this.is_active = val
	}
	public get icon_path(): string {
		return this.icon_path_
	}
	public set icon_path(val: string) {
		this.icon_path_ = val
		this.Update()
	}

	public get ConfigValue() {
		if (!this.save_unused_configs && this.entries.length === 0)
			return undefined
		if (!this.save_unused_configs)
			this.config_storage = Object.create(null)
		this.entries.forEach(entry => {
			const name = entry.InternalName
			if (name === "" || name.includes("."))
				return
			this.config_storage[name] = entry.ConfigValue
		})
		Object.getOwnPropertyNames(this.config_storage).forEach(name => {
			if (name === "" || name.includes("."))
				delete this.config_storage[name]
		})
		return this.config_storage
	}
	public set ConfigValue(obj) {
		if (obj === undefined)
			return
		if (this.save_unused_configs)
			this.config_storage = obj
		this.entries.forEach(entry => entry.ConfigValue = obj[entry.InternalName])
	}
	public get EntriesSizeX(): number {
		return this.entries.reduce(
			(prev, cur) => Math.max(prev, cur.IsVisible ? cur.OriginalSize.x : 0),
			this.OriginalSize.x,
		)
	}
	public get EntriesSizeY(): number {
		return this.entries.reduce(
			(prev, cur) => prev + (cur.IsVisible ? cur.OriginalSize.y : 0),
			0,
		)
	}
	public OnConfigLoaded() {
		this.entries.forEach(entry => entry.OnConfigLoaded())
	}
	public ApplyLocalization() {
		this.entries.forEach(entry => entry.ApplyLocalization())
		super.ApplyLocalization()
	}
	public async Update(recursive = false): Promise<boolean> {
		if (!(await super.Update()))
			return false
		this.OriginalSize.x =
			this.name_size.x
			+ Node.arrow_size.x
			+ Node.arrow_offset.x
			+ Node.arrow_text_gap
		if (this.icon_path !== "")
			this.OriginalSize.AddScalarX(Node.text_offset_with_icon.x)
		else
			this.OriginalSize.AddScalarX(this.text_offset.x)
		if (recursive)
			this.entries.forEach(entry => entry.Update(true))
		return true
	}

	public async Render(): Promise<void> {
		if (this.is_open) {
			const position = this.Position.Clone().AddScalarX(this.TotalSize.x),
				max_width = this.EntriesSizeX
			position.y = Math.min(position.y, this.WindowSize.y - this.EntriesSizeY)
			for (const entry of this.entries)
				if (entry.IsVisible) {
					position.CopyTo(entry.Position)
					entry.TotalSize.x = max_width
					entry.TotalSize.y = entry.OriginalSize.y
					if (entry.QueuedUpdate) {
						entry.QueuedUpdate = false
						await entry.Update()
					}
					await entry.Render()
					position.AddScalarY(entry.TotalSize.y)
				}
		}

		await super.Render(this.parent instanceof Node) // only draw bars on non-root nodes

		const TextPos = this.Position.Clone()
		if (this.icon_path !== "") {
			TextPos.AddForThis(Node.text_offset_with_icon)
			RendererSDK.Image(this.icon_path, this.Position.Add(Node.icon_offset), -1, Node.icon_size)
		} else
			TextPos.AddForThis(this.text_offset)

		this.RenderTextDefault(this.Name, TextPos)
		const arrow_pos = this.Position.Add(this.TotalSize).SubtractForThis(Node.arrow_offset).SubtractForThis(Node.arrow_size)
		if (this.is_open)
			RendererSDK.Image(Node.arrow_active_path, arrow_pos, -1, Node.arrow_size)
		else
			RendererSDK.Image(Node.arrow_inactive_path, arrow_pos, -1, Node.arrow_size)
	}
	public async PostRender(): Promise<void> {
		if (this.is_open)
			for (const entry of this.entries)
				if (entry.IsVisible)
					await entry.PostRender()
	}

	public OnParentNotVisible(ignore_open = false): void {
		if (ignore_open || this.is_open)
			this.entries.forEach(entry => entry.OnParentNotVisible())
	}

	public async OnMouseLeftDown(): Promise<boolean> {
		if (this.active_element !== undefined || this.IsHovered)
			return false
		if (!this.is_open)
			return true
		for (const entry of this.entries)
			if (entry.IsVisible && !await entry.OnPreMouseLeftDown()) {
				this.active_element = entry
				return false
			}
		for (const entry of this.entries)
			if (entry.IsVisible && !await entry.OnMouseLeftDown()) {
				this.active_element = entry
				return false
			}
		return true
	}
	public async OnMouseLeftUp(ignore_myself = false): Promise<boolean> {
		if (!ignore_myself && this.IsHovered) {
			this.is_open = !this.is_open
			if (this.is_open)
				this.parent.entries.forEach(entry => {
					if (entry instanceof Node && entry !== this)
						entry.is_open = false
				})
			else
				this.OnParentNotVisible(true)
			return false
		}
		if (this.active_element === undefined)
			return true
		const ret = this.active_element.OnMouseLeftUp()
		this.active_element = undefined
		Base.SaveConfigASAP = true
		return ret
	}
	public AddToggle(name: string, default_value: boolean = false, tooltip = ""): Toggle {
		return this.AddEntry(new Toggle(this, name, default_value, tooltip))
	}
	public AddSlider(name: string, default_value = 0, min = 0, max = 100, precision = 0, tooltip = ""): Slider {
		return this.AddEntry(new Slider(this, name, default_value, min, max, precision, tooltip))
	}
	public AddNode(name: string, icon_path = "", tooltip = ""): Node {
		const node = this.entries.find(entry => entry instanceof Node && entry.InternalName === name) as Node
		if (node !== undefined) {
			if (node.icon_path === "")
				node.icon_path = icon_path
			// TODO: should we do the same for tooltips?
			return node
		}
		return this.AddEntry(new Node(this, name, icon_path, tooltip))
	}
	public AddDropdown(name: string, values: string[], default_value = 0, tooltip = ""): Dropdown {
		return this.AddEntry(new Dropdown(this, name, values, default_value, tooltip))
	}
	public AddKeybind(name: string, default_key = "", tooltip = "") {
		return this.AddEntry(new KeyBind(this, name, default_key, tooltip))
	}
	public AddImageSelector(name: string, values: string[], default_values = new Map<string, boolean>(), tooltip = "", created_default_state = false, drag_and_drop = false) {
		return this.AddEntry(new ImageSelector(this, name, values, default_values, tooltip, created_default_state, drag_and_drop))
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
			},
		}
	}
	public AddColorPicker(name: string, default_color: Color = new Color(0, 255, 0), tooltip = ""): ColorPicker {
		return this.AddEntry(new ColorPicker(this, name, default_color, tooltip))
	}

	public AddParticlePicker(
		name: string,
		color: Color | number = new Color(0, 255, 0),
		render: PARTICLE_RENDER_NAME[],
		addStateToTree?: boolean[],
	): IMenuParticlePicker {
		const node = this.AddNode(name)

		let State: Nullable<Toggle>
		if (addStateToTree !== undefined && addStateToTree[0])
			State = node.AddToggle("State", addStateToTree[1])

		if (typeof color === "number")
			color = new Color(color, color, color)

		return {
			Node: node,
			State,
			Color: node.AddColorPicker("Color", color),
			Width: node.AddSlider("Width", 15, 1, 150),
			Style: node.AddDropdown("Style", render),
		}
	}

	private AddEntry<T extends Base>(entry: T): T {
		this.entries.push(entry)
		this.SortEntries()
		entry.ApplyLocalization()
		Base.ForwardConfigASAP = true
		return entry
	}

	private SortEntries(): void {
		if (!this.sort_nodes)
			return
		this.entries = this.entries.sort((a, b) => a instanceof Node && b instanceof Node ? a.Name.localeCompare(b.Name) : 0)
		this.entries = this.entries.sort((a, b) => a.Priority - b.Priority)
	}
}

EventsSDK.on("WindowSizeChanged", () => Node.OnWindowSizeChanged())
