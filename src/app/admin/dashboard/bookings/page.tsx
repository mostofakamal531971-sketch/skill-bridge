// app/admin/sessions/page.tsx
"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { format } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import {
  Calendar,
  Clock,
  CreditCard,
  Eye,
  Users,
  Video,
  ChevronLeft,
  ChevronRight,
  X,
  Filter,
  MoreHorizontal,
  Download,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { getAllBookingsByAdmin } from "@/features/admin/services";

// ---------- Types ----------
enum BookingStatus {
  CONFIRMED = "CONFIRMED",
  COMPLETED = "COMPLETED",
  CANCELLED = "CANCELLED",
}

interface Booking {
  id: string;
  studentId: string;
  tutorId: string;
  dateTime: string;
  status: BookingStatus;
  availabilityId: string;
  createdAt: string;
  updatedAt: string;
  student: {
    id: string;
    name: string;
    email: string;
    profileAvatar: string | null;
  };
  tutor: {
    id: string;
    name: string;
    hourlyRate: number;
    subjects: string[];
    category: string;
    profileAvatar: string | null;
    user: {
      name: string;
      image?: string;
    };
  };
  availability: {
    startTime: string;
    endTime: string;
  };
  review?: {
    rating: number;
    comment: string;
  };
}

interface ApiResponse {
  success: boolean;
  message: string;
  data: Booking[];
  meta?: {
    page: number;
    limit: number;
    totalCount: number;
    totalPages: number;
  };
}

// ---------- Status Config ----------
const statusConfig: Record<BookingStatus, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
  CONFIRMED: { label: "Confirmed", variant: "secondary" },
  COMPLETED: { label: "Completed", variant: "default" },
  CANCELLED: { label: "Cancelled", variant: "destructive" },
};

