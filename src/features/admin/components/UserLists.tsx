"use client";


import { AnimatePresence } from "framer-motion";
import { getAllUsersByAdmin } from "../services";
import UserCard from "./UserCard";


import { useState, useEffect, useCallback, useMemo } from "react";
import { debounce } from "lodash";
import { toast } from "sonner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Ban,
  CheckCircle2,
  Edit,
  MoreHorizontal,
  Search,
  UserCog,
  Users,
} from "lucide-react";

import { motion } from "framer-motion";

import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";

// ---------- Types ----------
interface User {
  id: string;
  name: string;
  email: string;
  image: string | null;
  role: "USER" | "TUTOR" | "MODERATOR" | "ADMIN";
  status: "ACTIVE" | "BANNED" | "DELETED";
  deletedAt: string | null;
  needPasswordChange: boolean;
  isDeleted: boolean;
  emailVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

interface ApiResponse {
  success: boolean;
  message: string;
  data: {
    meta: {
      page: string;
      limit: number;
      totalCount: number;
      totalPages: number;
    };
    data: User[];
  };
  meta: {
    timestamp: string;
  };
}

interface Filters {
  search: string;
  status: string;
}

// ---------- Status Badge Variants ----------
const statusVariants: Record<User["status"], { label: string; variant: "default" | "destructive" | "outline" | "secondary" }> = {
  ACTIVE: { label: "Active", variant: "default" },
  BANNED: { label: "Banned", variant: "destructive" },
  DELETED: { label: "Deleted", variant: "outline" },
};

const roleVariants: Record<User["role"], { label: string; variant: "default" | "secondary" | "outline" }> = {
  USER: { label: "User", variant: "outline" },
  TUTOR: { label: "Tutor", variant: "secondary" },
  MODERATOR: { label: "Moderator", variant: "default" },
  ADMIN: { label: "Admin", variant: "default" },
};

const UserLists = () => {
 
  // State
  const router = useRouter();
  const searchParams = useSearchParams();

  // Initialize state from URL params
  const initialPage = parseInt(searchParams.get("page") || "1");
  const initialSearch = searchParams.get("search") || "";
  const initialStatus = searchParams.get("status") || "ACTIVE";

  // State
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [meta, setMeta] = useState({
    page: initialPage,
    limit: 10,
    totalCount: 0,
    totalPages: 1,
  });
  const [filters, setFilters] = useState<Filters>({
    search: initialSearch,
    status: initialStatus,
  });
  const [selectedUsers, setSelectedUsers] = useState<Set<string>>(new Set());
  const [isAllSelected, setIsAllSelected] = useState(false);
  const [searchInput, setSearchInput] = useState(initialSearch);

  // Update URL with current state
  const updateURL = useCallback(
    (updates: { page?: number; search?: string; status?: string }) => {
      const params = new URLSearchParams(searchParams.toString());

      // Update page
      if (updates.page !== undefined) {
        if (updates.page === 1) {
          params.delete("page");
        } else {
          params.set("page", String(updates.page));
        }
      }

      // Update search
      if (updates.search !== undefined) {
        if (updates.search) {
          params.set("search", updates.search);
        } else {
          params.delete("search");
        }
      }

      // Update status
      if (updates.status !== undefined) {
        if (updates.status === "ACTIVE") {
          params.delete("status");
        } else {
          params.set("status", updates.status);
        }
      }

      const queryString = params.toString();
      const url = queryString ? `?${queryString}` : window.location.pathname;
      router.replace(url, { scroll: false });
    },
    [router, searchParams]
  );

  // Debounced search to avoid excessive API calls
  const debouncedSearch = useMemo(
    () =>
      debounce((searchTerm: string) => {
        setFilters((prev) => ({ ...prev, search: searchTerm }));
        setMeta((prev) => ({ ...prev, page: 1 }));
        updateURL({ search: searchTerm, page: 1 });
      }, 400),
    [updateURL]
  );

  // Handle search input change
  const handleSearchChange = (value: string) => {
    setSearchInput(value);
    debouncedSearch(value);
  };

  // Clear search
  const handleClearSearch = () => {
    setSearchInput("");
    setFilters((prev) => ({ ...prev, search: "" }));
    setMeta((prev) => ({ ...prev, page: 1 }));
    updateURL({ search: "", page: 1 });
  };

  // Fetch users
  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const response: ApiResponse = await getAllUsersByAdmin(
        meta.page,
        filters.status,
        filters.search.toLowerCase()
      );

      if (response.success) {
        setUsers(response.data.data);
        setMeta({
          page: Number(response.data.meta.page),
          limit: response.data.meta.limit,
          totalCount: response.data.meta.totalCount,
          totalPages: response.data.meta.totalPages,
        });
      } else {
        toast.error(response.message || "Failed to fetch users");
      }
    } catch (error) {
      toast.error("An error occurred while fetching users");
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch users when dependencies change
  useEffect(() => {
    fetchUsers();
  }, []);

  // Cleanup debounce on unmount
  useEffect(() => {
    return () => {
      debouncedSearch.cancel();
    };
  }, [debouncedSearch]);

  // Selection handlers
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedUsers(new Set(users.map((u) => u.id)));
    } else {
      setSelectedUsers(new Set());
    }
    setIsAllSelected(checked);
  };

 

  // Bulk actions
  const handleBulkStatusChange = async (status: User["status"]) => {
    if (selectedUsers.size === 0) return;
    
    toast.promise(
      new Promise((resolve) => setTimeout(resolve, 1000)),
      {
        loading: `Updating ${selectedUsers.size} users...`,
        success: `Successfully updated ${selectedUsers.size} users`,
        error: "Failed to update users",
      }
    );
    
    setSelectedUsers(new Set());
    setIsAllSelected(false);
    fetchUsers();
  };



  // Reset page when filters change
  const handleFilterChange = (value: string) => {
    setFilters((prev) => ({ ...prev, status: value }));
    setMeta((prev) => ({ ...prev, page: 1 }));
    updateURL({ status: value, page: 1 });
  };

  // Pagination
  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > meta.totalPages) return;
    setMeta((prev) => ({ ...prev, page: newPage }));
    updateURL({ page: newPage });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };


  return (
    <AnimatePresence>
           
   {/* Filters & Bulk Actions */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <div className="flex flex-wrap gap-3 w-full  justify-between ">
          {/* Search */}
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by name or email..."
              className="pl-9 bg-background"
              onChange={(e) => debouncedSearch(e.target.value)}
            />
          </div>

         

          {/* Status Filter */}
          <Select
            value={filters.status}
            onValueChange={(value) => handleFilterChange( value)}
          >
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Status</SelectItem>
              <SelectItem value="ACTIVE">Active</SelectItem>
              <SelectItem value="BANNED">Banned</SelectItem>
              <SelectItem value="DELETED">Deleted</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Bulk Actions */}
        {selectedUsers.size > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 bg-muted p-1 rounded-lg"
          >
            <span className="text-sm font-medium px-3">
              {selectedUsers.size} selected
            </span>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  Bulk Actions
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => handleBulkStatusChange("ACTIVE")}>
                  <CheckCircle2 className="mr-2 h-4 w-4 text-emerald-500" />
                  Activate
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleBulkStatusChange("BANNED")}>
                  <Ban className="mr-2 h-4 w-4 text-destructive" />
                  Ban
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </motion.div>
        )}
      </div>

      {/* Users Table */}
      <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50 hover:bg-muted/50">
                <TableHead className="w-12">
                  <Checkbox
                    checked={isAllSelected}
                    onCheckedChange={handleSelectAll}
                    aria-label="Select all"
                  />
                </TableHead>
                <TableHead>User</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="hidden md:table-cell">Joined</TableHead>
                <TableHead className="hidden lg:table-cell">Email Verified</TableHead>
                <TableHead className="w-[80px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                // Loading skeletons
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell><Skeleton className="h-4 w-4" /></TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Skeleton className="h-10 w-10 rounded-full" />
                        <div className="space-y-1">
                          <Skeleton className="h-4 w-32" />
                          <Skeleton className="h-3 w-24" />
                        </div>
                      </div>
                    </TableCell>
                    <TableCell><Skeleton className="h-5 w-16" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-20" /></TableCell>
                    <TableCell className="hidden md:table-cell"><Skeleton className="h-4 w-24" /></TableCell>
                    <TableCell className="hidden lg:table-cell"><Skeleton className="h-4 w-16" /></TableCell>
                    <TableCell><Skeleton className="h-8 w-8" /></TableCell>
                  </TableRow>
                ))
              ) : users.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="h-32 text-center">
                    <div className="flex flex-col items-center justify-center text-muted-foreground">
                      <UserCog className="h-10 w-10 mb-2 opacity-40" />
                      <p className="text-lg font-medium">No users found</p>
                      <p className="text-sm">Try adjusting your filters</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                <AnimatePresence mode="popLayout">
                  {users.map((user) => (
                   <UserCard user={user}/>
                  ))}
                </AnimatePresence>
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        {!loading && meta.totalPages > 1 && (
          <div className="flex items-center justify-between px-6 py-4 border-t">
            <p className="text-sm text-muted-foreground">
              Showing{" "}
              <span className="font-medium">
                {(meta.page - 1) * meta.limit + 1}
              </span>{" "}
              to{" "}
              <span className="font-medium">
                {Math.min(meta.page * meta.limit, meta.totalCount)}
              </span>{" "}
              of <span className="font-medium">{meta.totalCount}</span> users
            </p>
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() => handlePageChange(meta.page - 1)}
                    className={meta.page === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                  />
                </PaginationItem>
                {Array.from({ length: Math.min(5, meta.totalPages) }, (_, i) => {
                  // Show pages around current page
                  let pageNum: number;
                  if (meta.totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (meta.page <= 3) {
                    pageNum = i + 1;
                  } else if (meta.page >= meta.totalPages - 2) {
                    pageNum = meta.totalPages - 4 + i;
                  } else {
                    pageNum = meta.page - 2 + i;
                  }
                  return (
                    <PaginationItem key={pageNum}>
                      <PaginationLink
                        isActive={pageNum === meta.page}
                        onClick={() => handlePageChange(pageNum)}
                      >
                        {pageNum}
                      </PaginationLink>
                    </PaginationItem>
                  );
                })}
                <PaginationItem>
                  <PaginationNext
                    onClick={() => handlePageChange(meta.page + 1)}
                    className={meta.page === meta.totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </div>
              </AnimatePresence>
  )
}

export default UserLists 
