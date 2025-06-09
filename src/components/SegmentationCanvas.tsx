
import { useRef, useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RotateCcw, Download, Loader2 } from "lucide-react";
import { HouseElement } from "@/pages/Index";

interface SegmentationCanvasProps {
  imageUrl: string;
  elements: HouseElement[];
  selectedElement: HouseElement | null;
  hoveredElement: HouseElement | null;
  onElementHover: (element: HouseElement | null) => void;
  onElementSelect: (element: HouseElement) => void;
  isProcessing: boolean;
}

export const SegmentationCanvas = ({
  imageUrl,
  elements,
  selectedElement,
  hoveredElement,
  onElementHover,
  onElementSelect,
  isProcessing
}: SegmentationCanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      imageRef.current = img;
      setIsImageLoaded(true);
      drawCanvas();
    };
    img.src = imageUrl;
  }, [imageUrl]);

  useEffect(() => {
    if (isImageLoaded) {
      drawCanvas();
    }
  }, [elements, selectedElement, hoveredElement, isImageLoaded]);

  const drawCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    const img = imageRef.current;
    
    if (!canvas || !ctx || !img) return;

    // Set canvas size to match image
    const maxWidth = 800;
    const maxHeight = 600;
    const ratio = Math.min(maxWidth / img.width, maxHeight / img.height);
    
    canvas.width = img.width * ratio;
    canvas.height = img.height * ratio;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw image
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

    // Draw element overlays
    elements.forEach(element => {
      const isSelected = selectedElement?.id === element.id;
      const isHovered = hoveredElement?.id === element.id;
      
      if (isSelected || isHovered || isProcessing) {
        drawElementOverlay(ctx, element, isSelected, isHovered, ratio);
      }
    });
  };

  const drawElementOverlay = (
    ctx: CanvasRenderingContext2D,
    element: HouseElement,
    isSelected: boolean,
    isHovered: boolean,
    ratio: number
  ) => {
    const coords = element.coordinates.map(([x, y]) => [x * ratio, y * ratio]);
    
    // Draw filled area with element color
    ctx.fillStyle = element.color + (isSelected ? '80' : isHovered ? '60' : '40');
    ctx.beginPath();
    ctx.moveTo(coords[0][0], coords[0][1]);
    coords.slice(1).forEach(([x, y]) => ctx.lineTo(x, y));
    ctx.closePath();
    ctx.fill();

    // Draw border
    ctx.strokeStyle = isSelected ? '#3b82f6' : isHovered ? '#8b5cf6' : '#ffffff';
    ctx.lineWidth = isSelected ? 3 : isHovered ? 2 : 1;
    ctx.stroke();

    // Draw label
    if (isSelected || isHovered) {
      const centerX = coords.reduce((sum, [x]) => sum + x, 0) / coords.length;
      const centerY = coords.reduce((sum, [, y]) => sum + y, 0) / coords.length;
      
      ctx.fillStyle = isSelected ? '#3b82f6' : '#8b5cf6';
      ctx.font = '12px Inter, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(element.name, centerX, centerY - 5);
      
      ctx.fillStyle = '#ffffff';
      ctx.font = '10px Inter, sans-serif';
      ctx.fillText(element.material, centerX, centerY + 10);
    }
  };

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (isProcessing) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left) * (canvas.width / rect.width);
    const y = (e.clientY - rect.top) * (canvas.height / rect.height);

    // Find clicked element
    const clickedElement = findElementAtPoint(x, y);
    if (clickedElement) {
      onElementSelect(clickedElement);
    }
  };

  const handleCanvasMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (isProcessing) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left) * (canvas.width / rect.width);
    const y = (e.clientY - rect.top) * (canvas.height / rect.height);

    setMousePosition({ x: e.clientX, y: e.clientY });

    const hoveredElement = findElementAtPoint(x, y);
    onElementHover(hoveredElement);
  };

  const findElementAtPoint = (x: number, y: number): HouseElement | null => {
    const canvas = canvasRef.current;
    const img = imageRef.current;
    if (!canvas || !img) return null;

    const ratio = canvas.width / img.width;
    const scaledX = x / ratio;
    const scaledY = y / ratio;

    // Check each element to see if point is inside
    for (const element of elements) {
      if (isPointInPolygon([scaledX, scaledY], element.coordinates)) {
        return element;
      }
    }
    return null;
  };

  const isPointInPolygon = (point: number[], polygon: number[][]): boolean => {
    const [x, y] = point;
    let inside = false;

    for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
      const [xi, yi] = polygon[i];
      const [xj, yj] = polygon[j];

      if (((yi > y) !== (yj > y)) && (x < (xj - xi) * (y - yi) / (yj - yi) + xi)) {
        inside = !inside;
      }
    }

    return inside;
  };

  const handleReset = () => {
    const resetElements = elements.map(el => ({
      ...el,
      color: el.originalColor
    }));
    // This would need to be passed back to parent component
    console.log('Reset elements:', resetElements);
  };

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const link = document.createElement('a');
    link.download = 'house-visualization.png';
    link.href = canvas.toDataURL();
    link.click();
  };

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">House Visualization</h3>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm" onClick={handleReset}>
            <RotateCcw className="h-4 w-4 mr-2" />
            Reset
          </Button>
          <Button variant="outline" size="sm" onClick={handleDownload}>
            <Download className="h-4 w-4 mr-2" />
            Download
          </Button>
        </div>
      </div>

      <div className="relative">
        {isProcessing && (
          <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-10 rounded-lg">
            <div className="text-center">
              <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
              <p className="text-lg font-medium">Processing Image...</p>
              <p className="text-sm text-muted-foreground">AI is analyzing house elements</p>
            </div>
          </div>
        )}
        
        <canvas
          ref={canvasRef}
          className="max-w-full border border-gray-200 rounded-lg cursor-crosshair"
          onClick={handleCanvasClick}
          onMouseMove={handleCanvasMouseMove}
          onMouseLeave={() => onElementHover(null)}
        />

        {hoveredElement && (
          <div
            className="absolute bg-black/80 text-white px-3 py-2 rounded-lg text-sm pointer-events-none z-20"
            style={{
              left: mousePosition.x + 10,
              top: mousePosition.y - 40,
            }}
          >
            <div className="font-medium">{hoveredElement.name}</div>
            <div className="text-xs opacity-75">{hoveredElement.material}</div>
          </div>
        )}
      </div>

      {!isProcessing && elements.length > 0 && (
        <div className="mt-4 text-sm text-muted-foreground text-center">
          Click on any house element to customize its color and material
        </div>
      )}
    </Card>
  );
};