// ---------- Main Component ----------
export default function SessionManager() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const initialPage = parseInt(searchParams.get("page") || "1");
  const initialStatus = (searchParams.get("status") || "ALL") as BookingStatus | "ALL";

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(initialPage);
  const [statusFilter, setStatusFilter] = useState<BookingStatus | "COMPLETED">("COMPLETED");
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [selectedBookings, setSelectedBookings] = useState<Set<string>>(new Set());
  const [isAllSelected, setIsAllSelected] = useState(false);

  const limit = 10;

  // Update URL with current state
  const updateURL = useCallback(
    (updates: { page?: number; status?: string }) => {
      const params = new URLSearchParams(searchParams.toString());
      if (updates.page !== undefined) {
        updates.page === 1 ? params.delete("page") : params.set("page", String(updates.page));
      }
      if (updates.status !== undefined) {
        updates.status === "ALL" ? params.delete("status") : params.set("status", updates.status);
      }
      const queryString = params.toString();
      const url = queryString ? `?${queryString}` : window.location.pathname;
      router.replace(url, { scroll: false });
    },
    [router, searchParams]
  );

  const fetchBookings = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: String(page),
        limit: String(limit),
        ...(statusFilter !== "ALL" && { status: statusFilter }),
      });
      const response: ApiResponse = await getAllBookingsByAdmin(page,statusFilter);
      if (response.success) {
        setBookings(response.data);
        if (response.meta) {
          setTotalPages(response.meta.totalPages);
          setTotalCount(response.meta.totalCount);
        } else {
          setTotalCount(response.data.length);
          setTotalPages(Math.ceil(response.data.length / limit));
        }
      } else {
        toast.error(response.message || "Failed to fetch bookings");
      }
    } catch (error) {
      toast.error("An error occurred while fetching bookings");
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [page, statusFilter, limit]);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  const handleStatusChange = (value: string) => {
    const newStatus = value as BookingStatus | "ALL";
    setStatusFilter(newStatus);
    setPage(1);
    updateURL({ status: value, page: 1 });
    setSelectedBookings(new Set());
    setIsAllSelected(false);
  };

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages) return;
    setPage(newPage);
    updateURL({ page: newPage });
    setSelectedBookings(new Set());
    setIsAllSelected(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedBookings(new Set(bookings.map((b) => b.id)));
    } else {
      setSelectedBookings(new Set());
    }
    setIsAllSelected(checked);
  };

  const handleSelectBooking = (bookingId: string, checked: boolean) => {
    const newSelected = new Set(selectedBookings);
    if (checked) {
      newSelected.add(bookingId);
    } else {
      newSelected.delete(bookingId);
    }
    setSelectedBookings(newSelected);
    setIsAllSelected(newSelected.size === bookings.length);
  };

  const handleBulkAction = (action: string) => {
    toast.info(`${action} ${selectedBookings.size} booking(s)`);
  };

  const stats = useMemo(() => {
    const totalBookings = bookings.length;
    const totalRevenue = bookings.reduce((acc, curr) => acc + (curr.tutor?.hourlyRate || 0), 0);
    const uniqueStudents = new Set(bookings.map((b) => b.studentId)).size;
    return [
      { label: "Total Bookings", value: totalBookings.toLocaleString(), icon: Video },
      { label: "Total Revenue", value: `$${totalRevenue.toLocaleString()}`, icon: CreditCard },
      { label: "Active Students", value: uniqueStudents.toLocaleString(), icon: Users },
    ];
  }, [bookings]);

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 lg:space-y-8 max-w-[1600px] mx-auto">
      {/* Page Header */}
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">Sessions</h1>
        <p className="text-sm text-muted-foreground">Manage and monitor all platform bookings.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {stats.map((stat, i) => (
          <Card key={i} className="border-border/40 shadow-sm">
            <CardContent className="p-4 sm:p-5 flex items-center gap-4">
              <div className="p-2.5 rounded-lg bg-muted">
                <stat.icon className="h-5 w-5 text-muted-foreground" />
              </div>
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  {stat.label}
                </p>
                <p className="text-xl sm:text-2xl font-semibold tracking-tight text-foreground mt-0.5">
                  {stat.value}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          {/* Status Filter */}
          <Select value={statusFilter} onValueChange={handleStatusChange}>
            <SelectTrigger className="w-[160px] h-9 bg-background border-border/60">
              <Filter className="h-3.5 w-3.5 mr-2 text-muted-foreground" />
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Bookings</SelectItem>
              <SelectItem value="CONFIRMED">Confirmed</SelectItem>
              <SelectItem value="COMPLETED">Completed</SelectItem>
              <SelectItem value="CANCELLED">Cancelled</SelectItem>
            </SelectContent>
          </Select>

          {statusFilter !== "ALL" && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleStatusChange("ALL")}
              className="h-9 text-muted-foreground"
            >
              Clear
              <X className="ml-1 h-3.5 w-3.5" />
            </Button>
          )}
        </div>

        {/* Bulk Actions */}
        <AnimatePresence>
          {selectedBookings.size > 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="flex items-center gap-2 bg-background border border-border/60 rounded-lg p-1 shadow-sm"
            >
              <span className="text-sm font-medium px-3 text-muted-foreground">
                {selectedBookings.size} selected
              </span>
              <Separator orientation="vertical" className="h-5" />
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-8">
                    Actions
                    <MoreHorizontal className="ml-1 h-3.5 w-3.5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => handleBulkAction("Export")}>
                    <Download className="mr-2 h-4 w-4" />
                    Export
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => {
                  setSelectedBookings(new Set());
                  setIsAllSelected(false);
                }}
              >
                <X className="h-4 w-4" />
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Table */}
      <div className="rounded-lg border border-border/60 bg-card shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px]">
            <thead>
              <tr className="border-b border-border/60 bg-muted/30">
                <th className="w-10 pl-4 py-3">
                  <Checkbox
                    checked={isAllSelected}
                    onCheckedChange={handleSelectAll}
                    aria-label="Select all"
                  />
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Tutor
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Student
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Schedule
                </th>
                <th className="px-4 py-3 text-center text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Status
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Amount
                </th>
                <th className="w-16 px-4 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="bg-card">
                    <td className="pl-4 py-4"><Skeleton className="h-4 w-4 rounded" /></td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        <Skeleton className="h-10 w-10 rounded-full" />
                        <div className="space-y-1">
                          <Skeleton className="h-4 w-28" />
                          <Skeleton className="h-3 w-20" />
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="space-y-1">
                        <Skeleton className="h-4 w-28" />
                        <Skeleton className="h-3 w-32" />
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="space-y-1">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-3 w-20" />
                      </div>
                    </td>
                    <td className="px-4 py-4 text-center"><Skeleton className="h-6 w-20 mx-auto rounded-full" /></td>
                    <td className="px-4 py-4 text-right"><Skeleton className="h-4 w-12 ml-auto" /></td>
                    <td className="px-4 py-4"><Skeleton className="h-8 w-8 ml-auto rounded-md" /></td>
                  </tr>
                ))
              ) : bookings.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-16 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <div className="p-3 rounded-full bg-muted mb-3">
                        <Video className="h-6 w-6 text-muted-foreground" />
                      </div>
                      <p className="text-sm font-medium text-foreground">No bookings found</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {statusFilter !== "ALL"
                          ? `No ${statusFilter.toLowerCase()} bookings available.`
                          : "There are no bookings in the system yet."}
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                <AnimatePresence mode="popLayout">
                  {bookings.map((booking) => (
                    <BookingRow
                      key={booking.id}
                      booking={booking}
                      isSelected={selectedBookings.has(booking.id)}
                      onSelect={handleSelectBooking}
                    />
                  ))}
                </AnimatePresence>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {!loading && totalPages > 1 && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-4 sm:px-6 py-3 border-t border-border/60 bg-muted/20">
            <p className="text-xs text-muted-foreground">
              Page {page} of {totalPages} · {totalCount} total
            </p>
            <div className="flex items-center gap-1">
              <Button
                variant="outline"
                size="icon"
                onClick={() => handlePageChange(page - 1)}
                disabled={page === 1}
                className="h-8 w-8 border-border/60"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum: number;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (page <= 3) {
                  pageNum = i + 1;
                } else if (page >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = page - 2 + i;
                }
                return (
                  <Button
                    key={pageNum}
                    variant={pageNum === page ? "default" : "outline"}
                    size="icon"
                    onClick={() => handlePageChange(pageNum)}
                    className="h-8 w-8 border-border/60"
                  >
                    {pageNum}
                  </Button>
                );
              })}
              <Button
                variant="outline"
                size="icon"
                onClick={() => handlePageChange(page + 1)}
                disabled={page === totalPages}
                className="h-8 w-8 border-border/60"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ---------- Booking Row Component ----------
