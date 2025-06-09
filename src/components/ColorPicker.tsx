
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Palette, Pipette } from "lucide-react";
import { useState } from "react";

interface ColorPickerProps {
  selectedColor: string;
  onColorChange: (color: string) => void;
}

const predefinedColors = [
  // Neutrals
  '#FFFFFF', '#F5F5F5', '#E5E5E5', '#D4D4D4', '#A3A3A3', '#737373', '#525252', '#404040', '#262626', '#171717',
  // Reds
  '#FEF2F2', '#FCA5A5', '#EF4444', '#DC2626', '#B91C1C', '#991B1B', '#7F1D1D',
  // Blues  
  '#EFF6FF', '#93C5FD', '#3B82F6', '#2563EB', '#1D4ED8', '#1E40AF', '#1E3A8A',
  // Greens
  '#F0FDF4', '#86EFAC', '#22C55E', '#16A34A', '#15803D', '#166534', '#14532D',
  // Yellows
  '#FFFBEB', '#FDE68A', '#F59E0B', '#D97706', '#B45309', '#92400E', '#78350F',
  // Purples
  '#FAF5FF', '#C4B5FD', '#8B5CF6', '#7C3AED', '#6D28D9', '#5B21B6', '#4C1D95',
  // Browns (for roofs, doors)
  '#FDF2F8', '#D2B48C', '#8B4513', '#A0522D', '#654321', '#3E2723', '#1A0E0A',
];

export const ColorPicker = ({ selectedColor, onColorChange }: ColorPickerProps) => {
  const [customColor, setCustomColor] = useState(selectedColor);
  const [showCustomInput, setShowCustomInput] = useState(false);

  const handleCustomColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const color = e.target.value;
    setCustomColor(color);
    onColorChange(color);
  };

  const handleColorSelect = (color: string) => {
    setCustomColor(color);
    onColorChange(color);
    setShowCustomInput(false);
  };

  return (
    <Card className="p-6">
      <div className="flex items-center space-x-2 mb-4">
        <Palette className="h-5 w-5 text-primary" />
        <h3 className="text-lg font-semibold">Color Picker</h3>
      </div>
      
      {/* Current Color Display */}
      <div className="mb-4 p-4 border rounded-lg">
        <Label className="text-sm font-medium mb-2 block">Current Color</Label>
        <div className="flex items-center space-x-3">
          <div
            className="w-12 h-12 rounded-lg border-2 border-gray-300 shadow-sm"
            style={{ backgroundColor: selectedColor }}
          />
          <div className="flex-1">
            <div className="font-mono text-sm">{selectedColor}</div>
            <div className="text-xs text-muted-foreground">Click colors below to change</div>
          </div>
        </div>
      </div>

      {/* Predefined Colors */}
      <div className="mb-4">
        <Label className="text-sm font-medium mb-3 block">Popular Colors</Label>
        <div className="grid grid-cols-7 gap-2">
          {predefinedColors.map((color) => (
            <button
              key={color}
              className={`w-8 h-8 rounded-lg border-2 transition-all hover:scale-110 ${
                selectedColor === color 
                  ? 'border-primary ring-2 ring-primary/20' 
                  : 'border-gray-300 hover:border-gray-400'
              }`}
              style={{ backgroundColor: color }}
              onClick={() => handleColorSelect(color)}
              title={color}
            />
          ))}
        </div>
      </div>

      {/* Custom Color Input */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label className="text-sm font-medium">Custom Color</Label>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowCustomInput(!showCustomInput)}
          >
            <Pipette className="h-4 w-4 mr-2" />
            {showCustomInput ? 'Hide' : 'Custom'}
          </Button>
        </div>
        
        {showCustomInput && (
          <div className="space-y-2">
            <div className="flex space-x-2">
              <Input
                type="color"
                value={customColor}
                onChange={handleCustomColorChange}
                className="w-16 h-10 p-1 border rounded cursor-pointer"
              />
              <Input
                type="text"
                value={customColor}
                onChange={(e) => {
                  setCustomColor(e.target.value);
                  if (/^#[0-9A-F]{6}$/i.test(e.target.value)) {
                    onColorChange(e.target.value);
                  }
                }}
                placeholder="#000000"
                className="flex-1 font-mono"
              />
            </div>
            <p className="text-xs text-muted-foreground">
              Enter a hex color code or use the color picker
            </p>
          </div>
        )}
      </div>

      {/* Color Suggestions by Element Type */}
      <div className="mt-6 pt-4 border-t">
        <Label className="text-sm font-medium mb-2 block">Suggested Combinations</Label>
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Classic</span>
            <div className="flex space-x-1">
              {['#FFFFFF', '#8B4513', '#2563EB'].map(color => (
                <button
                  key={color}
                  className="w-6 h-6 rounded border border-gray-300 hover:scale-110 transition-transform"
                  style={{ backgroundColor: color }}
                  onClick={() => handleColorSelect(color)}
                />
              ))}
            </div>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Modern</span>
            <div className="flex space-x-1">
              {['#F5F5F5', '#404040', '#22C55E'].map(color => (
                <button
                  key={color}
                  className="w-6 h-6 rounded border border-gray-300 hover:scale-110 transition-transform"
                  style={{ backgroundColor: color }}
                  onClick={() => handleColorSelect(color)}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};
