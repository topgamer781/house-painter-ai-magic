
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { HouseElement } from "@/pages/Index";
import { 
  Home, 
  Square, 
  RectangleHorizontal, 
  Door,
  Building,
  Mountain
} from "lucide-react";

interface ElementPanelProps {
  elements: HouseElement[];
  selectedElement: HouseElement | null;
  onElementSelect: (element: HouseElement) => void;
  hoveredElement: HouseElement | null;
}

const getElementIcon = (type: HouseElement['type']) => {
  switch (type) {
    case 'roof':
      return Mountain;
    case 'wall':
      return Square;
    case 'window':
      return RectangleHorizontal;
    case 'door':
      return Door;
    case 'chimney':
      return Building;
    case 'foundation':
      return Home;
    default:
      return Square;
  }
};

const getElementColor = (type: HouseElement['type']) => {
  switch (type) {
    case 'roof':
      return 'bg-red-100 text-red-700 border-red-200';
    case 'wall':
      return 'bg-blue-100 text-blue-700 border-blue-200';
    case 'window':
      return 'bg-cyan-100 text-cyan-700 border-cyan-200';
    case 'door':
      return 'bg-yellow-100 text-yellow-700 border-yellow-200';
    case 'chimney':
      return 'bg-gray-100 text-gray-700 border-gray-200';
    case 'foundation':
      return 'bg-stone-100 text-stone-700 border-stone-200';
    default:
      return 'bg-gray-100 text-gray-700 border-gray-200';
  }
};

export const ElementPanel = ({ 
  elements, 
  selectedElement, 
  onElementSelect,
  hoveredElement 
}: ElementPanelProps) => {
  const groupedElements = elements.reduce((acc, element) => {
    if (!acc[element.type]) {
      acc[element.type] = [];
    }
    acc[element.type].push(element);
    return acc;
  }, {} as Record<string, HouseElement[]>);

  if (elements.length === 0) {
    return (
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">House Elements</h3>
        <div className="text-center text-muted-foreground">
          <Home className="h-12 w-12 mx-auto mb-3 opacity-30" />
          <p>Upload an image to detect house elements</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">
        House Elements
        <Badge variant="secondary" className="ml-2">
          {elements.length}
        </Badge>
      </h3>
      
      <div className="space-y-4">
        {Object.entries(groupedElements).map(([type, typeElements]) => {
          const Icon = getElementIcon(type as HouseElement['type']);
          const colorClass = getElementColor(type as HouseElement['type']);
          
          return (
            <div key={type} className="space-y-2">
              <div className="flex items-center space-x-2">
                <Icon className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium capitalize">{type}s</span>
                <Badge variant="outline" className="text-xs">
                  {typeElements.length}
                </Badge>
              </div>
              
              <div className="space-y-1">
                {typeElements.map((element) => (
                  <Button
                    key={element.id}
                    variant={selectedElement?.id === element.id ? "default" : "ghost"}
                    size="sm"
                    className={`w-full justify-start h-auto p-3 ${
                      hoveredElement?.id === element.id ? 'bg-accent/50' : ''
                    }`}
                    onClick={() => onElementSelect(element)}
                  >
                    <div className="flex items-center justify-between w-full">
                      <div className="flex items-center space-x-3">
                        <div
                          className="w-4 h-4 rounded border"
                          style={{ backgroundColor: element.color }}
                        />
                        <div className="text-left">
                          <div className="text-sm font-medium">{element.name}</div>
                          <div className="text-xs text-muted-foreground capitalize">
                            {element.material}
                          </div>
                        </div>
                      </div>
                      
                      <Badge 
                        variant="outline" 
                        className={`text-xs ${colorClass}`}
                      >
                        {type}
                      </Badge>
                    </div>
                  </Button>
                ))}
              </div>
            </div>
          );
        })}
      </div>
      
      {selectedElement && (
        <div className="mt-6 p-4 bg-primary/5 rounded-lg border border-primary/20">
          <h4 className="font-medium text-sm mb-2">Selected Element</h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Name:</span>
              <span className="font-medium">{selectedElement.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Type:</span>
              <span className="font-medium capitalize">{selectedElement.type}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Material:</span>
              <span className="font-medium capitalize">{selectedElement.material}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Color:</span>
              <div className="flex items-center space-x-2">
                <div
                  className="w-4 h-4 rounded border border-gray-300"
                  style={{ backgroundColor: selectedElement.color }}
                />
                <span className="font-medium font-mono text-xs">
                  {selectedElement.color}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
};
