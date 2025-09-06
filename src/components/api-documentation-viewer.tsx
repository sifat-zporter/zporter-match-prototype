// src/components/api-documentation-viewer.tsx
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface ApiDocumentationViewerProps {
  title: string;
  description: string;
  endpoint: string;
  method: "GET" | "POST" | "PATCH" | "DELETE";
  requestPayload?: string;
  response?: string;
  notes?: string;
}

export function ApiDocumentationViewer({
  title,
  description,
  endpoint,
  method,
  requestPayload,
  response,
  notes,
}: ApiDocumentationViewerProps) {
  const getMethodVariant = () => {
    switch (method) {
      case "GET":
        return "default";
      case "POST":
        return "secondary"; // A different color, e.g., blue or green
      case "PATCH":
        return "outline"; // e.g., yellow/orange
      case "DELETE":
        return "destructive";
      default:
        return "default";
    }
  };

  return (
    <Card className="bg-card/50">
      <CardHeader>
        <div className="flex items-center justify-between">
            <CardTitle className="text-lg">{title}</CardTitle>
            <Badge variant={getMethodVariant() as any} className="text-sm font-bold">
                {method}
            </Badge>
        </div>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h4 className="font-semibold text-sm mb-1">Endpoint</h4>
          <pre className="p-2 bg-background rounded-md text-xs font-mono text-primary overflow-x-auto">
            <code>{endpoint}</code>
          </pre>
        </div>
        {requestPayload && (
          <div>
            <h4 className="font-semibold text-sm mb-1">Request Payload</h4>
            <pre className="p-3 bg-background rounded-md text-xs font-mono text-foreground overflow-x-auto">
              <code>{requestPayload}</code>
            </pre>
          </div>
        )}
        {response && (
          <div>
            <h4 className="font-semibold text-sm mb-1">Success Response (200 OK / 201 Created)</h4>
            <pre className="p-3 bg-background rounded-md text-xs font-mono text-foreground overflow-x-auto">
              <code>{response}</code>
            </pre>
          </div>
        )}
        {notes && (
            <div>
                 <h4 className="font-semibold text-sm mb-1">Notes</h4>
                 <p className="text-sm text-muted-foreground italic">{notes}</p>
            </div>
        )}
      </CardContent>
    </Card>
  );
}
