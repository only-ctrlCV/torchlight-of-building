import type { BaseGearAffix } from "@/src/tli/gear-data-types";

interface AffixPreviewSectionProps {
  slotIndex: number;
  selectedAffix: BaseGearAffix;
  percentage: number;
  hideQualitySlider: boolean;
  showTierInfo: boolean;
  tierCount?: number;
  onSliderChange: (slotIndex: number, value: string) => void;
  onClear: (slotIndex: number) => void;
}

export const AffixPreviewSection = ({
  slotIndex,
  selectedAffix,
  percentage,
  hideQualitySlider,
  showTierInfo,
  tierCount,
  onSliderChange,
  onClear,
}: AffixPreviewSectionProps): React.ReactElement => {
  return (
    <div className="mt-1 flex items-center gap-2">
      {!hideQualitySlider && (
        <div className="flex flex-1 items-center gap-2">
          <label
            htmlFor={`quality-slider-${slotIndex}`}
            className="shrink-0 text-xs text-zinc-500"
          >
            Quality
          </label>
          <div className="relative flex-1">
            <input
              id={`quality-slider-${slotIndex}`}
              type="range"
              min="0"
              max="100"
              value={percentage}
              onChange={(e) => onSliderChange(slotIndex, e.target.value)}
              className="relative z-10 w-full"
            />
            {tierCount !== undefined &&
              tierCount > 1 &&
              Array.from({ length: tierCount - 1 }, (_, i) => {
                const position = ((i + 1) / tierCount) * 100;
                return (
                  <div
                    key={i}
                    className="pointer-events-none absolute top-1/2 z-0 h-3 w-px -translate-y-1/2 bg-zinc-500"
                    style={{ left: `${position}%` }}
                  />
                );
              })}
          </div>
          <span className="shrink-0 text-xs font-medium text-zinc-50">
            {percentage}%{showTierInfo && ` (T${selectedAffix.tier})`}
          </span>
        </div>
      )}
      <button
        type="button"
        onClick={() => onClear(slotIndex)}
        className="shrink-0 text-xs font-medium text-red-500 hover:text-red-400"
      >
        Clear
      </button>
    </div>
  );
};
