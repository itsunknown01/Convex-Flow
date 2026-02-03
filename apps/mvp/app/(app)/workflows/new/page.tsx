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
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

// Workflow templates with gradient colors matching landing page
const templates = [
  {
    id: "blank",
    name: "Blank Workflow",
    description: "Start from scratch with an empty workflow",
    icon: Workflow,
    gradient: "from-slate-500 to-slate-600",
    glow: "rgba(100, 116, 139, 0.4)",
    definition: { steps: [] },
  },
  {
    id: "approval",
    name: "Approval Flow",
    description: "Multi-step approval process with human review",
    icon: Shield,
    gradient: "from-blue-500 to-cyan-500",
    glow: "rgba(59, 130, 246, 0.4)",
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
    gradient: "from-purple-500 to-pink-500",
    glow: "rgba(139, 92, 246, 0.4)",
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
    gradient: "from-emerald-500 to-green-500",
    glow: "rgba(16, 185, 129, 0.4)",
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
    gradient: "from-amber-500 to-orange-500",
    glow: "rgba(245, 158, 11, 0.4)",
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
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-4"
      >
        <Button variant="ghost" size="sm" asChild className="hover:bg-muted/50">
          <Link href="/workflows">
            <ArrowLeft className="h-4 w-4 mr-2" aria-hidden="true" />
            Back
          </Link>
        </Button>
      </motion.div>

      {/* Progress Steps */}
      <div className="flex items-center justify-center gap-4">
        {[1, 2].map((s) => (
          <div key={s} className="flex items-center gap-2">
            <motion.div
              animate={{
                scale: step === s ? 1.1 : 1,
              }}
              className={`w-9 h-9 rounded-xl flex items-center justify-center text-sm font-medium transition-all duration-300 ${
                step >= s
                  ? "bg-gradient-to-br from-primary to-accent text-white shadow-lg"
                  : "bg-muted text-muted-foreground"
              }`}
              style={{
                boxShadow:
                  step >= s ? "0 4px 15px rgba(59, 130, 246, 0.3)" : "none",
              }}
            >
              {step > s ? (
                <CheckCircle className="h-4 w-4" aria-hidden="true" />
              ) : (
                <span>{s}</span>
              )}
            </motion.div>
            <span
              className={`text-sm font-medium ${step >= s ? "text-foreground" : "text-muted-foreground"}`}
            >
              {s === 1 ? "Choose Template" : "Configure"}
            </span>
            {s < 2 && (
              <div
                className={`w-12 h-0.5 rounded-full transition-colors ${step > 1 ? "bg-primary/50" : "bg-muted"}`}
              />
            )}
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
          <Card className="border-border/50">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-gradient-to-br from-primary/20 to-accent/10">
                  <Sparkles
                    className="h-5 w-5 text-primary"
                    aria-hidden="true"
                  />
                </div>
                <div>
                  <CardTitle>Choose a Template</CardTitle>
                  <CardDescription>
                    Start with a pre-built workflow or create from scratch.
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {templates.map((template) => {
                  const Icon = template.icon;
                  const isSelected = selectedTemplate?.id === template.id;
                  return (
                    <motion.button
                      key={template.id}
                      whileHover={{ scale: 1.02, y: -2 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setSelectedTemplate(template)}
                      className={`p-5 rounded-xl border-2 text-left transition-all duration-300 ${
                        isSelected
                          ? "border-primary bg-primary/5 shadow-lg"
                          : "border-border/50 hover:border-primary/40 hover:bg-muted/30"
                      }`}
                      style={{
                        boxShadow: isSelected
                          ? `0 8px 25px ${template.glow}`
                          : "none",
                      }}
                    >
                      <div
                        className={`w-11 h-11 rounded-xl bg-gradient-to-br ${template.gradient} flex items-center justify-center mb-3 shadow-lg`}
                        style={{ boxShadow: `0 4px 15px ${template.glow}` }}
                      >
                        <Icon
                          className="h-5 w-5 text-white"
                          aria-hidden="true"
                        />
                      </div>
                      <h3 className="font-semibold text-foreground">
                        {template.name}
                      </h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        {template.description}
                      </p>
                      {isSelected && (
                        <div className="mt-3 flex items-center gap-1.5 text-xs text-primary font-medium">
                          <CheckCircle
                            className="h-3.5 w-3.5"
                            aria-hidden="true"
                          />
                          Selected
                        </div>
                      )}
                    </motion.button>
                  );
                })}
              </div>
              <div className="flex justify-end mt-6">
                <Button onClick={() => setStep(2)} className="gap-2">
                  Continue
                  <ArrowLeft
                    className="h-4 w-4 rotate-180"
                    aria-hidden="true"
                  />
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
          <Card className="border-border/50">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div
                  className={`h-11 w-11 rounded-xl bg-gradient-to-br ${selectedTemplate?.gradient || "from-primary to-accent"} flex items-center justify-center shadow-lg`}
                  style={{
                    boxShadow: `0 4px 15px ${selectedTemplate?.glow || "rgba(59, 130, 246, 0.3)"}`,
                  }}
                >
                  {selectedTemplate && (
                    <selectedTemplate.icon
                      className="h-5 w-5 text-white"
                      aria-hidden="true"
                    />
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
                    className="border-border/50 focus:border-primary/40"
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
                    className="border-border/50 focus:border-primary/40"
                  />
                </div>

                {/* Template Preview */}
                {selectedTemplate &&
                  selectedTemplate.definition.steps.length > 0 && (
                    <div className="space-y-2">
                      <Label>Workflow Steps</Label>
                      <div className="flex items-center gap-2 flex-wrap p-4 bg-muted/20 rounded-xl border border-border/50">
                        {selectedTemplate.definition.steps.map(
                          (stepItem, i) => (
                            <div key={i} className="flex items-center gap-2">
                              <span className="px-3 py-1.5 text-xs bg-background border border-border/50 rounded-full font-medium">
                                {stepItem.name}
                              </span>
                              {i <
                                selectedTemplate.definition.steps.length -
                                  1 && (
                                <ArrowLeft
                                  className="h-3 w-3 text-muted-foreground rotate-180"
                                  aria-hidden="true"
                                />
                              )}
                            </div>
                          ),
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        You can customize these steps after creation.
                      </p>
                    </div>
                  )}

                {createWorkflow.isError && (
                  <div className="rounded-xl bg-red-500/10 border border-red-500/20 p-4 text-sm text-red-400">
                    Failed to create workflow. Please try again.
                  </div>
                )}

                <div className="flex justify-between gap-3 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setStep(1)}
                    disabled={createWorkflow.isPending}
                    className="border-border/50"
                  >
                    <ArrowLeft className="h-4 w-4 mr-2" aria-hidden="true" />
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
                      className="gap-2"
                    >
                      {createWorkflow.isPending ? (
                        <>
                          <Loader2
                            className="h-4 w-4 animate-spin"
                            aria-hidden="true"
                          />
                          Creating...
                        </>
                      ) : (
                        <>
                          <Save className="h-4 w-4" aria-hidden="true" />
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
