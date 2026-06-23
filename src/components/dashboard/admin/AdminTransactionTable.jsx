"use client";
import { useState } from "react";
import { Magnifier } from "@gravity-ui/icons";

export default function AdminTransactionTable({ transactions }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("All");

  const filteredTransactions = transactions.filter((txn) => {
    const matchesSearch = 
      txn.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      txn.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (txn.artwork && txn.artwork.toLowerCase().includes(searchQuery.toLowerCase()));
    
    if (filterType === "All") return matchesSearch;
    return matchesSearch && txn.type === filterType;
  });

  return (
    <section className="glass-card rounded-xl shadow-sm overflow-hidden mb-xl">
      <div className="p-lg border-b border-surface-variant flex flex-col gap-md">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-md">
          <div>
            <h4 className="font-h3 text-h3 text-on-surface">View All Transactions</h4>
            <p className="text-body-small text-on-surface-variant">
              Comprehensive log of purchases and active membership subscriptions.
            </p>
          </div>
          <div className="relative w-full md:w-64">
            <Magnifier className="absolute left-sm top-1/2 -translate-y-1/2 text-outline" />
            <input
              className="w-full pl-lg pr-md py-sm rounded-lg border border-outline-variant bg-surface-bright focus:ring-2 focus:ring-primary outline-none text-body-small"
              placeholder="Search by ID, email or item..."
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Transaction Type Filters */}
        <div className="flex border-b border-outline-variant/20 -mb-lg pb-1 gap-sm">
          {["All", "Purchase", "Subscription"].map((type) => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={`px-sm py-xs font-semibold text-body-small transition-all border-b-2 cursor-pointer ${
                filterType === type 
                  ? "border-primary text-primary" 
                  : "border-transparent text-outline hover:text-on-surface-variant"
              }`}
            >
              {type}s
            </button>
          ))}
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead className="bg-surface-container-low border-b border-outline-variant/30">
            <tr>
              <th className="px-lg py-md font-label-caps text-label-caps text-outline">
                Transaction ID
              </th>
              <th className="px-lg py-md font-label-caps text-label-caps text-outline">
                Type
              </th>
              <th className="px-lg py-md font-label-caps text-label-caps text-outline">
                User / Artist Email
              </th>
              <th className="px-lg py-md font-label-caps text-label-caps text-outline">
                Item
              </th>
              <th className="px-lg py-md font-label-caps text-label-caps text-outline">
                Date
              </th>
              <th className="px-lg py-md font-label-caps text-label-caps text-outline text-right">
                Amount
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-outline-variant/20">
            {filteredTransactions.length > 0 ? (
              filteredTransactions.map((txn) => (
                <tr
                  key={txn.id}
                  className="hover:bg-surface-container-low/50 transition-colors"
                >
                  <td className="px-lg py-md font-bold text-on-surface">
                    {txn.id}
                  </td>
                  <td className="px-lg py-md">
                    <span
                      className={`inline-flex items-center px-sm py-xs rounded-full text-xs font-bold ${
                        txn.type === "Purchase"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-purple-100 text-purple-800"
                      }`}
                    >
                      {txn.type}
                    </span>
                  </td>
                  <td className="px-lg py-md font-body-large text-on-surface-variant">
                    {txn.email}
                  </td>
                  <td className="px-lg py-md font-body-large text-on-surface-variant">
                    {txn.artwork || "N/A"}
                  </td>
                  <td className="px-lg py-md font-body-large text-on-surface-variant">
                    {txn.date}
                  </td>
                  <td className="px-lg py-md font-h3 text-h3 text-primary text-right">
                    {txn.amount}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center py-lg text-on-surface-variant font-body-large">
                  No transactions found matching filter and search.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <div className="p-md bg-surface-container-low border-t border-surface-variant flex justify-between items-center">
        <span className="text-body-small text-on-surface-variant">
          Showing 1-{filteredTransactions.length} of {filteredTransactions.length} transactions
        </span>
      </div>
    </section>
  );
}
