"use client";
import { Transaction } from "../page";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Trash2, TrendingUp, TrendingDown } from "lucide-react";

interface TransactionListProps {
  transactions: Transaction[];
  onDelete: (id: string) => void;
}

export function TransactionList({
  transactions,
  onDelete,
}: TransactionListProps) {
  if (transactions.length === 0) {
    return (
      <div className="text-center py-12 text-slate-500">
        No transactions yet. Add your first transaction above!
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

  return (
    <div className="space-y-3">
      {transactions.map((transaction) => (
        <div
          key={transaction.id}
          className="flex items-center justify-between p-4 bg-gradient-to-r from-white to-slate-50 border-2 border-slate-200 rounded-xl hover:border-purple-300 hover:shadow-md transition-all"
        >
          <div className="flex items-center gap-4 flex-1">
            <div
              className={`p-3 rounded-xl shadow-sm ${
                transaction.type === "income"
                  ? "bg-gradient-to-br from-emerald-400 to-green-500"
                  : "bg-gradient-to-br from-red-400 to-pink-500"
              }`}
            >
              {transaction.type === "income" ? (
                <TrendingUp className="size-5 text-white" />
              ) : (
                <TrendingDown className="size-5 text-white" />
              )}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-slate-900">{transaction.category}</span>
                <Badge
                  variant="outline"
                  className={`text-xs ${
                    transaction.type === "income"
                      ? "border-emerald-300 text-emerald-700 bg-emerald-50"
                      : "border-red-300 text-red-700 bg-red-50"
                  }`}
                >
                  {transaction.type}
                </Badge>
                {transaction.isRecurring && (
                  <Badge
                    variant="outline"
                    className="text-xs border-purple-300 text-purple-700 bg-purple-50"
                  >
                    🔄 recurring
                  </Badge>
                )}
              </div>
              {transaction.description && (
                <p className="text-sm text-slate-600 truncate">
                  {transaction.description}
                </p>
              )}
              <p className="text-xs text-slate-500 mt-1">
                {formatDate(transaction.date)}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <span
              className={`text-xl ${
                transaction.type === "income"
                  ? "text-emerald-600"
                  : "text-red-600"
              }`}
            >
              {transaction.type === "income" ? "+" : "-"}$
              {transaction.amount.toFixed(2)}
            </span>

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
      ))}
    </div>
  );
}
