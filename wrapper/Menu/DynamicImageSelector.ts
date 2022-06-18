import Color from "../Base/Color"
import Rectangle from "../Base/Rectangle"
import Vector2 from "../Base/Vector2"
import GUIInfo from "../GUI/GUIInfo"
import { Sleeper } from "../Helpers/Sleeper"
import EventsSDK from "../Managers/EventsSDK"
import InputManager, { InputEventSDK, VKeys } from "../Managers/InputManager"
import RendererSDK from "../Native/RendererSDK"
import AbilityData from "../Objects/DataBook/AbilityData"
import { orderBy } from "../Utils/ArrayExtensions"
import Base, { IMenu } from "./Base"

type IDefaultValues = Map<string, [
	boolean, /** default state */
	boolean, /** default static show */
	boolean, /** show */
	number,  /** priority */
]>

// every icon: 32x32, 1x1 border
export default class DynamicImageSelector extends Base {
	public static ServicePriorityToggle = false

	public static OnWindowSizeChanged(): void {
		DynamicImageSelector.image_border_width = GUIInfo.ScaleWidth(2)
		DynamicImageSelector.image_gap = GUIInfo.ScaleWidth(2)
		DynamicImageSelector.base_image_height = GUIInfo.ScaleHeight(32)
		DynamicImageSelector.random_height_value = GUIInfo.ScaleHeight(40)
	}

	private static image_border_width = 0
	private static image_gap = 0
	private static base_image_height = 0
	private static random_height_value = 0
	private static readonly elements_per_row = 5
	private static readonly image_activated_border_color = new Color(104, 4, 255)

	public enabled_values: IDefaultValues

	protected readonly item_drop = new Map<string, number>()
	protected readonly image_size = new Vector2()
	protected rendered_paths = new Map<string, string>()
	protected QueueSleeper = new Sleeper()
	protected QueueImages = new Map<string, [boolean, boolean]>()

	private autoPriority = 0

	constructor(
		parent: IMenu,
		name: string,
		public values: string[],
		default_values: IDefaultValues = new Map(),
		public created_default_state = false,
		tooltip = "",
	) {
		super(parent, name, tooltip)
		this.enabled_values = default_values
	}

