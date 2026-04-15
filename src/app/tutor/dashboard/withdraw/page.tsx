'use client';

import { useState } from "react";
import { Wallet, ArrowRight, Shield, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { StatCard } from "@/components/dashboard/StatCard";
import { StatusBadge } from "@/components/dashboard/StatusBadge";
import { DataTable } from "@/components/dashboard/DataTable";
import { ConfirmDialog } from "@/components/dashboard/ConfirmDialog";
import { tutorEarnings, withdrawals } from "@/lib/mock-data";
import { toast } from "sonner";

export default function TutorWithdrawPage() {
  const [tab, setTab] = useState<"transactions" | "transfer" | "security">("transactions");
  const [amount, setAmount] = useState("");
  const [otp, setOtp] = useState("");
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [otpSent, setOtpSent] = useState(false);

  const handleTransfer = () => {
    if (!amount || Number(amount) <= 0) { toast.error("Enter a valid amount"); return; }
    if (Number(amount) > tutorEarnings.availableBalance) { toast.error("Insufficient balance"); return; }
    setConfirmOpen(true);
  };

  const confirmTransfer = () => {
    setConfirmOpen(false);
    setTab("security");
    setOtpSent(true);
    toast.info("OTP sent to your registered phone");
  };

  const verifyOtp = () => {
    if (otp.length < 4) { toast.error("Enter a valid OTP"); return; }
    toast.success(`$${amount} withdrawal initiated successfully!`);
    setAmount("");
    setOtp("");
    setOtpSent(false);
    setTab("transactions");
  };

  const txColumns = [
    { key: "id", header: "ID", render: (w: typeof withdrawals[0]) => <span className="font-mono text-xs text-muted-foreground">{w.id}</span> },
    { key: "amount", header: "Amount", render: (w: typeof withdrawals[0]) => <span className="text-foreground font-bold">${w.amount}</span> },
    { key: "bank", header: "Bank", render: (w: typeof withdrawals[0]) => <span className="text-muted-foreground">{w.bankName} •••{w.accountEnding}</span> },
    { key: "date", header: "Date", render: (w: typeof withdrawals[0]) => <span className="text-muted-foreground">{w.date}</span> },
    { key: "status", header: "Status", render: (w: typeof withdrawals[0]) => <StatusBadge status={w.status} size="md" /> },
  ];

  return (
    <>
      <PageHeader title="Withdraw Money" description="Transfer your earnings to your bank account" />

      <div className="grid grid-cols-2 gap-4 mb-6">
        <StatCard label="Available Balance" value={`$${tutorEarnings.availableBalance}`} icon={Wallet} positive />
        <StatCard label="Pending Withdrawals" value={`$${withdrawals.filter(w => w.status === "pending").reduce((s, w) => s + w.amount, 0)}`} />
      </div>

      <div className="flex gap-2 mb-6">
        {(["transactions", "transfer", "security"] as const).map((t) => (
          <Button key={t} variant={tab === t ? "default" : "outline"} size="sm" className={`rounded-xl capitalize ${tab === t ? "bg-primary" : "border-white/[0.08]"}`} onClick={() => setTab(t)}>
            {t === "transactions" ? "History" : t === "transfer" ? "Transfer" : "Security"}
          </Button>
        ))}
      </div>

      {tab === "transactions" && (
        <div className="bento-card">
          <DataTable columns={txColumns} data={withdrawals} keyExtractor={(w) => w.id} emptyTitle="No withdrawals yet" />
        </div>
      )}

      {tab === "transfer" && (
        <div className="bento-card max-w-lg">
          <h3 className="font-bold text-foreground mb-4">Transfer to Bank</h3>
          <div className="space-y-4">
            <div className="p-3 rounded-xl bg-muted/30 border border-white/[0.04]">
              <p className="text-xs text-muted-foreground mb-1">Destination</p>
              <p className="text-sm font-semibold text-foreground">Chase Bank •••4523</p>
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Amount (USD)</label>
              <Input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="Enter amount" className="glass border-white/[0.08] rounded-xl" />
              <p className="text-xs text-muted-foreground mt-1">Min: $50 • Available: ${tutorEarnings.availableBalance}</p>
            </div>
            <Button onClick={handleTransfer} className="w-full bg-primary hover:bg-primary/90 rounded-xl">
              Continue <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      )}

      {tab === "security" && (
        <div className="bento-card max-w-lg">
          <div className="text-center mb-6">
            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <Shield className="w-8 h-8 text-primary" />
            </div>
            <h3 className="font-bold text-foreground mb-1">Security Verification</h3>
            <p className="text-sm text-muted-foreground">Enter the OTP sent to your registered phone number</p>
          </div>
          <div className="space-y-4">
            <Input value={otp} onChange={(e) => setOtp(e.target.value)} placeholder="Enter OTP code" maxLength={6} className="glass border-white/[0.08] rounded-xl text-center text-lg tracking-widest" />
            <Button onClick={verifyOtp} disabled={!otpSent} className="w-full bg-primary hover:bg-primary/90 rounded-xl">
              <CheckCircle2 className="w-4 h-4 mr-2" />Verify & Withdraw
            </Button>
            <Button variant="ghost" className="w-full text-xs text-muted-foreground" onClick={() => toast.info("OTP resent")}>Resend OTP</Button>
          </div>
        </div>
      )}

      <ConfirmDialog open={confirmOpen} onOpenChange={setConfirmOpen} title="Confirm Withdrawal" description={`Are you sure you want to withdraw $${amount} to Chase Bank •••4523?`} confirmLabel="Proceed to Verification" onConfirm={confirmTransfer} />
    </>
  );
}

