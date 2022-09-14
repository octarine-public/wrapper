import { Color } from "../Base/Color"
import { Rectangle } from "../Base/Rectangle"
import { Vector2 } from "../Base/Vector2"
import { Vector3 } from "../Base/Vector3"
import { GUIInfo } from "../GUI/GUIInfo"
import { EventsSDK } from "../Managers/EventsSDK"
import { PARTICLE_RENDER_NAME } from "../Managers/ParticleManager"
import { RendererSDK } from "../Native/RendererSDK"
import { Base, IMenu } from "./Base"
import { Button } from "./Button"
import { ColorPicker } from "./ColorPicker"
import { Dropdown } from "./Dropdown"
import { DynamicImageSelector } from "./DynamicImageSelector"
import { ImageSelector } from "./ImageSelector"
import { IMenuParticlePicker } from "./ITypes"
import { KeyBind } from "./KeyBind"
import { Slider } from "./Slider"
import { Toggle } from "./Toggle"

export class Node extends Base {
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
		Node.text_offset_.y = GUIInfo.ScaleHeight(13)
		Node.text_offset_with_icon.x = GUIInfo.ScaleWidth(48)
		Node.text_offset_with_icon.y = Node.text_offset_.y
		Node.scrollbar_width = GUIInfo.ScaleWidth(3)
		Node.scrollbar_offset.x = GUIInfo.ScaleWidth(2)
		Node.scrollbar_offset.y = GUIInfo.ScaleHeight(2)
	}

	private static readonly arrow_active_path = "menu/arrow_active.svg"
	private static readonly arrow_inactive_path = "menu/arrow_inactive.svg"
	private static readonly scrollbar_path = "menu/scrollbar.svg"
	private static scrollbar_width = 0
	private static readonly scrollbar_offset = new Vector2()
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
	public EntriesSizeX = 0
	public EntriesSizeY = 0
	protected config_storage = Object.create(null)
	protected active_element?: Base
	protected is_open_ = false
	protected readonly text_offset = Node.text_offset_
	private ScrollPosition = 0
	private IsAtScrollEnd = true
	private VisibleEntries = 0

	constructor(parent: IMenu, name: string, private icon_path_ = "", tooltip = "", private icon_round_ = -1) {
		super(parent, name, tooltip)
	}

	public get is_open(): boolean {
		return this.parent.is_open && this.IsVisible && this.is_open_
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

	public get icon_round(): number {
		return this.icon_round_
	}
	public set icon_round(val: number) {
		this.icon_round_ = val
		this.Update()
	}

	public get ConfigValue() {
		if (!this.save_unused_configs && this.entries.length === 0)
			return undefined
		if (!this.save_unused_configs)
			this.config_storage = Object.create(null)
		this.entries.forEach(entry => {
			if (entry.SaveConfig)
				this.config_storage[entry.InternalName] = entry.ConfigValue
		})
		return this.config_storage
	}
	public set ConfigValue(obj) {
		if (obj === undefined || typeof obj !== "object" || Array.isArray(obj))
			return
		if (this.save_unused_configs)
			this.config_storage = obj
		this.entries.forEach(entry => {
			if (entry.SaveConfig)
				entry.ConfigValue = obj[entry.InternalName]
		})
	}
	public get ClassPriority(): number {
		return 7
	}
	public get ScrollVisible() {
		let remaining = -this.VisibleEntries
		for (const entry of this.entries)
			if (entry.IsVisible)
				remaining++
		return remaining > 0
	}
	private get EntriesSizeX_(): number {
		let width = 0
		for (const entry of this.entries)
			if (entry.IsVisible)
				width = Math.max(width, entry.Size.x)
		return width
	}
	private get EntriesSizeY_(): number {
		const visibleEntries = this.VisibleEntries
		let height = 0,
			cnt = 0,
			skip = this.ScrollPosition
		for (const entry of this.entries) {
			if (!entry.IsVisible || skip-- > 0)
				continue
			height += entry.Size.y
			if (++cnt >= visibleEntries)
				break
		}
		return height
	}
	private get EntriesRect() {
		const pos = this.Position
			.Clone()
			.AddScalarX(this.parent.EntriesSizeX),
			height = this.EntriesSizeY
		pos.y = Math.min(pos.y, RendererSDK.WindowSize.y - height)
		return new Rectangle(
			pos,
			pos
				.Clone()
				.AddScalarX(this.EntriesSizeX)
				.AddScalarY(height),
		)
	}
	public OnConfigLoaded() {
		this.entries.forEach(entry => {
			if (entry.SaveConfig)
				entry.OnConfigLoaded()
		})
	}
	public async Update(recursive = false): Promise<boolean> {
		if (!(await super.Update(recursive)))
			return false
		this.Size.x =
			this.name_size.x
			+ Node.arrow_size.x
			+ Node.arrow_offset.x
			+ Node.arrow_text_gap
		if (this.icon_path !== "")
			this.Size.AddScalarX(Node.text_offset_with_icon.x)
		else
			this.Size.AddScalarX(this.text_offset.x)
		if (recursive)
			for (const entry of this.entries)
				await entry.Update(true)
		this.SortEntries()
		this.UpdateScrollbar()
		this.EntriesSizeX = this.EntriesSizeX_
		this.EntriesSizeY = this.EntriesSizeY_
		return true
	}

	public async Render(): Promise<void> {
		let updatedEntries = false
		for (const entry of this.entries) {
			if (entry.QueuedUpdate) {
				entry.QueuedUpdate = false
				await entry.Update(entry.QueuedUpdateRecursive)
			}
			updatedEntries = updatedEntries || entry.NeedsRootUpdate
			entry.NeedsRootUpdate = false
		}
		if (updatedEntries) {
			await this.Update()
			updatedEntries = false
		}
		if (this.is_open) {
			this.UpdateScrollbar()
			const position = this.Position.Clone().AddScalarX(this.parent.EntriesSizeX)
			position.y = Math.min(position.y, this.WindowSize.y - this.EntriesSizeY)
			let skip = this.ScrollPosition,
				visibleEntries = this.VisibleEntries
			for (const entry of this.entries) {
				if (!entry.IsVisible || skip-- > 0)
					continue
				position.CopyTo(entry.Position)
				if (entry.QueuedUpdate) {
					entry.QueuedUpdate = false
					await entry.Update(entry.QueuedUpdateRecursive)
				}
				updatedEntries = updatedEntries || entry.NeedsRootUpdate
				await entry.Render()
				position.AddScalarY(entry.Size.y)
				if (--visibleEntries <= 0)
					break
			}
			if (updatedEntries)
				await this.Update()
		}

		await super.Render(this.parent instanceof Node) // only draw bars on non-root nodes

		const TextPos = this.Position.Clone()
		if (this.icon_path !== "") {
			TextPos.AddForThis(Node.text_offset_with_icon)
			RendererSDK.Image(this.icon_path, this.Position.Add(Node.icon_offset), this.icon_round, Node.icon_size)
		} else
			TextPos.AddForThis(this.text_offset)

		this.RenderTextDefault(this.Name, TextPos)
		const arrow_pos = this.Position
			.Clone()
			.AddScalarX(this.parent.EntriesSizeX)
			.AddScalarY(this.Size.y)
			.SubtractForThis(Node.arrow_offset)
			.SubtractForThis(Node.arrow_size)
		if (this.is_open)
			RendererSDK.Image(Node.arrow_active_path, arrow_pos, -1, Node.arrow_size)
		else
			RendererSDK.Image(Node.arrow_inactive_path, arrow_pos, -1, Node.arrow_size)
	}
	public async PostRender(): Promise<void> {
		if (!this.is_open)
			return
		for (const entry of this.entries)
			if (entry.IsVisible)
				await entry.PostRender()
		if (this.ScrollVisible) {
			const rect = this.GetScrollbarRect(this.GetScrollbarPositionsRect(this.EntriesRect))
			RendererSDK.Image(Node.scrollbar_path, rect.pos1, -1, rect.Size)
		}
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
	public OnMouseWheel(up: boolean): boolean {
		if (!this.is_open)
			return false
		if (this.ScrollVisible) {
			const rect = this.EntriesRect
			if (rect.Contains(this.MousePosition)) {
				if (up) {
					if (this.ScrollPosition > 0) {
						this.ScrollPosition--
						this.UpdateScrollbar()
					}
				} else if (!this.IsAtScrollEnd) {
					this.ScrollPosition++
					this.UpdateScrollbar()
				}
				return true
			}
		}
		return this.entries.some(entry => {
			if (entry instanceof Node)
				entry.OnMouseWheel(up)
		})
	}
	public AddToggle(name: string, default_value: boolean = false, tooltip = "", priority = 0): Toggle {
		return this.AddEntry(new Toggle(this, name, default_value, tooltip), priority)
	}
	public AddSlider(name: string, default_value = 0, min = 0, max = 100, precision = 0, tooltip = "", priority = 0): Slider {
		return this.AddEntry(new Slider(this, name, default_value, min, max, precision, tooltip), priority)
	}
	public AddNode(name: string, icon_path = "", tooltip = "", icon_round = -1, priority = 0): Node {
		const node = this.entries.find(entry => entry instanceof Node && entry.InternalName === name) as Node
		if (node !== undefined) {
			if (node.icon_path === "")
				node.icon_path = icon_path
			// TODO: should we do the same for tooltips?
			return node
		}
		return this.AddEntry(new Node(this, name, icon_path, tooltip, icon_round), priority)
	}
	public AddDropdown(name: string, values: string[], default_value = 0, tooltip = "", priority = 0): Dropdown {
		return this.AddEntry(new Dropdown(this, name, values, default_value, tooltip), priority)
	}
	public AddKeybind(name: string, default_key = "", tooltip = "", priority = 0) {
		return this.AddEntry(new KeyBind(this, name, default_key, tooltip), priority)
	}
	public AddImageSelector(name: string, values: string[], default_values = new Map<string, boolean>(), tooltip = "", created_default_state = false, priority = 0) {
		return this.AddEntry(new ImageSelector(this, name, values, default_values, tooltip, created_default_state), priority)
	}
	public AddDynamicImageSelector(
		name: string,
		values: string[],
		default_values = new Map<string, [boolean, /** default state */ boolean, /** default show */ boolean, /** show */ number /** priority */]>(),
		all_default_state = false,
		tooltip = "",
		priority = 0,
	) {
		return this.AddEntry(new DynamicImageSelector(this, name, values, default_values, all_default_state, tooltip), priority)
	}
	public AddButton(name: string, tooltip = "", priority = 0): Button {
		return this.AddEntry(new Button(this, name, tooltip), priority)
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
	public AddColorPicker(name: string, default_color: Color = new Color(0, 255, 0), tooltip = "", priority = 0): ColorPicker {
		return this.AddEntry(new ColorPicker(this, name, default_color, tooltip), priority)
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
	private GetScrollbarPositionsRect(elements_rect: Rectangle): Rectangle {
		const additionalOffset = this.parent instanceof Node ? Base.bar_width : 0
		return new Rectangle(
			new Vector2(
				elements_rect.pos1.x
				+ Node.scrollbar_offset.x
				+ additionalOffset,
				elements_rect.pos1.y
				+ Node.scrollbar_offset.y,
			),
			new Vector2(
				elements_rect.pos1.x
				+ Node.scrollbar_offset.x
				+ additionalOffset
				+ Node.scrollbar_width,
				elements_rect.pos2.y
				- Node.scrollbar_offset.y,
			),
		)
	}
	private GetScrollbarRect(scrollbar_positions_rect: Rectangle): Rectangle {
		const positions_size = scrollbar_positions_rect.Size
		const scrollbar_size = new Vector2(
			Node.scrollbar_width,
			positions_size.y * this.VisibleEntries / this.entries.length,
		)
		const scrollbar_pos = scrollbar_positions_rect.pos1.Clone().AddScalarY(
			positions_size.y * this.ScrollPosition / this.entries.length,
		)
		return new Rectangle(
			scrollbar_pos,
			scrollbar_pos.Add(scrollbar_size),
		)
	}
	private UpdateVisibleEntries() {
		this.VisibleEntries = 0
		this.IsAtScrollEnd = true
		const maxHeight = this.WindowSize.y
		let height = 0,
			skip = this.ScrollPosition
		for (let i = 0; i < this.entries.length; i++) {
			const entry = this.entries[i]
			if (!entry.IsVisible || skip-- > 0)
				continue
			height += entry.Size.y
			this.VisibleEntries++
			if (height >= maxHeight) {
				if (i < this.entries.length - 1)
					this.IsAtScrollEnd = false
				break
			}
		}
	}
	private UpdateScrollbar() {
		this.ScrollPosition = Math.max(Math.min(this.ScrollPosition, this.entries.length - 1), 0)
		this.UpdateVisibleEntries()
		while (this.ScrollPosition > 0) {
			this.ScrollPosition--
			const prevVisibleEntries = this.VisibleEntries
			this.UpdateVisibleEntries()
			if (this.VisibleEntries <= prevVisibleEntries) {
				this.ScrollPosition++
				this.UpdateVisibleEntries()
				break
			}
		}
	}

	private AddEntry<T extends Base>(entry: T, priority = entry.Priority): T {
		entry.Priority = priority
		this.entries.push(entry)
		this.SortEntries()
		this.UpdateScrollbar()
		Base.ForwardConfigASAP = true
		return entry
	}

	private SortEntries(): void {
		if (!this.sort_nodes)
			return
		this.entries = this.entries
			.sort((a, b) => a.Name.localeCompare(b.Name))
			.sort((a, b) => a.ClassPriority - b.ClassPriority)
			.sort((a, b) => a.Priority - b.Priority)
			.sort((a, b) => {
				if (a.InternalName === "State")
					return -1
				if (b.InternalName === "State")
					return 1
				return 0
			})
	}
}

EventsSDK.on("WindowSizeChanged", () => Node.OnWindowSizeChanged())
