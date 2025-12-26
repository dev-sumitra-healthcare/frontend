
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface AIAssistantWidgetProps {
  data: {
    summary: string;
    recommendations: string[];
  };
}

export default function AIAssistantWidget({ data }: AIAssistantWidgetProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>AI Assistant</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h4 className="font-semibold">Summary</h4>
          <p className="text-sm text-gray-700">{data.summary}</p>
        </div>
        <div>
          <h4 className="font-semibold">Recommendations</h4>
          <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
            {data.recommendations.map((rec, index) => (
              <li key={index}>{rec}</li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
