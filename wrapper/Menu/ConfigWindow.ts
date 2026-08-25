import { Color } from "../Base/Color"
import { Rectangle } from "../Base/Rectangle"
import { Vector2 } from "../Base/Vector2"
import { GUIInfo } from "../GUI/GUIInfo"
import { Events } from "../Managers/Events"
import { InputEventSDK, InputManager, VMouseKeys } from "../Managers/InputManager"
import { RendererSDK } from "../Native/RendererSDK"
import { Base } from "./Base"
import { Localization } from "./Localization"
import { MenuManager } from "./Menu"
import { TextInput } from "./TextInput"

interface ConfigItem {
	id: string
	name: string
	description?: string
	badge?: number
	active: boolean
	public: boolean
	shareCode?: string
	origin: string // "own" | "imported"
	presetName?: string
	modified?: boolean
	oversize?: boolean
	likes?: number
	sourceId?: string
	author?: string
	createdAt?: number
	updatedAt?: number
}

interface GalleryItem {
	id: string
	name: string
	description?: string
	badge?: number
	likes: number
	likedByMe: boolean
	mine: boolean
	private: boolean
	shareCode: string
}

interface PresetItem {
	id: string
	name: string
	description?: string
}

const OP_UPDATE_INFO = 1
const OP_GET_ACCESS = 2
const OP_SET_ACCESS = 3
const OP_BROWSE = 4
const OP_LIKE = 5
const OP_PRESETS = 6
const OP_ADD_PRESET = 7

const MAX_CONFIGS = 10
const GALLERY_PAGE = 20
const VK_ESCAPE = 0x1b
const VK_BACK = 0x08
const VK_RETURN = 0x0d

type Tab = "mine" | "gallery" | "presets"
type Modal = "edit" | "access" | null

const accent = new Color(124, 40, 255)
const accentSoft = new Color(124, 40, 255, 40)
const panelBg = new Color(20, 20, 30)
const headerBg = new Color(26, 26, 40)
const rowBg = new Color(28, 28, 42)
const rowHover = new Color(38, 38, 56)
const rowActiveBg = new Color(40, 30, 64)
const fieldBg = new Color(14, 14, 22)
const fieldBorder = new Color(52, 52, 70)
const btnBase = new Color(48, 48, 64)
const btnHover = new Color(66, 66, 88)
const dangerBase = new Color(150, 44, 52)
const dangerHover = new Color(190, 58, 66)
const divider = new Color(48, 48, 66)
const okColor = new Color(74, 200, 120)
const errColor = new Color(224, 96, 96)
const textDim = new Color(150, 150, 168)
const textFaint = new Color(110, 110, 128)
const tabActiveBg = new Color(34, 30, 52)

const badgeColors = [
	new Color(74, 200, 120),
	new Color(220, 170, 70),
	new Color(224, 96, 96)
]
const badgeKeys = ["Legit", "Semi-rage", "Rage"]

interface Hit {
	rect: Rectangle
	action: () => void
}

