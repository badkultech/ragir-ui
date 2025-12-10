"use client"

interface MobileBottomBarProps {
  onSort: () => void;
  onFilters: () => void;
}

export function MobileBottomBar({ onSort, onFilters }: MobileBottomBarProps) {
  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-[#e5e3e0] z-20">
      <div className="flex">
        <button
          onClick={onSort}
          className="flex-1 flex items-center justify-center gap-2 py-4 border-r border-[#e5e3e0]"
        >
          Sort By
        </button>

        <button
          onClick={onFilters}
          className="flex-1 flex items-center justify-center gap-2 py-4"
        >
          Advanced Filters
        </button>
      </div>
    </div>
  );
}
