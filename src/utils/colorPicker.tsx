import { Popover, PopoverTrigger, PopoverContent, Button, Input } from "@heroui/react";
import { HexColorPicker } from "react-colorful";
import { useState } from "react";

interface ColorPickerProps {
  value: string;
  onChange: (color: string) => void;
  label?: string;
}

export function ColorPicker({ value, onChange, label = "Color" }: ColorPickerProps) {
  const [hexInput, setHexInput] = useState(value);

  const handleHexChange = (newHex: string) => {
    setHexInput(newHex);
    if (/^#[0-9A-Fa-f]{6}$/.test(newHex)) {
      onChange(newHex);
    }
  };

  const handleColorChange = (newColor: string) => {
    setHexInput(newColor);
    onChange(newColor);
  };

  return (
    <Popover placement="bottom">
      <PopoverTrigger>
        <Button
          className="w-32 h-14 justify-start px-3 border border-gray-700 hover:border-gray-600 bg-transparent"
          variant="bordered"
        >
          <div className="flex items-center gap-3 w-full">
            <div
              className="w-8 h-8 rounded border border-gray-600"
              style={{ backgroundColor: value }}
            />
            <div className="flex flex-col items-start flex-1">
              <span className="text-xs text-gray-400">{label}</span>
              <span className="text-white font-mono">{value.toUpperCase()}</span>
            </div>
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="bg-neutral-800 border border-gray-700 p-4">
        <div className="space-y-3">
          <HexColorPicker color={value} onChange={handleColorChange} />
          <Input
            label="Hex Code"
            variant="bordered"
            value={hexInput}
            onValueChange={handleHexChange}
            placeholder="#FFFFFF"
            classNames={{
              input: "text-white font-mono",
              inputWrapper: "border-gray-700 data-[hover=true]:border-gray-600 group-data-[focus=true]:bg-neutral-900 group-data-[focus=true]:border-white",
            }}
          />
          <div className="flex gap-1 flex-wrap justify-center">
            {['#ff0000ff', '#ff7b00ff', '#ffbf00ff', '#ffea00ff', '#000000ff', '#FFFFFF'].map((presetColor) => (
              <button
                key={presetColor}
                className="w-6 h-6 rounded border border-gray-600 hover:scale-110 transition-transform"
                style={{ backgroundColor: presetColor }}
                onClick={() => handleColorChange(presetColor)}
              />
            ))}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}