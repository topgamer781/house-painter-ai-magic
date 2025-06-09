
import { useState } from "react";
import { ImageUpload } from "@/components/ImageUpload";
import { SegmentationCanvas } from "@/components/SegmentationCanvas";
import { ColorPicker } from "@/components/ColorPicker";
import { MaterialPicker } from "@/components/MaterialPicker";
import { ElementPanel } from "@/components/ElementPanel";
import { House, Palette, Layers } from "lucide-react";
import { Card } from "@/components/ui/card";

export interface HouseElement {
  id: string;
  name: string;
  type: "roof" | "wall" | "window" | "door" | "chimney" | "foundation";
  color: string;
  material: string;
  coordinates: number[][];
  originalColor: string;
}

const Index = () => {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [houseElements, setHouseElements] = useState<HouseElement[]>([]);
  const [selectedElement, setSelectedElement] = useState<HouseElement | null>(null);
  const [hoveredElement, setHoveredElement] = useState<HouseElement | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleImageUpload = (imageUrl: string) => {
    setUploadedImage(imageUrl);
    setIsProcessing(true);
    
    // Simulate AI segmentation process
    setTimeout(() => {
      const mockElements: HouseElement[] = [
        {
          id: "roof-1",
          name: "Main Roof",
          type: "roof",
          color: "#8B4513",
          material: "shingles",
          coordinates: [[100, 50], [300, 50], [400, 150], [0, 150]],
          originalColor: "#8B4513"
        },
        {
          id: "wall-1",
          name: "Front Wall",
          type: "wall",
          color: "#F5F5DC",
          material: "brick",
          coordinates: [[50, 150], [350, 150], [350, 350], [50, 350]],
          originalColor: "#F5F5DC"
        },
        {
          id: "window-1",
          name: "Left Window",
          type: "window",
          color: "#87CEEB",
          material: "glass",
          coordinates: [[80, 180], [140, 180], [140, 240], [80, 240]],
          originalColor: "#87CEEB"
        },
        {
          id: "window-2",
          name: "Right Window",
          type: "window",
          color: "#87CEEB",
          material: "glass",
          coordinates: [[260, 180], [320, 180], [320, 240], [260, 240]],
          originalColor: "#87CEEB"
        },
        {
          id: "door-1",
          name: "Front Door",
          type: "door",
          color: "#654321",
          material: "wood",
          coordinates: [[180, 250], [220, 250], [220, 340], [180, 340]],
          originalColor: "#654321"
        }
      ];
      
      setHouseElements(mockElements);
      setIsProcessing(false);
    }, 2000);
  };

  const handleElementSelect = (element: HouseElement) => {
    setSelectedElement(element);
  };

  const handleColorChange = (color: string) => {
    if (selectedElement) {
      const updatedElements = houseElements.map(el =>
        el.id === selectedElement.id ? { ...el, color } : el
      );
      setHouseElements(updatedElements);
      setSelectedElement({ ...selectedElement, color });
    }
  };

  const handleMaterialChange = (material: string) => {
    if (selectedElement) {
      const updatedElements = houseElements.map(el =>
        el.id === selectedElement.id ? { ...el, material } : el
      );
      setHouseElements(updatedElements);
      setSelectedElement({ ...selectedElement, material });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg">
                <House className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  AI House Visualizer
                </h1>
                <p className="text-sm text-muted-foreground">Transform your home with AI-powered design</p>
              </div>
            </div>
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <Layers className="h-4 w-4" />
              <span>{houseElements.length} elements detected</span>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        {!uploadedImage ? (
          /* Upload Section */
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Visualize Your Dream Home
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Upload a photo of your house and watch our AI identify every element. 
                Then customize colors and materials in real-time.
              </p>
            </div>
            <ImageUpload onImageUpload={handleImageUpload} />
            
            {/* Features */}
            <div className="grid md:grid-cols-3 gap-6 mt-16">
              <Card className="p-6 text-center hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <House className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="font-semibold mb-2">Smart Detection</h3>
                <p className="text-sm text-muted-foreground">
                  AI automatically identifies roof, walls, windows, doors, and more
                </p>
              </Card>
              
              <Card className="p-6 text-center hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Palette className="h-6 w-6 text-purple-600" />
                </div>
                <h3 className="font-semibold mb-2">Color & Material</h3>
                <p className="text-sm text-muted-foreground">
                  Experiment with different colors and materials instantly
                </p>
              </Card>
              
              <Card className="p-6 text-center hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Layers className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="font-semibold mb-2">Real-time Preview</h3>
                <p className="text-sm text-muted-foreground">
                  See changes instantly with interactive highlighting
                </p>
              </Card>
            </div>
          </div>
        ) : (
          /* Main Workspace */
          <div className="grid lg:grid-cols-4 gap-6">
            {/* Left Panel - Elements */}
            <div className="lg:col-span-1 space-y-6">
              <ElementPanel
                elements={houseElements}
                selectedElement={selectedElement}
                onElementSelect={handleElementSelect}
                hoveredElement={hoveredElement}
              />
              
              {selectedElement && (
                <>
                  <ColorPicker
                    selectedColor={selectedElement.color}
                    onColorChange={handleColorChange}
                  />
                  <MaterialPicker
                    selectedMaterial={selectedElement.material}
                    elementType={selectedElement.type}
                    onMaterialChange={handleMaterialChange}
                  />
                </>
              )}
            </div>

            {/* Center - Canvas */}
            <div className="lg:col-span-3">
              <SegmentationCanvas
                imageUrl={uploadedImage}
                elements={houseElements}
                selectedElement={selectedElement}
                hoveredElement={hoveredElement}
                onElementHover={setHoveredElement}
                onElementSelect={handleElementSelect}
                isProcessing={isProcessing}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
