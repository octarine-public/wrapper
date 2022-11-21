#include "stdafx.h"

struct HeightMapCell {
	FORCEINLINE HeightMapCell() {}
	int32_t m_iHeightMapID;
	float m_flDefaultFirstHeight;
	float m_flSecondaryHeight;
};

enum HeightMapParseError {
	NONE = 0,
	INVALID_MAGIC = 1,
	UNKNOWN_VERSION = 2,
	ALLOCATION_ERROR = 3,
};

class HeightMap {
public:
	FORCEINLINE HeightMap() {}
	FORCEINLINE ~HeightMap() {
		delete this->m_pCells;
		delete this->m_pHeightMap;
	}
	int Parse(uint8_t* data, uint32_t size);
	FORCEINLINE Vector2D GetMinMapCoords() {
		return this->m_vecMinMapCoords;
	}
	FORCEINLINE Vector2D GetMapSize() {
		return Vector2D(this->m_CellCountX, this->m_CellCountY) * this->m_flHeightMapAccuracy;
	}
	FORCEINLINE Vector2D GetMaxMapCoords() {
		return this->GetMinMapCoords() + this->GetMapSize();
	}
	float GetHeightForLocation(Vector2D loc);
	float GetSecondaryHeightForLocation(Vector2D loc);

private:
	FORCEINLINE HeightMapCell* GetCellByBasicCoords(Vector2D basic_coords) {
		if (this->m_pCells == nullptr)
			return nullptr;
		auto basic_coords_x = (int32_t)floorf(basic_coords.x);
		if (basic_coords_x < 0 || basic_coords_x >= this->m_CellCountX)
			return nullptr;
		auto basic_coords_y = (uint32_t)floorf(basic_coords.y);
		if (basic_coords_y < 0 || basic_coords_y >= this->m_CellCountY)
			return nullptr;
		return &this->m_pCells[basic_coords_x + basic_coords_y * this->m_CellCountX];
	}
	HeightMapCell* m_pCells = nullptr;
	float* m_pHeightMap = nullptr;
	Vector2D m_vecMinMapCoords = { 0.f, 0.f };
	int32_t m_CellCountX = 0, m_CellCountY = 0;
	float m_flHeightMapAccuracy = 0.f;
	int32_t m_iHeightMapCellAccuracy = 0;
};
