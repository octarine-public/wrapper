import BinaryStream from "./BinaryStream"
import Vector2 from "../Base/Vector2"

export class HeightMap {
	constructor(
		private cells: [number, number, number][],
		private height_map: number[],
		private min_x: number,
		private min_y: number,
		private cell_count_x: number,
		private cell_count_y: number,
		private height_map_accuracy: number,
		private height_map_fraction_accuracy: number
	) { }

	public get MinMapCoords(): Vector2 {
		return new Vector2(this.min_x, this.min_y)
	}

	public get MapSize(): Vector2 {
		return new Vector2(this.cell_count_x, this.cell_count_y).MultiplyScalarForThis(this.height_map_accuracy)
	}

	public get MaxMapCoords(): Vector2 {
		return this.MinMapCoords.AddForThis(this.MapSize)
	}

	public GetHeightForLocation(loc: Vector2): number {
		let basic_coords_no_floor = loc.Subtract(this.MinMapCoords).DivideScalarForThis(this.height_map_accuracy)
		let basic_coords = basic_coords_no_floor.Floor()
		if (basic_coords.x < 0 || basic_coords.y < 0 || basic_coords.x > this.cell_count_x || basic_coords.y > this.cell_count_y)
			return 0

		let flat_coord = basic_coords.x + basic_coords.y * this.cell_count_x
		if (flat_coord === -1)
			return 0

		let cell = this.cells[flat_coord]
		if (cell === undefined)
			return 0

		let height_map_id = cell[0]
		if (height_map_id === -1)
			return cell[1]

		let fraction_vec = basic_coords_no_floor.Subtract(basic_coords)
		let fraction_vec_mul = fraction_vec.Min(0.99999988).MultiplyScalarForThis(this.height_map_fraction_accuracy - 1).FloorForThis()
		let a = this.height_map[height_map_id + this.height_map_fraction_accuracy * fraction_vec_mul.y + fraction_vec_mul.x]
		let b = this.height_map[height_map_id + this.height_map_fraction_accuracy * fraction_vec_mul.y + (fraction_vec_mul.x + 1)]
		let c = this.height_map[height_map_id + this.height_map_fraction_accuracy * (fraction_vec_mul.y + 1) + fraction_vec_mul.x]
		let d = this.height_map[height_map_id + this.height_map_fraction_accuracy * (fraction_vec_mul.y + 1) + (fraction_vec_mul.x + 1)]
		let something = (fraction_vec.x - (fraction_vec_mul.x / (this.height_map_fraction_accuracy - 1))) * (this.height_map_fraction_accuracy - 1)
		let something2 = ((b - a) * something) + a
		return ((d - c) * something + c - something2) * ((fraction_vec.y - (fraction_vec_mul.y / (this.height_map_fraction_accuracy - 1))) * (this.height_map_fraction_accuracy - 1)) + something2
	}

	public GetSecondaryHeightForLocation(loc: Vector2): number {
		let basic_coords = loc.Subtract(this.MinMapCoords).DivideScalarForThis(this.height_map_accuracy).FloorForThis()
		if (basic_coords.x < 0 || basic_coords.y < 0 || basic_coords.x > this.cell_count_x || basic_coords.y > this.cell_count_y)
			return 0

		let flat_coord = basic_coords.x + basic_coords.y * this.cell_count_x
		if (flat_coord === -1)
			return 0

		return this.cells[flat_coord][2]
	}
}

export function ParseHeightMap(buf: ArrayBuffer) {
	let stream = new BinaryStream(new DataView(buf))
	if (stream.ReadInt32(false) !== 0x76686367) // "vhcg" magic
		throw "Invalid VHCG file magic " + stream.RelativeSeek(-4).ReadInt32(false)
	if (stream.ReadInt32() > 1) // version
		throw "Unknown VHCG version " + stream.RelativeSeek(-4).ReadInt32()
	let data_offset = stream.ReadInt32(), // v9
		cell_count_x = stream.ReadInt32(), // *+0
		cell_count_y = stream.ReadInt32(), // *+4
		height_map_fraction_accuracy = stream.ReadInt32(), // *+8
		height_map_accuracy = stream.ReadFloat32(), // *+12
		min_x = stream.ReadFloat32(), // *+16
		min_y = stream.ReadFloat32() // *+20
	stream.pos = data_offset
	let cell_count = cell_count_x * cell_count_y
	let something = height_map_fraction_accuracy ** 2
	let cells: [number, number, number][] = []
	let height_map: number[] = []
	let height_count = 0
	for (let i = cell_count; i--;) {
		let cell: [number, number, number] = [height_count, stream.ReadFloat32(), stream.ReadFloat32()]
		if (!stream.ReadBoolean())
			cell[0] = -1
		else
			height_count += something
		cells.push(cell)
	}
	for (let i = height_count; i--;)
		height_map.push(stream.ReadFloat32())
	return new HeightMap(cells, height_map, min_x, min_y, cell_count_x, cell_count_y, height_map_accuracy, height_map_fraction_accuracy)
}
