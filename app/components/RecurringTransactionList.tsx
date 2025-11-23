"use client";
import { RecurringTransaction } from "../page";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Switch } from "./ui/switch";
import { Trash2, Repeat } from "lucide-react";

interface RecurringTransactionListProps {
  recurringTransactions: RecurringTransaction[];
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

export function RecurringTransactionList({
  recurringTransactions,
  onToggle,
  onDelete,
}: RecurringTransactionListProps) {
  if (recurringTransactions.length === 0) {
    return (
      <div className="text-center py-12 text-slate-500">
        No recurring transactions yet. Add one above to automate your budget
        tracking! 🔄
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getFrequencyEmoji = (frequency: string) => {
    switch (frequency) {
      case "daily":
        return "📅";
      case "weekly":
        return "📆";
      case "monthly":
        return "🗓️";
      case "yearly":
        return "📋";
      default:
        return "🔄";
    }
  };

  return (
    <div className="space-y-3">
      {recurringTransactions.map((transaction) => (
        <div
          key={transaction.id}
          className={`flex items-center justify-between p-4 border-2 rounded-xl transition-all ${
            transaction.isActive
              ? "bg-gradient-to-r from-white to-green-50 border-green-200 hover:border-green-300 hover:shadow-md"
              : "bg-gradient-to-r from-white to-slate-50 border-slate-200 opacity-60"
          }`}
        >
          <div className="flex items-center gap-4 flex-1">
            <div
              className={`p-3 rounded-xl shadow-sm ${
                transaction.type === "income"
                  ? "bg-gradient-to-br from-blue-400 to-cyan-500"
                  : "bg-gradient-to-br from-orange-400 to-yellow-500"
              }`}
            >
              <Repeat className="size-5 text-white" />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-slate-900">{transaction.category}</span>
                <Badge
                  variant="outline"
                  className={`text-xs ${
                    transaction.type === "income"
                      ? "border-blue-300 text-blue-700 bg-blue-50"
                      : "border-orange-300 text-orange-700 bg-orange-50"
                  }`}
                >
                  {transaction.type}
                </Badge>
                <Badge
                  variant="outline"
                  className="text-xs border-purple-300 text-purple-700 bg-purple-50"
                >
                  {getFrequencyEmoji(transaction.frequency)}{" "}
                  {transaction.frequency}
                </Badge>
              </div>
              {transaction.description && (
                <p className="text-sm text-slate-600 truncate">
                  {transaction.description}
                </p>
              )}
              <p className="text-xs text-slate-500 mt-1">
                Started: {formatDate(transaction.startDate)}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <span
              className={`text-xl ${
                transaction.type === "income"
                  ? "text-blue-600"
                  : "text-orange-600"
              }`}
            >
              {transaction.type === "income" ? "+" : "-"}$
              {transaction.amount.toFixed(2)}
            </span>

            <div className="flex items-center gap-2">
              <Switch
                checked={transaction.isActive}
                onCheckedChange={() => onToggle(transaction.id)}
              />
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onDelete(transaction.id)}
                className="text-slate-400 hover:text-red-600 hover:bg-red-50"
              >
                <Trash2 className="size-4" />
              </Button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
