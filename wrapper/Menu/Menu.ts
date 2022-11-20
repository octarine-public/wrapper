import { Rectangle } from "../Base/Rectangle"
import { Vector2 } from "../Base/Vector2"
import { GUIInfo } from "../GUI/GUIInfo"
import { Events } from "../Managers/Events"
import { EventsSDK } from "../Managers/EventsSDK"
import { InputEventSDK, InputManager, VMouseKeys } from "../Managers/InputManager"
import { RendererSDK } from "../Native/RendererSDK"
import { readJSON } from "../Utils/Utils"
import { Base } from "./Base"
import { Dropdown } from "./Dropdown"
import { Header } from "./Header"
import { Localization } from "./Localization"
import { Node } from "./Node"

const hardcoded_icons = new Map<string, string>(Object.entries(readJSON("hardcoded_icons.json"))),
	hardcoded_priorities = new Map<string, number>(Object.entries(readJSON("hardcoded_priorities.json")))
class CMenuManager {
	public static OnWindowSizeChanged(): void {
		CMenuManager.scrollbar_width = GUIInfo.ScaleWidth(3)
		CMenuManager.scrollbar_offset.x = GUIInfo.ScaleWidth(2)
		CMenuManager.scrollbar_offset.y = GUIInfo.ScaleHeight(2)
	}
	private static readonly scrollbar_path = "menu/scrollbar.svg"
	private static scrollbar_width = 0
	private static readonly scrollbar_offset = new Vector2()
	public entries: Node[] = []
	public config: any
	public empty_config = false
	public EntriesSizeX = 0
	public EntriesSizeY = 0
	private readonly header = new Header(this)
	private active_element?: Base
	private is_open_ = true
	private initialized_language = false
	private ScrollPosition = 0
	private IsAtScrollEnd = true
	private VisibleEntries = 0

	public get Position() {
		return this.header.Position.Clone()
	}
	public get is_open(): boolean {
		return this.is_open_
	}
	public set is_open(val: boolean) {
		if (this.is_open_ === val)
			return
		if (!val) {
			this.OnMouseLeftUp()
			this.entries.forEach(entry => entry.OnParentNotVisible())
		}
		this.is_open_ = val
	}
	public get IsVisible() {
		return this.is_open
	}

	public get ConfigValue() {
		this.config = Object.create(null)
		this.entries.forEach(entry => {
			if (entry.SaveConfig)
				this.config[entry.InternalName] = entry.ConfigValue
		})
		this.config.Header = this.header.ConfigValue
		this.config.SelectedLocalization = Localization.SelectedUnitName
		return this.config
	}
	public set ConfigValue(obj) {
		this.config = obj
		this.ForwardConfig()
	}

	public get ScrollVisible() {
		let remaining = -this.VisibleEntries
		for (const entry of this.entries)
			if (entry.IsVisible)
				remaining++
		return remaining > 0
	}

