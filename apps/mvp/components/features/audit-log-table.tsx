"use client";

import { LedgerEntry } from "@/types/api";
import { format } from "date-fns";
import {
  Shield,
  Key,
  ChevronDown,
  ChevronUp,
  Clock,
  User,
  Cpu,
  Activity,
} from "lucide-react";
import { useState } from "react";
import { cn } from "@workspace/ui/lib/utils";
import { Badge } from "@workspace/ui/components/badge";

interface AuditLogTableProps {
  logs: LedgerEntry[];
}

export function AuditLogTable({ logs }: AuditLogTableProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const getActorIcon = (type: string) => {
    if (type.includes("USER")) return <User className="h-3 w-3" />;
    if (type.includes("AI")) return <Cpu className="h-3 w-3" />;
    return <Activity className="h-3 w-3" />;
  };

  return (
    <div className="rounded-xl border bg-card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-muted/50 text-muted-foreground font-medium border-b">
            <tr>
              <th className="px-4 py-3 w-10"></th>
              <th className="px-4 py-3">Timestamp</th>
              <th className="px-4 py-3">Event Type</th>
              <th className="px-4 py-3">Actor</th>
              <th className="px-4 py-3">Short Hash</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {logs.map((log) => (
              <React.Fragment key={log.id}>
                <tr
                  className={cn(
                    "hover:bg-muted/30 transition-colors cursor-pointer",
                    expandedId === log.id && "bg-muted/20",
                  )}
                  onClick={() => toggleExpand(log.id)}
                >
                  <td className="px-4 py-3">
                    {expandedId === log.id ? (
                      <ChevronUp className="h-4 w-4" />
                    ) : (
                      <ChevronDown className="h-4 w-4" />
                    )}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Clock className="h-3.5 w-3.5" />
                      {format(new Date(log.createdAt), "MMM d, HH:mm:ss")}
                    </div>
                  </td>
                  <td className="px-4 py-3 font-medium">
                    <Badge variant="outline" className="uppercase text-[10px]">
                      {log.eventType}
                    </Badge>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1.5 text-xs">
                      {getActorIcon(log.eventType)}
                      {log.eventType.split("_")[0]}
                    </div>
                  </td>
                  <td className="px-4 py-3 font-mono text-[10px] text-muted-foreground">
                    {log.hash.slice(0, 12)}...
                  </td>
                </tr>
                {expandedId === log.id && (
                  <tr className="bg-muted/10">
                    <td colSpan={5} className="px-8 py-6">
                      <div className="grid gap-6 md:grid-cols-2">
                        <div className="space-y-4">
                          <div className="space-y-1">
                            <h5 className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-primary">
                              <Shield className="h-3 w-3" />
                              Verifiable Cryptographic Proof
                            </h5>
                            <div className="p-3 bg-background rounded-lg border space-y-3 font-mono text-[10px] break-all">
                              <div>
                                <span className="text-muted-foreground">
                                  Current Hash:
                                </span>
                                <p className="mt-1 text-foreground">
                                  {log.hash}
                                </p>
                              </div>
                              <div>
                                <span className="text-muted-foreground">
                                  Previous Hash:
                                </span>
                                <p className="mt-1 text-foreground">
                                  {log.previousHash}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="space-y-1">
                          <h5 className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-primary">
                            <Key className="h-3 w-3" />
                            Payload Content
                          </h5>
                          <div className="p-3 bg-background rounded-lg border">
                            <pre className="text-[10px] font-mono leading-relaxed overflow-x-auto">
                              {JSON.stringify(JSON.parse(log.data), null, 2)}
                            </pre>
                          </div>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
import * as React from "react";
