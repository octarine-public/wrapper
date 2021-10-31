import Color from "../Base/Color"
import Rectangle from "../Base/Rectangle"
import Vector2 from "../Base/Vector2"
import GUIInfo from "../GUI/GUIInfo"
import EventsSDK from "../Managers/EventsSDK"
import RendererSDK from "../Native/RendererSDK"
import Base, { IMenu } from "./Base"

export default class Toggle extends Base {
	public static OnWindowSizeChanged(): void {
		Toggle.toggle_background_size.x = GUIInfo.ScaleWidth(Toggle.orig_toggle_background_size.x)
		Toggle.toggle_background_size.y = GUIInfo.ScaleHeight(Toggle.orig_toggle_background_size.y)
		Toggle.toggle_size.x = GUIInfo.ScaleWidth(Toggle.orig_toggle_size.x)
		Toggle.toggle_size.y = GUIInfo.ScaleHeight(Toggle.orig_toggle_size.y)
		Toggle.toggle_background_offset.x = GUIInfo.ScaleWidth(12)
		Toggle.toggle_background_offset.y = GUIInfo.ScaleHeight(12)
		Toggle.toggle_offset.x = GUIInfo.ScaleWidth(3)
		Toggle.toggle_offset.y = GUIInfo.ScaleHeight(3)
	}

	private static readonly toggle_background_path = "menu/toggle_background.svg"
	private static readonly toggle_path = "menu/toggle.svg"
	private static readonly orig_toggle_background_size = RendererSDK.GetImageSize(Toggle.toggle_background_path)
	private static readonly toggle_background_size = new Vector2()
	private static readonly orig_toggle_size = RendererSDK.GetImageSize(Toggle.toggle_path)
	private static readonly toggle_size = new Vector2()
	private static readonly toggle_background_offset = new Vector2()
	private static readonly toggle_offset = new Vector2()
	private static readonly toggle_background_color_active = new Color(104, 4, 255)
	private static readonly toggle_background_color_inactive = new Color(31, 30, 53)
	private static readonly text_toggle_gap = 10
	private static readonly animation_time = 150

	public value = true
	private animation_start_time = 0
	private readonly current_color = new Color()

	constructor(parent: IMenu, name: string, default_value: boolean, tooltip = "") {
		super(parent, name, tooltip)
		this.value = default_value
	}

	public get ConfigValue() { return this.value }
	public set ConfigValue(value) {
		if (this.ShouldIgnoreNewConfigValue)
			return
		this.value = value ?? this.value
	}

	private get ToggleRect() {
		const base_pos = this.Position.Add(this.TotalSize).SubtractForThis(Toggle.toggle_background_offset)
		return new Rectangle(base_pos.Subtract(Toggle.toggle_background_size), base_pos)
	}

	public async Update(): Promise<boolean> {
		if (!(await super.Update()))
			return false
		this.OriginalSize.x =
			this.text_offset.x
			+ this.name_size.x
			+ Toggle.text_toggle_gap
			+ Toggle.toggle_background_size.x
			+ Toggle.toggle_background_offset.x
		return true
	}

	public OnActivate(func: (caller: this) => any) {
		return this.OnValue(async caller => {
			if (caller.value)
				await func(caller)
		})
	}
	public OnDeactivate(func: (caller: this) => any) {
		return this.OnValue(async caller => {
			if (!caller.value)
				await func(caller)
		})
	}
	public async Render(): Promise<void> {
		await super.Render()
		this.RenderTextDefault(this.Name, this.Position.Add(this.text_offset))
		const animation_state = Math.min(1, (hrtime() - this.animation_start_time) / Toggle.animation_time)
		const primary_color = this.value ? Toggle.toggle_background_color_active : Toggle.toggle_background_color_inactive,
			secondary_color = this.value ? Toggle.toggle_background_color_inactive : Toggle.toggle_background_color_active
		const toggle_rect = this.ToggleRect
		this.current_color.r = (primary_color.r * animation_state) + (secondary_color.r * (1 - animation_state))
		this.current_color.g = (primary_color.g * animation_state) + (secondary_color.g * (1 - animation_state))
		this.current_color.b = (primary_color.b * animation_state) + (secondary_color.b * (1 - animation_state))
		RendererSDK.Image(
			Toggle.toggle_background_path,
			toggle_rect.pos1,
			-1,
			Toggle.toggle_background_size,
			this.current_color,
		)
		const toggle_pos = this.value ? animation_state : 1 - animation_state
		RendererSDK.Image(
			Toggle.toggle_path,
			toggle_rect.pos1
				.Add(Toggle.toggle_offset)
				.AddScalarX((toggle_rect.Size.x - Toggle.toggle_size.x - (Toggle.toggle_offset.x * 2)) * toggle_pos),
			-1,
			Toggle.toggle_size,
		)
	}

	public async OnMouseLeftDown(): Promise<boolean> {
		return !this.IsHovered
	}
	public async OnMouseLeftUp(): Promise<boolean> {
		this.value = !this.value
		this.animation_start_time = hrtime()
		await this.TriggerOnValueChangedCBs()
		return false
	}
}

EventsSDK.on("WindowSizeChanged", () => Toggle.OnWindowSizeChanged())