	private get EntriesSizeX_(): number {
		let width = this.header.Size.x
		for (const entry of this.entries)
			if (entry.IsVisible)
				width = Math.max(width, entry.Size.x)
		return width
	}
	private get EntriesSizeY_(): number {
		const visibleEntries = this.VisibleEntries
		let height = this.header.Size.y,
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
		const pos = this.header.Position
			.Clone()
			.AddScalarY(this.header.Size.y),
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

	public async LoadConfig() {
		if (!IS_MAIN_WORKER)
			return // workers shouldn't propagate configs
		try {
			this.ConfigValue = JSON.parse(await readConfig())
		} catch {
			this.empty_config = true
			this.ConfigValue = {}
		} finally {
			this.header.ConfigValue = this.config.Header
			if (this.config.SelectedLocalization !== undefined && this.config.SelectedLocalization !== "") {
				Localization.SelectedUnitName = this.config.SelectedLocalization
				this.initialized_language = true
			}
			this.Update(true)
		}
	}
	public Render(): void {
		if (this.config === undefined)
			return
		if (!this.initialized_language && Localization.PreferredUnitName !== "") {
			Localization.SelectedUnitName = Localization.PreferredUnitName
			this.initialized_language = true
		}
		this.ForwardConfig()
		if (Localization.was_changed) {
			this.Update(true)
			Localization.was_changed = false
			Base.SaveConfigASAP = true
		}
		if (Base.SaveConfigASAP) {
			writeConfig(JSON.stringify(this.ConfigValue))
			Base.SaveConfigASAP = false
		}
		if (!this.is_open)
			return
		if (this.header.QueuedUpdate) {
			this.header.QueuedUpdate = false
			this.header.Update(this.header.QueuedUpdateRecursive)
		}
		let updatedEntries = false
		for (const entry of this.entries) {
			if (entry.QueuedUpdate) {
				entry.QueuedUpdate = false
				entry.Update(entry.QueuedUpdateRecursive)
			}
			updatedEntries = updatedEntries || entry.NeedsRootUpdate
			entry.NeedsRootUpdate = false
		}
		if (updatedEntries) {
			this.Update()
			updatedEntries = false
		}
		this.UpdateScrollbar()
		this.header.Render()
		const position = this.header.Position.Clone().AddScalarY(this.header.Size.y)
		let skip = this.ScrollPosition,
			visibleEntries = this.VisibleEntries
		for (const entry of this.entries) {
			if (!entry.IsVisible || skip-- > 0)
				continue
			position.CopyTo(entry.Position)
			if (entry.QueuedUpdate) {
				entry.QueuedUpdate = false
				entry.Update(entry.QueuedUpdateRecursive)
			}
			updatedEntries = updatedEntries || entry.NeedsRootUpdate
			entry.Render()
			position.AddScalarY(entry.Size.y)
			if (--visibleEntries <= 0)
				break
		}
		if (updatedEntries)
			this.Update()
		for (const node of this.entries)
			if (node.IsVisible)
				node.PostRender()
		this.PostRender()
	}
	public Update(recursive = false): void {
		if (recursive)
			for (const entry of this.entries)
				entry.Update(true)
		this.UpdateScrollbar()
		this.EntriesSizeX = this.EntriesSizeX_
		this.EntriesSizeY = this.EntriesSizeY_
	}

	public OnMouseLeftDown(): boolean {
		if (!this.is_open)
			return true
		if (!this.header.OnMouseLeftDown()) {
			this.active_element = this.header
			return false
		}
		for (const node of this.entries)
			if (node.IsVisible && !node.OnMouseLeftDown()) {
				this.active_element = node
				return false
			}
		return true
	}
	public OnMouseLeftUp(): boolean {
		if (!this.is_open || this.active_element === undefined)
			return true
		const ret = this.active_element.OnMouseLeftUp()
		if (this.active_element === this.header)
			Base.SaveConfigASAP = true
		this.active_element = undefined
		return ret
	}
	public OnMouseWheel(up: boolean): boolean {
		if (!this.is_open)
			return false
		if (this.ScrollVisible) {
			const rect = this.EntriesRect
			if (rect.Contains(InputManager.CursorOnScreen)) {
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
	public AddEntry(name: string, icon_path = "", tooltip = "", icon_round = -1): Node {
		let node = this.entries.find(entry => entry.InternalName === name)
		if (node !== undefined) {
			if (node.icon_path === "")
				node.icon_path = icon_path
			return node
		}
		if (hardcoded_icons.has(name))
			icon_path = hardcoded_icons.get(name)!
		node = new Node(this, name, icon_path, tooltip, icon_round)
		if (hardcoded_priorities.has(name))
			node.Priority = hardcoded_priorities.get(name)!
		node.parent = this
		this.entries.push(node)
		this.entries = this.entries
			.sort((a, b) => a.Name.localeCompare(b.Name))
			.sort((a, b) => a.Priority - b.Priority)
		return node
	}
	public AddEntryDeep(names: string[], icon_paths: string[] = []): Node {
		if (names.length === 0)
			throw "Invalid names array passed to Menu.AddEntryDeep"
		return names.reduce((prev, cur, i) => {
			if (i === 0)
				return prev
			const icon_path_id = names.length - i - 1
			const icon_path = icon_path_id < icon_paths.length
				? icon_paths[icon_path_id]
				: ""
			return prev.AddNode(cur, icon_path)
		}, this.AddEntry(names[0]))
	}
	private GetScrollbarPositionsRect(elements_rect: Rectangle): Rectangle {
		return new Rectangle(
			new Vector2(
				elements_rect.pos1.x
				+ CMenuManager.scrollbar_offset.x,
				elements_rect.pos1.y
				+ CMenuManager.scrollbar_offset.y,
			),
			new Vector2(
				elements_rect.pos1.x
				+ CMenuManager.scrollbar_offset.x
				+ CMenuManager.scrollbar_width,
				elements_rect.pos2.y
				- CMenuManager.scrollbar_offset.y,
			),
		)
	}
	private GetScrollbarRect(scrollbar_positions_rect: Rectangle): Rectangle {
		const positions_size = scrollbar_positions_rect.Size
		const scrollbar_size = new Vector2(
			CMenuManager.scrollbar_width,
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
	private PostRender(): void {
		if (!this.is_open)
			return
		if (this.ScrollVisible) {
			const rect = this.GetScrollbarRect(this.GetScrollbarPositionsRect(this.EntriesRect))
			RendererSDK.Image(CMenuManager.scrollbar_path, rect.pos1, -1, rect.Size)
		}
	}
	private UpdateVisibleEntries() {
		this.VisibleEntries = 0
		this.IsAtScrollEnd = true
		const maxHeight = RendererSDK.WindowSize.y
		let height = this.header.Size.y,
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
	private ForwardConfig() {
		while (Base.ForwardConfigASAP && this.config !== undefined) {
			Base.ForwardConfigASAP = false
			this.entries.forEach(entry => {
				if (entry.SaveConfig)
					entry.ConfigValue = this.config[entry.InternalName]
			})
			this.entries.forEach(entry => {
				if (entry.SaveConfig)
					entry.OnConfigLoaded()
			})
		}
	}
}
export const MenuManager = new CMenuManager()
await MenuManager.LoadConfig()

Events.after("Draw", () => {
	MenuManager.Render()
	RendererSDK.EmitDraw()
})

EventsSDK.on("WindowSizeChanged", () => MenuManager.Update(true))
EventsSDK.on("UnitAbilityDataUpdated", () => MenuManager.Update(true))

InputEventSDK.on("MouseKeyDown", key => {
	if (key === VMouseKeys.MK_LBUTTON)
		return MenuManager.OnMouseLeftDown()
	return true
})
InputEventSDK.on("MouseKeyUp", key => {
	if (key === VMouseKeys.MK_LBUTTON)
		return MenuManager.OnMouseLeftUp()
	return true
})

InputEventSDK.on("MouseWheel", up => {
	const active_dropdown = Dropdown.active_dropdown
	if (active_dropdown?.IsVisible && active_dropdown.OnMouseWheel(up))
		return false
	return !MenuManager.OnMouseWheel(up)
})

EventsSDK.on("WindowSizeChanged", () => CMenuManager.OnWindowSizeChanged())
