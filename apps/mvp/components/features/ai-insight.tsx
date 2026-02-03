import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import { Sparkles, BrainCircuit, Info } from "lucide-react";
import { ConfidenceBadge } from "@workspace/ui/components/confidence-badge";
import { cn } from "@workspace/ui/lib/utils";

interface AiInsightProps {
  summary: string;
  explanation?: string;
  confidence: number;
  className?: string;
}

export function AiInsight({
  summary,
  explanation,
  confidence,
  className,
}: AiInsightProps) {
  return (
    <Card
      className={cn(
        "overflow-hidden border-primary/20 bg-primary/5 shadow-md",
        className,
      )}
    >
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0 bg-primary/5 border-b border-primary/10">
        <CardTitle className="flex items-center gap-2 text-sm font-semibold text-primary">
          <Sparkles className="h-4 w-4" />
          AI-Assisted Insight
        </CardTitle>
        <ConfidenceBadge score={confidence} />
      </CardHeader>
      <CardContent className="pt-4 space-y-4">
        <div className="flex gap-3">
          <div className="mt-1 h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 border border-primary/20">
            <BrainCircuit className="h-4 w-4 text-primary" />
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium leading-relaxed text-foreground">
              {summary}
            </p>
            {explanation && (
              <p className="text-xs text-muted-foreground leading-relaxed italic">
                &quot;{explanation}&quot;
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 rounded-lg bg-muted/50 p-3 text-[10px] text-muted-foreground border">
          <Info className="h-3.5 w-3.5 flex-shrink-0" />
          <p>
            This insight is generated based on automated patterns and historical
            data traces. AI results are never authoritative and should be
            verified for mission-critical decisions.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