const BookingRow = ({
  booking,
  isSelected,
  onSelect,
}: {
  booking: Booking;
  isSelected: boolean;
  onSelect: (id: string, checked: boolean) => void;
}) => {
  const status = statusConfig[booking.status];

  return (
    <motion.tr
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="group bg-card hover:bg-muted/30 transition-colors"
    >
      <td className="pl-4 py-4">
        <Checkbox
          checked={isSelected}
          onCheckedChange={(checked) => onSelect(booking.id, checked as boolean)}
          aria-label={`Select booking ${booking.id}`}
        />
      </td>

      {/* Tutor */}
      <td className="px-4 py-4">
        <Link href={`/tutors/${booking.tutor?.id}`} className="flex items-center gap-3 group/tutor">
          <Avatar className="h-9 w-9 border border-border/60">
            <AvatarImage src={booking.tutor?.user.image} alt={booking.tutor?.user.name} />
            <AvatarFallback className="bg-muted text-foreground text-xs font-medium">
              {booking.tutor?.user.name.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <p className="text-sm font-medium text-foreground group-hover/tutor:text-primary transition-colors truncate">
              {booking.tutor?.user.name}
            </p>
            <p className="text-xs text-muted-foreground truncate">
              {booking.tutor?.subjects?.[0] || booking.tutor?.category}
            </p>
          </div>
        </Link>
      </td>

      {/* Student */}
      <td className="px-4 py-4">
        <div className="flex flex-col">
          <p className="text-sm font-medium text-foreground truncate">{booking.student?.name}</p>
          <p className="text-xs text-muted-foreground truncate">{booking.student?.email}</p>
        </div>
      </td>

      {/* Schedule */}
      <td className="px-4 py-4">
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5 text-sm text-foreground">
            <Calendar className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
            {format(new Date(booking.dateTime), "MMM d, yyyy")}
          </div>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-0.5">
            <Clock className="h-3 w-3 shrink-0" />
            {booking.availability?.startTime} – {booking.availability?.endTime}
          </div>
        </div>
      </td>

      {/* Status */}
      <td className="px-4 py-4 text-center">
        <Badge variant={status.variant} className="font-medium text-xs">
          {status.label}
        </Badge>
      </td>

      {/* Amount */}
      <td className="px-4 py-4 text-right">
        <span className="text-sm font-medium text-foreground">
          ${booking.tutor?.hourlyRate}
        </span>
      </td>

      {/* Actions */}
      <td className="px-4 py-4 text-right">
        <Link href={`/admin/bookings/${booking.id}`}>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
            title="View Details"
          >
            <Eye className="h-4 w-4 text-muted-foreground" />
          </Button>
        </Link>
      </td>
    </motion.tr>
  );
};
