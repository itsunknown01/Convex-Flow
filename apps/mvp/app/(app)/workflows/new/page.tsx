"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCreateWorkflow } from "@/hooks/use-workflows";
import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
import { Label } from "@workspace/ui/components/label";
import { Textarea } from "@workspace/ui/components/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import {
  ArrowLeft,
  Loader2,
  Save,
  Workflow,
  Zap,
  Shield,
  Mail,
  Calendar,
  CheckCircle,
} from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

// Workflow templates
const templates = [
  {
    id: "blank",
    name: "Blank Workflow",
    description: "Start from scratch with an empty workflow",
    icon: Workflow,
    color: "bg-slate-500",
    definition: { steps: [] },
  },
  {
    id: "approval",
    name: "Approval Flow",
    description: "Multi-step approval process with human review",
    icon: Shield,
    color: "bg-blue-500",
    definition: {
      steps: [
        { type: "validate", name: "Validate Input" },
        { type: "approval", name: "Manager Approval" },
        { type: "notify", name: "Send Notification" },
      ],
    },
  },
  {
    id: "automation",
    name: "Automation Pipeline",
    description: "Automated task execution with AI agents",
    icon: Zap,
    color: "bg-purple-500",
    definition: {
      steps: [
        { type: "trigger", name: "Event Trigger" },
        { type: "ai_process", name: "AI Processing" },
        { type: "action", name: "Execute Action" },
      ],
    },
  },
  {
    id: "notification",
    name: "Notification Workflow",
    description: "Send alerts and notifications based on conditions",
    icon: Mail,
    color: "bg-green-500",
    definition: {
      steps: [
        { type: "condition", name: "Check Condition" },
        { type: "notify", name: "Send Email" },
        { type: "log", name: "Log Activity" },
      ],
    },
  },
  {
    id: "scheduled",
    name: "Scheduled Task",
    description: "Time-based workflow execution",
    icon: Calendar,
    color: "bg-amber-500",
    definition: {
      steps: [
        { type: "schedule", name: "Daily Trigger" },
        { type: "fetch", name: "Fetch Data" },
        { type: "report", name: "Generate Report" },
      ],
    },
  },
];

export default function NewWorkflowPage() {
  const router = useRouter();
  const createWorkflow = useCreateWorkflow();
  const [selectedTemplate, setSelectedTemplate] = useState(templates[0]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [step, setStep] = useState(1);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) return;

    try {
      await createWorkflow.mutateAsync({
        title: title.trim(),
        description: description.trim() || undefined,
        definition: selectedTemplate?.definition || { steps: [] },
      });
      router.push("/workflows");
    } catch (error) {
      console.error("Failed to create workflow:", error);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/workflows">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Link>
        </Button>
      </div>

      {/* Progress Steps */}
      <div className="flex items-center justify-center gap-4">
        {[1, 2].map((s) => (
          <div key={s} className="flex items-center gap-2">
            <motion.div
              animate={{
                scale: step === s ? 1.1 : 1,
                backgroundColor:
                  step >= s ? "hsl(var(--primary))" : "hsl(var(--muted))",
              }}
              className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium"
            >
              {step > s ? (
                <CheckCircle className="h-4 w-4 text-primary-foreground" />
              ) : (
                <span
                  className={
                    step >= s
                      ? "text-primary-foreground"
                      : "text-muted-foreground"
                  }
                >
                  {s}
                </span>
              )}
            </motion.div>
            <span
              className={`text-sm ${step >= s ? "text-foreground" : "text-muted-foreground"}`}
            >
              {s === 1 ? "Choose Template" : "Configure"}
            </span>
            {s < 2 && <div className="w-12 h-0.5 bg-muted rounded" />}
          </div>
        ))}
      </div>

      {/* Step 1: Template Selection */}
      {step === 1 && (
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 20 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Choose a Template</CardTitle>
              <CardDescription>
                Start with a pre-built workflow or create from scratch.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {templates.map((template) => {
                  const Icon = template.icon;
                  const isSelected = selectedTemplate?.id === template.id;
                  return (
                    <motion.button
                      key={template.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setSelectedTemplate(template)}
                      className={`p-4 rounded-xl border-2 text-left transition-all ${
                        isSelected
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-primary/50"
                      }`}
                    >
                      <div
                        className={`w-10 h-10 rounded-lg ${template.color} flex items-center justify-center mb-3`}
                      >
                        <Icon className="h-5 w-5 text-white" />
                      </div>
                      <h3 className="font-semibold text-foreground">
                        {template.name}
                      </h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        {template.description}
                      </p>
                      {isSelected && (
                        <div className="mt-3 flex items-center gap-1 text-xs text-primary font-medium">
                          <CheckCircle className="h-3 w-3" />
                          Selected
                        </div>
                      )}
                    </motion.button>
                  );
                })}
              </div>
              <div className="flex justify-end mt-6">
                <Button onClick={() => setStep(2)}>
                  Continue
                  <ArrowLeft className="h-4 w-4 ml-2 rotate-180" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Step 2: Configure */}
      {step === 2 && (
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
        >
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div
                  className={`h-10 w-10 rounded-lg ${selectedTemplate?.color || "bg-primary"} flex items-center justify-center`}
                >
                  {selectedTemplate && (
                    <selectedTemplate.icon className="h-5 w-5 text-white" />
                  )}
                </div>
                <div>
                  <CardTitle>Configure Your Workflow</CardTitle>
                  <CardDescription>
                    Based on: {selectedTemplate?.name}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="title">Workflow Name *</Label>
                  <Input
                    id="title"
                    placeholder="e.g., Customer Onboarding Flow"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    disabled={createWorkflow.isPending}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Brief description of what this workflow does..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    disabled={createWorkflow.isPending}
                    rows={3}
                  />
                </div>

                {/* Template Preview */}
                {selectedTemplate &&
                  selectedTemplate.definition.steps.length > 0 && (
                    <div className="space-y-2">
                      <Label>Workflow Steps</Label>
                      <div className="flex items-center gap-2 flex-wrap p-3 bg-muted/30 rounded-lg">
                        {selectedTemplate.definition.steps.map((step, i) => (
                          <div key={i} className="flex items-center gap-2">
                            <span className="px-3 py-1 text-xs bg-background border rounded-full">
                              {step.name}
                            </span>
                            {i <
                              selectedTemplate.definition.steps.length - 1 && (
                              <ArrowLeft className="h-3 w-3 text-muted-foreground rotate-180" />
                            )}
                          </div>
                        ))}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        You can customize these steps after creation.
                      </p>
                    </div>
                  )}

                {createWorkflow.isError && (
                  <div className="rounded bg-destructive/10 p-3 text-sm text-destructive">
                    Failed to create workflow. Please try again.
                  </div>
                )}

                <div className="flex justify-between gap-3 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setStep(1)}
                    disabled={createWorkflow.isPending}
                  >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back
                  </Button>
                  <div className="flex gap-3">
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => router.push("/workflows")}
                      disabled={createWorkflow.isPending}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      disabled={createWorkflow.isPending || !title.trim()}
                    >
                      {createWorkflow.isPending ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Creating...
                        </>
                      ) : (
                        <>
                          <Save className="h-4 w-4 mr-2" />
                          Create Workflow
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
}
