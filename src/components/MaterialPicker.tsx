
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { HouseElement } from "@/pages/Index";
import { Hammer, Sparkles } from "lucide-react";

interface MaterialPickerProps {
  selectedMaterial: string;
  elementType: HouseElement['type'];
  onMaterialChange: (material: string) => void;
}

const materialsByType: Record<HouseElement['type'], string[]> = {
  roof: ['shingles', 'tile', 'metal', 'slate', 'thatch', 'solar panels'],
  wall: ['brick', 'siding', 'stucco', 'stone', 'wood', 'concrete'],
  window: ['glass', 'tinted glass', 'frosted glass', 'stained glass'],
  door: ['wood', 'metal', 'glass', 'composite', 'fiberglass'],
  chimney: ['brick', 'stone', 'metal', 'concrete'],
  foundation: ['concrete', 'stone', 'brick', 'block']
};

const materialDescriptions: Record<string, string> = {
  // Roof materials
  'shingles': 'Classic asphalt shingles - affordable and versatile',
  'tile': 'Clay or concrete tiles - durable and elegant',
  'metal': 'Steel or aluminum - modern and energy efficient',
  'slate': 'Natural slate - premium and long-lasting',
  'thatch': 'Traditional straw - rustic and eco-friendly',
  'solar panels': 'Photovoltaic panels - sustainable energy',
  
  // Wall materials
  'brick': 'Traditional clay brick - timeless and sturdy',
  'siding': 'Vinyl or wood siding - low maintenance',
  'stucco': 'Textured cement finish - Mediterranean style',
  'stone': 'Natural stone veneer - luxurious appearance',
  'wood': 'Wood cladding - warm and natural',
  'concrete': 'Modern concrete - industrial aesthetic',
  
  // Window materials
  'glass': 'Clear standard glass - maximum light',
  'tinted glass': 'Privacy and UV protection',
  'frosted glass': 'Diffused light and privacy',
  'stained glass': 'Decorative colored glass',
  
  // Door materials
  'wood': 'Solid wood - classic and warm',
  'metal': 'Steel or aluminum - secure and modern',
  'glass': 'Glass panels - contemporary and bright',
  'composite': 'Wood fiber composite - durable',
  'fiberglass': 'Fiberglass - weather resistant',
  
  // Chimney materials
  'brick': 'Traditional brick - classic appearance',
  'stone': 'Natural stone - rustic charm',
  'metal': 'Metal flue - modern and efficient',
  'concrete': 'Concrete blocks - cost effective',
  
  // Foundation materials
  'concrete': 'Poured concrete - standard and strong',
  'stone': 'Natural stone - traditional look',
  'brick': 'Brick foundation - classic style',
  'block': 'Concrete blocks - economical choice'
};

export const MaterialPicker = ({ 
  selectedMaterial, 
  elementType, 
  onMaterialChange 
}: MaterialPickerProps) => {
  const availableMaterials = materialsByType[elementType] || [];

  return (
    <Card className="p-6">
      <div className="flex items-center space-x-2 mb-4">
        <Hammer className="h-5 w-5 text-primary" />
        <h3 className="text-lg font-semibold">Material Options</h3>
        <Badge variant="outline" className="text-xs capitalize">
          {elementType}
        </Badge>
      </div>

      {/* Current Material */}
      <div className="mb-4 p-4 border rounded-lg bg-accent/5">
        <Label className="text-sm font-medium mb-2 block">Current Material</Label>
        <div className="flex items-center space-x-2">
          <Sparkles className="h-4 w-4 text-primary" />
          <span className="font-medium capitalize">{selectedMaterial}</span>
        </div>
        {materialDescriptions[selectedMaterial] && (
          <p className="text-sm text-muted-foreground mt-1">
            {materialDescriptions[selectedMaterial]}
          </p>
        )}
      </div>

      {/* Material Options */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">Available Materials</Label>
        <div className="grid grid-cols-1 gap-2">
          {availableMaterials.map((material) => (
            <Button
              key={material}
              variant={selectedMaterial === material ? "default" : "outline"}
              size="sm"
              className="justify-start h-auto p-3"
              onClick={() => onMaterialChange(material)}
            >
              <div className="text-left w-full">
                <div className="font-medium capitalize">{material}</div>
                <div className="text-xs text-muted-foreground">
                  {materialDescriptions[material]}
                </div>
              </div>
            </Button>
          ))}
        </div>
      </div>

      {/* Material Properties */}
      <div className="mt-6 pt-4 border-t">
        <Label className="text-sm font-medium mb-2 block">Material Properties</Label>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-muted-foreground">Durability:</span>
            <div className="flex items-center space-x-1 mt-1">
              {[1, 2, 3, 4, 5].map((i) => (
                <div
                  key={i}
                  className={`w-2 h-2 rounded-full ${
                    i <= getDurabilityRating(selectedMaterial) 
                      ? 'bg-green-500' 
                      : 'bg-gray-200'
                  }`}
                />
              ))}
            </div>
          </div>
          <div>
            <span className="text-muted-foreground">Maintenance:</span>
            <div className="flex items-center space-x-1 mt-1">
              {[1, 2, 3, 4, 5].map((i) => (
                <div
                  key={i}
                  className={`w-2 h-2 rounded-full ${
                    i <= getMaintenanceRating(selectedMaterial) 
                      ? 'bg-blue-500' 
                      : 'bg-gray-200'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

const getDurabilityRating = (material: string): number => {
  const ratings: Record<string, number> = {
    'slate': 5, 'stone': 5, 'brick': 5, 'concrete': 5,
    'metal': 4, 'tile': 4, 'fiberglass': 4,
    'composite': 3, 'wood': 3, 'stucco': 3,
    'shingles': 2, 'siding': 2,
    'thatch': 1, 'glass': 3, 'tinted glass': 3,
    'frosted glass': 3, 'stained glass': 2,
    'solar panels': 4, 'block': 4
  };
  return ratings[material] || 3;
};

const getMaintenanceRating = (material: string): number => {
  const ratings: Record<string, number> = {
    'metal': 1, 'concrete': 1, 'fiberglass': 1, 'composite': 1,
    'siding': 2, 'stucco': 2, 'glass': 2, 'tinted glass': 2,
    'brick': 2, 'tile': 2, 'slate': 2, 'stone': 2,
    'shingles': 3, 'frosted glass': 3, 'stained glass': 3,
    'wood': 4, 'solar panels': 3, 'block': 2,
    'thatch': 5
  };
  return ratings[material] || 3;
};
