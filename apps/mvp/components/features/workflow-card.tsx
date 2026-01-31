import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@workspace/ui/components/card";
import { Badge } from "@workspace/ui/components/badge";
import { Button } from "@workspace/ui/components/button";
import { WorkflowDefinition } from "@/types/api";
import { Calendar, Layers, ArrowRight } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";

interface WorkflowCardProps {
  workflow: WorkflowDefinition;
}

export function WorkflowCard({ workflow }: WorkflowCardProps) {
  return (
    <Card className="group hover:border-primary/50 transition-colors">
      <CardHeader className="flex flex-row items-start justify-between space-y-0">
        <div className="space-y-1">
          <CardTitle className="text-xl font-bold">{workflow.title}</CardTitle>
          <CardDescription className="line-clamp-2 min-h-[40px]">
            {workflow.description || "No description provided."}
          </CardDescription>
        </div>
        <Badge variant="outline" className="ml-2 whitespace-nowrap">
          v{workflow.version}
        </Badge>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            {format(new Date(workflow.createdAt), "MMM d, yyyy")}
          </div>
          <div className="flex items-center gap-1">
            <Layers className="h-4 w-4" />
            Deterministic
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between items-center border-t bg-muted/50 px-6 py-4 rounded-b-lg">
        <Badge variant="secondary" className="bg-secondary/50">
          Ready
        </Badge>
        <Button
          size="sm"
          variant="ghost"
          className="gap-2 group-hover:translate-x-1 transition-transform"
          asChild
        >
          <Link href={`/workflows/${workflow.id}`}>
            View Details <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}

export function WorkflowCardSkeleton() {
  return (
    <Card className="animate-pulse">
      <CardHeader className="space-y-2">
        <div className="h-6 w-2/3 bg-muted rounded" />
        <div className="h-4 w-full bg-muted rounded" />
        <div className="h-4 w-5/6 bg-muted rounded" />
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="h-4 w-1/3 bg-muted rounded" />
      </CardContent>
      <CardFooter className="border-t bg-muted/20 px-6 py-4">
        <div className="h-8 w-1/4 bg-muted rounded" />
      </CardFooter>
    </Card>
  );
}
