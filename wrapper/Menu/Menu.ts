import { Rectangle } from "../Base/Rectangle"
import { Vector2 } from "../Base/Vector2"
import { GUIInfo } from "../GUI/GUIInfo"
import { Events } from "../Managers/Events"
import { EventsSDK } from "../Managers/EventsSDK"
import { InputEventSDK, InputManager, VMouseKeys } from "../Managers/InputManager"
import { RendererSDK } from "../Native/RendererSDK"
import { readJSON } from "../Utils/Utils"
import { Base } from "./Base"
import { ColorPicker } from "./ColorPicker"
import { Dropdown } from "./Dropdown"
import { Header } from "./Header"
import { KeyBind } from "./KeyBind"
import { Localization } from "./Localization"
import { Node } from "./Node"
import { Slider } from "./Slider"

const hardcodedIcons = new Map<string, string>(
		Object.entries(readJSON("hardcoded_icons.json"))
	),
	hardcodedPriorities = new Map<string, number>(
		Object.entries(readJSON("hardcoded_priorities.json"))
	)
class CMenuManager {
	public static OnWindowSizeChanged(): void {
		CMenuManager.scrollbarWidth = GUIInfo.ScaleWidth(3)
		CMenuManager.scrollbarOffset.x = GUIInfo.ScaleWidth(2)
		CMenuManager.scrollbarOffset.y = GUIInfo.ScaleHeight(2)
	}
	private static readonly scrollbarPath = "menu/scrollbar.svg"
	private static scrollbarWidth = 0
	private static readonly scrollbarOffset = new Vector2()
	public entries: Node[] = []
	public config: any
	public emptyConfig = false
	public EntriesSizeX = 0
	public EntriesSizeY = 0
	private readonly header = new Header(this)
	private activeElement?: Base
	private IsOpen_ = true
	private initializedLanguage = false
	private ScrollPosition = 0
	private IsAtScrollEnd = true
	private VisibleEntries = 0

	public get Position() {
		return this.header.Position.Clone()
	}
	public get IsOpen(): boolean {
		return this.IsOpen_
	}
	public set IsOpen(val: boolean) {
		if (this.IsOpen_ === val) {
			return
		}
		if (!val) {
			this.OnMouseLeftUp()
			const entries = this.entries
			for (let i = 0, end = entries.length; i < end; i++) {
				const entry = entries[i]
				if (entry !== undefined) {
					entry.OnParentNotVisible()
				}
			}
		}
		this.IsOpen_ = val
	}
	public get IsVisible() {
		return this.IsOpen
	}

