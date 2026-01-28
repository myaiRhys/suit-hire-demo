import type { SuitStyle, SuitColour } from '../../types';

interface SuitFiltersProps {
  selectedStyle: SuitStyle;
  selectedColour: SuitColour;
  onStyleChange: (style: SuitStyle) => void;
  onColourChange: (colour: SuitColour) => void;
  styles: readonly SuitStyle[];
  colours: readonly SuitColour[];
}

export default function SuitFilters({
  selectedStyle,
  selectedColour,
  onStyleChange,
  onColourChange,
  styles,
  colours
}: SuitFiltersProps) {
  return (
    <div className="flex flex-wrap gap-4">
      <div className="flex-1 min-w-[200px]">
        <label htmlFor="style-select" className="block text-sm font-medium text-gray-700 mb-1">
          Suit Style
        </label>
        <select
          id="style-select"
          value={selectedStyle}
          onChange={(e) => onStyleChange(e.target.value as SuitStyle)}
          className="w-full px-4 py-3 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          {styles.map(style => (
            <option key={style} value={style}>
              {style}
            </option>
          ))}
        </select>
      </div>

      <div className="flex-1 min-w-[200px]">
        <label htmlFor="colour-select" className="block text-sm font-medium text-gray-700 mb-1">
          Colour
        </label>
        <select
          id="colour-select"
          value={selectedColour}
          onChange={(e) => onColourChange(e.target.value as SuitColour)}
          className="w-full px-4 py-3 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          {colours.map(colour => (
            <option key={colour} value={colour}>
              {colour}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
