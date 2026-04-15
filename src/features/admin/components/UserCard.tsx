"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { TableRow, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  CheckCircle2,
  Ban,
  Edit,
  MoreHorizontal,
  Loader2,
  Mail,
  ShieldCheck,
  ShieldAlert,
  UserCircle,
  GraduationCap,
  User,
} from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { updateUserStatus } from "../services";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";

// ---------- Types ----------
interface UserCardProps {
  user: {
    id: string;
    name: string;
    email: string;
    image: string | null;
    role: "USER" | "TUTOR" | "MODERATOR" | "ADMIN";
    status: "ACTIVE" | "BANNED" | "DELETED";
    createdAt: string;
    emailVerified: boolean;
  };
  onSelect?: (userId: string, checked: boolean) => void;
  isSelected?: boolean;
  onEdit?: (user: UserCardProps["user"]) => void;
  onStatusChange?: () => void;
}

// ---------- Status & Role Variants ----------
const statusVariants: Record<UserCardProps["user"]["status"], { label: string; variant: "default" | "destructive" | "outline" | "secondary" }> = {
  ACTIVE: { label: "Active", variant: "default" },
  BANNED: { label: "Banned", variant: "destructive" },
  DELETED: { label: "Deleted", variant: "outline" },
};

const roleVariants: Record<UserCardProps["user"]["role"], { label: string; variant: "default" | "secondary" | "outline"; icon: React.ElementType }> = {
  USER: { label: "User", variant: "outline", icon: User },
  TUTOR: { label: "Tutor", variant: "secondary", icon: GraduationCap },
  MODERATOR: { label: "Moderator", variant: "default", icon: ShieldCheck },
  ADMIN: { label: "Admin", variant: "default", icon: ShieldAlert },
};

// ---------- Main Component ----------
const UserCard = ({ user, onSelect, isSelected = false, onEdit, onStatusChange }: UserCardProps) => {
  const [status, setStatus] = useState(user.status);
  const [isUpdating, setIsUpdating] = useState(false);

  const updateStatusMutation = useMutation({
    mutationFn: updateUserStatus,
    onMutate: () => {
      setIsUpdating(true);
    },
    onSuccess: (res) => {
      setStatus(res.data.status);
      toast.success(`User status updated to ${res.data.status.toLowerCase()}`);
      onStatusChange?.();
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : "Failed to update status");
    },
    onSettled: () => {
      setIsUpdating(false);
    },
  });

  const handleStatusChange = async (newStatus: string) => {
    if (newStatus === user.status) return;
    
    await updateStatusMutation.mutateAsync({
      userId: user.id,
      body: { status: newStatus },
    });
  };

  const handleToggleBan = async () => {
    const newStatus = user.status === "ACTIVE" ? "BANNED" : "ACTIVE";
    await handleStatusChange(newStatus);
  };

  const handleEdit = () => {
    onEdit?.(user);
  };

  const RoleIcon = roleVariants[user.role].icon;
  const isDeleted = user.status === "DELETED";

  return (
    <motion.tr
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.2 }}
      className={cn(
        "border-b transition-colors hover:bg-muted/50",
        isSelected && "bg-muted/50",
        isDeleted && "opacity-60"
      )}
    
    >
      {/* Selection Checkbox */}
      <TableCell>
        <Checkbox
          checked={isSelected}
          onCheckedChange={(checked) => onSelect?.(user.id, checked as boolean)}
          disabled={isDeleted}
          aria-label={`Select ${user.name}`}
        />
      </TableCell>

      {/* User Info */}
      <TableCell>
        <div className="flex items-center gap-3">
          <Avatar className="h-9 w-9 border">
            <AvatarImage src={user.image || undefined} alt={user.name} />
            <AvatarFallback className="bg-primary/10 text-primary text-xs font-medium">
              {user.name
                .split(" ")
                .map((n) => n[0])
                .join("")
                .toUpperCase()
                .slice(0, 2)}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <p className="font-medium text-sm text-foreground truncate">
                {user.name}
              </p>
              {isDeleted && (
                <Badge variant="outline" className="text-[10px] px-1 py-0">
                  Deleted
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Mail className="h-3 w-3" />
              <span className="truncate">{user.email}</span>
            </div>
          </div>
        </div>
      </TableCell>

      {/* Role */}
      <TableCell>
        <Badge 
          variant={roleVariants[user.role].variant}
          className="flex items-center gap-1 w-fit"
        >
          <RoleIcon className="h-3 w-3" />
          {roleVariants[user.role].label}
        </Badge>
      </TableCell>

      {/* Status with Inline Selector */}
      <TableCell>
        {isDeleted ? (
          <Badge variant={statusVariants[user.status].variant}>
            {statusVariants[user.status].label}
          </Badge>
        ) : (
          <Select
            value={status}
            onValueChange={handleStatusChange}
            disabled={isUpdating || updateStatusMutation.isPending}
          >
            <SelectTrigger 
              className={cn(
                "h-8 w-[110px]",
                status === "ACTIVE" && "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950/20 dark:text-emerald-400",
                status === "BANNED" && "border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-800 dark:bg-rose-950/20 dark:text-rose-400"
              )}
            >
              {isUpdating ? (
                <div className="flex items-center gap-1">
                  <Loader2 className="h-3 w-3 animate-spin" />
                  <span>Updating...</span>
                </div>
              ) : (
                <SelectValue />
              )}
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ACTIVE">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-3 w-3 text-emerald-500" />
                  Active
                </div>
              </SelectItem>
              <SelectItem value="BANNED">
                <div className="flex items-center gap-2">
                  <Ban className="h-3 w-3 text-rose-500" />
                  Banned
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        )}
      </TableCell>

      {/* Joined Date */}
      <TableCell className="hidden md:table-cell text-sm text-muted-foreground">
        {new Date(user.createdAt).toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
        })}
      </TableCell>

      {/* Email Verified */}
      <TableCell className="hidden lg:table-cell">
        {user.emailVerified ? (
          <Badge 
            variant="outline" 
            className="text-emerald-600 border-emerald-200 bg-emerald-50 dark:bg-emerald-950/20"
          >
            <CheckCircle2 className="h-3 w-3 mr-1" />
            Verified
          </Badge>
        ) : (
          <Badge 
            variant="outline" 
            className="text-amber-600 border-amber-200 bg-amber-50 dark:bg-amber-950/20"
          >
            <Mail className="h-3 w-3 mr-1" />
            Pending
          </Badge>
        )}
      </TableCell>

      {/* Actions */}
      <TableCell>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8"
              disabled={isDeleted}
            >
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
          
            
            {!isDeleted && (
              <DropdownMenuItem
                onClick={handleToggleBan}
                className={
                  user.status === "ACTIVE"
                    ? "text-destructive"
                    : "text-emerald-600"
                }
              >
                {user.status === "ACTIVE" ? (
                  <>
                    <Ban className="mr-2 h-4 w-4" />
                    Ban User
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="mr-2 h-4 w-4" />
                    Activate User
                  </>
                )}
              </DropdownMenuItem>
            )}
            
            <DropdownMenuItem onClick={() => window.location.href = `mailto:${user.email}`}>
              <Mail className="mr-2 h-4 w-4" />
              Send Email
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </motion.tr>
  );
};

export default UserCard;
