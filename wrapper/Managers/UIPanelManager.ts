import { Color } from "../Base/Color"
import { Rectangle } from "../Base/Rectangle"
import { Vector2 } from "../Base/Vector2"
import { GUIInfo } from "../GUI/GUIInfo"
import { RendererSDK } from "../Native/RendererSDK"
import { EventsSDK } from "./EventsSDK"
import { InputEventSDK, InputManager, VMouseKeys } from "./InputManager"

export abstract class UIPanel {
	public IsValid = true
	protected Dragging = false
	protected readonly DragOffset = new Vector2()

	constructor(public readonly Position: Rectangle) {}

	public abstract Draw(): void
	public abstract MouseKeyUp(): boolean
	public abstract MouseKeyDown(): boolean
	public OnDispose?(): void

	public Compute(desiredPos?: Vector2) {
		UIPanelManager.Compute(this, desiredPos)
	}
	public ComputeDrag() {
		if (this.Dragging) {
			this.Compute(InputManager.CursorOnScreen.Subtract(this.DragOffset))
		}
	}
	public BackgroundDrag() {
		if (!this.Dragging) {
			return
		}
		RendererSDK.FilledRect(
			this.Position.pos1,
			this.Position.Size,
			Color.Black.SetA(180)
		)
		RendererSDK.OutlinedRect(
			this.Position.pos1,
			this.Position.Size,
			Math.round(GUIInfo.ScaleHeight(3)),
			Color.Yellow
		)
	}
}

export const UIPanelManager = new (class CUIPanelManager {
	private readonly maxSearchRadius = 32
	private readonly tmpBasePos = new Vector2()
	private readonly tmpTestRect = new Rectangle(new Vector2(), new Vector2())

	private readonly items: UIPanel[] = []
	private activePanel: Nullable<UIPanel>

	constructor() {
		InputEventSDK.on("MouseKeyUp", this.mouseKeyUp.bind(this))
		InputEventSDK.on("MouseKeyDown", this.mouseKeyDown.bind(this))

		EventsSDK.after("Draw", this.draw.bind(this))
		EventsSDK.on("WindowSizeChanged", this.windowSizeChanged.bind(this))
	}
	public Register(panel: UIPanel): boolean {
		if (this.items.includes(panel)) {
			return false
		}
		this.items.push(panel)
		return true
	}
	public Unregister<T extends UIPanel>(panel: T): boolean {
		const index = this.items.indexOf(panel)
		if (index === -1) {
			return false
		}
		if (this.activePanel === panel) {
			this.activePanel = undefined
		}
		panel.OnDispose?.()
		panel.IsValid = false
		this.items.splice(index, 1)
		return true
	}
	public Compute(panel: UIPanel, desiredPos?: Vector2) {
		const rect = panel.Position
		const size = rect.Size

		const win = RendererSDK.WindowSize
		const minimap = GUIInfo.Minimap.Minimap

		this.tmpBasePos.CopyFrom(desiredPos ?? rect.pos1)
		this.tmpBasePos.x = Math.max(0, Math.min(this.tmpBasePos.x, win.x - size.x))
		this.tmpBasePos.y = Math.max(0, Math.min(this.tmpBasePos.y, win.y - size.y))

		if (this.isFree(panel, size, minimap, this.tmpBasePos.x, this.tmpBasePos.y)) {
			rect.pos1.CopyFrom(this.tmpBasePos)
			rect.pos2 = this.tmpBasePos.Add(size)
			return
		}
		for (let r = 1; r <= this.maxSearchRadius; r++) {
			for (let dx = -r; dx <= r; dx++) {
				if (
					this.tryApply(
						panel,
						size,
						minimap,
						this.tmpBasePos.x + dx,
						this.tmpBasePos.y - r
					)
				) {
					return
				}
				if (
					this.tryApply(
						panel,
						size,
						minimap,
						this.tmpBasePos.x + dx,
						this.tmpBasePos.y + r
					)
				) {
					return
				}
			}
			for (let dy = -r + 1; dy <= r - 1; dy++) {
				if (
					this.tryApply(
						panel,
						size,
						minimap,
						this.tmpBasePos.x - r,
						this.tmpBasePos.y + dy
					)
				) {
					return
				}
				if (
					this.tryApply(
						panel,
						size,
						minimap,
						this.tmpBasePos.x + r,
						this.tmpBasePos.y + dy
					)
				) {
					return
				}
			}
		}
	}
	private draw() {
		for (let i = this.items.length - 1; i >= 0; i--) {
			const panel = this.items[i]
			panel.Draw()
			panel.ComputeDrag()
			panel.BackgroundDrag()
		}
	}
	private mouseKeyDown(key: VMouseKeys) {
		if (key !== VMouseKeys.MK_LBUTTON) {
			return true
		}
		if (this.activePanel !== undefined) {
			return false
		}
		for (let i = this.items.length - 1; i >= 0; i--) {
			const panel = this.items[i]
			if (panel.MouseKeyDown() === false) {
				this.activePanel = panel
				// z-order to top
				this.items.splice(i, 1)
				this.items.push(panel)
				return false
			}
		}
		return true
	}
	private mouseKeyUp(key: VMouseKeys) {
		if (this.activePanel === undefined || key !== VMouseKeys.MK_LBUTTON) {
			return true
		}
		const panel = this.activePanel
		this.activePanel = undefined
		return panel.MouseKeyUp()
	}
	private windowSizeChanged() {
		const win = RendererSDK.WindowSize
		for (let i = this.items.length - 1; i >= 0; i--) {
			const it = this.items[i]
			const size = it.Position.Size
			it.Position.pos1.x = Math.min(Math.max(0, it.Position.pos1.x), win.x - size.x)
			it.Position.pos1.y = Math.min(Math.max(0, it.Position.pos1.y), win.y - size.y)
			it.Position.pos2 = it.Position.pos1.Add(size)
			this.Compute(it)
		}
	}
	private isFree(
		panel: UIPanel,
		size: Vector2,
		minimap: Rectangle,
		x: number,
		y: number
	): boolean {
		const win = RendererSDK.WindowSize
		if (x < 0 || y < 0 || x + size.x > win.x || y + size.y > win.y) {
			return false
		}
		this.tmpTestRect.pos1.x = x
		this.tmpTestRect.pos1.y = y
		this.tmpTestRect.pos2.x = x + size.x
		this.tmpTestRect.pos2.y = y + size.y

		if (this.tmpTestRect.Intersects(minimap)) {
			return false
		}
		for (let i = this.items.length - 1; i >= 0; i--) {
			const other = this.items[i]
			if (other === panel) {
				continue
			}
			if (this.tmpTestRect.Intersects(other.Position)) {
				return false
			}
		}
		return true
	}
	private tryApply(
		panel: UIPanel,
		size: Vector2,
		minimap: Rectangle,
		x: number,
		y: number
	): boolean {
		if (!this.isFree(panel, size, minimap, x, y)) {
			return false
		}
		panel.Position.pos1.x = x
		panel.Position.pos1.y = y
		panel.Position.pos2 = panel.Position.pos1.Add(size)
		return true
	}
})()