	public get IsZeroSelected(): boolean {
		for (const [value] of this.enabled_values.values())
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
					.AddScalar(DynamicImageSelector.image_border_width * 2 + DynamicImageSelector.image_gap)
					.MultiplyScalarX(Math.min(this.values.length, DynamicImageSelector.elements_per_row))
					.MultiplyScalarY(Math.ceil(this.values.length / DynamicImageSelector.elements_per_row)),
			).SubtractScalar((DynamicImageSelector.elements_per_row - 1) * DynamicImageSelector.image_gap),
		)
	}

	public get ConfigValue() {
		return Array.from(this.enabled_values.entries())
	}

	public set ConfigValue(value) {
		if (this.ShouldIgnoreNewConfigValue || value === undefined || !Array.isArray(value))
			return

		this.enabled_values = new Map(value)

		for (const [] of this.enabled_values)
			this.autoPriority++

		this.values = [...orderBy(this.values.filter(name => this.GetPriority(name) >= 0), x => this.GetPriority(x))]

		this.values.forEach(value_ => {
			if (!this.enabled_values.has(value_))
				this.enabled_values.set(value_, [this.created_default_state, false, false, this.autoPriority])
		})
	}

	public get ClassPriority(): number {
		return 6
	}

	public async Update(): Promise<boolean> {
		if (!(await super.Update()))
			return false

		this.values = [...orderBy(this.values.filter(name => this.GetPriority(name) >= 0), x => this.GetPriority(x))]

		this.values.forEach(value => {
			if (!this.enabled_values.has(value))
				this.enabled_values.set(value, [this.created_default_state, false, false, this.autoPriority])
		})

		this.rendered_paths.clear()
		this.image_size.x = this.image_size.y = DynamicImageSelector.base_image_height

		for (const name of this.values) {
			if (!this.IsVisibleImage(name))
				continue
			let path = name
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
			this.image_size.x = Math.max(this.image_size.x, DynamicImageSelector.base_image_height * (path_iamge_size.x / path_iamge_size.y))
			this.rendered_paths.set(name, path)
		}

		this.OriginalSize.x = Math.max(
			this.name_size.x,
			Math.min(this.rendered_paths.size, DynamicImageSelector.elements_per_row)
			* (this.image_size.x + DynamicImageSelector.image_border_width * 2 + DynamicImageSelector.image_gap),
		) + this.text_offset.x * 2

		this.OriginalSize.y = (
			Math.ceil(this.rendered_paths.size / DynamicImageSelector.elements_per_row)
			* (this.image_size.y + DynamicImageSelector.image_border_width * 2 + DynamicImageSelector.image_gap)
			+ DynamicImageSelector.random_height_value
		)

		return true
	}

	public GetPriority(value: string): number {
		const state = this.enabled_values.get(value)
		if (state === undefined)
			return Number.MAX_SAFE_INTEGER
		return state[3]
	}

	public IsVisibleImage(value: string): boolean {
		const state = this.enabled_values.get(value)
		if (state === undefined)
			return false
		return state[1] || state[2]
	}

	public IsEnabled(value: string): boolean {
		const state = this.enabled_values.get(value)

		if (this.QueuedUpdate) {
			const state_ = this.QueueImages.get(value)
			if (state_ === undefined)
				return false
			return state_[0]
		}

		if (!this.QueuedUpdate && !this.QueueSleeper.Sleeping(value))
			this.QueueImages.delete(value)

		if (state === undefined)
			return false
		return state[0]
	}

	public IsEnabledID(id: number): boolean {
		return this.IsEnabled(this.values[id])
	}

	public async OnAddNewImage(name: string, default_state = true, default_show = false) {
		if (this.QueuedUpdate && !this.values.includes(name)) {
			this.QueueSleeper.Sleep(300, name)
			this.QueueImages.set(name, [default_state, default_show])
			return
		}

		// boolean, /** default state */
		// boolean, /** default static show */
		// boolean, /** show */
		// number /** priority */

		if (this.values.includes(name)) {
			const enabled_values = this.enabled_values.get(name)
			if (enabled_values === undefined || !Array.isArray(enabled_values)) {
				this.enabled_values.set(name, [default_state, default_show, true, this.autoPriority++])
				await this.Update()
				return
			}

			enabled_values[2] = true
			await this.Update()
			return
		}

		this.values.push(name)

		const enabled_values_ = this.enabled_values.get(name)
		if (enabled_values_ === undefined || !Array.isArray(enabled_values_)) {
			this.enabled_values.set(name, [default_state, default_show, true, this.autoPriority++])
			await this.Update()
			return
		}

		enabled_values_[2] = true
		await this.Update()
	}

	public async OnHideImages(names?: string[]) {

		// boolean, /** default state */
		// boolean, /** default static show */
		// boolean, /** show */
		// number /** priority */

		if (names === undefined) {
			for (const name of this.values) {
				const enabled_values = this.enabled_values.get(name)
				if (enabled_values === undefined || enabled_values[1])
					continue
				enabled_values[2] = false
				await this.Update()
			}
			return
		}

		for (const name of names) {
			const enabled_values = this.enabled_values.get(name)
			if (enabled_values !== undefined && !enabled_values[1]) {
				enabled_values[2] = false
				await this.Update()
			}
		}

		this.QueueImages.clear()
	}

	public async Render(): Promise<void> {
		await super.Render()
		this.RenderTextDefault(this.Name, this.Position.Add(this.text_offset))

		for (const [value, [default_state, default_show]] of this.QueueImages) {
			const time = this.QueueSleeper.RemainingSleepTime(value)
			if (time > 50)
				continue
			await this.OnAddNewImage(value, default_state, default_show)
			this.QueueImages.delete(value)
			this.QueueSleeper.ResetKey(value)
		}

		const base_pos = this.IconsRect.pos1
		for (let i = 0; i < this.values.length; i++) {
			const value = this.values[i]
			if (!this.IsVisibleImage(value))
				continue
			const imagePath = this.rendered_paths.get(value)
			if (imagePath === undefined)
				continue

			const size = this.image_size,
				pos = new Vector2(
					i % DynamicImageSelector.elements_per_row,
					Math.floor(i / DynamicImageSelector.elements_per_row),
				).Multiply(this.image_size.AddScalar(DynamicImageSelector.image_border_width * 2 + DynamicImageSelector.image_gap)).Add(base_pos)

			const position = this.item_drop.has(value) ? this.MousePosition : pos

			RendererSDK.Image(imagePath, position, -1, size, Color.White, 0, undefined, !this.IsEnabled(value))

			if (InputManager.IsKeyDown(VKeys.CONTROL) || DynamicImageSelector.ServicePriorityToggle)
				RendererSDK.FilledRect(position, size, Color.Black.SetA(180))

			if (this.IsEnabled(value))
				RendererSDK.FilledRect(
					position.Add(new Vector2(0, size.y / 1.75)),
					size.Subtract(new Vector2(0, size.y / 1.75)),
					Color.Black.SetA(233),
				)

			this.DrawTextPriority(i + 1, position, size)

			if (this.IsEnabled(value))
				RendererSDK.OutlinedRect(
					position,
					size,
					DynamicImageSelector.image_border_width,
					DynamicImageSelector.image_activated_border_color,
				)

			if (DynamicImageSelector.ServicePriorityToggle)
				this.DrawTextRealPriority(this.enabled_values.get(value), position, size)
		}
	}

	public async OnMouseLeftDown(): Promise<boolean> {
		const rect = this.IconsRect,
			off = rect.GetOffset(this.MousePosition)

		if (InputManager.IsKeyDown(VKeys.CONTROL))
			this.ImageValueChanged(off, async value => {
				const enabled_values = this.enabled_values.get(value)
				if (enabled_values === undefined || !this.IsVisibleImage(value))
					return
				this.item_drop.set(value, enabled_values[3])
			})

		return !rect.Contains(this.MousePosition)
	}

	public async OnMouseLeftUp(): Promise<boolean> {
		const rect = this.IconsRect,
			off = rect.GetOffset(this.MousePosition)

		for (const [dragName, dragPriority] of this.item_drop) {
			await this.ImageValueChanged(off, async (currName, _, currPriority) => {

				const dragNameValue = this.enabled_values.get(dragName)
				const currNameValue = this.enabled_values.get(currName)

				if (dragNameValue === undefined || currNameValue === undefined || dragPriority === currPriority)
					return

				// todo need improved
				if (dragPriority > currPriority) {
					dragNameValue[3] = currPriority
					currNameValue[3] = currNameValue[3] + 1
					this.InsertIncrease(currName, dragName, currPriority)
				} else if (dragPriority < currPriority) {
					dragNameValue[3] = currPriority
					currNameValue[3] = currNameValue[3] - 1
					this.InsertDecrease(currName, dragName, currPriority)
				}

				await this.Update()
			})

			this.item_drop.delete(dragName)
		}

		if (!rect.Contains(this.MousePosition) || InputManager.IsKeyDown(VKeys.CONTROL))
			return false

		this.ImageValueChanged(off, async value => {
			const enabled_values = this.enabled_values.get(value)
			if (enabled_values === undefined || !this.IsVisibleImage(value))
				return
			enabled_values[0] = !this.IsEnabled(value)
			await this.TriggerOnValueChangedCBs()
		})

		return false
	}

	private async ImageValueChanged(off: Vector2, callback: (value: string, state: boolean, priority: number) => Promise<void>) {
		for (let i = 0; i < this.values.length; i++) {
			const value = this.values[i]
			const enabled_values = this.enabled_values.get(value)
			if (enabled_values === undefined || !this.IsVisibleImage(value))
				return
			const base_pos = new Vector2(
				i % DynamicImageSelector.elements_per_row,
				Math.floor(i / DynamicImageSelector.elements_per_row),
			).Multiply(this.image_size.AddScalar(DynamicImageSelector.image_border_width * 2 + DynamicImageSelector.image_gap))
			if (!new Rectangle(base_pos, base_pos.Add(this.image_size)).Contains(off))
				continue
			await callback(value, enabled_values[0], enabled_values[3])
			break
		}
	}

	private InsertDecrease(currName: string, dragName: string, currPriority: number) {
		const entriesEnables = [...this.enabled_values.entries()]
		const Decrease = entriesEnables.filter(([name, [, , , priority]]) =>
			this.FilterDecrease(name, currName, dragName, currPriority, priority))
		for (const [insertName] of Decrease) {
			const insert = this.enabled_values.get(insertName)
			if (insert === undefined)
				continue
			insert[3] = insert[3] - 1
		}
	}

	private InsertIncrease(currName: string, dragName: string, currPriority: number) {
		const entriesEnables = [...this.enabled_values.entries()]

		const Increase = entriesEnables.filter(([name, [, , , priority]]) =>
			this.FilterIncrease(name, currName, dragName, currPriority, priority, entriesEnables.length))

		for (const [insertName] of Increase) {
			const insert = this.enabled_values.get(insertName)
			if (insert === undefined)
				continue
			insert[3] = insert[3] + 1
		}
	}

	private FilterDecrease(name: string, currName: string, dragName: string, currPriority: number, priority: number) {
		return name !== currName
			&& name !== dragName
			&& currPriority > priority && priority > 0
	}

	private FilterIncrease(name: string, currName: string, dragName: string, currPriority: number, priority: number, maxPriority: number) {
		return name !== currName
			&& name !== dragName
			&& currPriority <= priority && priority < (maxPriority - 1)
	}

	private DrawTextPriority(Id: number, position: Vector2, size: Vector2) {
		const text = `${Id}`
		const textSize = size.y / 2
		const textName = RendererSDK.DefaultFontName

		const textSizePosition = Vector2.FromVector3(RendererSDK.GetTextSize(text, textName, textSize))
			.MultiplyScalarForThis(-1)
			.AddScalarX(size.x)
			.AddScalarY(size.y)

		const textPosition = textSizePosition.DivideScalarForThis(2)
			.AddScalarX(position.x + textSizePosition.x)
			.AddScalarY(position.y + textSizePosition.y)
			.RoundForThis()

		RendererSDK.Text(text, textPosition, Color.White, textName, textSize)
	}

	/** service */
	private DrawTextRealPriority(
		enabled: Nullable<[boolean, /** default state */ boolean, /** default show */ boolean, /** show */ number /** priority */]>,
		position: Vector2, size: Vector2,
	) {
		if (enabled === undefined)
			return

		const text = `${enabled[3]}`
		const textSize = size.y / 1.3
		const textName = RendererSDK.DefaultFontName

		const textSizePosition = Vector2.FromVector3(RendererSDK.GetTextSize(text, textName, textSize))
			.MultiplyScalarForThis(-1)
			.AddScalarX(size.x)
			.AddScalarY(size.y)

		const textPosition = textSizePosition.DivideScalarForThis(2)
			.AddScalarX(position.x)
			.AddScalarY(position.y)
			.RoundForThis()

		RendererSDK.Text(text, textPosition, Color.White, textName, textSize)
	}
}

EventsSDK.on("WindowSizeChanged", () => DynamicImageSelector.OnWindowSizeChanged())

InputEventSDK.on("KeyDown", key => {
	if (key !== VKeys.MENU && key !== VKeys.KEY_K || !(InputManager.IsKeyDown(VKeys.MENU) && InputManager.IsKeyDown(VKeys.KEY_K)))
		return true
	DynamicImageSelector.ServicePriorityToggle = !DynamicImageSelector.ServicePriorityToggle
	return !(InputManager.IsKeyDown(VKeys.MENU) && InputManager.IsKeyDown(VKeys.KEY_K))
})
