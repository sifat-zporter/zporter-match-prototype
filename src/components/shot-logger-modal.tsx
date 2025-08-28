"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { FootballPitchIcon } from "@/components/icons";
import { calculateXg } from "@/ai/flows/calculate-xg-flow";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { Card, CardContent } from "./ui/card";
import type { LoggedEvent } from "@/lib/data";

interface ShotLoggerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onEventLogged: (event: Omit<LoggedEvent, 'id' | 'time'>) => void;
  isSubmitting: boolean;
}

export function ShotLoggerModal({ isOpen, onClose, onEventLogged, isSubmitting }: ShotLoggerModalProps) {
  const { toast } = useToast();
  const [isCalculating, setIsCalculating] = useState(false);
  const [result, setResult] = useState<{ xG: number; reasoning: string } | null>(null);

  const handlePitchClick = async (event: React.MouseEvent<SVGSVGElement>) => {
    if (isSubmitting || isCalculating) return;

    setIsCalculating(true);
    setResult(null);
    const svg = event.currentTarget;
    const pt = svg.createSVGPoint();
    pt.x = event.clientX;
    pt.y = event.clientY;
    const { x, y } = pt.matrixTransform(svg.getScreenCTM()?.inverse());

    // Normalize coordinates to a 100x100 grid where goal is at x=100
    // SVG is 300x150. Pitch area is 290x140, starting at (5,5).
    const normalizedX = Math.round(((x - 5) / 290) * 100);
    const normalizedY = Math.round(Math.abs((y - 75) / 140) * 100); // y=75 is centerline

    try {
      const xgResult = await calculateXg({
        shotCoordinates: { x: normalizedX, y: normalizedY },
      });
      setResult(xgResult);

      // Pass the event up to the LiveLogger, which will handle the API call
      onEventLogged({
          type: "Shot",
          details: `Shot from (${normalizedX}, ${normalizedY}) with xG: ${xgResult.xG.toFixed(2)}. AI says: "${xgResult.reasoning}"`
      });

      // The toast is now handled by LiveLogger upon successful API call
      onClose();
    } catch (error) {
      console.error("xG Calculation Error:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to calculate xG. Please try again.",
      });
    } finally {
      setIsCalculating(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Log a Shot</DialogTitle>
          <DialogDescription>
            Tap on the pitch where the shot was taken from. The AI will calculate the Expected Goal (xG) value.
          </DialogDescription>
        </DialogHeader>
        <div className="relative">
          <FootballPitchIcon
            className="w-full h-auto cursor-pointer text-primary"
            onClick={handlePitchClick}
          />
          {(isCalculating || isSubmitting) && (
            <div className="absolute inset-0 bg-background/50 flex items-center justify-center">
              <Loader2 className="w-8 h-8 animate-spin" />
            </div>
          )}
        </div>
        {result && (
            <Card>
                <CardContent className="p-4">
                    <p><strong>xG:</strong> {result.xG.toFixed(2)}</p>
                    <p className="text-sm text-muted-foreground">{result.reasoning}</p>
                </CardContent>
            </Card>
        )}
      </DialogContent>
    </Dialog>
  );
}