	public get ConfigValue() {
		//this.config = Object.create(null)
		this.config = Object.create(null)

		this.entries.forEach(e => {
			if (e?.SaveConfig) {
				this.config[e.InternalName] = e.ConfigValue
			}
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
		const entries = this.entries
		for (let i = 0, end = entries.length; i < end; i++) {
			const entry = entries[i]
			if (entry !== undefined) {
				remaining++
			}
		}
		return remaining > 0
	}

	private get EntriesSizeX_(): number {
		let width = this.header.Size.x
		const entries = this.entries
		for (let i = 0, end = entries.length; i < end; i++) {
			const entry = entries[i]
			if (entry !== undefined && entry.IsVisible) {
				width = Math.max(width, entry.Size.x)
			}
		}
		return width
	}
	private get EntriesSizeY_(): number {
		const visibleEntries = this.VisibleEntries
		let height = this.header.Size.y,
			cnt = 0,
			skip = this.ScrollPosition
		const entries = this.entries
		for (let i = 0, end = entries.length; i < end; i++) {
			const entry = entries[i]
			if (entry === undefined || !entry.IsVisible || skip-- > 0) {
				continue
			}
			height += entry.Size.y
			if (++cnt >= visibleEntries) {
				break
			}
		}
		return height
	}
	private get EntriesRect() {
		const pos = this.header.Position.Clone().AddScalarY(this.header.Size.y),
			height = this.EntriesSizeY
		pos.y = Math.min(pos.y, RendererSDK.WindowSize.y - height)
		return new Rectangle(
			pos,
			pos.Clone().AddScalarX(this.EntriesSizeX).AddScalarY(height)
		)
	}
	private foreachRecursiveInternal(element: Base, cb: (element: Base) => any) {
		if (element && (cb(element), true) && element instanceof Node) {
			element.entries.forEach(e => this.foreachRecursiveInternal(e, cb))
		}
	}
	public foreachRecursive(cb: (element: Base) => any) {
		this.entries.forEach(node => this.foreachRecursiveInternal(node, cb))
	}

	public async LoadConfig() {
		try {
			this.ConfigValue = JSON.parse(await readConfig())
		} catch {
			this.emptyConfig = true
			this.ConfigValue = {}
		} finally {
			this.header.ConfigValue = this.config.Header
			if (
				this.config.SelectedLocalization !== undefined &&
				this.config.SelectedLocalization !== ""
			) {
				Localization.SelectedUnitName = this.config.SelectedLocalization
				this.initializedLanguage = true
			}
			this.Update(true)
		}
	}
	public Render(): void {
		if (this.config === undefined) {
			return
		}
		if (!this.initializedLanguage && Localization.PreferredUnitName !== "") {
			Localization.SelectedUnitName = Localization.PreferredUnitName
			this.initializedLanguage = true
		}
		this.ForwardConfig()
		if (Localization.wasChanged) {
			this.Update(true)
			Localization.wasChanged = false
			Base.SaveConfigASAP = true
		}

		if (this.entries.length === 1) {
			Base.NoWriteConfig = true

			const main = this.entries[0]

			main.Name = main.InternalName = "Try to reload"
			main.IconPath = "menu/icons/reload.svg"

			if (RendererSDK.GetFont(main.FontName, main.FontWeight, false) === -1) {
				RendererSDK.CreateFont(
					main.FontName,
					"fonts/PTSans/PTSans-Regular.ttf",
					main.FontWeight,
					false
				)
			}
			if (main.IsOpen) {
				main.IsOpen = false
				reload()
			}
		}

		if (Base.SaveConfigASAP) {
			const config = this.ConfigValue
			if (Base.NoWriteConfig) {
				console.log("NoWriteConfig prevented from saving config", { ...config })
			} else {
				writeConfig(JSON.stringify(config))
			}

			Base.SaveConfigASAP = false
			EventsSDK.emit("MenuConfigChanged", false, config)
		}

		const popup = Node.ActivePopup?.Target.parent

		Base.HoveredElement = undefined
		Base.ActiveElement =
			Slider.DraggingNow ??
			KeyBind.changingNow ??
			Dropdown.activeDropdown ??
			ColorPicker.activeColorpicker ??
			(popup instanceof Base ? popup : undefined)

		if (!this.IsOpen) {
			return
		}
		if (this.header.QueuedUpdate) {
			this.header.QueuedUpdate = false
			this.header.Update(this.header.QueuedUpdateRecursive)
		}
		let updatedEntries = false
		const arrEntries = this.entries
		for (let i = 0, end = arrEntries.length; i < end; i++) {
			const entry = arrEntries[i]
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
		const entries = this.entries
		for (let i = 0, end = entries.length; i < end; i++) {
			const entry = entries[i]
			if (entry === undefined || !entry.IsVisible || skip-- > 0) {
				continue
			}
			position.CopyTo(entry.Position)
			if (entry.QueuedUpdate) {
				entry.QueuedUpdate = false
				entry.Update(entry.QueuedUpdateRecursive)
			}
			updatedEntries ||= entry.NeedsRootUpdate
			entry.Render()
			position.AddScalarY(entry.Size.y)
			if (--visibleEntries <= 0) {
				break
			}
		}
		if (updatedEntries) {
			this.Update()
		}

		this.entries.forEach(e => (e.IsVisible ? e.PostRender() : 0))
		this.PostRender()
	}
	public Update(recursive = false): void {
		if (recursive) {
			this.entries?.forEach(e => e?.Update(true))
		}
		this.UpdateScrollbar()
		this.EntriesSizeX = this.EntriesSizeX_
		this.EntriesSizeY = this.EntriesSizeY_
	}

	public OnMouseRightDown(): boolean {
		if (this.IsOpen && Base.HoveredElement?.parent instanceof Node) {
			return Base.HoveredElement.parent.OnPopupClick(true)
		}
		return true
	}

	public OnMouseLeftDown(): boolean {
		if (!this.IsOpen) {
			return true
		}
		// close popups if clicked outside, skip click
		if (Base.ActiveElement && Base.ActiveElement.OnPreMouseLeftDown()) {
			Base.ActiveElement =
				KeyBind.changingNow =
				Dropdown.activeDropdown =
				ColorPicker.activeColorpicker =
				Node.ActivePopup =
					/**/ undefined

			return false
		}

		if (
			Node.ActivePopup &&
			Node.ActivePopup.Target.parent instanceof Node &&
			!Node.ActivePopup.Target.parent.OnPopupClick()
		) {
			return false
		}
		if (!this.header.OnMouseLeftDown()) {
			this.activeElement = this.header
			return false
		}
		const entries = this.entries
		for (let i = 0, end = entries.length; i < end; i++) {
			const node = entries[i]
			if (node !== undefined && node.IsVisible && !node.OnMouseLeftDown()) {
				this.activeElement = node
				return false
			}
		}
		return true
	}
	public OnMouseLeftUp(): boolean {
		if (!this.IsOpen || this.activeElement === undefined) {
			return true
		}
		const ret = this.activeElement.OnMouseLeftUp()
		if (this.activeElement === this.header) {
			Base.SaveConfigASAP = true
		}
		this.activeElement = undefined
		return ret
	}
	public OnMouseWheel(up: boolean): boolean {
		if (!this.IsOpen) {
			return false
		}
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
		return this.entries.some(entry => entry.OnMouseWheel(up))
	}
	public AddEntry(name: string, iconPath = "", tooltip = "", iconRound = -1): Node {
		let node = this.entries.find(entry => entry.InternalName === name)
		if (node !== undefined) {
			if (node.IconPath === "") {
				node.IconPath = iconPath
			}
			return node
		}
		if (hardcodedIcons.has(name)) {
			iconPath = hardcodedIcons.get(name)!
		}
		node = new Node(this, name, iconPath, tooltip, iconRound)
		if (hardcodedPriorities.has(name)) {
			node.Priority = hardcodedPriorities.get(name)!
		}
		node.parent = this
		this.entries.push(node)
		this.entries = this.entries
			.sort((a, b) => a.Name.localeCompare(b.Name))
			.sort((a, b) => a.Priority - b.Priority)
		return node
	}
	public AddEntryDeep(names: string[], iconPaths: string[] = []): Node {
		if (names.length === 0) {
			throw "Invalid names array passed to Menu.AddEntryDeep"
		}
		return names.reduce((prev, cur, i) => {
			if (i === 0) {
				return prev
			}
			const iconPathID = names.length - i - 1
			const iconPath = iconPathID < iconPaths.length ? iconPaths[iconPathID] : ""
			return prev.AddNode(cur, iconPath)
		}, this.AddEntry(names[0]))
	}
	private GetScrollbarPositionsRect(elementsRect: Rectangle): Rectangle {
		return new Rectangle(
			new Vector2(
				elementsRect.pos1.x + CMenuManager.scrollbarOffset.x,
				elementsRect.pos1.y + CMenuManager.scrollbarOffset.y
			),
			new Vector2(
				elementsRect.pos1.x +
					CMenuManager.scrollbarOffset.x +
					CMenuManager.scrollbarWidth,
				elementsRect.pos2.y - CMenuManager.scrollbarOffset.y
			)
		)
	}
	private GetScrollbarRect(scrollbarPositionsRect: Rectangle): Rectangle {
		const positionsSize = scrollbarPositionsRect.Size
		const scrollbarSize = new Vector2(
			CMenuManager.scrollbarWidth,
			(positionsSize.y * this.VisibleEntries) / this.entries.length
		)
		const scrollbarPos = scrollbarPositionsRect.pos1
			.Clone()
			.AddScalarY((positionsSize.y * this.ScrollPosition) / this.entries.length)
		return new Rectangle(scrollbarPos, scrollbarPos.Add(scrollbarSize))
	}
	private PostRender(): void {
		if (!this.IsOpen) {
			return
		}
		if (this.ScrollVisible) {
			const rect = this.GetScrollbarRect(
				this.GetScrollbarPositionsRect(this.EntriesRect)
			)
			RendererSDK.Image(CMenuManager.scrollbarPath, rect.pos1, -1, rect.Size)
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
			if (!entry.IsVisible || skip-- > 0) {
				continue
			}
			height += entry.Size.y
			this.VisibleEntries++
			if (height >= maxHeight) {
				if (i < this.entries.length - 1) {
					this.IsAtScrollEnd = false
				}
				break
			}
		}
	}
	private UpdateScrollbar() {
		this.ScrollPosition = Math.max(
			Math.min(this.ScrollPosition, this.entries.length - 1),
			0
		)
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
		while (Base.ForwardConfigASAP) {
			Base.ForwardConfigASAP = false
			this.entries.forEach(e => {
				if (e) {
					e.ConfigValue = this.config[e.InternalName]
					e.OnConfigLoaded()
				}
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
	if (key === VMouseKeys.MK_LBUTTON) {
		return MenuManager.OnMouseLeftDown()
	}
	if (key === VMouseKeys.MK_RBUTTON) {
		return MenuManager.OnMouseRightDown()
	}
	return true
})
InputEventSDK.on("MouseKeyUp", key => {
	if (key === VMouseKeys.MK_LBUTTON) {
		return MenuManager.OnMouseLeftUp()
	}
	return true
})

InputEventSDK.on("MouseWheel", up => {
	const activeDropdown = Dropdown.activeDropdown
	if (activeDropdown?.IsVisible && activeDropdown.OnMouseWheel(up)) {
		return false
	}
	return !MenuManager.OnMouseWheel(up)
})

EventsSDK.on("WindowSizeChanged", () => CMenuManager.OnWindowSizeChanged())
