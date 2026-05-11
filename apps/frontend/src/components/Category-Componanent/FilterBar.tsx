import React, { useState } from "react";
import type { Dispatch, SetStateAction } from "react";

export const CATEGORIES = [
  "All",
  "Living Room Furniture",
  "Bedroom Furniture",
  "Dining Room Furniture",
] as const;

export const PRICE_RANGES = [
  { label: "All Prices", min: 0, max: Infinity },
  { label: "Under LKR 50,000", min: 0, max: 50000 },
  { label: "LKR 50,000 – 80,000", min: 50000, max: 80000 },
  { label: "LKR 80,000 – 120,000", min: 80000, max: 120000 },
  { label: "Above LKR 120,000", min: 120000, max: Infinity },
] as const;

export const PRODUCT_TYPES = ["All", "Teka", "Leema", "Others"] as const;

type FilterBarProps = {
  search: string;
  setSearch: Dispatch<SetStateAction<string>>;
  category: string;
  setCategory: Dispatch<SetStateAction<string>>;
  priceIdx: number;
  setPriceIdx: Dispatch<SetStateAction<number>>;
  type: string;
  setType: Dispatch<SetStateAction<string>>;
};

export default function FilterBar({
  search,
  setSearch,
  category,
  setCategory,
  priceIdx,
  setPriceIdx,
  type,
  setType,
}: FilterBarProps) {
  const [catOpen, setCatOpen] = useState(false);
  const [priceOpen, setPriceOpen] = useState(false);
  const [typeOpen, setTypeOpen] = useState(false);

  return (
    <div className="bg-[#ca6e23] w-full">
      <div className="max-w-6xl mx-auto px-5 py-3 flex flex-wrap gap-3 items-center">

        {/* Category */}
        <div className="relative">
          <button
            onClick={() => {
              setCatOpen(!catOpen);
              setPriceOpen(false);
              setTypeOpen(false);
            }}
            className="px-4 py-2 rounded bg-white/20 text-white text-sm font-medium"
          >
            {category === "All" ? "Category" : category.replace(" Furniture", "")} ▼
          </button>

          {catOpen && (
            <div className="absolute mt-1 bg-white rounded shadow-lg w-48 z-50">
              {CATEGORIES.map((c) => (
                <button
                  key={c}
                  onClick={() => {
                    setCategory(c);
                    setCatOpen(false);
                  }}
                  className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 ${
                    category === c ? "font-bold text-green-800" : "text-gray-800"
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Price */}
        <div className="relative">
          <button
            onClick={() => {
              setPriceOpen(!priceOpen);
              setCatOpen(false);
              setTypeOpen(false);
            }}
            className="px-4 py-2 rounded bg-white/20 text-white text-sm font-medium"
          >
            {PRICE_RANGES[priceIdx]?.label ?? PRICE_RANGES[0].label} ▼
          </button>

          {priceOpen && (
            <div className="absolute mt-1 bg-white rounded shadow-lg w-56 z-50">
              {PRICE_RANGES.map((r, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setPriceIdx(i);
                    setPriceOpen(false);
                  }}
                  className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 ${
                    priceIdx === i ? "font-bold text-green-800" : "text-gray-800"
                  }`}
                >
                  {r.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Type */}
        <div className="relative">
          <button
            onClick={() => {
              setTypeOpen(!typeOpen);
              setCatOpen(false);
              setPriceOpen(false);
            }}
            className="px-4 py-2 rounded bg-white/20 text-white text-sm font-medium"
          >
            {type === "All" ? "Product Type" : type} ▼
          </button>

          {typeOpen && (
            <div className="absolute mt-1 bg-white rounded shadow-lg w-48 z-50">
              {PRODUCT_TYPES.map((t) => (
                <button
                  key={t}
                  onClick={() => {
                    setType(t);
                    setTypeOpen(false);
                  }}
                  className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 ${
                    type === t ? "font-bold text-green-800" : "text-gray-800"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Search */}
        <input
          type="text"
          placeholder="Search product..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 min-w-[180px] px-4 py-2 rounded text-white text-sm"
        />
      </div>
    </div>
  );
}