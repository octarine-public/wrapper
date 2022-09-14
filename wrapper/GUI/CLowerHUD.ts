import { Color } from "../Base/Color"
import { Rectangle } from "../Base/Rectangle"
import { Vector2 } from "../Base/Vector2"
import { RendererSDK } from "../Native/RendererSDK"
import { ScaleHeight, ScaleWidth } from "./Helpers"

export class CLowerHUD {
	public readonly LeftFlare = new Rectangle()
	public readonly Portrait = new Rectangle()
	public readonly XP = new Rectangle()
	public readonly StatsContainer = new Rectangle()
	public readonly TalentTree = new Rectangle()
	public readonly AbilitiesContainer = new Rectangle()
	public readonly AbilitiesRects: Rectangle[] = []
	public readonly AghsStatusContainer = new Rectangle()
	public readonly InventoryContainer = new Rectangle()
	public readonly MainInventorySlots: Rectangle[] = []
	public readonly BackpackSlots: Rectangle[] = []
	public readonly NeutralAndTPContainer = new Rectangle()
	public readonly NeutralSlot = new Rectangle()
	public readonly TPSlot = new Rectangle()
	public readonly RightFlare = new Rectangle()
	public readonly HealthManaContainer = new Rectangle()

	constructor(
		screen_size: Vector2,
		is_hero: boolean,
		abilities_count: number,
		base_abilities_count: number,
		hud_flip: boolean,
	) {
		this.LeftFlare.Width = ScaleWidth(52, screen_size)
		this.LeftFlare.Height = ScaleHeight(138, screen_size)
		this.LeftFlare.x = 0
		this.LeftFlare.y = screen_size.y - this.LeftFlare.Height

		this.Portrait.Width = ScaleWidth(159, screen_size)
		this.Portrait.Height = ScaleHeight(145, screen_size)
		this.Portrait.x = ScaleWidth(52, screen_size)
		this.Portrait.y = screen_size.y - this.Portrait.Height

		this.XP.Width = ScaleWidth(42, screen_size)
		this.XP.Height = ScaleHeight(42, screen_size)
		this.XP.x = ScaleWidth(30, screen_size)
		this.XP.y = screen_size.y - this.XP.Height - ScaleHeight(3, screen_size)

		// TODO: calculate stats groups positions
		this.StatsContainer.Width = ScaleWidth(129, screen_size)
		this.StatsContainer.Height =
			this.StatsContainer.x = ScaleWidth(82, screen_size)
		this.StatsContainer.y = screen_size.y - this.StatsContainer.Height - ScaleHeight(145, screen_size)

		this.AbilitiesContainer.Width = ScaleWidth(321, screen_size)
		this.AbilitiesContainer.Height = ScaleHeight(104, screen_size) + ScaleHeight(25, screen_size)
		this.AbilitiesContainer.x = ScaleWidth(219, screen_size)
		this.AbilitiesContainer.y = screen_size.y - this.AbilitiesContainer.Height - ScaleHeight(50, screen_size)

		if (is_hero) {
			this.TalentTree.Width = ScaleWidth(62, screen_size)
			this.TalentTree.Height = ScaleHeight(62, screen_size)
		}
		this.TalentTree.x = this.AbilitiesContainer.x
		this.TalentTree.y = this.AbilitiesContainer.pos2.y - this.TalentTree.Height - ScaleHeight(26, screen_size)
		const TalentTreeMargin = is_hero
			? ScaleWidth(4, screen_size)
			: 0

		if (is_hero) {
			this.AghsStatusContainer.Width = ScaleWidth(62, screen_size) - ScaleWidth(4, screen_size)
			this.AghsStatusContainer.Height = ScaleHeight(62, screen_size)
		}
		this.AghsStatusContainer.x = ScaleHeight(-6, screen_size)
		this.AghsStatusContainer.y = this.AbilitiesContainer.pos2.y - this.AghsStatusContainer.Height - ScaleHeight(24, screen_size)
		let AghsStatusContainerStart = this.TalentTree.pos2.x + TalentTreeMargin
		const AbilitiesContainerMargin = ScaleWidth(2, screen_size)
		const extended_abilities = base_abilities_count >= 5
		const AbilitySize = extended_abilities ? 58 : 65,
			AbilityMarginBottom1 = extended_abilities ? 24 : 25,
			AbilityMarginBottom2 = extended_abilities ? 8 : 0
		for (let i = 0; i < abilities_count; i++) {
			const AbilityRect = new Rectangle()
			AbilityRect.Width = ScaleWidth(AbilitySize, screen_size)
			AbilityRect.Height = ScaleHeight(AbilitySize, screen_size)
			AbilityRect.x = i === 0
				? this.TalentTree.pos2.x + TalentTreeMargin - AbilitiesContainerMargin
				: this.AbilitiesRects[i - 1].pos2.x
			AbilityRect.y = (
				this.AbilitiesContainer.pos2.y
				- AbilityRect.Height
				- ScaleHeight(AbilityMarginBottom1, screen_size)
				- ScaleHeight(AbilityMarginBottom2, screen_size)
			)
			this.AbilitiesRects.push(AbilityRect)
			AghsStatusContainerStart = AbilityRect.pos2.x - AbilitiesContainerMargin
		}
		this.AghsStatusContainer.x += AghsStatusContainerStart
		this.AbilitiesContainer.pos2.x = Math.max(
			this.AbilitiesContainer.pos2.x,
			this.AghsStatusContainer.pos2.x,
		)

		let max_x = this.AbilitiesContainer.pos2.x + ScaleWidth(302, screen_size)

		this.InventoryContainer.Width = ScaleWidth(202, screen_size)
		this.InventoryContainer.Height = ScaleHeight(145, screen_size)
		this.InventoryContainer.x = max_x - this.InventoryContainer.Width - ScaleWidth(93, screen_size)
		this.InventoryContainer.y = screen_size.y - this.InventoryContainer.Height
		max_x = Math.max(max_x, this.InventoryContainer.pos2.x + ScaleWidth(93, screen_size))

		const MaininventoryItemWidth = ScaleWidth(60, screen_size),
			MainInventoryItemHeight = ScaleHeight(45, screen_size),
			MainInventoryItemMarginHorizontal = ScaleWidth(3, screen_size),
			MainInventoryItemMarginVertical = ScaleHeight(2, screen_size)
		const MaininventoryX = this.InventoryContainer.x + ScaleWidth(3, screen_size)
		const MainInventoryRow1Container = new Rectangle()
		MainInventoryRow1Container.Width = ScaleWidth(200, screen_size)
		MainInventoryRow1Container.Height = ScaleWidth(50, screen_size)
		MainInventoryRow1Container.x = MaininventoryX
		MainInventoryRow1Container.y = this.InventoryContainer.y + ScaleHeight(6, screen_size)
		for (let i = 0; i < 3; i++) {
			const ItemRect = new Rectangle()
			ItemRect.Width = MaininventoryItemWidth
			ItemRect.Height = MainInventoryItemHeight
			ItemRect.x = MainInventoryRow1Container.x + MainInventoryItemMarginHorizontal
			ItemRect.y = MainInventoryRow1Container.y + MainInventoryItemMarginVertical
			MainInventoryRow1Container.x += ItemRect.Width + MainInventoryItemMarginHorizontal
			this.MainInventorySlots.push(ItemRect)
		}

		const MainInventoryRow2Container = new Rectangle()
		MainInventoryRow2Container.Width = MainInventoryRow1Container.Width
		MainInventoryRow2Container.Height = MainInventoryRow1Container.Height
		MainInventoryRow2Container.x = MaininventoryX
		MainInventoryRow2Container.y = MainInventoryRow1Container.pos2.y - ScaleHeight(2, screen_size)
		for (let i = 0; i < 3; i++) {
			const ItemRect = new Rectangle()
			ItemRect.Width = MaininventoryItemWidth
			ItemRect.Height = MainInventoryItemHeight
			ItemRect.x = MainInventoryRow2Container.x + MainInventoryItemMarginHorizontal
			ItemRect.y = MainInventoryRow2Container.y + MainInventoryItemMarginVertical
			MainInventoryRow2Container.x += ItemRect.Width + MainInventoryItemMarginHorizontal
			this.MainInventorySlots.push(ItemRect)
		}

		const BackpackItemWidth = ScaleWidth(60, screen_size)
		const BackpackContainer = new Rectangle()
		BackpackContainer.Height = ScaleWidth(34, screen_size)
		BackpackContainer.x = this.InventoryContainer.x + ScaleWidth(6, screen_size)
		BackpackContainer.y = this.InventoryContainer.y + ScaleHeight(104, screen_size)
		for (let i = 0; i < 3; i++) {
			const ItemRect = new Rectangle()
			ItemRect.Width = BackpackItemWidth
			ItemRect.Height = BackpackContainer.Height
			ItemRect.x = BackpackContainer.x + ScaleWidth(3, screen_size) - ScaleWidth(4, screen_size)
			ItemRect.y = BackpackContainer.y
			BackpackContainer.x += ItemRect.Width + ScaleWidth(3, screen_size) * 2
			this.BackpackSlots.push(ItemRect)
		}

		this.RightFlare.Width = ScaleWidth(92, screen_size)
		this.RightFlare.Height = ScaleHeight(138, screen_size)
		this.RightFlare.x = max_x - ScaleWidth(1, screen_size) - this.RightFlare.Width
		this.RightFlare.y = screen_size.y - this.RightFlare.Height

		const NeutralAndTPWidth = ScaleWidth(48, screen_size),
			NeutralAndTPHeight = ScaleHeight(48, screen_size)
		this.NeutralAndTPContainer.Width = NeutralAndTPWidth
		this.NeutralAndTPContainer.Height = ScaleHeight(128, screen_size)
		this.NeutralAndTPContainer.x = max_x - ScaleWidth(44, screen_size) - this.NeutralAndTPContainer.Width
		this.NeutralAndTPContainer.y = screen_size.y - this.NeutralAndTPContainer.Height

		const NeutralAndTPPaddingWidth = ScaleWidth(2, screen_size),
			NeutralAndTPPaddingHeight = ScaleHeight(2, screen_size)
		const NeutralAndTPWidthPadded = NeutralAndTPWidth - NeutralAndTPPaddingWidth * 2,
			NeutralAndTPHeightPadded = NeutralAndTPHeight - NeutralAndTPPaddingHeight * 2
		const BaseNeutralAndTPHeight = screen_size.y - NeutralAndTPHeight + NeutralAndTPPaddingHeight
		this.TPSlot.Width = NeutralAndTPWidthPadded
		this.TPSlot.Height = NeutralAndTPHeightPadded
		this.TPSlot.x = this.NeutralAndTPContainer.x + NeutralAndTPPaddingWidth
		this.TPSlot.y = BaseNeutralAndTPHeight - ScaleHeight(9, screen_size)

		this.NeutralSlot.Width = NeutralAndTPWidthPadded
		this.NeutralSlot.Height = NeutralAndTPHeightPadded
		this.NeutralSlot.x = this.TPSlot.x
		this.NeutralSlot.y = BaseNeutralAndTPHeight - ScaleHeight(62, screen_size)

		this.HealthManaContainer.Height = ScaleHeight(26, screen_size) * 2
		this.HealthManaContainer.x = ScaleWidth(223, screen_size)
		this.HealthManaContainer.Width = (
			max_x
			- ScaleWidth(40, screen_size)
			- ScaleWidth(266, screen_size)
			- this.HealthManaContainer.x
		)
		this.HealthManaContainer.y = screen_size.y - ScaleHeight(8, screen_size) - this.HealthManaContainer.Height

		this.CenterEverything(screen_size, max_x, hud_flip)
	}

