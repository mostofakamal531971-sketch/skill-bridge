import { ReactNode } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EmptyState } from "./EmptyState";

interface Column<T> {
  key: string;
  header: string;
  render: (item: T) => ReactNode;
  className?: string;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  keyExtractor: (item: T) => string;
  page?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
  emptyTitle?: string;
  emptyDescription?: string;
  onRowClick?: (item: T) => void;
  /** Shown under the table (e.g. range summary) */
  resultsHint?: string;
  /** Soft loading state while refetching (e.g. page change) */
  isFetching?: boolean;
}

export function DataTable<T>({
  columns,
  data,
  keyExtractor,
  page,
  totalPages,
  onPageChange,
  emptyTitle = "No data found",
  emptyDescription,
  onRowClick,
  resultsHint,
  isFetching,
}: DataTableProps<T>) {
  if (data.length === 0) {
    return <EmptyState title={emptyTitle} description={emptyDescription} />;
  }

  return (
    <div className={isFetching ? "opacity-60 transition-opacity duration-200" : "transition-opacity duration-200"}>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border">
              {columns.map((col) => (
                <th key={col.key} className={`text-left py-3 font-medium text-muted-foreground ${col.className || ""}`}>
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((item) => (
              <tr
                key={keyExtractor(item)}
                className={`border-b border-border/50 ${onRowClick ? "cursor-pointer hover:bg-muted/30" : ""}`}
                onClick={() => onRowClick?.(item)}
              >
                {columns.map((col) => (
                  <td key={col.key} className={`py-3 ${col.className || ""}`}>
                    {col.render(item)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {(resultsHint || (page !== undefined && totalPages !== undefined && totalPages > 1 && onPageChange)) && (
        <div className="mt-6 flex flex-col gap-4 border-t border-border/50 pt-4 sm:flex-row sm:items-center sm:justify-between">
          {resultsHint ? (
            <p className="text-xs text-muted-foreground tabular-nums">{resultsHint}</p>
          ) : (
            <span />
          )}
          {page !== undefined && totalPages !== undefined && totalPages > 1 && onPageChange && (
            <div className="flex items-center justify-center gap-2 sm:justify-end">
              <Button
                variant="outline"
                size="sm"
                disabled={page === 1 || isFetching}
                onClick={() => onPageChange(page - 1)}
                className="border-white/[0.08] rounded-xl"
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <span className="min-w-[7rem] text-center text-sm text-muted-foreground tabular-nums">
                Page {page} of {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                disabled={page === totalPages || isFetching}
                onClick={() => onPageChange(page + 1)}
                className="border-white/[0.08] rounded-xl"
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

