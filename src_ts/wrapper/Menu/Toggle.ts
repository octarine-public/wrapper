import Color from "../Base/Color"
import Rectangle from "../Base/Rectangle"
import Vector2 from "../Base/Vector2"
import RendererSDK from "../Native/RendererSDK"
import Base from "./Base"

export default class Toggle extends Base {
	public value = true
	protected readonly text_offset = new Vector2(8, 8)
	protected readonly toggle_size = new Vector2(20, 20)
	protected readonly toggle_offset = this.toggle_size.Add(new Vector2(3, 8))
	protected readonly toggle_activated_offset = new Vector2(2, 2)
	protected readonly toggle_color = new Color(36, 40, 50)
	protected readonly toggle_activated_color = new Color(14, 99, 152)
	protected readonly MousePosition = new Vector2()

	constructor(name: string, default_value: boolean, tooltip?: string) {
		super(name)
		this.value = default_value
		this.tooltip = tooltip
		this.TotalSize_.x =
			RendererSDK.GetTextSize(this.name, this.FontName, this.FontSize, FontFlags_t.ANTIALIAS).x
			+ 10
			+ this.toggle_size.x
			+ this.border_size.x * 2
			+ this.text_offset.x * 2
		super.Update()
	}

	public get ConfigValue() { return this.value }
	public set ConfigValue(value) { this.value = value !== undefined ? value : this.value }

	private get ToggleRect() {
		let base_pos = this.Position.Add(this.TotalSize).SubtractForThis(this.toggle_offset).SubtractForThis(this.border_size.MultiplyScalar(2))
		return new Rectangle(base_pos, base_pos.Add(this.toggle_size))
	}

	public OnActivate(func: (caller: this) => void) {
		return this.OnValue(caller => {
			if (caller.value)
				func(caller)
		})
	}
	public OnDeactivate(func: (caller: this) => void) {
		return this.OnValue(caller => {
			if (!caller.value)
				func(caller)
		})
	}
	public Render(): void {
		super.Render()
		RendererSDK.FilledRect(this.Position.Add(this.border_size), this.TotalSize.Subtract(this.border_size.MultiplyScalar(2)), this.background_color)
		RendererSDK.Text(this.name, this.Position.Add(this.text_offset), this.FontColor, this.FontName, this.FontSize, FontFlags_t.ANTIALIAS)
		let toggle_rect = this.ToggleRect
		RendererSDK.FilledRect(toggle_rect.pos1, this.toggle_size, this.toggle_color)
		if (this.value)
			RendererSDK.FilledRect(toggle_rect.pos1.Add(this.toggle_activated_offset), this.toggle_size.Subtract(this.toggle_activated_offset.MultiplyScalar(2)), this.toggle_activated_color)
		if (!toggle_rect.Contains(this.MousePosition))
			super.RenderTooltip()
	}

	public OnMouseLeftDown(): boolean {
		return !this.Rect.Contains(this.MousePosition)
	}
	public OnMouseLeftUp(): boolean {
		this.value = !this.value
		this.OnValueChangedCBs.forEach(f => f(this))
		return false
	}
}