	public DebugDraw(): void {
		RendererSDK.FilledRect(this.LeftFlare.pos1, this.LeftFlare.Size, Color.Gray.SetA(128))
		RendererSDK.FilledRect(this.XP.pos1, this.XP.Size, Color.Yellow.SetA(128))
		RendererSDK.FilledRect(this.Portrait.pos1, this.Portrait.Size, Color.Green.SetA(128))
		RendererSDK.FilledRect(this.AbilitiesContainer.pos1, this.AbilitiesContainer.Size, Color.RoyalBlue.SetA(128))
		RendererSDK.FilledRect(this.TalentTree.pos1, this.TalentTree.Size, Color.Red.SetA(128))
		this.AbilitiesRects.forEach(rect => RendererSDK.FilledRect(
			rect.pos1,
			rect.Size,
			Color.Fuchsia.SetA(128),
		))
		RendererSDK.FilledRect(this.AghsStatusContainer.pos1, this.AghsStatusContainer.Size, Color.Blue.SetA(128))
		RendererSDK.FilledRect(this.InventoryContainer.pos1, this.InventoryContainer.Size, Color.Orange.SetA(128))
		this.MainInventorySlots.forEach(rect => RendererSDK.FilledRect(
			rect.pos1,
			rect.Size,
			Color.Fuchsia.SetA(128),
		))
		this.BackpackSlots.forEach(rect => RendererSDK.FilledRect(
			rect.pos1,
			rect.Size,
			Color.Fuchsia.SetA(128),
		))
		RendererSDK.FilledRect(this.NeutralAndTPContainer.pos1, this.NeutralAndTPContainer.Size, Color.White.SetA(128))
		RendererSDK.FilledRect(this.RightFlare.pos1, this.RightFlare.Size, Color.Gray.SetA(128))
		RendererSDK.FilledRect(this.TPSlot.pos1, this.TPSlot.Size, Color.Fuchsia.SetA(128))
		RendererSDK.FilledRect(this.NeutralSlot.pos1, this.NeutralSlot.Size, Color.Fuchsia.SetA(128))
		RendererSDK.FilledRect(this.HealthManaContainer.pos1, this.HealthManaContainer.Size, Color.Aqua.SetA(128))
	}

	private CenterEverything(screen_size: Vector2, max_x: number, hud_flip: boolean): void {
		let base_x = Math.floor((screen_size.x - max_x) / 2)
		if (hud_flip)
			base_x++
		this.LeftFlare.x += base_x
		this.Portrait.x += base_x
		this.XP.x += base_x
		this.StatsContainer.x += base_x
		this.TalentTree.x += base_x
		this.AbilitiesRects.forEach(rect => rect.x += base_x)
		this.AghsStatusContainer.x += base_x
		this.InventoryContainer.x += base_x
		this.MainInventorySlots.forEach(rect => rect.x += base_x)
		this.BackpackSlots.forEach(rect => rect.x += base_x)
		this.NeutralAndTPContainer.x += base_x
		this.NeutralSlot.x += base_x
		this.TPSlot.x += base_x
		this.RightFlare.x += base_x
		this.HealthManaContainer.x += base_x
		this.AbilitiesContainer.x += base_x
	}
}