export const ConfigWindow = new (class CConfigWindow {
	private active = false
	private anim = 0
	private lastTime = 0
	// set when opening had to bring the menu up (it drives cursor/input) so Close() restores it
	private forcedMenu = false

	private tab: Tab = "mine"
	private items: ConfigItem[] = []
	private busy = false

	private fields: Record<string, string> = {
		name: "",
		code: "",
		search: "",
		editName: "",
		editDesc: "",
		grantee: ""
	}
	private fieldMax: Record<string, number> = {
		name: 32,
		code: 32,
		search: 40,
		editName: 32,
		editDesc: 140,
		grantee: 64
	}
	private focus: string | null = null
	private cursorBlink = 0

	private keepBinds = true
	private sortMode = 0 // mine: 0 name, 1 newest, 2 active-first
	private scroll = 0 // px, reset on tab change
	private maxScroll = 0

	private gallery: GalleryItem[] = []
	private galleryLoaded = false
	private galleryLoading = false
	private gallerySort = 0 // 0 likes, 1 updated, 2 created
	private galleryTotal = 0

	private presets: PresetItem[] = []
	private presetsLoaded = false
	private presetsLoading = false

	private modal: Modal = null
	private modalItem: ConfigItem | null = null
	private editBadge = 0
	private accessList: string[] = []
	private accessLoading = false

	private status = ""
	private statusErr = false

	private hits: Hit[] = [] // rebuilt every render, hit-tested on click
	private listClip = new Rectangle()
	private reloadConfig: () => Promise<void> = async () => {
		/* no-op until set by the menu */
	}

	constructor() {
		Events.after("Draw", () => this.OnDraw(), 1000)
		InputEventSDK.on("MouseKeyDown", key => this.OnMouseDown(key), -1000)
		InputEventSDK.on("MouseKeyUp", () => !this.active, -1000)
		InputEventSDK.on("MouseWheel", up => this.OnWheel(up), -1000)
		InputEventSDK.on("KeyDown", key => this.OnKeyDown(key), -1000)
		// CharInput has no priority overload; it's swallowed via the return value.
		InputEventSDK.on("CharInput", char => this.OnChar(char))
	}

	public get IsOpen(): boolean {
		return this.active
	}

	public SetReloadHandler(fn: () => Promise<void>): void {
		this.reloadConfig = fn
	}

	public RequestRefresh(): void {
		if (!this.active) {
			return
		}
		void this.refresh()
		if (this.tab === "gallery") {
			void this.loadGallery(true)
		} else if (this.tab === "presets") {
			void this.loadPresets()
		}
	}

	public Show(): void {
		if (this.active) {
			return
		}
		// the menu owns cursor/input, so opening in-game needs it up (hidden behind our dim)
		this.forcedMenu = !MenuManager.IsOpen
		if (this.forcedMenu) {
			MenuManager.IsOpen = true
		}
		this.active = true
		this.lastTime = hrtime()
		this.scroll = 0
		this.focus = null
		this.modal = null
		this.status = ""
		this.tab = "mine"
		// release the menu's text box so its keyboard capture doesn't fight our fields
		TextInput.focusedInput = undefined
		void this.refresh()
	}

	public Close(): void {
		this.active = false
		this.focus = null
		this.modal = null
		if (this.forcedMenu) {
			MenuManager.IsOpen = false
			this.forcedMenu = false
		}
	}

	private async refresh(): Promise<void> {
		if (typeof listConfigs !== "function") {
			return
		}
		try {
			this.items = JSON.parse(await listConfigs()) as ConfigItem[]
		} catch {
			/* offline — keep the current view */
		}
	}

	private async cmd(
		op: number,
		payload: object
	): Promise<{ result: number; data: any } | null> {
		if (typeof configCommand !== "function") {
			return null
		}
		try {
			return JSON.parse(await configCommand(op, JSON.stringify(payload)))
		} catch {
			return null
		}
	}

	private locale(): string {
		return Localization.SelectedUnitName === "russian" ? "ru" : "en"
	}

	private setStatus(text: string, err: boolean): void {
		this.status = text
		this.statusErr = err
	}

	private tr(s: string): string {
		return Localization.Localize(s)
	}

	private resultMessage(result: number): string {
		switch (result) {
			case 3:
				return this.tr("You have reached the maximum number of configs.")
			case 4:
				return this.tr("That name is not allowed.")
			case 5:
				return this.tr(
					"Cannot publish: the author hasn't made the source config public."
				)
			case 6:
				return this.tr("User not found.")
			case 7:
				return this.tr(
					"Remove mentions of other projects from the name or description."
				)
			case 2:
				return this.tr("This code belongs to another game.")
			default:
				return this.tr("Something went wrong. Try again.")
		}
	}

	private noConn(): void {
		this.setStatus(this.tr("No connection to the server. Try again later."), true)
	}

	private async loadGallery(reset: boolean): Promise<void> {
		if (this.galleryLoading) {
			return
		}
		this.galleryLoading = true
		if (reset) {
			this.gallery = []
			this.galleryTotal = 0
			this.scroll = 0
		}
		const res = await this.cmd(OP_BROWSE, {
			sort: this.gallerySort,
			badge: 0,
			query: this.fields.search.trim(),
			offset: this.gallery.length,
			limit: GALLERY_PAGE
		})
		if (res && res.result === 0 && res.data) {
			const entries = (res.data.entries ?? []) as GalleryItem[]
			this.gallery = this.gallery.concat(entries)
			this.galleryTotal = res.data.totalCount ?? this.gallery.length
		} else if (res === null) {
			this.noConn()
		}
		this.galleryLoaded = true
		this.galleryLoading = false
	}

	private async loadPresets(): Promise<void> {
		if (this.presetsLoading) {
			return
		}
		this.presetsLoading = true
		const res = await this.cmd(OP_PRESETS, { locale: this.locale() })
		if (res && res.result === 0 && Array.isArray(res.data)) {
			this.presets = res.data as PresetItem[]
		} else if (res === null) {
			this.noConn()
		}
		this.presetsLoaded = true
		this.presetsLoading = false
	}

	private switchTab(tab: Tab): void {
		if (this.tab === tab) {
			return
		}
		this.tab = tab
		this.scroll = 0
		this.focus = null
		this.status = ""
		// always re-fetch: the gallery/presets may have changed since last viewed
		if (tab === "gallery") {
			void this.loadGallery(true)
		} else if (tab === "presets") {
			void this.loadPresets()
		}
	}
	private async withSwitch(fn: () => Promise<void>): Promise<void> {
		const prevNoWrite = Base.NoWriteConfig
		Base.SaveConfigASAP = false
		Base.NoWriteConfig = true
		try {
			await fn()
		} finally {
			Base.SaveConfigASAP = false
			Base.NoWriteConfig = prevNoWrite
		}
	}

	private async doActivate(item: ConfigItem): Promise<void> {
		if (this.busy || item.active) {
			return
		}
		this.busy = true
		await this.withSwitch(async () => {
			try {
				const res = JSON.parse(await setActiveConfig(item.id))
				if (res.result === 0) {
					await this.reloadConfig()
				} else {
					this.setStatus(this.resultMessage(res.result), true)
				}
			} catch {
				this.noConn()
			}
		})
		this.busy = false
		await this.refresh()
	}

	private async doCreate(): Promise<void> {
		const name = this.fields.name.trim()
		if (this.busy || name.length === 0) {
			return
		}
		this.busy = true
		try {
			const res = JSON.parse(await createConfig(name))
			if (res.result === 0) {
				this.fields.name = ""
				this.setStatus(this.tr("Config created"), false)
				await this.reloadConfig()
			} else {
				this.setStatus(this.resultMessage(res.result), true)
			}
		} catch {
			this.noConn()
		}
		this.busy = false
		await this.refresh()
	}

	private async doAdd(): Promise<void> {
		const code = this.fields.code.trim()
		if (this.busy || code.length === 0) {
			return
		}
		this.busy = true
		await this.withSwitch(async () => {
			try {
				const res = JSON.parse(await addConfigByCode(code, this.keepBinds))
				if (res.result === 0) {
					this.fields.code = ""
					this.setStatus(this.tr("Config added"), false)
					await this.reloadConfig()
				} else {
					this.setStatus(this.resultMessage(res.result), true)
				}
			} catch {
				this.noConn()
			}
		})
		this.busy = false
		await this.refresh()
	}

	private async doDelete(item: ConfigItem): Promise<void> {
		if (this.busy || item.active) {
			return // the active config can never be deleted
		}
		this.busy = true
		try {
			await deleteConfig(item.id)
		} catch {
			/* offline */
		}
		this.busy = false
		await this.refresh()
	}

	private async doTogglePublic(item: ConfigItem): Promise<void> {
		if (this.busy || item.origin !== "own" || typeof setConfigPublic !== "function") {
			return
		}
		this.busy = true
		try {
			const res = JSON.parse(await setConfigPublic(item.id, !item.public))
			if (res.result !== 0) {
				this.setStatus(this.resultMessage(res.result), true)
			}
		} catch {
			this.noConn()
		}
		this.busy = false
		await this.refresh()
	}

	private openEdit(item: ConfigItem): void {
		this.modal = "edit"
		this.modalItem = item
		this.fields.editName = item.name
		this.fields.editDesc = item.description ?? ""
		this.editBadge = item.badge ?? 0
		this.focus = null
		this.status = ""
	}

	private openAccess(item: ConfigItem): void {
		this.modal = "access"
		this.modalItem = item
		this.accessList = []
		this.accessLoading = true
		this.fields.grantee = ""
		this.focus = null
		this.status = ""
		void this.cmd(OP_GET_ACCESS, { id: item.id }).then(res => {
			if (res && res.result === 0 && Array.isArray(res.data)) {
				this.accessList = res.data as string[]
			}
			this.accessLoading = false
		})
	}

	private closeModal(): void {
		this.modal = null
		this.modalItem = null
		this.focus = null
	}

	private async doSaveEdit(): Promise<void> {
		const item = this.modalItem
		if (this.busy || item === null) {
			return
		}
		const name = this.fields.editName.trim()
		if (name.length === 0) {
			return
		}
		this.busy = true
		const res = await this.cmd(OP_UPDATE_INFO, {
			id: item.id,
			name,
			description: this.fields.editDesc.trim(),
			badge: this.editBadge
		})
		this.busy = false
		if (res === null) {
			this.noConn()
			return
		}
		if (res.result === 0) {
			this.setStatus(this.tr("Config updated"), false)
			this.closeModal()
			await this.refresh()
		} else {
			this.setStatus(this.resultMessage(res.result), true)
		}
	}

	private async doGrant(): Promise<void> {
		const item = this.modalItem
		const grantee = this.fields.grantee.trim()
		if (this.busy || item === null || grantee.length === 0) {
			return
		}
		this.busy = true
		const res = await this.cmd(OP_SET_ACCESS, { id: item.id, grantee, revoke: false })
		this.busy = false
		if (res === null) {
			this.noConn()
			return
		}
		if (res.result === 0) {
			if (Array.isArray(res.data)) {
				this.accessList = res.data as string[]
			}
			this.fields.grantee = ""
			this.setStatus(this.tr("Access granted"), false)
		} else {
			this.setStatus(this.resultMessage(res.result), true)
		}
	}

	private async doRevoke(user: string): Promise<void> {
		const item = this.modalItem
		if (this.busy || item === null) {
			return
		}
		this.busy = true
		const res = await this.cmd(OP_SET_ACCESS, {
			id: item.id,
			grantee: user,
			revoke: true
		})
		this.busy = false
		if (res === null) {
			this.noConn()
			return
		}
		if (res.result === 0) {
			if (Array.isArray(res.data)) {
				this.accessList = res.data as string[]
			}
			this.setStatus(this.tr("Access revoked"), false)
		} else {
			this.setStatus(this.resultMessage(res.result), true)
		}
	}

	private async doLike(item: GalleryItem): Promise<void> {
		if (this.busy) {
			return
		}
		this.busy = true
		const like = !item.likedByMe
		const res = await this.cmd(OP_LIKE, { id: item.id, like })
		this.busy = false
		if (res && res.result === 0 && res.data) {
			item.likedByMe = like
			item.likes = res.data.likes ?? item.likes
		} else if (res === null) {
			this.noConn()
		}
	}

	private async doAddFromGallery(item: GalleryItem): Promise<void> {
		if (this.busy || item.mine || item.shareCode.length === 0) {
			return
		}
		this.busy = true
		await this.withSwitch(async () => {
			try {
				const res = JSON.parse(
					await addConfigByCode(item.shareCode, this.keepBinds)
				)
				if (res.result === 0) {
					this.setStatus(this.tr("Config added"), false)
					await this.reloadConfig()
					await this.refresh()
					this.switchTab("mine")
				} else {
					this.setStatus(this.resultMessage(res.result), true)
				}
			} catch {
				this.noConn()
			}
		})
		this.busy = false
	}

	private async doAddPreset(item: PresetItem): Promise<void> {
		if (this.busy) {
			return
		}
		this.busy = true
		await this.withSwitch(async () => {
			const res = await this.cmd(OP_ADD_PRESET, {
				presetId: item.id,
				keepBinds: this.keepBinds,
				locale: this.locale()
			})
			if (res && res.result === 0) {
				this.setStatus(this.tr("Preset added"), false)
				await this.reloadConfig()
				await this.refresh()
				this.switchTab("mine")
			} else if (res === null) {
				this.noConn()
			} else {
				this.setStatus(this.resultMessage(res.result), true)
			}
		})
		this.busy = false
	}

	private sortedItems(): ConfigItem[] {
		const list = this.items.slice()
		if (this.sortMode === 0) {
			list.sort((a, b) => a.name.localeCompare(b.name))
		} else if (this.sortMode === 1) {
			list.sort((a, b) => (b.updatedAt ?? 0) - (a.updatedAt ?? 0))
		} else {
			list.sort((a, b) => (a.active ? 0 : 1) - (b.active ? 0 : 1))
		}
		return list
	}

	private OnMouseDown(key: VMouseKeys): boolean {
		if (!this.active) {
			return true
		}
		if (key !== VMouseKeys.MK_LBUTTON) {
			return false // swallow every button while open
		}
		const cursor = InputManager.CursorOnScreen
		for (const hit of this.hits) {
			if (hit.rect.Contains(cursor)) {
				hit.action()
				return false
			}
		}
		return false // modal: clicks never reach the game/menu underneath
	}

	private OnWheel(up: boolean): boolean {
		if (!this.active) {
			return true
		}
		if (this.listClip.Contains(InputManager.CursorOnScreen)) {
			const step = GUIInfo.ScaleHeightMenu(46)
			this.scroll = Math.max(
				0,
				Math.min(this.maxScroll, this.scroll + (up ? -step : step))
			)
			// infinite-scroll; the "Load more" row stays as a manual fallback
			if (
				this.tab === "gallery" &&
				!up &&
				this.scroll >= this.maxScroll - GUIInfo.ScaleHeightMenu(8) &&
				this.gallery.length < this.galleryTotal
			) {
				void this.loadGallery(false)
			}
		}
		return false
	}

	private submitFocused(): void {
		switch (this.focus) {
			case "name":
				void this.doCreate()
				break
			case "code":
				void this.doAdd()
				break
			case "search":
				this.focus = null
				void this.loadGallery(true)
				break
			case "grantee":
				void this.doGrant()
				break
			case "editName":
			case "editDesc":
				void this.doSaveEdit()
				break
		}
	}

	private OnKeyDown(key: number): boolean {
		if (!this.active) {
			return true
		}
		if (key === VK_ESCAPE) {
			if (this.focus !== null) {
				this.focus = null
			} else if (this.modal !== null) {
				this.closeModal()
			} else {
				this.Close()
			}
			return false
		}
		if (this.focus !== null && key === VK_RETURN) {
			this.submitFocused()
			return false
		}
		if (this.focus !== null && key === VK_BACK) {
			this.fields[this.focus] = this.fields[this.focus].slice(0, -1)
			this.cursorBlink = hrtime()
			return false
		}
		// swallow keys while a field is focused so they don't leak to the menu search
		return this.focus === null
	}

	private OnChar(char: string): boolean {
		if (!this.active || this.focus === null || char.charCodeAt(0) < 0x20) {
			return !this.active
		}
		const max = this.fieldMax[this.focus] ?? 32
		if (this.fields[this.focus].length < max) {
			this.fields[this.focus] += char
		}
		this.cursorBlink = hrtime()
		return false
	}

	private OnDraw(): void {
		const now = hrtime()
		const dt = this.lastTime ? now - this.lastTime : 0
		this.lastTime = now

		const target = this.active ? 1 : 0
		this.anim += (target - this.anim) * (1 - Math.exp(-dt / 90))
		if (!this.active && this.anim < 0.01) {
			this.anim = 0
			return
		}
		if (this.anim <= 0) {
			return
		}
		const size = RendererSDK.WindowSize
		RendererSDK.BeforeDraw(size.x, size.y)
		this.Render(this.anim * this.anim * (3 - 2 * this.anim))
		RendererSDK.EmitDrawOverlay()
	}

	private Render(ease: number): void {
		this.hits = []
		const screen = RendererSDK.WindowSize
		const font = RendererSDK.DefaultFontName
		const a = Math.round(255 * ease)
		const cursor = InputManager.CursorOnScreen

		RendererSDK.FilledRect(
			new Vector2(),
			screen.Clone(),
			Color.Black.SetA(Math.round(185 * ease))
		)

		const pad = GUIInfo.ScaleWidthMenu(22)
		const panelW = Math.min(GUIInfo.ScaleWidthMenu(760), Math.round(screen.x * 0.72))
		const panelH = Math.min(GUIInfo.ScaleHeightMenu(640), Math.round(screen.y * 0.86))
		const round = GUIInfo.ScaleWidthMenu(16)
		const slide = (1 - ease) * GUIInfo.ScaleHeightMenu(18)
		const px = Math.round((screen.x - panelW) / 2)
		const py = Math.round((screen.y - panelH) / 2 + slide)
		const left = px + pad
		const right = px + panelW - pad

		RendererSDK.RectRounded(
			new Vector2(px, py),
			new Vector2(panelW, panelH),
			round,
			panelBg.Clone().SetA(Math.round(250 * ease)),
			accent.Clone().SetA(Math.round(200 * ease)),
			GUIInfo.ScaleWidthMenu(1.5)
		)

		const titleFont = GUIInfo.ScaleHeightMenu(21)
		const bodyFont = GUIInfo.ScaleHeightMenu(14)
		const smallFont = GUIInfo.ScaleHeightMenu(12)

		const headerH = GUIInfo.ScaleHeightMenu(52)
		RendererSDK.RectRounded(
			new Vector2(px, py),
			new Vector2(panelW, headerH),
			round,
			headerBg.Clone().SetA(Math.round(250 * ease)),
			Color.Black.SetA(0),
			0
		)
		RendererSDK.FilledRect(
			new Vector2(px, py + headerH - round),
			new Vector2(panelW, round),
			headerBg.Clone().SetA(Math.round(250 * ease))
		)
		const titleSize = RendererSDK.GetTextSize(
			this.tr("Cloud configs"),
			font,
			titleFont
		)
		RendererSDK.Text(
			this.tr("Cloud configs"),
			new Vector2(left, py + (headerH - (titleSize.y + titleSize.z)) / 2),
			Color.White.SetA(a),
			font,
			titleFont
		)
		const closeBox = GUIInfo.ScaleHeightMenu(30)
		const closeSize = GUIInfo.ScaleHeightMenu(20)
		const closeRect = new Rectangle(
			new Vector2(right - closeBox, py + (headerH - closeBox) / 2),
			new Vector2(right, py + (headerH + closeBox) / 2)
		)
		const closeHovered = closeRect.Contains(cursor)
		if (closeHovered) {
			RendererSDK.RectRounded(
				closeRect.pos1,
				closeRect.Size,
				GUIInfo.ScaleWidthMenu(6),
				btnHover.Clone().SetA(a),
				Color.Black.SetA(0),
				0
			)
		}
		RendererSDK.Image(
			"menu/close.svg",
			new Vector2(
				closeRect.pos1.x + (closeBox - closeSize) / 2,
				closeRect.pos1.y + (closeBox - closeSize) / 2
			),
			-1,
			new Vector2(closeSize, closeSize),
			(closeHovered ? Color.White : textDim).Clone().SetA(a)
		)
		this.hits.push({ rect: closeRect, action: () => this.Close() })

		const tabTop = py + headerH + GUIInfo.ScaleHeightMenu(8)
		const tabH = GUIInfo.ScaleHeightMenu(30)
		this.renderTabs(left, right, tabTop, tabH, ease, a, font, bodyFont, cursor)

		// slot is always reserved so showing/clearing a message never shifts the content
		const bannerTop = tabTop + tabH + GUIInfo.ScaleHeightMenu(8)
		const bannerH = GUIInfo.ScaleHeightMenu(26)
		if (this.status !== "") {
			this.renderStatusBanner(
				left,
				right,
				bannerTop,
				bannerH,
				ease,
				a,
				font,
				smallFont
			)
		}
		const contentTop = bannerTop + bannerH + GUIInfo.ScaleHeightMenu(8)

		if (this.tab === "mine") {
			this.renderMine(
				px,
				py,
				panelW,
				panelH,
				left,
				right,
				contentTop,
				pad,
				ease,
				a,
				font,
				bodyFont,
				smallFont,
				cursor
			)
		} else if (this.tab === "gallery") {
			this.renderGallery(
				left,
				right,
				contentTop,
				py + panelH - pad,
				ease,
				a,
				font,
				bodyFont,
				smallFont,
				cursor
			)
		} else {
			this.renderPresets(
				left,
				right,
				contentTop,
				py + panelH - pad,
				ease,
				a,
				font,
				bodyFont,
				smallFont,
				cursor
			)
		}

		if (this.modal !== null) {
			this.renderModal(
				screen,
				px,
				py,
				panelW,
				panelH,
				ease,
				a,
				font,
				titleFont,
				bodyFont,
				smallFont,
				cursor
			)
		}
	}

	private renderTabs(
		left: number,
		right: number,
		top: number,
		h: number,
		ease: number,
		a: number,
		font: string,
		fontSize: number,
		cursor: Vector2
	): void {
		const tabs: [Tab, string][] = [
			["mine", this.tr("My configs")],
			["gallery", this.tr("Gallery")],
			["presets", this.tr("Presets")]
		]
		let x = left
		const gap = GUIInfo.ScaleWidthMenu(8)
		for (const [id, label] of tabs) {
			const tw =
				RendererSDK.GetTextSize(label, font, fontSize).x +
				GUIInfo.ScaleWidthMenu(26)
			const rect = new Rectangle(new Vector2(x, top), new Vector2(x + tw, top + h))
			const isActive = this.tab === id
			const hovered = rect.Contains(cursor)
			RendererSDK.RectRounded(
				rect.pos1,
				rect.Size,
				GUIInfo.ScaleWidthMenu(7),
				(isActive ? tabActiveBg : hovered ? rowHover : Color.Black.SetA(0))
					.Clone()
					.SetA(Math.round((isActive || hovered ? 240 : 0) * ease)),
				Color.Black.SetA(0),
				0
			)
			const ts = RendererSDK.GetTextSize(label, font, fontSize)
			RendererSDK.Text(
				label,
				new Vector2(
					rect.pos1.x + (tw - ts.x) / 2,
					rect.pos1.y + (h - (ts.y + ts.z)) / 2
				),
				(isActive ? Color.White : textDim).Clone().SetA(a),
				font,
				fontSize
			)
			if (isActive) {
				RendererSDK.FilledRect(
					new Vector2(
						x + GUIInfo.ScaleWidthMenu(8),
						top + h - GUIInfo.ScaleHeightMenu(2)
					),
					new Vector2(
						tw - GUIInfo.ScaleWidthMenu(16),
						Math.max(1, GUIInfo.ScaleHeightMenu(2))
					),
					accent.Clone().SetA(a)
				)
			}
			this.hits.push({ rect, action: () => this.switchTab(id) })
			x += tw + gap
		}
	}

	private renderStatusBanner(
		left: number,
		right: number,
		top: number,
		h: number,
		ease: number,
		a: number,
		font: string,
		fontSize: number
	): void {
		const col = this.statusErr ? errColor : okColor
		RendererSDK.RectRounded(
			new Vector2(left, top),
			new Vector2(right - left, h),
			GUIInfo.ScaleWidthMenu(7),
			col.Clone().SetA(Math.round(30 * ease)),
			col.Clone().SetA(a),
			GUIInfo.ScaleWidthMenu(1)
		)
		const ic = GUIInfo.ScaleHeightMenu(15)
		RendererSDK.Image(
			this.statusErr ? "menu/icons/alert.svg" : "menu/icons/check.svg",
			new Vector2(left + GUIInfo.ScaleWidthMenu(10), top + (h - ic) / 2),
			-1,
			new Vector2(ic, ic),
			col.Clone().SetA(a)
		)
		const tx = left + GUIInfo.ScaleWidthMenu(10) + ic + GUIInfo.ScaleWidthMenu(8)
		const msg = this.ellipsize(
			this.status,
			font,
			fontSize,
			right - tx - GUIInfo.ScaleWidthMenu(10)
		)
		const ts = RendererSDK.GetTextSize(msg, font, fontSize)
		RendererSDK.Text(
			msg,
			new Vector2(tx, top + (h - (ts.y + ts.z)) / 2),
			col.Clone().SetA(a),
			font,
			fontSize
		)
	}

	private renderMine(
		px: number,
		py: number,
		panelW: number,
		panelH: number,
		left: number,
		right: number,
		contentTop: number,
		pad: number,
		ease: number,
		a: number,
		font: string,
		bodyFont: number,
		smallFont: number,
		cursor: Vector2
	): void {
		const fieldH = GUIInfo.ScaleHeightMenu(36)
		const rowGap = GUIInfo.ScaleHeightMenu(10)
		const kbH = GUIInfo.ScaleHeightMenu(20)
		const statusH = GUIInfo.ScaleHeightMenu(16)
		const footerH = fieldH + rowGap + fieldH + rowGap + kbH + rowGap + statusH
		const footerTop = py + panelH - pad - footerH

		const sortLabels = ["By name", "By date", "Active first"]
		const sortText = this.tr("Sort") + ": " + this.tr(sortLabels[this.sortMode])
		const sortW =
			RendererSDK.GetTextSize(sortText, font, smallFont).x +
			GUIInfo.ScaleWidthMenu(18)
		const sortH = GUIInfo.ScaleHeightMenu(22)
		const sortRect = new Rectangle(
			new Vector2(right - sortW, contentTop),
			new Vector2(right, contentTop + sortH)
		)
		this.drawButton(
			sortRect,
			sortText,
			btnBase,
			btnHover,
			ease,
			a,
			font,
			smallFont,
			cursor
		)
		this.hits.push({
			rect: sortRect,
			action: () => (this.sortMode = (this.sortMode + 1) % 3)
		})

		const listTop = contentTop + sortH + GUIInfo.ScaleHeightMenu(10)
		const listBottom = footerTop - GUIInfo.ScaleHeightMenu(12)
		RendererSDK.FilledRect(
			new Vector2(left, footerTop - GUIInfo.ScaleHeightMenu(11)),
			new Vector2(right - left, Math.max(1, GUIInfo.ScaleHeightMenu(1))),
			divider.Clone().SetA(a)
		)
		this.renderList(
			this.sortedItems(),
			left,
			right,
			listTop,
			listBottom,
			ease,
			a,
			font,
			bodyFont,
			smallFont,
			cursor,
			(item, top, h) =>
				this.renderConfigRow(
					item,
					left,
					right,
					top,
					h,
					ease,
					a,
					font,
					bodyFont,
					smallFont,
					cursor
				)
		)
		if (this.items.length === 0) {
			RendererSDK.Text(
				this.tr("No configs yet"),
				new Vector2(left, listTop + GUIInfo.ScaleHeightMenu(6)),
				textDim.Clone().SetA(a),
				font,
				bodyFont
			)
		}

		this.renderMineFooter(
			left,
			right,
			footerTop,
			fieldH,
			rowGap,
			kbH,
			ease,
			a,
			font,
			bodyFont,
			smallFont,
			cursor
		)
	}

	private renderConfigRow(
		item: ConfigItem,
		left: number,
		right: number,
		top: number,
		h: number,
		ease: number,
		a: number,
		font: string,
		bodyFont: number,
		smallFont: number,
		cursor: Vector2
	): void {
		const rect = new Rectangle(new Vector2(left, top), new Vector2(right, top + h))
		const hovered = rect.Contains(cursor)
		const bg = item.active ? rowActiveBg : hovered ? rowHover : rowBg
		RendererSDK.RectRounded(
			rect.pos1,
			new Vector2(right - left, h),
			GUIInfo.ScaleWidthMenu(9),
			bg.Clone().SetA(Math.round(240 * ease)),
			item.active ? accent.Clone().SetA(a) : Color.Black.SetA(0),
			item.active ? GUIInfo.ScaleWidthMenu(1) : 0
		)
		if (item.active) {
			RendererSDK.RectRounded(
				new Vector2(left, top + GUIInfo.ScaleHeightMenu(9)),
				new Vector2(GUIInfo.ScaleWidthMenu(3), h - GUIInfo.ScaleHeightMenu(18)),
				GUIInfo.ScaleWidthMenu(2),
				accent.Clone().SetA(a),
				Color.Black.SetA(0),
				0
			)
		}

		const nameX = left + GUIInfo.ScaleWidthMenu(16)
		RendererSDK.Text(
			item.name,
			new Vector2(nameX, top + GUIInfo.ScaleHeightMenu(8)),
			Color.White.SetA(a),
			font,
			bodyFont
		)

		const badges: [string, Color][] = []
		if (item.active) {
			badges.push([this.tr("Active"), accent])
		}
		if (
			typeof item.badge === "number" &&
			item.badge > 0 &&
			item.badge < badgeKeys.length
		) {
			badges.push([
				this.tr(badgeKeys[item.badge]),
				badgeColors[item.badge] ?? textDim
			])
		}
		if (item.presetName) {
			badges.push([this.tr("Preset"), textDim])
		}
		if (item.modified) {
			badges.push([this.tr("Modified"), textDim])
		}
		if (item.oversize) {
			badges.push([this.tr("Too large"), errColor])
		}
		let bx = nameX
		const by = top + GUIInfo.ScaleHeightMenu(28)
		for (const [label, col] of badges) {
			bx = this.drawBadge(bx, by, label, col, ease, a, font, smallFont)
		}

		const bH = GUIInfo.ScaleHeightMenu(28)
		const bY = top + (h - bH) / 2
		let curX = right - GUIInfo.ScaleWidthMenu(10)

		if (!item.active) {
			const delW = GUIInfo.ScaleWidthMenu(34)
			const delRect = new Rectangle(
				new Vector2(curX - delW, bY),
				new Vector2(curX, bY + bH)
			)
			const delHover = delRect.Contains(cursor)
			RendererSDK.RectRounded(
				delRect.pos1,
				delRect.Size,
				GUIInfo.ScaleWidthMenu(6),
				(delHover ? dangerHover : dangerBase).Clone().SetA(a),
				Color.Black.SetA(0),
				0
			)
			const ic = GUIInfo.ScaleHeightMenu(13)
			RendererSDK.Image(
				"menu/close.svg",
				new Vector2(
					delRect.pos1.x + (delW - ic) / 2,
					delRect.pos1.y + (bH - ic) / 2
				),
				-1,
				new Vector2(ic, ic),
				Color.White.SetA(a)
			)
			this.hits.push({ rect: delRect, action: () => void this.doDelete(item) })
			curX -= delW + GUIInfo.ScaleWidthMenu(8)
		}

		if (item.origin === "own") {
			const label = this.tr(item.public ? "Public" : "Private")
			curX = this.drawPill(
				curX,
				bY,
				bH,
				label,
				item.public,
				ease,
				a,
				font,
				smallFont,
				cursor,
				() => void this.doTogglePublic(item)
			)
			if (!item.public) {
				curX = this.drawTextButton(
					curX,
					bY,
					bH,
					this.tr("Access"),
					ease,
					a,
					font,
					smallFont,
					cursor,
					() => this.openAccess(item)
				)
			}
			curX = this.drawTextButton(
				curX,
				bY,
				bH,
				this.tr("Edit"),
				ease,
				a,
				font,
				smallFont,
				cursor,
				() => this.openEdit(item)
			)
		}

		if (!item.active) {
			const bodyRect = new Rectangle(
				rect.pos1.Clone(),
				new Vector2(curX - GUIInfo.ScaleWidthMenu(6), top + h)
			)
			this.hits.push({ rect: bodyRect, action: () => void this.doActivate(item) })
		}
	}

	private renderMineFooter(
		left: number,
		right: number,
		top: number,
		fieldH: number,
		rowGap: number,
		kbH: number,
		ease: number,
		a: number,
		font: string,
		bodyFont: number,
		smallFont: number,
		cursor: Vector2
	): void {
		// size both buttons to the wider label so a long localized string isn't clipped
		const btnPad = GUIInfo.ScaleWidthMenu(26)
		const btnW = Math.max(
			GUIInfo.ScaleWidthMenu(96),
			RendererSDK.GetTextSize(this.tr("Create"), font, bodyFont).x + btnPad,
			RendererSDK.GetTextSize(this.tr("Add by code"), font, smallFont).x + btnPad
		)
		const btnGap = GUIInfo.ScaleWidthMenu(8)

		const createRect = new Rectangle(
			new Vector2(right - btnW, top),
			new Vector2(right, top + fieldH)
		)
		const nameRect = new Rectangle(
			new Vector2(left, top),
			new Vector2(right - btnW - btnGap, top + fieldH)
		)
		this.drawField(
			nameRect,
			this.fields.name,
			this.tr("Config name"),
			this.focus === "name",
			ease,
			a,
			font,
			bodyFont
		)
		this.hits.push({ rect: nameRect, action: () => (this.focus = "name") })
		this.drawButton(
			createRect,
			this.tr("Create"),
			accent.Clone().SetA(210),
			accent,
			ease,
			a,
			font,
			bodyFont,
			cursor
		)
		this.hits.push({ rect: createRect, action: () => void this.doCreate() })

		const r2 = top + fieldH + rowGap
		const addRect = new Rectangle(
			new Vector2(right - btnW, r2),
			new Vector2(right, r2 + fieldH)
		)
		const codeRect = new Rectangle(
			new Vector2(left, r2),
			new Vector2(right - btnW - btnGap, r2 + fieldH)
		)
		this.drawField(
			codeRect,
			this.fields.code,
			this.tr("Share code"),
			this.focus === "code",
			ease,
			a,
			font,
			bodyFont
		)
		this.hits.push({ rect: codeRect, action: () => (this.focus = "code") })
		this.drawButton(
			addRect,
			this.tr("Add by code"),
			btnBase,
			btnHover,
			ease,
			a,
			font,
			smallFont,
			cursor
		)
		this.hits.push({ rect: addRect, action: () => void this.doAdd() })

		const r3 = r2 + fieldH + rowGap
		this.drawKeepBinds(left, r3, kbH, ease, a, font, smallFont)

		const counter = `${this.items.length}/${MAX_CONFIGS}`
		const cSize = RendererSDK.GetTextSize(counter, font, smallFont)
		RendererSDK.Text(
			counter,
			new Vector2(right - cSize.x, r3 + GUIInfo.ScaleHeightMenu(2)),
			(this.items.length >= MAX_CONFIGS ? errColor : textFaint).Clone().SetA(a),
			font,
			smallFont
		)
	}

	private renderGallery(
		left: number,
		right: number,
		contentTop: number,
		bottom: number,
		ease: number,
		a: number,
		font: string,
		bodyFont: number,
		smallFont: number,
		cursor: Vector2
	): void {
		const fieldH = GUIInfo.ScaleHeightMenu(34)
		const sortLabels = ["Most liked", "Recently updated", "Oldest"]
		const sortText = this.tr(sortLabels[this.gallerySort])
		const sortW =
			RendererSDK.GetTextSize(sortText, font, smallFont).x +
			GUIInfo.ScaleWidthMenu(20)
		const searchRect = new Rectangle(
			new Vector2(left, contentTop),
			new Vector2(right - sortW - GUIInfo.ScaleWidthMenu(8), contentTop + fieldH)
		)
		this.drawField(
			searchRect,
			this.fields.search,
			this.tr("Search configs"),
			this.focus === "search",
			ease,
			a,
			font,
			bodyFont,
			"menu/icons/search.svg"
		)
		this.hits.push({ rect: searchRect, action: () => (this.focus = "search") })
		const sortRect = new Rectangle(
			new Vector2(right - sortW, contentTop),
			new Vector2(right, contentTop + fieldH)
		)
		this.drawButton(
			sortRect,
			sortText,
			btnBase,
			btnHover,
			ease,
			a,
			font,
			smallFont,
			cursor
		)
		this.hits.push({
			rect: sortRect,
			action: () => {
				this.gallerySort = (this.gallerySort + 1) % 3
				void this.loadGallery(true)
			}
		})

		const listTop = contentTop + fieldH + GUIInfo.ScaleHeightMenu(12)
		const listBottom = bottom - GUIInfo.ScaleHeightMenu(4)

		const rows: (GalleryItem | "more")[] = this.gallery.slice()
		if (this.gallery.length < this.galleryTotal) {
			rows.push("more")
		}
		this.renderList(
			rows,
			left,
			right,
			listTop,
			listBottom,
			ease,
			a,
			font,
			bodyFont,
			smallFont,
			cursor,
			(row, top, h) => {
				if (row === "more") {
					this.renderLoadMore(
						left,
						right,
						top,
						h,
						ease,
						a,
						font,
						bodyFont,
						cursor
					)
				} else {
					this.renderGalleryRow(
						row,
						left,
						right,
						top,
						h,
						ease,
						a,
						font,
						bodyFont,
						smallFont,
						cursor
					)
				}
			}
		)

		if (this.galleryLoading && this.gallery.length === 0) {
			RendererSDK.Text(
				this.tr("Loading..."),
				new Vector2(left, listTop + GUIInfo.ScaleHeightMenu(6)),
				textDim.Clone().SetA(a),
				font,
				bodyFont
			)
		} else if (this.galleryLoaded && this.gallery.length === 0) {
			RendererSDK.Text(
				this.tr("Nothing found"),
				new Vector2(left, listTop + GUIInfo.ScaleHeightMenu(6)),
				textDim.Clone().SetA(a),
				font,
				bodyFont
			)
		}
	}

	private renderGalleryRow(
		item: GalleryItem,
		left: number,
		right: number,
		top: number,
		h: number,
		ease: number,
		a: number,
		font: string,
		bodyFont: number,
		smallFont: number,
		cursor: Vector2
	): void {
		const rect = new Rectangle(new Vector2(left, top), new Vector2(right, top + h))
		const hovered = rect.Contains(cursor)
		RendererSDK.RectRounded(
			rect.pos1,
			new Vector2(right - left, h),
			GUIInfo.ScaleWidthMenu(9),
			(hovered ? rowHover : rowBg).Clone().SetA(Math.round(240 * ease)),
			Color.Black.SetA(0),
			0
		)

		const nameX = left + GUIInfo.ScaleWidthMenu(16)
		RendererSDK.Text(
			item.name,
			new Vector2(nameX, top + GUIInfo.ScaleHeightMenu(7)),
			Color.White.SetA(a),
			font,
			bodyFont
		)

		const bH = GUIInfo.ScaleHeightMenu(28)
		const bY = top + (h - bH) / 2
		let curX = right - GUIInfo.ScaleWidthMenu(10)

		const likeLabel =
			(item.likedByMe ? this.tr("Liked") : this.tr("Like")) + "  " + item.likes
		const likeW =
			RendererSDK.GetTextSize(likeLabel, font, smallFont).x +
			GUIInfo.ScaleWidthMenu(20)
		const likeRect = new Rectangle(
			new Vector2(curX - likeW, bY),
			new Vector2(curX, bY + bH)
		)
		const likeHover = likeRect.Contains(cursor)
		RendererSDK.RectRounded(
			likeRect.pos1,
			likeRect.Size,
			GUIInfo.ScaleWidthMenu(6),
			(item.likedByMe ? accentSoft : likeHover ? btnHover : btnBase)
				.Clone()
				.SetA(a),
			item.likedByMe ? accent.Clone().SetA(a) : Color.Black.SetA(0),
			item.likedByMe ? GUIInfo.ScaleWidthMenu(1) : 0
		)
		const lts = RendererSDK.GetTextSize(likeLabel, font, smallFont)
		RendererSDK.Text(
			likeLabel,
			new Vector2(
				likeRect.pos1.x + (likeW - lts.x) / 2,
				likeRect.pos1.y + (bH - (lts.y + lts.z)) / 2
			),
			(item.likedByMe ? accent : textDim).Clone().SetA(a),
			font,
			smallFont
		)
		this.hits.push({ rect: likeRect, action: () => void this.doLike(item) })
		curX -= likeW + GUIInfo.ScaleWidthMenu(8)

		curX = item.mine
			? this.drawBadge(
					curX - GUIInfo.ScaleWidthMenu(4),
					bY + GUIInfo.ScaleHeightMenu(6),
					this.tr("Mine"),
					textDim,
					ease,
					a,
					font,
					smallFont,
					true
				)
			: this.drawTextButton(
					curX,
					bY,
					bH,
					this.tr("Add"),
					ease,
					a,
					font,
					smallFont,
					cursor,
					() => void this.doAddFromGallery(item),
					true
				)

		let bx = nameX
		const by = top + GUIInfo.ScaleHeightMenu(27)
		if (
			typeof item.badge === "number" &&
			item.badge > 0 &&
			item.badge < badgeKeys.length
		) {
			bx = this.drawBadge(
				bx,
				by,
				this.tr(badgeKeys[item.badge]),
				badgeColors[item.badge] ?? textDim,
				ease,
				a,
				font,
				smallFont
			)
		}
		if (item.private) {
			bx = this.drawBadge(
				bx,
				by,
				this.tr("Private"),
				accent,
				ease,
				a,
				font,
				smallFont
			)
		}
		if (item.description) {
			const descMax = curX - bx - GUIInfo.ScaleWidthMenu(10)
			if (descMax > GUIInfo.ScaleWidthMenu(40)) {
				RendererSDK.Text(
					this.ellipsize(item.description, font, smallFont, descMax),
					new Vector2(
						bx + GUIInfo.ScaleWidthMenu(2),
						by + GUIInfo.ScaleHeightMenu(1)
					),
					textFaint.Clone().SetA(a),
					font,
					smallFont
				)
			}
		}
	}

	private renderLoadMore(
		left: number,
		right: number,
		top: number,
		h: number,
		ease: number,
		a: number,
		font: string,
		bodyFont: number,
		cursor: Vector2
	): void {
		const w = GUIInfo.ScaleWidthMenu(160)
		const bh = GUIInfo.ScaleHeightMenu(30)
		const rect = new Rectangle(
			new Vector2(left + (right - left - w) / 2, top + (h - bh) / 2),
			new Vector2(left + (right - left + w) / 2, top + (h + bh) / 2)
		)
		this.drawButton(
			rect,
			this.galleryLoading ? this.tr("Loading...") : this.tr("Load more"),
			btnBase,
			btnHover,
			ease,
			a,
			font,
			bodyFont,
			cursor
		)
		this.hits.push({ rect, action: () => void this.loadGallery(false) })
	}

	private renderPresets(
		left: number,
		right: number,
		contentTop: number,
		bottom: number,
		ease: number,
		a: number,
		font: string,
		bodyFont: number,
		smallFont: number,
		cursor: Vector2
	): void {
		const kbH = GUIInfo.ScaleHeightMenu(20)
		this.drawKeepBinds(left, contentTop, kbH, ease, a, font, smallFont)

		const listTop = contentTop + kbH + GUIInfo.ScaleHeightMenu(12)
		const listBottom = bottom - GUIInfo.ScaleHeightMenu(4)
		this.renderList(
			this.presets,
			left,
			right,
			listTop,
			listBottom,
			ease,
			a,
			font,
			bodyFont,
			smallFont,
			cursor,
			(row, top, h) =>
				this.renderPresetRow(
					row,
					left,
					right,
					top,
					h,
					ease,
					a,
					font,
					bodyFont,
					smallFont,
					cursor
				)
		)

		if (this.presetsLoading && this.presets.length === 0) {
			RendererSDK.Text(
				this.tr("Loading..."),
				new Vector2(left, listTop + GUIInfo.ScaleHeightMenu(6)),
				textDim.Clone().SetA(a),
				font,
				bodyFont
			)
		} else if (this.presetsLoaded && this.presets.length === 0) {
			RendererSDK.Text(
				this.tr("No presets"),
				new Vector2(left, listTop + GUIInfo.ScaleHeightMenu(6)),
				textDim.Clone().SetA(a),
				font,
				bodyFont
			)
		}
	}

	private renderPresetRow(
		item: PresetItem,
		left: number,
		right: number,
		top: number,
		h: number,
		ease: number,
		a: number,
		font: string,
		bodyFont: number,
		smallFont: number,
		cursor: Vector2
	): void {
		const rect = new Rectangle(new Vector2(left, top), new Vector2(right, top + h))
		const hovered = rect.Contains(cursor)
		RendererSDK.RectRounded(
			rect.pos1,
			new Vector2(right - left, h),
			GUIInfo.ScaleWidthMenu(9),
			(hovered ? rowHover : rowBg).Clone().SetA(Math.round(240 * ease)),
			Color.Black.SetA(0),
			0
		)
		const nameX = left + GUIInfo.ScaleWidthMenu(16)
		RendererSDK.Text(
			item.name,
			new Vector2(nameX, top + GUIInfo.ScaleHeightMenu(7)),
			Color.White.SetA(a),
			font,
			bodyFont
		)

		const bH = GUIInfo.ScaleHeightMenu(28)
		const bY = top + (h - bH) / 2
		const addX = this.drawTextButton(
			right - GUIInfo.ScaleWidthMenu(10),
			bY,
			bH,
			this.tr("Add"),
			ease,
			a,
			font,
			smallFont,
			cursor,
			() => void this.doAddPreset(item),
			true
		)

		if (item.description) {
			const descMax = addX - nameX - GUIInfo.ScaleWidthMenu(12)
			if (descMax > GUIInfo.ScaleWidthMenu(40)) {
				RendererSDK.Text(
					this.ellipsize(item.description, font, smallFont, descMax),
					new Vector2(nameX, top + GUIInfo.ScaleHeightMenu(27)),
					textFaint.Clone().SetA(a),
					font,
					smallFont
				)
			}
		}
	}

	private renderModal(
		screen: Vector2,
		px: number,
		py: number,
		panelW: number,
		panelH: number,
		ease: number,
		a: number,
		font: string,
		titleFont: number,
		bodyFont: number,
		smallFont: number,
		cursor: Vector2
	): void {
		// discard the underlying tab's hits: only the modal is interactive now
		this.hits = []
		RendererSDK.FilledRect(
			new Vector2(),
			screen.Clone(),
			Color.Black.SetA(Math.round(150 * ease))
		)

		const mw = Math.min(
			GUIInfo.ScaleWidthMenu(480),
			panelW - GUIInfo.ScaleWidthMenu(40)
		)
		const mh =
			this.modal === "edit"
				? GUIInfo.ScaleHeightMenu(320)
				: GUIInfo.ScaleHeightMenu(360)
		const mx = Math.round(screen.x / 2 - mw / 2)
		const my = Math.round(screen.y / 2 - mh / 2)
		const pad = GUIInfo.ScaleWidthMenu(20)
		const left = mx + pad
		const right = mx + mw - pad
		const round = GUIInfo.ScaleWidthMenu(14)

		RendererSDK.RectRounded(
			new Vector2(mx, my),
			new Vector2(mw, mh),
			round,
			panelBg.Clone().SetA(Math.round(252 * ease)),
			accent.Clone().SetA(a),
			GUIInfo.ScaleWidthMenu(1.5)
		)

		const title =
			this.modal === "edit" ? this.tr("Edit config") : this.tr("Grant access")
		RendererSDK.Text(
			title,
			new Vector2(left, my + GUIInfo.ScaleHeightMenu(16)),
			Color.White.SetA(a),
			font,
			titleFont
		)

		if (this.modal === "edit") {
			this.renderEditModal(
				left,
				right,
				my,
				mh,
				ease,
				a,
				font,
				bodyFont,
				smallFont,
				cursor
			)
		} else {
			this.renderAccessModal(
				left,
				right,
				my,
				mh,
				ease,
				a,
				font,
				bodyFont,
				smallFont,
				cursor
			)
		}

		// backdrop-cancel: pushed LAST so any modal control (pushed earlier) wins
		this.hits.push({
			rect: new Rectangle(new Vector2(), screen.Clone()),
			action: () => this.closeModal()
		})
	}

	private renderEditModal(
		left: number,
		right: number,
		my: number,
		mh: number,
		ease: number,
		a: number,
		font: string,
		bodyFont: number,
		smallFont: number,
		cursor: Vector2
	): void {
		let y = my + GUIInfo.ScaleHeightMenu(52)
		const fieldH = GUIInfo.ScaleHeightMenu(36)

		RendererSDK.Text(
			this.tr("Config name"),
			new Vector2(left, y),
			textDim.Clone().SetA(a),
			font,
			smallFont
		)
		y += GUIInfo.ScaleHeightMenu(18)
		const nameRect = new Rectangle(
			new Vector2(left, y),
			new Vector2(right, y + fieldH)
		)
		this.drawField(
			nameRect,
			this.fields.editName,
			this.tr("Config name"),
			this.focus === "editName",
			ease,
			a,
			font,
			bodyFont
		)
		this.hits.push({ rect: nameRect, action: () => (this.focus = "editName") })
		y += fieldH + GUIInfo.ScaleHeightMenu(12)

		RendererSDK.Text(
			this.tr("Description"),
			new Vector2(left, y),
			textDim.Clone().SetA(a),
			font,
			smallFont
		)
		y += GUIInfo.ScaleHeightMenu(18)
		const descRect = new Rectangle(
			new Vector2(left, y),
			new Vector2(right, y + fieldH)
		)
		this.drawField(
			descRect,
			this.fields.editDesc,
			this.tr("Description"),
			this.focus === "editDesc",
			ease,
			a,
			font,
			bodyFont
		)
		this.hits.push({ rect: descRect, action: () => (this.focus = "editDesc") })
		y += fieldH + GUIInfo.ScaleHeightMenu(12)

		RendererSDK.Text(
			this.tr("Badge"),
			new Vector2(left, y),
			textDim.Clone().SetA(a),
			font,
			smallFont
		)
		y += GUIInfo.ScaleHeightMenu(18)
		const segW = (right - left - GUIInfo.ScaleWidthMenu(16)) / 3
		const segH = GUIInfo.ScaleHeightMenu(30)
		for (let i = 0; i < 3; i++) {
			const sx = left + i * (segW + GUIInfo.ScaleWidthMenu(8))
			const segRect = new Rectangle(
				new Vector2(sx, y),
				new Vector2(sx + segW, y + segH)
			)
			const selected = this.editBadge === i
			const hovered = segRect.Contains(cursor)
			const col = badgeColors[i]
			RendererSDK.RectRounded(
				segRect.pos1,
				segRect.Size,
				GUIInfo.ScaleWidthMenu(6),
				(selected ? col.Clone().SetA(46) : hovered ? btnHover : btnBase)
					.Clone()
					.SetA(a),
				selected ? col.Clone().SetA(a) : Color.Black.SetA(0),
				selected ? GUIInfo.ScaleWidthMenu(1) : 0
			)
			const label = this.tr(badgeKeys[i])
			const ts = RendererSDK.GetTextSize(label, font, smallFont)
			RendererSDK.Text(
				label,
				new Vector2(sx + (segW - ts.x) / 2, y + (segH - (ts.y + ts.z)) / 2),
				(selected ? col : textDim).Clone().SetA(a),
				font,
				smallFont
			)
			const idx = i
			this.hits.push({ rect: segRect, action: () => (this.editBadge = idx) })
		}

		// error/success line (the shared banner is hidden behind the modal)
		if (this.status !== "") {
			RendererSDK.Text(
				this.ellipsize(this.status, font, smallFont, right - left),
				new Vector2(left, my + mh - GUIInfo.ScaleHeightMenu(64)),
				(this.statusErr ? errColor : okColor).Clone().SetA(a),
				font,
				smallFont
			)
		}

		this.renderModalButtons(
			left,
			right,
			my,
			mh,
			this.tr("Save"),
			() => void this.doSaveEdit(),
			ease,
			a,
			font,
			bodyFont,
			cursor
		)
	}

	private renderAccessModal(
		left: number,
		right: number,
		my: number,
		mh: number,
		ease: number,
		a: number,
		font: string,
		bodyFont: number,
		smallFont: number,
		cursor: Vector2
	): void {
		let y = my + GUIInfo.ScaleHeightMenu(52)
		const fieldH = GUIInfo.ScaleHeightMenu(36)
		const btnW = GUIInfo.ScaleWidthMenu(96)
		const gap = GUIInfo.ScaleWidthMenu(8)

		const grantRect = new Rectangle(
			new Vector2(right - btnW, y),
			new Vector2(right, y + fieldH)
		)
		const inputRect = new Rectangle(
			new Vector2(left, y),
			new Vector2(right - btnW - gap, y + fieldH)
		)
		this.drawField(
			inputRect,
			this.fields.grantee,
			this.tr("Name or email"),
			this.focus === "grantee",
			ease,
			a,
			font,
			bodyFont
		)
		this.hits.push({ rect: inputRect, action: () => (this.focus = "grantee") })
		this.drawButton(
			grantRect,
			this.tr("Grant"),
			accent.Clone().SetA(210),
			accent,
			ease,
			a,
			font,
			bodyFont,
			cursor
		)
		this.hits.push({ rect: grantRect, action: () => void this.doGrant() })
		y += fieldH + GUIInfo.ScaleHeightMenu(14)

		RendererSDK.Text(
			this.tr("Users with access"),
			new Vector2(left, y),
			textDim.Clone().SetA(a),
			font,
			smallFont
		)
		y += GUIInfo.ScaleHeightMenu(20)

		const listBottom = my + mh - GUIInfo.ScaleHeightMenu(70)
		if (this.accessLoading) {
			RendererSDK.Text(
				this.tr("Loading..."),
				new Vector2(left, y),
				textDim.Clone().SetA(a),
				font,
				smallFont
			)
		} else if (this.accessList.length === 0) {
			RendererSDK.Text(
				this.tr("No one has access yet"),
				new Vector2(left, y),
				textFaint.Clone().SetA(a),
				font,
				smallFont
			)
		} else {
			const rowH = GUIInfo.ScaleHeightMenu(28)
			for (const user of this.accessList) {
				if (y + rowH > listBottom) {
					break
				}
				RendererSDK.RectRounded(
					new Vector2(left, y),
					new Vector2(right - left, rowH),
					GUIInfo.ScaleWidthMenu(6),
					rowBg.Clone().SetA(Math.round(230 * ease)),
					Color.Black.SetA(0),
					0
				)
				RendererSDK.Text(
					this.ellipsize(
						user,
						font,
						smallFont,
						right - left - GUIInfo.ScaleWidthMenu(50)
					),
					new Vector2(
						left + GUIInfo.ScaleWidthMenu(10),
						y + (rowH - GUIInfo.ScaleHeightMenu(smallFont)) / 2
					),
					Color.White.SetA(a),
					font,
					smallFont
				)
				const delBox = GUIInfo.ScaleHeightMenu(20)
				const delRect = new Rectangle(
					new Vector2(
						right - delBox - GUIInfo.ScaleWidthMenu(8),
						y + (rowH - delBox) / 2
					),
					new Vector2(
						right - GUIInfo.ScaleWidthMenu(8),
						y + (rowH + delBox) / 2
					)
				)
				const delHover = delRect.Contains(cursor)
				RendererSDK.Image(
					"menu/close.svg",
					delRect.pos1,
					-1,
					new Vector2(delBox, delBox),
					(delHover ? errColor : textDim).Clone().SetA(a)
				)
				const u = user
				this.hits.push({ rect: delRect, action: () => void this.doRevoke(u) })
				y += rowH + GUIInfo.ScaleHeightMenu(6)
			}
		}

		if (this.status !== "") {
			RendererSDK.Text(
				this.status,
				new Vector2(left, my + mh - GUIInfo.ScaleHeightMenu(54)),
				(this.statusErr ? errColor : okColor).Clone().SetA(a),
				font,
				smallFont
			)
		}
		const bh = GUIInfo.ScaleHeightMenu(34)
		const bw = GUIInfo.ScaleWidthMenu(110)
		const closeRect = new Rectangle(
			new Vector2(right - bw, my + mh - GUIInfo.ScaleHeightMenu(20) - bh),
			new Vector2(right, my + mh - GUIInfo.ScaleHeightMenu(20))
		)
		this.drawButton(
			closeRect,
			this.tr("Close"),
			btnBase,
			btnHover,
			ease,
			a,
			font,
			bodyFont,
			cursor
		)
		this.hits.push({ rect: closeRect, action: () => this.closeModal() })
	}

	private renderModalButtons(
		left: number,
		right: number,
		my: number,
		mh: number,
		okLabel: string,
		okAction: () => void,
		ease: number,
		a: number,
		font: string,
		bodyFont: number,
		cursor: Vector2
	): void {
		const bh = GUIInfo.ScaleHeightMenu(34)
		const bw = GUIInfo.ScaleWidthMenu(110)
		const gap = GUIInfo.ScaleWidthMenu(10)
		const by = my + mh - GUIInfo.ScaleHeightMenu(20) - bh
		const okRect = new Rectangle(
			new Vector2(right - bw, by),
			new Vector2(right, by + bh)
		)
		const cancelRect = new Rectangle(
			new Vector2(right - bw * 2 - gap, by),
			new Vector2(right - bw - gap, by + bh)
		)
		this.drawButton(
			cancelRect,
			this.tr("Cancel"),
			btnBase,
			btnHover,
			ease,
			a,
			font,
			bodyFont,
			cursor
		)
		this.hits.push({ rect: cancelRect, action: () => this.closeModal() })
		this.drawButton(
			okRect,
			okLabel,
			accent.Clone().SetA(210),
			accent,
			ease,
			a,
			font,
			bodyFont,
			cursor
		)
		this.hits.push({ rect: okRect, action: okAction })
	}

	private renderList<T>(
		rows: T[],
		left: number,
		right: number,
		listTop: number,
		listBottom: number,
		ease: number,
		a: number,
		font: string,
		bodyFont: number,
		smallFont: number,
		cursor: Vector2,
		draw: (row: T, top: number, h: number) => void
	): void {
		const rowH = GUIInfo.ScaleHeightMenu(52)
		const rGap = GUIInfo.ScaleHeightMenu(8)
		const listH = Math.max(0, listBottom - listTop)
		this.listClip = new Rectangle(
			new Vector2(left, listTop),
			new Vector2(right, listBottom)
		)
		const totalH = rows.length * (rowH + rGap)
		this.maxScroll = Math.max(0, totalH - listH)
		if (this.scroll > this.maxScroll) {
			this.scroll = this.maxScroll
		}
		const tol = GUIInfo.ScaleHeightMenu(1)
		let ry = listTop - this.scroll
		for (const row of rows) {
			const rowTop = ry
			ry += rowH + rGap
			// only fully-visible rows: no scissor here, so a partial row would overflow
			if (rowTop < listTop - tol || rowTop + rowH > listBottom + tol) {
				continue
			}
			draw(row, rowTop, rowH)
		}
		if (this.maxScroll > 0) {
			const thumbH = Math.max(GUIInfo.ScaleHeightMenu(26), (listH / totalH) * listH)
			const thumbY = listTop + (this.scroll / this.maxScroll) * (listH - thumbH)
			RendererSDK.RectRounded(
				new Vector2(right + GUIInfo.ScaleWidthMenu(6), thumbY),
				new Vector2(GUIInfo.ScaleWidthMenu(3), thumbH),
				GUIInfo.ScaleWidthMenu(2),
				accent.Clone().SetA(Math.round(170 * ease)),
				Color.Black.SetA(0),
				0
			)
		}
	}

	private ellipsize(
		text: string,
		font: string,
		fontSize: number,
		maxW: number
	): string {
		if (RendererSDK.GetTextSize(text, font, fontSize).x <= maxW) {
			return text
		}
		let lo = 0
		let hi = text.length
		while (lo < hi) {
			const mid = (lo + hi + 1) >> 1
			if (
				RendererSDK.GetTextSize(text.slice(0, mid) + "...", font, fontSize).x <=
				maxW
			) {
				lo = mid
			} else {
				hi = mid - 1
			}
		}
		return text.slice(0, lo) + "..."
	}

	private drawBadge(
		x: number,
		y: number,
		label: string,
		col: Color,
		ease: number,
		a: number,
		font: string,
		smallFont: number,
		alignRight = false
	): number {
		const ts = RendererSDK.GetTextSize(label, font, smallFont)
		const bw = ts.x + GUIInfo.ScaleWidthMenu(12)
		const bh = GUIInfo.ScaleHeightMenu(16)
		const bx = alignRight ? x - bw : x
		RendererSDK.RectRounded(
			new Vector2(bx, y),
			new Vector2(bw, bh),
			GUIInfo.ScaleWidthMenu(4),
			col.Clone().SetA(Math.round(36 * ease)),
			Color.Black.SetA(0),
			0
		)
		RendererSDK.Text(
			label,
			new Vector2(bx + GUIInfo.ScaleWidthMenu(6), y + GUIInfo.ScaleHeightMenu(2)),
			col.Clone().SetA(a),
			font,
			smallFont
		)
		return alignRight
			? bx - GUIInfo.ScaleWidthMenu(6)
			: bx + bw + GUIInfo.ScaleWidthMenu(6)
	}

	private drawPill(
		curX: number,
		bY: number,
		bH: number,
		label: string,
		on: boolean,
		ease: number,
		a: number,
		font: string,
		smallFont: number,
		cursor: Vector2,
		action: () => void
	): number {
		const w =
			RendererSDK.GetTextSize(label, font, smallFont).x + GUIInfo.ScaleWidthMenu(20)
		const rect = new Rectangle(new Vector2(curX - w, bY), new Vector2(curX, bY + bH))
		const hover = rect.Contains(cursor)
		RendererSDK.RectRounded(
			rect.pos1,
			rect.Size,
			GUIInfo.ScaleWidthMenu(6),
			(on ? accentSoft : hover ? btnHover : btnBase).Clone().SetA(a),
			on ? accent.Clone().SetA(a) : Color.Black.SetA(0),
			on ? GUIInfo.ScaleWidthMenu(1) : 0
		)
		const ts = RendererSDK.GetTextSize(label, font, smallFont)
		RendererSDK.Text(
			label,
			new Vector2(
				rect.pos1.x + (w - ts.x) / 2,
				rect.pos1.y + (bH - (ts.y + ts.z)) / 2
			),
			(on ? accent : textDim).Clone().SetA(a),
			font,
			smallFont
		)
		this.hits.push({ rect, action })
		return curX - w - GUIInfo.ScaleWidthMenu(8)
	}

	private drawTextButton(
		curX: number,
		bY: number,
		bH: number,
		label: string,
		ease: number,
		a: number,
		font: string,
		smallFont: number,
		cursor: Vector2,
		action: () => void,
		accented = false
	): number {
		const w =
			RendererSDK.GetTextSize(label, font, smallFont).x + GUIInfo.ScaleWidthMenu(20)
		const rect = new Rectangle(new Vector2(curX - w, bY), new Vector2(curX, bY + bH))
		const hover = rect.Contains(cursor)
		RendererSDK.RectRounded(
			rect.pos1,
			rect.Size,
			GUIInfo.ScaleWidthMenu(6),
			(accented
				? accent.Clone().SetA(hover ? 240 : 200)
				: hover
					? btnHover
					: btnBase
			)
				.Clone()
				.SetA(a),
			Color.Black.SetA(0),
			0
		)
		const ts = RendererSDK.GetTextSize(label, font, smallFont)
		RendererSDK.Text(
			label,
			new Vector2(
				rect.pos1.x + (w - ts.x) / 2,
				rect.pos1.y + (bH - (ts.y + ts.z)) / 2
			),
			Color.White.SetA(a),
			font,
			smallFont
		)
		this.hits.push({ rect, action })
		return curX - w - GUIInfo.ScaleWidthMenu(8)
	}

	private drawKeepBinds(
		left: number,
		y: number,
		kbH: number,
		ease: number,
		a: number,
		font: string,
		smallFont: number
	): void {
		const on = this.keepBinds
		const trackW = GUIInfo.ScaleWidthMenu(34)
		const trackH = GUIInfo.ScaleHeightMenu(18)
		const trackY = y + (kbH - trackH) / 2
		RendererSDK.RectRounded(
			new Vector2(left, trackY),
			new Vector2(trackW, trackH),
			trackH / 2,
			(on ? accent : fieldBg).Clone().SetA(a),
			(on ? accent : fieldBorder).Clone().SetA(a),
			GUIInfo.ScaleWidthMenu(1)
		)
		const knob = trackH - GUIInfo.ScaleHeightMenu(4)
		const knobX = on
			? left + trackW - knob - GUIInfo.ScaleWidthMenu(2)
			: left + GUIInfo.ScaleWidthMenu(2)
		RendererSDK.RectRounded(
			new Vector2(knobX, trackY + GUIInfo.ScaleHeightMenu(2)),
			new Vector2(knob, knob),
			knob / 2,
			(on ? Color.White : textDim).Clone().SetA(a),
			Color.Black.SetA(0),
			0
		)
		const label = this.tr("Keep my binds")
		const lts = RendererSDK.GetTextSize(label, font, smallFont)
		const textX = left + trackW + GUIInfo.ScaleWidthMenu(9)
		RendererSDK.Text(
			label,
			new Vector2(textX, y + (kbH - (lts.y + lts.z)) / 2),
			textDim.Clone().SetA(a),
			font,
			smallFont
		)
		const rect = new Rectangle(
			new Vector2(left, y),
			new Vector2(textX + lts.x, y + kbH)
		)
		this.hits.push({ rect, action: () => (this.keepBinds = !this.keepBinds) })
	}

	private drawField(
		rect: Rectangle,
		text: string,
		placeholder: string,
		focused: boolean,
		ease: number,
		a: number,
		font: string,
		fontSize: number,
		icon?: string
	): void {
		RendererSDK.RectRounded(
			rect.pos1,
			rect.Size,
			GUIInfo.ScaleWidthMenu(6),
			fieldBg.Clone().SetA(Math.round(240 * ease)),
			(focused ? accent : fieldBorder).Clone().SetA(a),
			GUIInfo.ScaleWidthMenu(1)
		)
		let tx = rect.pos1.x + GUIInfo.ScaleWidthMenu(12)
		if (icon !== undefined) {
			const ic = GUIInfo.ScaleHeightMenu(14)
			RendererSDK.Image(
				icon,
				new Vector2(tx, rect.pos1.y + (rect.Height - ic) / 2),
				-1,
				new Vector2(ic, ic),
				textFaint.Clone().SetA(a)
			)
			tx += ic + GUIInfo.ScaleWidthMenu(8)
		}
		// fontSize is already scaled — center on real metrics, NOT another ScaleHeightMenu
		const shown =
			text.length === 0
				? ""
				: this.ellipsize(
						text,
						font,
						fontSize,
						rect.pos2.x - tx - GUIInfo.ScaleWidthMenu(8)
					)
		const metrics = RendererSDK.GetTextSize(
			shown.length !== 0 ? shown : placeholder,
			font,
			fontSize
		)
		const th = metrics.y + metrics.z
		const ty = rect.pos1.y + (rect.Height - th) / 2
		if (shown.length === 0 && !focused) {
			RendererSDK.Text(
				placeholder,
				new Vector2(tx, ty),
				textFaint.Clone().SetA(a),
				font,
				fontSize
			)
			return
		}
		RendererSDK.Text(shown, new Vector2(tx, ty), Color.White.SetA(a), font, fontSize)
		if (focused && (hrtime() - this.cursorBlink) % 1000 < 500) {
			const w = RendererSDK.GetTextSize(shown, font, fontSize).x
			RendererSDK.FilledRect(
				new Vector2(tx + w + GUIInfo.ScaleWidthMenu(1), ty),
				new Vector2(Math.max(1, GUIInfo.ScaleWidthMenu(1)), th),
				Color.White.SetA(a)
			)
		}
	}

	private drawButton(
		rect: Rectangle,
		label: string,
		base: Color,
		hover: Color,
		ease: number,
		a: number,
		font: string,
		fontSize: number,
		cursor: Vector2
	): void {
		const hovered = rect.Contains(cursor)
		RendererSDK.RectRounded(
			rect.pos1,
			rect.Size,
			GUIInfo.ScaleWidthMenu(6),
			(hovered ? hover : base).Clone().SetA(Math.round(255 * ease)),
			Color.Black.SetA(0),
			0
		)
		const ts = RendererSDK.GetTextSize(label, font, fontSize)
		RendererSDK.Text(
			label,
			new Vector2(
				rect.pos1.x + (rect.Width - ts.x) / 2,
				rect.pos1.y + (rect.Height - (ts.y + ts.z)) / 2
			),
			Color.White.SetA(Math.round(255 * ease)),
			font,
			fontSize
		)
	}
})()
