"use client";
import { useState } from "react";
import { RecurringTransaction } from "../page";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Textarea } from "./ui/textarea";

interface RecurringTransactionFormProps {
  onSubmit: (transaction: Omit<RecurringTransaction, "id">) => void;
}

const EXPENSE_CATEGORIES = [
  "Food & Dining",
  "Transportation",
  "Shopping",
  "Entertainment",
  "Bills & Utilities",
  "Healthcare",
  "Education",
  "Travel",
  "Other",
];

const INCOME_CATEGORIES = [
  "Salary",
  "Freelance",
  "Investment",
  "Gift",
  "Other",
];

export function RecurringTransactionForm({
  onSubmit,
}: RecurringTransactionFormProps) {
  const [type, setType] = useState<"income" | "expense">("expense");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [frequency, setFrequency] = useState<
    "daily" | "weekly" | "monthly" | "yearly"
  >("monthly");
  const [startDate, setStartDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!amount || !category || !startDate) return;

    onSubmit({
      type,
      amount: Number(amount),
      category,
      description,
      frequency,
      startDate,
      isActive: true,
    });

    // Reset form
    setAmount("");
    setCategory("");
    setDescription("");
    setFrequency("monthly");
    setStartDate(new Date().toISOString().split("T")[0]);
  };

  const categories =
    type === "expense" ? EXPENSE_CATEGORIES : INCOME_CATEGORIES;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="type">Type</Label>
          <Select
            value={type}
            onValueChange={(value: "income" | "expense") => {
              setType(value);
              setCategory("");
            }}
          >
            <SelectTrigger id="type">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="expense">💸 Expense</SelectItem>
              <SelectItem value="income">💰 Income</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="amount">Amount</Label>
          <Input
            id="amount"
            type="number"
            step="0.01"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.00"
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="category">Category</Label>
          <Select value={category} onValueChange={setCategory} required>
            <SelectTrigger id="category">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((cat) => (
                <SelectItem key={cat} value={cat}>
                  {cat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="frequency">Frequency</Label>
          <Select
            value={frequency}
            onValueChange={(value: any) => setFrequency(value)}
          >
            <SelectTrigger id="frequency">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="daily">📅 Daily</SelectItem>
              <SelectItem value="weekly">📆 Weekly</SelectItem>
              <SelectItem value="monthly">🗓️ Monthly</SelectItem>
              <SelectItem value="yearly">📋 Yearly</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="startDate">Start Date</Label>
        <Input
          id="startDate"
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description (Optional)</Label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Add notes about this recurring transaction..."
          rows={2}
        />
      </div>

      <Button
        type="submit"
        className="w-full bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600"
      >
        Add Recurring Transaction
      </Button>
    </form>
  );
}
