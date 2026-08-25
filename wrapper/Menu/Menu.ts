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
import { KeyNames } from "./KeyNames"
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
	private readonly noResultsRow = new ShortDescription(this, "", "")
	private searchSelectedIndex = -1
	private lastSearchText = ""
	private activeElement?: Base
	private IsOpen_ = true
	private ScrollPosition = 0
	private IsAtScrollEnd = true
	private VisibleEntries = 0
	// menu open-fade progress (0..1); starts at 1 so the initial load doesn't animate
	private menuOpenT = 1
	private menuOpenLast = 0

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
		if (val) {
			// restart the open-fade each time the menu is brought up
			if (Base.MenuOpenAnimation) {
				this.menuOpenT = 0
				this.menuOpenLast = 0
			}
		} else {
			this.OnMouseLeftUp()
			// release the search box so its keyboard capture doesn't swallow game input
			if (TextInput.focusedInput === this.textInput) {
				TextInput.focusedInput = undefined
			}
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
	public get HeaderClampHeightY(): number {
		// While searching, the result list is rebuilt on every keystroke, so its
		// total height changes constantly. The header clamps its Y position against
		// this height to stay on screen, which makes the whole menu jump up and down
		// as results filter. Clamp against a stable height (header + search box + one
		// row) instead and let the results scroll beneath a stationary header.
		if (this.isSearchActive) {
			return this.header.Size.y + this.textInput.Size.y + Base.DefaultSize.y
		}
		return this.EntriesSizeY
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
		this.config.__binds = this.collectBinds()
		return this.config
	}
	public set ConfigValue(obj) {
		this.config = obj
		this.ForwardConfig()
	}
	private collectBinds(): {
		p: string[]
		k: string
		v: number
		l: Record<string, string[]>
	}[] {
		const binds: {
			p: string[]
			k: string
			v: number
			l: Record<string, string[]>
		}[] = []
		this.entries.forEach(node =>
			node.ForeachRecursive(el => {
				if (el instanceof KeyBind && el.SaveConfig && el.assignedKey > 0) {
					const path = [el.InternalName]
					el.foreachParent(parent => path.unshift(parent.InternalName))
					const key =
						el.assignedKey >= KeyNames.length
							? "Unknown"
							: KeyNames[el.assignedKey]
					const l: Record<string, string[]> = {}
					for (const lang of Localization.Languages) {
						l[lang] = path.map(seg => Localization.LocalizeIn(lang, seg))
					}
					binds.push({ p: path, k: key, v: el.assignedKey, l })
				}
			})
		)
		return binds
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
		const pos = this.header.Position.Clone().AddScalarY(
				this.header.Size.y + this.textInput.Size.y
			),
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
	// alias: deadlock/cs2 spell it this way, keeping the shared ConfigManager identical
	public foreachRecursive(cb: (element: Base) => any) {
		this.ForeachRecursive(cb)
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
	public async ReloadConfig() {
		Base.SaveConfigASAP = false // discard the pending old-state save
		this.ForeachRecursive(el => el.InvalidateConfig())
		Base.ForwardConfigASAP = true
		await this.LoadConfig()
		Base.SaveConfigASAP = false // the applied state IS the stored state
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
		// fade the whole menu in on open; reset to 1 after the last draw below.
		// re-applied every frame, so a stray value can never leak past one frame.
		RendererSDK.OpacityMultiplier = this.UpdateMenuOpenAnim()
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
		const position = this.header.Position.Clone().AddScalarY(this.header.Size.y)
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
		if (this.isSearchActive && this.searchResultEntries.length === 0) {
			const text =
				Localization.SelectedUnitName === "russian"
					? "Ничего не найдено"
					: "No results"
			if (this.noResultsRow.InternalName !== text) {
				this.noResultsRow.InternalName = text
				this.noResultsRow.SaveConfig = false
				this.noResultsRow.Update()
			}
			position.CopyTo(this.noResultsRow.Position)
			this.noResultsRow.Render()
		}
		if (updatedEntries) {
			this.Update()
		}

		this.displayEntries.forEach(e => (e.IsVisible ? e.PostRender() : 0))
		this.PostRender()
		RendererSDK.OpacityMultiplier = 1
	}
	// eases the open-fade toward 1 frame-rate-independently; returns the current alpha
	private UpdateMenuOpenAnim(): number {
		if (!Base.MenuOpenAnimation) {
			this.menuOpenT = 1
			return 1
		}
		if (this.menuOpenT >= 1) {
			return 1
		}
		const now = hrtime()
		const dt =
			this.menuOpenLast === 0
				? 16
				: Math.min(Math.max(now - this.menuOpenLast, 0), 100)
		this.menuOpenLast = now
		const tau = 70
		this.menuOpenT += (1 - this.menuOpenT) * (1 - Math.exp(-dt / tau))
		if (this.menuOpenT > 0.995) {
			this.menuOpenT = 1
		}
		return this.menuOpenT
	}
	public Update(recursive = false): void {
		if (recursive) {
			this.entries?.forEach(e => e?.Update(true))
			// the search box isn't in `entries`, so it'd otherwise keep its old size
			// across a scale/resolution change (only refreshing on a full reload) —
			// re-run its Update so it re-copies the new Base.DefaultSize
			this.textInput.Update()
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
		this.searchSelectedIndex = -1
		const query = this.textInput.text.toLowerCase().trim()
		if (query === "") {
			return
		}
		let count = 0
		this.ForeachRecursive(el => {
			if (count >= MAX_RESULTS) {
				return
			}
			// match only on the element's own name, but in any language, so RU input
			// finds items in an EN menu and vice-versa (no path/tooltip matching, to
			// avoid flooding results with the same control under every parent)
			if (
				!el.Name.toLowerCase().includes(query) &&
				!el.InternalName.toLowerCase().includes(query) &&
				!Localization.LocalizeAll(el.InternalName).some(name =>
					name.toLowerCase().includes(query)
				)
			) {
				return
			}
			const path: string[] = []
			el.foreachParent(node => path.unshift(node.Name))
			path.push(el.Name)
			let icon = ""
			let iconRound = -1
			el.foreachParent(node => {
				if (icon === "" && node instanceof Node && node.IconPath !== "") {
					icon = node.IconPath
					iconRound = node.IconRound
				}
			}, true)
			const entry = new ShortDescription(
				this,
				path.join(" > "),
				"",
				icon,
				iconRound
			)
			entry.searchQuery = query
			entry.SaveConfig = false
			entry.Update()
			this.searchResultEntries.push(entry)
			this.searchResultMap.set(entry, el)
			count++
		})
		this.SetSearchSelection(this.searchResultEntries.length > 0 ? 0 : -1)
	}
	private SetSearchSelection(idx: number): void {
		const entries = this.searchResultEntries
		const prev = entries[this.searchSelectedIndex]
		if (prev instanceof ShortDescription) {
			prev.Selected = false
		}
		this.searchSelectedIndex = idx
		const cur = entries[idx]
		if (cur instanceof ShortDescription) {
			cur.Selected = true
			this.EnsureSearchSelectionVisible()
		}
	}
	private EnsureSearchSelectionVisible(): void {
		const idx = this.searchSelectedIndex
		if (idx < 0) {
			return
		}
		if (idx < this.ScrollPosition) {
			this.ScrollPosition = idx
		} else if (idx >= this.ScrollPosition + this.VisibleEntries) {
			this.ScrollPosition = Math.max(0, idx - this.VisibleEntries + 1)
		}
		this.UpdateScrollbar()
	}
	public MoveSearchSelection(delta: number): boolean {
		if (!this.isSearchActive || this.searchResultEntries.length === 0) {
			return false
		}
		const len = this.searchResultEntries.length
		let idx = this.searchSelectedIndex
		idx = idx < 0 ? (delta > 0 ? 0 : len - 1) : (idx + delta + len) % len
		this.SetSearchSelection(idx)
		return true
	}
	public ActivateSearchSelection(): boolean {
		if (!this.isSearchActive || this.searchResultEntries.length === 0) {
			return false
		}
		const idx = this.searchSelectedIndex >= 0 ? this.searchSelectedIndex : 0
		const entry = this.searchResultEntries[idx]
		if (entry === undefined) {
			return false
		}
		this.NavigateToSearchResult(entry)
		return true
	}
	private ScrollToEntry(node: Node): void {
		const idx = this.entries.indexOf(node)
		if (idx >= 0) {
			this.ScrollPosition = Math.max(0, idx - 1)
		}
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
		this.searchSelectedIndex = -1
		const parents: Node[] = []
		original.foreachParent(node => {
			if (node instanceof Node) {
				parents.push(node)
			}
		}, original instanceof Node)
		parents.reverse()
		for (const parent of parents) {
			parent.IsOpen = true
			parent.parent.entries
				.filter((e): e is Node => e instanceof Node && e !== parent)
				.forEach(e => (e.IsOpen = false))
		}
		// scroll every level of the path so the target row ends up on screen
		if (parents.length > 0) {
			this.ScrollToEntry(parents[0])
			for (let i = 0; i < parents.length; i++) {
				parents[i].ScrollToEntry(
					i + 1 < parents.length ? parents[i + 1] : original
				)
			}
		}
		Base.Flash(original)
		this.Update(true)
	}
	private ForwardConfig() {
		while (Base.ForwardConfigASAP) {
			Base.ForwardConfigASAP = false
			this.entries.forEach(e => {
				if (e) {
					const value = this.config[e.InternalName]
					if (value === undefined || value === null) {
						if (e.SaveConfig) {
							e.ResetConfigValue()
						}
					} else {
						e.ConfigValue = value
					}
					e.OnConfigLoaded()
				}
			})
		}
	}
}
export const MenuManager = new CMenuManager()
await MenuManager.LoadConfig()
import("./ConfigManager")
	.then(m => m.setupConfigsMenu())
	.catch(e => console.error("ConfigManager load failed", e))

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
