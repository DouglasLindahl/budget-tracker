"use client";
import { useState, useEffect } from "react";
import { TransactionForm } from "./components/TransactionForm";
import { TransactionList } from "./components/TransactionList";
import { RecurringTransactionForm } from "./components/RecurringTransactionForm";
import { RecurringTransactionList } from "./components/RecurringTransactionList";
import { StatisticsPanel } from "./components/StatisticsPanel";
import { BudgetOverview } from "./components/BudgetOverview";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./components/ui/tabs";
import { Wallet } from "lucide-react";

export interface Transaction {
  id: string;
  type: "income" | "expense";
  amount: number;
  category: string;
  description: string;
  date: string;
  isRecurring?: boolean;
  recurringFrequency?: "daily" | "weekly" | "monthly" | "yearly";
}

export interface RecurringTransaction {
  id: string;
  type: "income" | "expense";
  amount: number;
  category: string;
  description: string;
  frequency: "daily" | "weekly" | "monthly" | "yearly";
  startDate: string;
  isActive: boolean;
}

export default function App() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [recurringTransactions, setRecurringTransactions] = useState<
    RecurringTransaction[]
  >([]);
  const [monthlyBudget, setMonthlyBudget] = useState(3000);

  // Load data from localStorage
  useEffect(() => {
    const savedTransactions = localStorage.getItem("transactions");
    const savedBudget = localStorage.getItem("monthlyBudget");
    const savedRecurring = localStorage.getItem("recurringTransactions");

    if (savedTransactions) {
      setTransactions(JSON.parse(savedTransactions));
    }
    if (savedBudget) {
      setMonthlyBudget(Number(savedBudget));
    }
    if (savedRecurring) {
      setRecurringTransactions(JSON.parse(savedRecurring));
    }
  }, []);

  // Save transactions to localStorage
  useEffect(() => {
    localStorage.setItem("transactions", JSON.stringify(transactions));
  }, [transactions]);

  // Save recurring transactions to localStorage
  useEffect(() => {
    localStorage.setItem(
      "recurringTransactions",
      JSON.stringify(recurringTransactions)
    );
  }, [recurringTransactions]);

  const addTransaction = (transaction: Omit<Transaction, "id">) => {
    const newTransaction: Transaction = {
      ...transaction,
      id: Date.now().toString(),
    };
    setTransactions([newTransaction, ...transactions]);
  };

  const deleteTransaction = (id: string) => {
    setTransactions(transactions.filter((t) => t.id !== id));
  };

  const addRecurringTransaction = (
    transaction: Omit<RecurringTransaction, "id">
  ) => {
    const newRecurring: RecurringTransaction = {
      ...transaction,
      id: Date.now().toString(),
    };
    setRecurringTransactions([...recurringTransactions, newRecurring]);
  };

  const toggleRecurringTransaction = (id: string) => {
    setRecurringTransactions(
      recurringTransactions.map((rt) =>
        rt.id === id ? { ...rt, isActive: !rt.isActive } : rt
      )
    );
  };

  const deleteRecurringTransaction = (id: string) => {
    setRecurringTransactions(
      recurringTransactions.filter((rt) => rt.id !== id)
    );
  };

  const updateBudget = (budget: number) => {
    setMonthlyBudget(budget);
    localStorage.setItem("monthlyBudget", budget.toString());
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      <div className="container mx-auto p-4 md:p-8 max-w-7xl">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl shadow-lg">
            <Wallet className="size-8 text-white" />
          </div>
          <div>
            <h1 className="text-slate-900 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Budget Tracker
            </h1>
            <p className="text-slate-600">✨ Manage your finances with style</p>
          </div>
        </div>

        {/* Budget Overview */}
        <BudgetOverview
          transactions={transactions}
          monthlyBudget={monthlyBudget}
          onBudgetChange={updateBudget}
        />

        {/* Main Content */}
        <Tabs defaultValue="transactions" className="mt-8">
          <TabsList className="grid w-full grid-cols-3 max-w-2xl">
            <TabsTrigger value="transactions">💰 Transactions</TabsTrigger>
            <TabsTrigger value="recurring">🔄 Recurring</TabsTrigger>
            <TabsTrigger value="statistics">📊 Statistics</TabsTrigger>
          </TabsList>

          <TabsContent value="transactions" className="space-y-6 mt-6">
            <Card className="border-2 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50">
                <CardTitle>Add Transaction</CardTitle>
                <CardDescription>
                  Record your income or expenses
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <TransactionForm onSubmit={addTransaction} />
              </CardContent>
            </Card>

            <Card className="border-2 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-cyan-50">
                <CardTitle>Recent Transactions</CardTitle>
                <CardDescription>Your transaction history</CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <TransactionList
                  transactions={transactions}
                  onDelete={deleteTransaction}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="recurring" className="space-y-6 mt-6">
            <Card className="border-2 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-orange-50 to-yellow-50">
                <CardTitle>Add Recurring Transaction</CardTitle>
                <CardDescription>
                  Set up automatic recurring income or expenses
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <RecurringTransactionForm onSubmit={addRecurringTransaction} />
              </CardContent>
            </Card>

            <Card className="border-2 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50">
                <CardTitle>Active Recurring Transactions</CardTitle>
                <CardDescription>
                  Manage your recurring transactions
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <RecurringTransactionList
                  recurringTransactions={recurringTransactions}
                  onToggle={toggleRecurringTransaction}
                  onDelete={deleteRecurringTransaction}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="statistics" className="mt-6">
            <StatisticsPanel
              transactions={transactions}
              recurringTransactions={recurringTransactions}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
