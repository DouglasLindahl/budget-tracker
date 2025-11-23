"use client";
import { Transaction } from "../page";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  AreaChart,
  Area,
} from "recharts";
import { TrendingUp, TrendingDown, Calendar, Target } from "lucide-react";

interface StatisticsPanelProps {
  transactions: Transaction[];
  recurringTransactions: Transaction[];
}

const COLORS = [
  "#a855f7",
  "#ec4899",
  "#f59e0b",
  "#10b981",
  "#3b82f6",
  "#ef4444",
  "#8b5cf6",
  "#14b8a6",
];

export function StatisticsPanel({
  transactions,
  recurringTransactions,
}: StatisticsPanelProps) {
  // Calculate spending by category
  const expensesByCategory = transactions
    .filter((t) => t.type === "expense")
    .reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + t.amount;
      return acc;
    }, {} as Record<string, number>);

  const categoryData = Object.entries(expensesByCategory).map(
    ([name, value]) => ({
      name,
      value: Number(value.toFixed(2)),
    })
  );

  // Calculate income by category
  const incomeByCategory = transactions
    .filter((t) => t.type === "income")
    .reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + t.amount;
      return acc;
    }, {} as Record<string, number>);

  const incomeCategoryData = Object.entries(incomeByCategory).map(
    ([name, value]) => ({
      name,
      value: Number(value.toFixed(2)),
    })
  );

  // Calculate monthly trend (last 6 months)
  const getMonthlyTrend = () => {
    const monthlyData: Record<
      string,
      { income: number; expenses: number; month: string }
    > = {};

    transactions.forEach((t) => {
      const date = new Date(t.date);
      const monthKey = `${date.getFullYear()}-${String(
        date.getMonth() + 1
      ).padStart(2, "0")}`;
      const monthLabel = date.toLocaleDateString("en-US", {
        month: "short",
        year: "numeric",
      });

      if (!monthlyData[monthKey]) {
        monthlyData[monthKey] = { income: 0, expenses: 0, month: monthLabel };
      }

      if (t.type === "income") {
        monthlyData[monthKey].income += t.amount;
      } else {
        monthlyData[monthKey].expenses += t.amount;
      }
    });

    return Object.entries(monthlyData)
      .sort(([a], [b]) => a.localeCompare(b))
      .slice(-6)
      .map(([_, data]) => ({
        ...data,
        income: Number(data.income.toFixed(2)),
        expenses: Number(data.expenses.toFixed(2)),
      }));
  };

  const monthlyTrendData = getMonthlyTrend();

  // Calculate comparison data
  const totalIncome = transactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = transactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);

  const comparisonData = [
    { name: "Income", amount: Number(totalIncome.toFixed(2)) },
    { name: "Expenses", amount: Number(totalExpenses.toFixed(2)) },
  ];

  // Calculate average transaction by type
  const incomeTransactions = transactions.filter((t) => t.type === "income");
  const expenseTransactions = transactions.filter((t) => t.type === "expense");

  const avgIncome =
    incomeTransactions.length > 0 ? totalIncome / incomeTransactions.length : 0;
  const avgExpense =
    expenseTransactions.length > 0
      ? totalExpenses / expenseTransactions.length
      : 0;

  // Calculate daily spending average (last 30 days)
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const recentExpenses = transactions.filter(
    (t) => t.type === "expense" && new Date(t.date) >= thirtyDaysAgo
  );

  const dailyAverage =
    recentExpenses.length > 0
      ? recentExpenses.reduce((sum, t) => sum + t.amount, 0) / 30
      : 0;

  // Calculate projected monthly recurring costs
  const projectedMonthlyRecurring = recurringTransactions
    .filter((rt) => rt.isActive)
    .reduce((sum, rt) => {
      let monthlyAmount = rt.amount;
      switch (rt.frequency) {
        case "daily":
          monthlyAmount = rt.amount * 30;
          break;
        case "weekly":
          monthlyAmount = rt.amount * 4.33;
          break;
        case "yearly":
          monthlyAmount = rt.amount / 12;
          break;
      }
      return sum + (rt.type === "expense" ? monthlyAmount : -monthlyAmount);
    }, 0);

  // Top spending categories
  const topCategories = Object.entries(expensesByCategory)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)
    .map(([name, value]) => ({
      name,
      value: Number(value.toFixed(2)),
    }));

  // Spending pattern by day of week
  const dayOfWeekData = Array(7)
    .fill(0)
    .map((_, i) => ({
      day: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][i],
      amount: 0,
    }));

  expenseTransactions.forEach((t) => {
    const day = new Date(t.date).getDay();
    dayOfWeekData[day].amount += t.amount;
  });

  dayOfWeekData.forEach((d) => {
    d.amount = Number(d.amount.toFixed(2));
  });

  if (transactions.length === 0) {
    return (
      <Card className="border-2 shadow-lg">
        <CardContent className="py-12">
          <div className="text-center text-slate-500">
            No data to display. Add some transactions to see statistics! 📊
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-2 shadow-lg bg-gradient-to-br from-purple-50 to-pink-50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm text-slate-700">
              Avg. Income
            </CardTitle>
            <TrendingUp className="size-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl text-purple-600">
              ${avgIncome.toFixed(2)}
            </div>
            <p className="text-xs text-slate-600 mt-1">per transaction</p>
          </CardContent>
        </Card>

        <Card className="border-2 shadow-lg bg-gradient-to-br from-red-50 to-orange-50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm text-slate-700">
              Avg. Expense
            </CardTitle>
            <TrendingDown className="size-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl text-red-600">
              ${avgExpense.toFixed(2)}
            </div>
            <p className="text-xs text-slate-600 mt-1">per transaction</p>
          </CardContent>
        </Card>

        <Card className="border-2 shadow-lg bg-gradient-to-br from-blue-50 to-cyan-50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm text-slate-700">
              Daily Average
            </CardTitle>
            <Calendar className="size-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl text-blue-600">
              ${dailyAverage.toFixed(2)}
            </div>
            <p className="text-xs text-slate-600 mt-1">last 30 days</p>
          </CardContent>
        </Card>

        <Card className="border-2 shadow-lg bg-gradient-to-br from-orange-50 to-yellow-50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm text-slate-700">
              Recurring/Month
            </CardTitle>
            <Target className="size-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl text-orange-600">
              ${projectedMonthlyRecurring.toFixed(2)}
            </div>
            <p className="text-xs text-slate-600 mt-1">projected costs</p>
          </CardContent>
        </Card>
      </div>

      {/* Income vs Expenses */}
      <Card className="border-2 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-purple-50 to-blue-50">
          <CardTitle>💰 Income vs Expenses</CardTitle>
          <CardDescription>Overall comparison</CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={comparisonData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="name" stroke="#64748b" />
              <YAxis stroke="#64748b" />
              <Tooltip
                formatter={(value) => `$${value}`}
                contentStyle={{
                  borderRadius: "8px",
                  border: "2px solid #e2e8f0",
                }}
              />
              <Bar
                dataKey="amount"
                fill="url(#colorGradient)"
                radius={[8, 8, 0, 0]}
              />
              <defs>
                <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#a855f7" />
                  <stop offset="100%" stopColor="#ec4899" />
                </linearGradient>
              </defs>
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Monthly Trend */}
      {monthlyTrendData.length > 0 && (
        <Card className="border-2 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50">
            <CardTitle>📈 Monthly Trend</CardTitle>
            <CardDescription>Income and expenses over time</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={monthlyTrendData}>
                <defs>
                  <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.1} />
                  </linearGradient>
                  <linearGradient
                    id="colorExpenses"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0.1} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="month" stroke="#64748b" />
                <YAxis stroke="#64748b" />
                <Tooltip
                  formatter={(value) => `$${value}`}
                  contentStyle={{
                    borderRadius: "8px",
                    border: "2px solid #e2e8f0",
                  }}
                />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="income"
                  stroke="#10b981"
                  fillOpacity={1}
                  fill="url(#colorIncome)"
                  strokeWidth={2}
                  name="Income"
                />
                <Area
                  type="monotone"
                  dataKey="expenses"
                  stroke="#ef4444"
                  fillOpacity={1}
                  fill="url(#colorExpenses)"
                  strokeWidth={2}
                  name="Expenses"
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-6 md:grid-cols-2">
        {/* Top Spending Categories */}
        {topCategories.length > 0 && (
          <Card className="border-2 shadow-lg">
            <CardHeader className="bg-gradient-to-r from-pink-50 to-rose-50">
              <CardTitle>🏆 Top Spending Categories</CardTitle>
              <CardDescription>Where your money goes</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={topCategories} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis type="number" stroke="#64748b" />
                  <YAxis
                    dataKey="name"
                    type="category"
                    width={100}
                    stroke="#64748b"
                  />
                  <Tooltip
                    formatter={(value) => `$${value}`}
                    contentStyle={{
                      borderRadius: "8px",
                      border: "2px solid #e2e8f0",
                    }}
                  />
                  <Bar dataKey="value" fill="#ec4899" radius={[0, 8, 8, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        )}

        {/* Spending by Day of Week */}
        <Card className="border-2 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50">
            <CardTitle>📅 Spending by Day</CardTitle>
            <CardDescription>Weekly spending patterns</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={dayOfWeekData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="day" stroke="#64748b" />
                <YAxis stroke="#64748b" />
                <Tooltip
                  formatter={(value) => `$${value}`}
                  contentStyle={{
                    borderRadius: "8px",
                    border: "2px solid #e2e8f0",
                  }}
                />
                <Bar dataKey="amount" fill="#3b82f6" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Expenses by Category Pie */}
        {categoryData.length > 0 && (
          <Card className="border-2 shadow-lg">
            <CardHeader className="bg-gradient-to-r from-orange-50 to-amber-50">
              <CardTitle>🥧 Expenses Distribution</CardTitle>
              <CardDescription>Breakdown of spending</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) =>
                      `${name} (${(percent * 100).toFixed(0)}%)`
                    }
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {categoryData.map((_, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value) => `$${value}`}
                    contentStyle={{
                      borderRadius: "8px",
                      border: "2px solid #e2e8f0",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        )}

        {/* Income by Category */}
        {incomeCategoryData.length > 0 && (
          <Card className="border-2 shadow-lg">
            <CardHeader className="bg-gradient-to-r from-emerald-50 to-teal-50">
              <CardTitle>💵 Income Sources</CardTitle>
              <CardDescription>Where income comes from</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={incomeCategoryData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="name" stroke="#64748b" />
                  <YAxis stroke="#64748b" />
                  <Tooltip
                    formatter={(value) => `$${value}`}
                    contentStyle={{
                      borderRadius: "8px",
                      border: "2px solid #e2e8f0",
                    }}
                  />
                  <Bar dataKey="value" fill="#10b981" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
