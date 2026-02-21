import { Rectangle } from "../Base/Rectangle"
import { Vector2 } from "../Base/Vector2"
import { EventPriority } from "../Enums/EventPriority"
import { ScaleHeight, ScaleWidth } from "../GUI/Helpers"
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
import { ShortDescription } from "./ShortDescription"
import { Slider } from "./Slider"
import { TextInput } from "./TextInput"

const hardcodedIcons = new Map<string, string>(
	Object.entries(readJSON("hardcoded_icons.json"))
),
	hardcodedPriorities = new Map<string, number>(
		Object.entries(readJSON("hardcoded_priorities.json"))
	)
class CMenuManager {
	public static OnWindowSizeChanged(): void {
		CMenuManager.scrollbarWidth = ScaleWidth(3)
		CMenuManager.scrollbarOffset.x = ScaleWidth(2)
		CMenuManager.scrollbarOffset.y = ScaleHeight(2)
	}
	private static readonly scrollbarPath = "menu/scrollbar.svg"
	private static scrollbarWidth = 0
	private static readonly scrollbarOffset = new Vector2()
	public entries: Node[] = []
	public config: any
	public EntriesSizeX = 0
	public EntriesSizeY = 0
	private readonly header = new Header(this)
	public readonly textInput = new TextInput(this)
	private readonly searchResultEntries: Base[] = []
	private readonly searchResultMap = new Map<Base, Base>()
	private lastSearchText = ""
	private activeElement?: Base
	private IsOpen_ = true
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

	private get isSearchActive(): boolean {
		return this.textInput.text !== ""
	}
	private get displayEntries(): Base[] {
		return this.isSearchActive ? this.searchResultEntries : this.entries
	}

