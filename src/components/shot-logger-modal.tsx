"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { FootballPitchIcon } from "@/components/icons";
import { calculateXg } from "@/ai/flows/calculate-xg-flow";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { Card, CardContent } from "./ui/card";
import type { LogMatchEventDto } from "@/lib/models";

interface ShotLoggerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onEventLogged: (payload: LogMatchEventDto) => void;
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

    const normalizedX = Math.round(((x - 5) / 290) * 100);
    const normalizedY = Math.round(Math.abs((y - 75) / 140) * 100);

    try {
      const xgResult = await calculateXg({
        shotCoordinates: { x: normalizedX, y: normalizedY },
      });
      setResult(xgResult);

      const payload: LogMatchEventDto = {
        eventType: "SHOT",
        playerId: "player-placeholder-id", // This should be selected in the UI
        coordinates: { x: normalizedX, y: normalizedY },
        isGoal: false, // This would be determined after the shot
        xG: xgResult.xG,
      };

      onEventLogged(payload);
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
