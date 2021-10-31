import Color from "../Base/Color"
import Rectangle from "../Base/Rectangle"
import Vector2 from "../Base/Vector2"
import GUIInfo from "../GUI/GUIInfo"
import EventsSDK from "../Managers/EventsSDK"
import RendererSDK from "../Native/RendererSDK"
import AbilityData from "../Objects/DataBook/AbilityData"
import Base, { IMenu } from "./Base"

// every icon: 32x32, 1x1 border
export default class ImageSelector extends Base {
	public static OnWindowSizeChanged(): void {
		ImageSelector.image_border_width = GUIInfo.ScaleWidth(2)
		ImageSelector.image_gap = GUIInfo.ScaleWidth(2)
		ImageSelector.base_image_height = GUIInfo.ScaleHeight(32)
		ImageSelector.random_height_value = GUIInfo.ScaleHeight(40)
	}

	private static image_border_width = 0
	private static image_gap = 0
	private static base_image_height = 0
	private static random_height_value = 0
	private static readonly elements_per_row = 5
	private static readonly image_activated_border_color = new Color(104, 4, 255)

	public enabled_values: Map<string, boolean>
	protected readonly image_size = new Vector2()
	protected rendered_paths: string[] = []

	constructor(
		parent: IMenu,
		name: string,
		public values: string[],
		default_values = new Map<string, boolean>(),
		tooltip = "",
	) {
		super(parent, name, tooltip)
		this.enabled_values = default_values
	}
	public get IsZeroSelected(): boolean {
		for (const value of this.enabled_values.values())
			if (value)
				return false
		return true
	}

	public get IconsRect() {
		const base_pos = this.Position.Add(this.text_offset).AddScalarY(this.name_size.y + 3)
		return new Rectangle(
			base_pos,
			base_pos.Add(
				this.image_size
					.AddScalar(ImageSelector.image_border_width * 2 + ImageSelector.image_gap)
					.MultiplyScalarX(Math.min(this.values.length, ImageSelector.elements_per_row))
					.MultiplyScalarY(Math.ceil(this.values.length / ImageSelector.elements_per_row)),
			).SubtractScalar((ImageSelector.elements_per_row - 1) * ImageSelector.image_gap),
		)
	}

	public get ConfigValue() { return Array.from(this.enabled_values.entries()) }
	public set ConfigValue(value) {
		if (this.ShouldIgnoreNewConfigValue || value === undefined)
			return
		this.enabled_values = new Map<string, boolean>(value)
		this.values.forEach(value_ => {
			if (!this.enabled_values.has(value_))
				this.enabled_values.set(value_, false)
		})
	}

	public async Update(): Promise<boolean> {
		if (!(await super.Update()))
			return false
		this.values.forEach(value => {
			if (!this.enabled_values.has(value))
				this.enabled_values.set(value, false)
		})
		this.image_size.x = this.image_size.y = ImageSelector.base_image_height
		this.rendered_paths = []
		for (let path of this.values) {
			if (path.startsWith("rune_"))
				path = `panorama/images/spellicons/${path}_png.vtex_c`
			else if (path.startsWith("item_bottle_"))
				path = `panorama/images/items/${path.substring(5)}_png.vtex_c`
			else if (!path.startsWith("npc_dota_hero_")) {
				const abil = await AbilityData.GetAbilityByName(path)
				if (abil !== undefined)
					path = abil.TexturePath
			} else
				path = `panorama/images/heroes/${path}_png.vtex_c`
			const path_iamge_size = RendererSDK.GetImageSize(path)
			this.image_size.x = Math.max(this.image_size.x, ImageSelector.base_image_height * (path_iamge_size.x / path_iamge_size.y))
			this.rendered_paths.push(path)
		}
		this.OriginalSize.x =
			Math.max(
				this.name_size.x,
				Math.min(this.values.length, ImageSelector.elements_per_row)
				* (this.image_size.x + ImageSelector.image_border_width * 2 + ImageSelector.image_gap),
			)
			+ this.text_offset.x * 2
		this.OriginalSize.y = (
			Math.ceil(this.values.length / ImageSelector.elements_per_row)
			* (this.image_size.y + ImageSelector.image_border_width * 2 + ImageSelector.image_gap)
			+ ImageSelector.random_height_value
		)
		return true
	}

	public IsEnabled(value: string): boolean {
		return this.enabled_values.get(value) ?? false
	}
	public IsEnabledID(id: number): boolean {
		return this.IsEnabled(this.values[id])
	}

	public async Render(): Promise<void> {
		await super.Render()
		this.RenderTextDefault(this.Name, this.Position.Add(this.text_offset))
		const base_pos = this.IconsRect.pos1
		for (let i = 0; i < this.values.length; i++) {
			const size = this.image_size,
				pos = new Vector2(
					i % ImageSelector.elements_per_row,
					Math.floor(i / ImageSelector.elements_per_row),
				).Multiply(this.image_size.AddScalar(ImageSelector.image_border_width * 2 + ImageSelector.image_gap)).Add(base_pos)
			RendererSDK.Image(this.rendered_paths[i], pos, -1, size)
			if (this.IsEnabled(this.values[i]))
				RendererSDK.OutlinedRect(
					pos,
					size,
					ImageSelector.image_border_width,
					ImageSelector.image_activated_border_color,
				)
		}
	}

	public async OnMouseLeftDown(): Promise<boolean> {
		return !this.IconsRect.Contains(this.MousePosition)
	}
	public async OnMouseLeftUp(): Promise<boolean> {
		const rect = this.IconsRect
		if (!rect.Contains(this.MousePosition))
			return false
		const off = rect.GetOffset(this.MousePosition)
		for (let i = 0; i < this.values.length; i++) {
			const base_pos = new Vector2(
				i % ImageSelector.elements_per_row,
				Math.floor(i / ImageSelector.elements_per_row),
			).Multiply(this.image_size.AddScalar(ImageSelector.image_border_width * 2 + ImageSelector.image_gap))
			if (!new Rectangle(base_pos, base_pos.Add(this.image_size)).Contains(off))
				continue
			const value = this.values[i]
			this.enabled_values.set(value, !this.IsEnabled(value))
			await this.TriggerOnValueChangedCBs()
			break
		}
		return false
	}
}

EventsSDK.on("WindowSizeChanged", () => ImageSelector.OnWindowSizeChanged())