	public get ConfigValue() {
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
		const entries = this.displayEntries
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
		const entries = this.displayEntries
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
		let height = this.header.Size.y + this.textInput.Size.y,
			cnt = 0,
			skip = this.ScrollPosition
		const entries = this.displayEntries
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
		const pos = this.header.Position
			.Clone()
			.AddScalarY(this.header.Size.y + this.textInput.Size.y),
			height = this.EntriesSizeY
		pos.y = Math.min(pos.y, RendererSDK.WindowSize.y - height)
		return new Rectangle(
			pos,
			pos.Clone().AddScalarX(this.EntriesSizeX).AddScalarY(height)
		)
	}
	public ForeachRecursive(cb: (element: Base) => any) {
		for (let i = 0, end = this.entries.length; i < end; i++) {
			this.entries[i].ForeachRecursive(cb)
		}
	}
	public async LoadConfig() {
		try {
			this.ConfigValue = JSON.parse(await readConfig())
		} catch {
			this.ConfigValue = {}
		} finally {
			if (this.config.SelectedLocalization) {
				Localization.SelectedUnitName = this.config.SelectedLocalization
			} else {
				this.ConfigValue = {}
			}
			this.header.ConfigValue = this.config.Header
			this.Update(true)
		}
	}
	public Render(): void {
		if (this.config === undefined) {
			return
		}
		this.ForwardConfig()
		if (Localization.wasChanged) {
			const langDD = this.entries
				.at(-1)
				?.entries.find(e => e.InternalName === "Language")

			if (langDD instanceof Dropdown) {
				langDD.SelectedID = langDD.InternalValuesNames.findIndex(
					l => l.toLowerCase() === Localization.SelectedUnitName
				)
			}
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

		if (Base.HoveredElement) {
			if (
				Base.HoveredElement.FirstTime &&
				!Base.HoveredElement.IsHovered &&
				!Base.HoveredElement.IsNode
			) {
				Base.HoveredElement.FirstTime = false
			}
			Base.HoveredElement = undefined
		}

		Base.ActiveElement =
			Slider.DraggingNow ??
			KeyBind.changingNow ??
			TextInput.focusedInput ??
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
		if (this.textInput.text !== this.lastSearchText) {
			this.lastSearchText = this.textInput.text
			this.PopulateSearchResults()
			this.Update()
		}
		this.UpdateScrollbar()
		this.header.Render()
		if (this.textInput.QueuedUpdate) {
			this.textInput.QueuedUpdate = false
			this.textInput.Update()
		}
		const position = this.header.Position
			.Clone()
			.AddScalarY(this.header.Size.y)
		position.CopyTo(this.textInput.Position)
		this.textInput.Render()
		position.AddScalarY(this.textInput.Size.y)
		let skip = this.ScrollPosition,
			visibleEntries = this.VisibleEntries
		const entries = this.displayEntries
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

		this.displayEntries.forEach(e => (e.IsVisible ? e.PostRender() : 0))
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
		if (
			this.IsOpen &&
			Base.HoveredElement?.parent instanceof Node &&
			!Base.HoveredElement.parent.OnPopupClick(true)
		) {
			Base.ActiveElement =
				Slider.DraggingNow =
				KeyBind.changingNow =
				TextInput.focusedInput =
				Dropdown.activeDropdown =
				ColorPicker.activeColorpicker =
					/**/ undefined

			return false
		}
		return true
	}
	public OnMouseLeftDown(): boolean {
		if (!this.IsOpen) {
			return true
		}
		// clear active element when search is active so IsHovered
		// works for search results (otherwise ActiveElement guard
		// makes them all report unhovered)
		if (this.isSearchActive && Base.ActiveElement !== undefined) {
			Base.ActiveElement =
				KeyBind.changingNow =
				TextInput.focusedInput =
				Dropdown.activeDropdown =
				ColorPicker.activeColorpicker =
				Node.ActivePopup =
					/**/ undefined
		}
		if (this.isSearchActive) {
			for (const entry of this.searchResultEntries) {
				if (entry.IsHovered) {
					this.NavigateToSearchResult(entry)
					return false
				}
			}
		}
		// close popups if clicked outside, skip click
		if (Base.ActiveElement !== undefined && Base.ActiveElement.OnPreMouseLeftDown()) {
			Base.ActiveElement =
				KeyBind.changingNow =
				TextInput.focusedInput =
				Dropdown.activeDropdown =
				ColorPicker.activeColorpicker =
				Node.ActivePopup =
					/**/ undefined

			return false
		}

		if (
			Node.ActivePopup !== undefined &&
			Node.ActivePopup.Target.parent instanceof Node &&
			!Node.ActivePopup.Target.parent.OnPopupClick()
		) {
			return false
		}
		if (!this.header.OnMouseLeftDown()) {
			this.activeElement = this.header
			return false
		}
		if (!this.textInput.OnMouseLeftDown()) {
			this.activeElement = this.textInput
			return false
		}
		if (this.isSearchActive) {
			return true
		}
		const entries = this.entries
		for (let i = 0, end = entries.length; i < end; i++) {
			const node = entries[i]
			if (node === undefined || !node.IsVisible) {
				continue
			}
			if (!node.OnMouseLeftDown()) {
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
		if (this.isSearchActive) {
			return false
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
		const totalEntries = this.displayEntries.length
		const scrollbarSize = new Vector2(
			CMenuManager.scrollbarWidth,
			(positionsSize.y * this.VisibleEntries) / totalEntries
		)
		const scrollbarPos = scrollbarPositionsRect.pos1
			.Clone()
			.AddScalarY((positionsSize.y * this.ScrollPosition) / totalEntries)
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
		const entries = this.displayEntries
		let height = this.header.Size.y + this.textInput.Size.y,
			skip = this.ScrollPosition
		for (let i = 0; i < entries.length; i++) {
			const entry = entries[i]
			if (!entry.IsVisible || skip-- > 0) {
				continue
			}
			height += entry.Size.y
			this.VisibleEntries++
			if (height >= maxHeight) {
				if (i < entries.length - 1) {
					this.IsAtScrollEnd = false
				}
				break
			}
		}
	}
	private UpdateScrollbar() {
		this.ScrollPosition = Math.max(
			Math.min(this.ScrollPosition, this.displayEntries.length - 1),
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
	private PopulateSearchResults(): void {
		const MAX_RESULTS = this.entries.length
		this.searchResultEntries.splice(0)
		this.searchResultMap.clear()
		this.ScrollPosition = 0
		const query = this.textInput.text.toLowerCase()
		if (query === "") {
			return
		}
		let count = 0
		this.ForeachRecursive(el => {
			if (count >= MAX_RESULTS) {
				return
			}
			const path: string[] = []
			el.foreachParent(node => path.unshift(node.Name))
			path.push(el.Name)
			const fullPath = path.join(" > ")
			if (
				!el.Name.toLowerCase().includes(query) &&
				!el.InternalName.toLowerCase().includes(query)
			) {
				return
			}
			let icon = ""
			let iconRound = -1
			el.foreachParent(node => {
				if (
					icon === "" &&
					node instanceof Node &&
					node.IconPath !== ""
				) {
					icon = node.IconPath
					iconRound = node.IconRound
				}
			},
				true
			)

			const entry = new ShortDescription(
				this,
				fullPath,
				"",
				icon,
				iconRound
			)
			entry.SaveConfig = false
			entry.Update()
			this.searchResultEntries.push(entry)
			this.searchResultMap.set(entry, el)
			count++
		})
	}
	private NavigateToSearchResult(resultEntry: Base): void {
		const original = this.searchResultMap.get(resultEntry)
		if (original === undefined) {
			return
		}
		this.textInput.text = ""
		this.textInput.cursorPos = 0
		TextInput.focusedInput = undefined
		this.lastSearchText = ""
		this.searchResultEntries.splice(0)
		this.searchResultMap.clear()
		this.ScrollPosition = 0
		const parents: Node[] = []
		original.foreachParent(
			node => {
				if (node instanceof Node) {
					parents.push(node)
				}
			},
			original instanceof Node
		)
		parents.reverse()
		for (const parent of parents) {
			parent.IsOpen = true
			parent.parent.entries
				.filter((e): e is Node => e instanceof Node && e !== parent)
				.forEach(e => (e.IsOpen = false))
		}
		this.Update(true)
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

EventsSDK.on("WindowSizeChanged", () => MenuManager.Update(true), EventPriority.IMMEDIATE)

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

EventsSDK.on(
	"WindowSizeChanged",
	() => CMenuManager.OnWindowSizeChanged(),
	EventPriority.IMMEDIATE
)
