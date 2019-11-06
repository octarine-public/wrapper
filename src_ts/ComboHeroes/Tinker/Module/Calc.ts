import { Game, GameSleeper, Hero } from "wrapper/Imports"
import InitAbility from "../Extends/Abilities"
import InitItems from "../Extends/Items"
import {  MyHero } from "../Listeners"
import { abils, items } from "../MenuManager"

export function GetComboDamage()
{
	let ItemsInit = new InitItems(MyHero),
		Abilities = new InitAbility(MyHero),
		latest_spellamp = (1 + MyHero.SpellAmplification),
		ethereal_d = 0,
		etheral_blade_magic_reduction = 0,
		veil_of_discord_magic_reduction = 0,
		base_magic_res = 0.25,
		dagon_d=0,
		totalMagicResistance,
		laser_d=0,
		shiva_d = 0,
		rocket_d = 0
	let eblade = ItemsInit.Ethereal
	if (eblade !== undefined && items.IsEnabled("item_ethereal_blade"))
	{
		etheral_blade_magic_reduction = 0.4
		ethereal_d = (ItemsInit.Ethereal.GetSpecialValue("blast_damage_base") + ItemsInit.Ethereal.GetSpecialValue("blast_agility_multiplier") * MyHero.TotalIntellect)
	}
	if (ItemsInit.Discord !== undefined && items.IsEnabled("item_veil_of_discord"))
	{
		veil_of_discord_magic_reduction = 0.25
	}
	if (ItemsInit.Dagon!==undefined && items.IsEnabled("item_dagon_5"))
	{
		dagon_d = ItemsInit.Dagon.GetSpecialValue("damage")*latest_spellamp
	}
	if (Abilities.q!==undefined && abils.IsEnabled("tinker_laser") && Abilities.q.Level>0)
	{
		laser_d = Abilities.q.GetSpecialValue("laser_damage")+MyHero.GetTalentValue("special_bonus_unique_tinker")
	}
	if (Abilities.w !==undefined && abils.IsEnabled("tinker_heat_seeking_missile")&& Abilities.w.Level>0)
	{
		rocket_d = Abilities.w.GetSpecialValue("damage")*latest_spellamp
	}
	if (ItemsInit.Shivas!==undefined&&items.IsEnabled("item_shivas_guard"))
	{
		shiva_d = ItemsInit.Shivas.GetSpecialValue("blast_damage")*latest_spellamp
	}
	totalMagicResistance = ((1 - base_magic_res) * (1 + etheral_blade_magic_reduction) * (1 + veil_of_discord_magic_reduction))
	return (ethereal_d+dagon_d+laser_d+rocket_d+shiva_d)/totalMagicResistance
}
export function ManaFactDamage(en: Hero)
{
	if (en !== undefined && en.IsAlive && en.IsValid)
			{
				let manalaser = 0,
					manarocket = 0,
					manarearm = 0,
					manadagon = 0,
					dagondist = 0,
					manaethereal = 0,
					manashiva = 0,
					manasoulring = 0,
					ItemsInit = new InitItems(MyHero),
					Abilities = new InitAbility(MyHero)
				if (Abilities.q !== undefined &&  Abilities.q.Level> 0 && Abilities.q.CanBeCasted())
				{
					manalaser = Abilities.q.ManaCost
				}
				else
				{
					manalaser = 0
				}
				if (Abilities.w !== undefined &&  Abilities.w.Level > 0 && Abilities.w.CanBeCasted())
				{
					manarocket = Abilities.w.ManaCost
				}
				else
				{
					manarocket = 0
				}
				if (Abilities.r !== undefined &&  Abilities.r.Level > 0   && Abilities.r.CanBeCasted())
				{
					manarearm = Abilities.r.ManaCost
				}
				else
				{
					manarearm = 0
				}
				if (ItemsInit.Dagon !== undefined && ItemsInit.Dagon.CanBeCasted())
				{
					dagondist = ItemsInit.Dagon.GetSpecialValue("range_tooltip")
					manadagon = ItemsInit.Dagon.ManaCost
				}
				else
				{
					manadagon = 0
					dagondist = 0
				}
				if (ItemsInit.Ethereal !== undefined && ItemsInit.Ethereal.CanBeCasted())
				{
					manaethereal = ItemsInit.Ethereal.ManaCost
				}
				else
				{
					manaethereal = 0
				}

				if (ItemsInit.Shivas !== undefined && ItemsInit.Shivas.CanBeCasted())
				{
					manashiva = ItemsInit.Shivas.ManaCost
				}
				else
				{
					manashiva = 0
				}
				if (ItemsInit.Soulring !== undefined && ItemsInit.Soulring.CanBeCasted())
				{
					manasoulring = 150
				}
				else
				{
					manasoulring = 0
				}
				//factical mana consume in current range
				return ((MyHero.Distance2D(en) < 650 + MyHero.CastRangeBonus? manalaser : 0)
					+ (MyHero.Distance2D(en) < 2500 ? manarocket : 0)
					+ (MyHero.Distance2D(en) < 800 + MyHero.CastRangeBonus ? manaethereal : 0)
					+ (MyHero.Distance2D(en) < dagondist + MyHero.CastRangeBonus ? manadagon : 0)
					+ (MyHero.Distance2D(en) < 900  ? manashiva : 0)
					- manasoulring)
			}
	return 0
}
export function  Manaprocast()
{
	let manalaser = 0,
		manarocket = 0, manarearm = 0,
		manadagon = 0,
		manaveil = 0,
		manasheep = 0,
		manaethereal = 0,
		manashiva = 0,
		manasoulring = 0,
		ItemsInit = new InitItems(MyHero),
		Abilities = new InitAbility(MyHero)

	if (Abilities.q !=null && Abilities.q.Level>0)
	{
		manalaser = Abilities.q.ManaCost
	}
	else
	{
		manalaser = 0;
	}

	if (Abilities.w !== null && Abilities.w.Level>0)
	{
		Abilities.w.ManaCost
	}
	else
	{
		manarocket = 0;
	}

	if (Abilities.r !== undefined && Abilities.r.Level>0)
	{
		manarearm = Abilities.r.ManaCost
	}
	else
	{
		manarearm = 0;
	}

	if (ItemsInit.Dagon !== undefined && items.IsEnabled("item_dagon_5"))
	{
		manadagon = ItemsInit.Dagon.ManaCost
	}
	else
	{
		manadagon = 0;
	}

	if (ItemsInit.Ethereal !== undefined && items.IsEnabled("item_ethereal_blade"))
	{
		manaethereal = ItemsInit.Ethereal.ManaCost
	}
	else
	{
		manaethereal = 0;
	}

	if (ItemsInit.Discord !== undefined && items.IsEnabled("item_veil_of_discord"))
	{
		manaveil = ItemsInit.Discord.ManaCost
	}
	else
	{
		manaveil = 0;
	}

	if (ItemsInit.Sheeps !== undefined && items.IsEnabled("item_sheepstick"))
	{
		manasheep = ItemsInit.Sheeps.ManaCost
	}
	else
	{
		manasheep = 0;
	}

	if (ItemsInit.Shivas !== undefined && items.IsEnabled("item_shivas_guard"))
	{
		manashiva = ItemsInit.Shivas.ManaCost
	}
	else
	{
		manashiva = 0;
	}

	if (ItemsInit.Soulring !== undefined)
	{
		manasoulring = 150;
	}
	else
	{
		manasoulring = 0;
	}

	return manarearm + manalaser + manarocket + manadagon + manaethereal + manaveil + manasheep + manashiva - manasoulring;
}
export function OneHitLeft(en: Hero)
{
	if (((en.HP < GetOneAutoAttackDamage(en)))
		&& MyHero.Distance2D(en) < MyHero.AttackRange+50)
	{
		return true
	}
	return false
}
export function GetOneAutoAttackDamage(enemy: Hero)
{
	if (MyHero.CanAttack(enemy))
	{
		return enemy.CalculateDamageByHand(MyHero)
	}
	return 0
}
export function EZKill(enemy: Hero)
{
	if (enemy != undefined && enemy.IsAlive && enemy.IsValid)
	{
		let		ItemsInit = new InitItems(MyHero),
				latest_spellamp = (1 + MyHero.SpellAmplification),
				ethereal_d:number
		let eblade = ItemsInit.Ethereal
		if (eblade != undefined && items.IsEnabled(eblade.Name))
		{
			ethereal_d = ItemsInit.Ethereal.GetSpecialValue("blast_damage_base") + ItemsInit.Ethereal.GetSpecialValue("blast_agility_multiplier") * MyHero.TotalIntellect
		}
		if (enemy.HP*(1+enemy.MagicDamageResist/100) < ((ethereal_d + ((ItemsInit.Dagon!==undefined)?ItemsInit.Dagon.GetSpecialValue("damage"):0))*latest_spellamp  ))
		{
			return true
		}
		return false
	}
	return false
}
export function GetEZKillDamage(enemy:Hero)
{
	if (enemy != undefined && enemy.IsAlive && enemy.IsValid)
	{

		let		ItemsInit = new InitItems(MyHero),
				latest_spellamp = (1 + MyHero.SpellAmplification),
				ethereal_d:number
		let eblade = ItemsInit.Ethereal
		if (eblade != undefined && items.IsEnabled(eblade.Name))
		{
			ethereal_d = ItemsInit.Ethereal.GetSpecialValue("blast_damage_base") + ItemsInit.Ethereal.GetSpecialValue("blast_agility_multiplier") * MyHero.TotalIntellect
		}

		return ((ethereal_d + ((ItemsInit.Dagon!==undefined)?ItemsInit.Dagon.GetSpecialValue("damage"):0))*latest_spellamp * (1-enemy.MagicDamageResist/100))
	}
	return 0
}
export function ProcastCounter(en: Hero)
{
	let Abilities = new InitAbility(MyHero)
	{
		if (!en.IsMagicImmune && !en.IsInvulnerable)
		{
			return Math.ceil((en.HP*(1+en.MagicDamageResist/100)+(Abilities.r.GetSpecialValue("channel_tooltip",Abilities.r.Level)+0.1)*en.HPRegen) / GetComboDamage())

		}
		return 999
	}
}
/*export function HitCount(en: Hero)
{
	if (MyHero.CanAttack(en))
	{
		if (Math.ceil((en.HP - GetComboDamage() + 2 * GetOneAutoAttackDamage(en)) / GetOneAutoAttackDamage(en)) <= 0)
		{
			return 0
		}

		return (Math.ceil((en.HP - GetComboDamage() + 2 * GetOneAutoAttackDamage(en)) / GetOneAutoAttackDamage(en)))
	}

	return 999
}*/
export function OnlyRocketCount(en: Hero)
{

	let ItemsInit = new InitItems(MyHero),
		Abilities = new InitAbility(MyHero),
		latest_spellamp = (1 + MyHero.SpellAmplification)
	if (!en.IsMagicImmune && !en.IsInvulnerable && Abilities.w!==undefined&&Abilities.w.Level>0)
	{
		return ((((en.HP*(1+en.MagicDamageResist/100)) + ((en.Distance2D(MyHero)/Abilities.w.GetSpecialValue("speed")+Abilities.r.GetSpecialValue("channel_tooltip"))*en.HPRegen)) / (Abilities.w.GetSpecialValue("damage")*latest_spellamp)))
	}

	return 999
}
export function Manaonerocket()
{
	let manarocket = 0,
		manarearm = 0,
		manasoulring = 0,
		ItemsInit = new InitItems(MyHero),
		Abilities = new InitAbility(MyHero)

	if (Abilities.w !== null && Abilities.w.Level>0)
	{
		manarocket = Abilities.w.ManaCost
	}
	else
	{
		manarocket = 0
	}

	if (Abilities.r !== undefined && Abilities.r.Level>0)
	{
		manarearm = Abilities.r.ManaCost
	}
	else
	{
		manarearm = 0
	}

	if (ItemsInit.Soulring !== null)
	{
		manasoulring = 150
	}
	else
	{
		manasoulring = 0
	}

	return manarocket - manasoulring
}