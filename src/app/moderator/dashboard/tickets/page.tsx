"use client";

import { useState } from "react";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { FilterBar } from "@/components/dashboard/FilterBar";
import { StatusBadge } from "@/components/dashboard/StatusBadge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { issues, issueReplies } from "@/lib/mock-data";
import { toast } from "sonner";
import { Send, CheckCircle2 } from "lucide-react";

export default function ModeratorTicketsPage() {
  const [search, setSearch] = useState("");
  const [selectedTicket, setSelectedTicket] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const filtered = issues.filter((i) => {
    const matchSearch =
      i.title.toLowerCase().includes(search.toLowerCase()) ||
      i.username.toLowerCase().includes(search.toLowerCase());
    const matchStatus = !statusFilter || i.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const selected = issues.find((i) => i.id === selectedTicket);
  const replies = issueReplies.filter((r) => r.issueId === selectedTicket);

  return (
    <>
      <PageHeader
        title="Support Tickets"
        description="Manage user complaints and issues"
      />
      <div
        className="grid lg:grid-cols-3 gap-4"
        style={{ height: "calc(100vh - 220px)" }}
      >
        {/* Ticket List */}
        <div className="bento-card p-0 overflow-hidden flex flex-col">
          <div className="p-3 border-b border-border">
            <FilterBar
              searchValue={search}
              onSearchChange={setSearch}
              searchPlaceholder="Search tickets..."
              filters={[
                {
                  label: "All",
                  value: "status",
                  options: [
                    { label: "Pending", value: "PENDING" },
                    { label: "Resolved", value: "SUCCESS" },
                  ],
                },
              ]}
              filterValues={{ status: statusFilter }}
              onFilterChange={(_, v) => setStatusFilter(v)}
            />
          </div>
          <div className="flex-1 overflow-y-auto">
            {filtered.map((issue) => (
              <button
                key={issue.id}
                onClick={() => setSelectedTicket(issue.id)}
                className={`w-full text-left p-4 border-b border-border/50 hover:bg-muted/30 transition-colors ${
                  selectedTicket === issue.id ? "bg-muted/50" : ""
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-semibold text-foreground truncate">
                    {issue.title}
                  </span>
                  <StatusBadge status={issue.priority} />
                </div>
                <p className="text-xs text-muted-foreground truncate">
                  {issue.username} • {issue.createdAt}
                </p>
                <StatusBadge status={issue.status} />
              </button>
            ))}
          </div>
        </div>

        {/* Ticket Detail */}
        <div className="lg:col-span-2 bento-card p-0 flex flex-col overflow-hidden">
          {selected ? (
            <>
              <div className="p-4 border-b border-border">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-foreground">
                      {selected.title}
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      {selected.username} • {selected.createdAt}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <StatusBadge status={selected.type} size="md" />
                    <StatusBadge status={selected.status} size="md" />
                  </div>
                </div>
              </div>
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                <div className="p-3 rounded-xl bg-muted/30 border border-white/[0.04]">
                  <p className="text-xs text-muted-foreground mb-1">
                    User Message
                  </p>
                  <p className="text-sm text-foreground">
                    {selected.userMessage}
                  </p>
                </div>
                {replies.map((r) => (
                  <div
                    key={r.id}
                    className={`p-3 rounded-xl ${
                      r.isAdmin
                        ? "bg-primary/5 border border-primary/10 ml-6"
                        : "bg-muted/30 border border-white/[0.04]"
                    }`}
                  >
                    <p className="text-xs text-muted-foreground mb-1">
                      {r.isAdmin ? "Moderator" : "User"} • {r.createdAt}
                    </p>
                    <p className="text-sm text-foreground">{r.content}</p>
                  </div>
                ))}
              </div>
              <div className="p-3 border-t border-border flex gap-2">
                <Input
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="Type a reply..."
                  className="flex-1 h-9 bg-muted/50 border-none rounded-lg text-sm"
                />
                <Button
                  size="sm"
                  onClick={() => {
                    toast.success("Reply sent");
                    setReplyText("");
                  }}
                  className="bg-primary hover:bg-primary/90 h-9 rounded-lg"
                >
                  <Send className="w-4 h-4" />
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => toast.success("Ticket closed")}
                  className="border-white/[0.08] h-9 rounded-lg"
                >
                  <CheckCircle2 className="w-4 h-4 mr-1" />
                  Close
                </Button>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-muted-foreground">
              Select a ticket
            </div>
          )}
        </div>
      </div>
    </>
  );
}

