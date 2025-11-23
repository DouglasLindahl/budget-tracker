"use client";
import { useState } from "react";
import { Transaction } from "../page";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Label } from "./ui/label";
import { TrendingUp, TrendingDown, DollarSign, Settings } from "lucide-react";
import { Progress } from "./ui/progress";

interface BudgetOverviewProps {
  transactions: Transaction[];
  monthlyBudget: number;
  onBudgetChange: (budget: number) => void;
}

export function BudgetOverview({
  transactions,
  monthlyBudget,
  onBudgetChange,
}: BudgetOverviewProps) {
  const [budgetInput, setBudgetInput] = useState(monthlyBudget.toString());
  const [open, setOpen] = useState(false);

  // Calculate current month's data
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  const currentMonthTransactions = transactions.filter((t) => {
    const transactionDate = new Date(t.date);
    return (
      transactionDate.getMonth() === currentMonth &&
      transactionDate.getFullYear() === currentYear
    );
  });

  const totalIncome = currentMonthTransactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = currentMonthTransactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);

  const balance = totalIncome - totalExpenses;
  const budgetUsed = (totalExpenses / monthlyBudget) * 100;
  const remaining = monthlyBudget - totalExpenses;

  const handleSaveBudget = () => {
    const newBudget = Number(budgetInput);
    if (newBudget > 0) {
      onBudgetChange(newBudget);
      setOpen(false);
    }
  };

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card className="border-2 shadow-lg hover:shadow-xl transition-shadow bg-gradient-to-br from-white to-purple-50">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm text-slate-700">
            Total Balance
          </CardTitle>
          <div className="p-2 bg-gradient-to-br from-purple-400 to-pink-400 rounded-lg">
            <DollarSign className="size-4 text-white" />
          </div>
        </CardHeader>
        <CardContent>
          <div
            className={`text-3xl ${
              balance >= 0 ? "text-emerald-600" : "text-red-600"
            }`}
          >
            ${balance.toFixed(2)}
          </div>
          <p className="text-xs text-slate-600 mt-1">This month</p>
        </CardContent>
      </Card>

      <Card className="border-2 shadow-lg hover:shadow-xl transition-shadow bg-gradient-to-br from-white to-emerald-50">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm text-slate-700">Income</CardTitle>
          <div className="p-2 bg-gradient-to-br from-emerald-400 to-green-500 rounded-lg">
            <TrendingUp className="size-4 text-white" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-3xl text-emerald-600">
            ${totalIncome.toFixed(2)}
          </div>
          <p className="text-xs text-slate-600 mt-1">
            +
            {currentMonthTransactions.filter((t) => t.type === "income").length}{" "}
            transactions
          </p>
        </CardContent>
      </Card>

      <Card className="border-2 shadow-lg hover:shadow-xl transition-shadow bg-gradient-to-br from-white to-red-50">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm text-slate-700">Expenses</CardTitle>
          <div className="p-2 bg-gradient-to-br from-red-400 to-pink-500 rounded-lg">
            <TrendingDown className="size-4 text-white" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-3xl text-red-600">
            ${totalExpenses.toFixed(2)}
          </div>
          <p className="text-xs text-slate-600 mt-1">
            {
              currentMonthTransactions.filter((t) => t.type === "expense")
                .length
            }{" "}
            transactions
          </p>
        </CardContent>
      </Card>

      <Card className="border-2 shadow-lg hover:shadow-xl transition-shadow bg-gradient-to-br from-white to-blue-50">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm text-slate-700">
            Monthly Budget
          </CardTitle>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="size-8 p-0 hover:bg-blue-100 rounded-lg"
              >
                <Settings className="size-4 text-slate-600" />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Set Monthly Budget</DialogTitle>
                <DialogDescription>
                  Define your monthly spending limit
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="budget">Budget Amount</Label>
                  <Input
                    id="budget"
                    type="number"
                    value={budgetInput}
                    onChange={(e) => setBudgetInput(e.target.value)}
                    placeholder="Enter budget amount"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button
                  onClick={handleSaveBudget}
                  className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                >
                  Save Budget
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          <div className="text-3xl text-slate-900">${remaining.toFixed(0)}</div>
          <Progress value={Math.min(budgetUsed, 100)} className="mt-2 h-2" />
          <p className="text-xs text-slate-600 mt-1">
            {budgetUsed.toFixed(0)}% used{" "}
            {remaining < 0 ? "⚠️ Over budget!" : ""}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
