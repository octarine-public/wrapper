#include "stdafx.h"
#include "reader.h"

int HeightMap::Parse(uint8_t* data, uint32_t size) {
	Reader reader(data, size);
	
	{
		uint32_t magic;
		if (!reader.Read(magic))
			return -1;
		if (magic != 0x67636876) // "vhcg" magic
			return HeightMapParseError::INVALID_MAGIC;
	}
	{
		int32_t version;
		if (!reader.Read(version))
			return -2;
		if (version > 1)
			return HeightMapParseError::UNKNOWN_VERSION;
	}
	{
		int32_t data_offset;
		if (!reader.Read(data_offset) || data_offset < 0)
			return -3;
		if (
			!reader.Read(this->m_CellCountX) || this->m_CellCountX < 0
			|| !reader.Read(this->m_CellCountY) || this->m_CellCountY < 0
			|| !reader.Read(this->m_iHeightMapCellAccuracy)
			|| !reader.Read(this->m_flHeightMapAccuracy)
			|| !reader.Read(this->m_vecMinMapCoords.x)
			|| !reader.Read(this->m_vecMinMapCoords.y)
		)
			return -4;
		reader.SetPos(data_offset);
	}
	
	uint32_t cell_count = this->m_CellCountX * this->m_CellCountY;
	this->m_pCells = (HeightMapCell*)calloc(cell_count, sizeof(HeightMapCell));
	if (this->m_pCells == nullptr)
		return HeightMapParseError::ALLOCATION_ERROR;

	uint32_t cell_floats = this->m_iHeightMapCellAccuracy * this->m_iHeightMapCellAccuracy;
	uint32_t height_count = 0;
	for (uint32_t i = 0; i < cell_count; i++) {
		auto& cell = this->m_pCells[i];
		if (!reader.Read(cell.m_flDefaultFirstHeight) || !reader.Read(cell.m_flSecondaryHeight)) {
			delete this->m_pCells;
			this->m_pCells = nullptr;
			return -5;
		}

		bool use_height_map = false;
		if (!reader.ReadBoolean(use_height_map)) {
			delete this->m_pCells;
			this->m_pCells = nullptr;
			return -6;
		}
		if (use_height_map) {
			cell.m_iHeightMapID = height_count;
			height_count += cell_floats;
		} else
			cell.m_iHeightMapID = -1;
	}

	this->m_pHeightMap = (float*)calloc(height_count, sizeof(float));
	if (this->m_pHeightMap == nullptr) {
		delete this->m_pCells;
		this->m_pCells = nullptr;
		return HeightMapParseError::ALLOCATION_ERROR;
	}
	for (uint32_t i = 0; i < height_count; i++)
		if (!reader.Read(this->m_pHeightMap[i])) {
			delete this->m_pCells;
			this->m_pCells = nullptr;
			delete this->m_pHeightMap;
			this->m_pHeightMap = nullptr;
			return -7;
		}

	return HeightMapParseError::NONE;
}

float HeightMap::GetHeightForLocation(Vector2D loc) {
	if (this->m_pHeightMap == nullptr)
		return 0.f;
	auto basic_coords = (loc - this->GetMinMapCoords()) / this->m_flHeightMapAccuracy;
	auto cell_ptr = this->GetCellByBasicCoords(basic_coords);
	if (cell_ptr == nullptr)
		return 0.f;
	
	auto& cell = *cell_ptr;
	if (cell.m_iHeightMapID == -1)
		return cell.m_flDefaultFirstHeight;
	
	auto fraction_vec = basic_coords - basic_coords.Floor();
	int32_t fraction_vec_mul_x, fraction_vec_mul_y;
	{
		auto fraction_vec_mul = fraction_vec.Min(0.99999988) * (this->m_iHeightMapCellAccuracy - 1);
		fraction_vec_mul_x = (int32_t)floorf(fraction_vec_mul.x);
		fraction_vec_mul_y = (int32_t)floorf(fraction_vec_mul.y);
	}
	auto cell_base = &this->m_pHeightMap[cell.m_iHeightMapID];
	float a = cell_base[this->m_iHeightMapCellAccuracy * fraction_vec_mul_y + fraction_vec_mul_x];
	float b = cell_base[this->m_iHeightMapCellAccuracy * fraction_vec_mul_y + (fraction_vec_mul_x + 1)];
	float c = cell_base[this->m_iHeightMapCellAccuracy * (fraction_vec_mul_y + 1) + fraction_vec_mul_x];
	float d = cell_base[this->m_iHeightMapCellAccuracy * (fraction_vec_mul_y + 1) + (fraction_vec_mul_x + 1)];
	float something = (fraction_vec.x - (fraction_vec_mul_x / (this->m_iHeightMapCellAccuracy - 1))) * (this->m_iHeightMapCellAccuracy - 1);
	float something2 = ((b - a) * something) + a;
	return ((d - c) * something + c - something2) * ((fraction_vec.y - (fraction_vec_mul_y / (this->m_iHeightMapCellAccuracy - 1))) * (this->m_iHeightMapCellAccuracy - 1)) + something2;
}

float HeightMap::GetSecondaryHeightForLocation(Vector2D loc) {
	auto cell_ptr = this->GetCellByBasicCoords((loc - this->GetMinMapCoords()) / this->m_flHeightMapAccuracy);
	if (cell_ptr == nullptr)
		return 0.f;
	return cell_ptr->m_flSecondaryHeight;
}
