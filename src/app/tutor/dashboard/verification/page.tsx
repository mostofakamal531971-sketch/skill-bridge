'use client';

import { useState } from "react";
import { Upload, CheckCircle2, XCircle, Clock, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { StatusBadge } from "@/components/dashboard/StatusBadge";
import { verificationDocs } from "@/lib/mock-data";
import { toast } from "sonner";

export default function TutorVerificationPage() {
  const myDocs = verificationDocs.filter((d) => d.tutorId === "1" || d.tutorId === "4");
  const [uploading, setUploading] = useState(false);

  const checklist = [
    { label: "Government-issued ID", status: "approved" },
    { label: "Degree / Professional Certificate", status: "approved" },
    { label: "Teaching Demo Video", status: "pending" },
    { label: "Background Check Consent", status: "not_submitted" },
  ];

  const overallStatus = checklist.every(c => c.status === "approved") ? "Verified" : checklist.some(c => c.status === "pending") ? "In Review" : "Incomplete";

  return (
    <>
      <PageHeader title="Platform Verification" description="Complete your verification to start teaching" />

      {/* Status Card */}
      <div className="bento-card mb-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-primary/5" />
        <div className="relative z-10 flex items-center gap-4">
          <div className={`w-16 h-16 rounded-2xl flex items-center justify-center ${overallStatus === "Verified" ? "bg-accent/10" : overallStatus === "In Review" ? "bg-warning/10" : "bg-muted"}`}>
            {overallStatus === "Verified" ? <CheckCircle2 className="w-8 h-8 text-accent" /> : overallStatus === "In Review" ? <Clock className="w-8 h-8 text-warning" /> : <XCircle className="w-8 h-8 text-muted-foreground" />}
          </div>
          <div>
            <h3 className="text-lg font-bold text-foreground">{overallStatus}</h3>
            <p className="text-sm text-muted-foreground">{overallStatus === "Verified" ? "You are fully verified and can accept bookings." : overallStatus === "In Review" ? "Your documents are being reviewed." : "Please complete the verification checklist below."}</p>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Checklist */}
        <div className="bento-card">
          <h3 className="font-bold text-foreground mb-4">Verification Checklist</h3>
          <div className="space-y-3">
            {checklist.map((item, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-muted/30 border border-white/[0.04]">
                <div className="flex items-center gap-3">
                  {item.status === "approved" ? <CheckCircle2 className="w-5 h-5 text-accent" /> : item.status === "pending" ? <Clock className="w-5 h-5 text-warning" /> : <XCircle className="w-5 h-5 text-muted-foreground" />}
                  <span className="text-sm text-foreground">{item.label}</span>
                </div>
                {item.status === "not_submitted" && (
                  <Button size="sm" variant="outline" className="border-white/[0.08] rounded-xl text-xs"><Upload className="w-3 h-3 mr-1" />Upload</Button>
                )}
                {item.status !== "not_submitted" && <StatusBadge status={item.status} size="md" />}
              </div>
            ))}
          </div>
        </div>

        {/* Document History */}
        <div className="bento-card">
          <h3 className="font-bold text-foreground mb-4">Submitted Documents</h3>
          <div className="space-y-3">
            {myDocs.map((doc) => (
              <div key={doc.id} className="p-3 rounded-xl bg-muted/30 border border-white/[0.04]">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-primary" />
                    <span className="text-sm font-medium text-foreground">{doc.documentType}</span>
                  </div>
                  <StatusBadge status={doc.status} size="md" />
                </div>
                <p className="text-xs text-muted-foreground">{doc.fileName} • Submitted {doc.submittedAt}</p>
                {doc.notes && (
                  <p className={`text-xs mt-1 ${doc.status === "rejected" ? "text-destructive" : "text-muted-foreground"}`}>{doc.notes}</p>
                )}
                {doc.status === "rejected" && (
                  <Button size="sm" variant="outline" className="mt-2 border-white/[0.08] rounded-xl text-xs"><Upload className="w-3 h-3 mr-1" />Resubmit</Button>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

