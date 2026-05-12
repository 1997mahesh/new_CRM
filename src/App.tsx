/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AppLayout } from "./components/AppLayout";
import { DashboardPage } from "./pages/Dashboard";
import { LoginPage } from "./pages/Login";
import SalesDashboard from "./pages/sales/SalesDashboard";
import LeadsPage from "./pages/sales/Leads";
import PipelinePage from "./pages/sales/Pipeline";
import { LeadCreatePage } from "./pages/sales/LeadCreate";
import { LeadEditPage } from "./pages/sales/LeadEdit";
import QuotationsPage from "./pages/sales/Quotations";
import { QuotationCreatePage } from "./pages/sales/QuotationCreate";
import { QuotationViewPage } from "./pages/sales/QuotationView";
import OrdersPage from "./pages/sales/Orders";
import InvoicesPage from "./pages/sales/Invoices";
import { InvoiceCreatePage } from "./pages/sales/InvoiceCreate";
import PaymentsPage from "./pages/sales/Payments";
import SalesForecastingPage from "./pages/sales/Forecast";
import PurchaseDashboard from "./pages/purchase/PurchaseDashboard";
import VendorsPage from "./pages/purchase/Vendors";
import PurchaseOrdersPage from "./pages/purchase/PurchaseOrders";
import BillsPage from "./pages/purchase/Bills";
import InventoryDashboard from "./pages/inventory/InventoryDashboard";
import InvProductsPage from "./pages/inventory/Products";
import InvCategoriesPage from "./pages/inventory/Categories";
import StockPage from "./pages/inventory/Stock";
import SupportDashboard from "./pages/support/SupportDashboard";
import TicketsPage from "./pages/support/Tickets";
import { TicketCreatePage } from "./pages/support/TicketCreate";
import SupportCategoriesPage from "./pages/support/SupportCategories";
import CRMDashboard from "./pages/crm/CRMDashboard";
import CRM_Todos from "./pages/crm/Todos";
import TodoGroups from "./pages/crm/TodoGroups";
import UsersPage from "./pages/crm/Users";
import DepartmentsPage from "./pages/crm/Departments";
import CRMCustomers from "./pages/crm/Customers";
import ContactsPage from "./pages/crm/Contacts";

// Finance Module
import FinanceDashboard from "./pages/finance/FinanceDashboard";
import ExpensesPage from "./pages/finance/Expenses";
import LedgerPage from "./pages/finance/Ledger";
import ExpenseCategoriesPage from "./pages/finance/ExpenseCategories";

// Reports Module
import SalesReport from "./pages/reports/SalesReport";
import PurchaseReport from "./pages/reports/PurchaseReport";
import StockReport from "./pages/reports/StockReport";
import FinanceReport from "./pages/reports/FinanceReport";

// System Module
import RolesPage from "./pages/system/Roles";
import PermissionsPage from "./pages/system/Permissions";
import DocumentationPage from "./pages/system/Documentation";
import GeneralSettings from "./pages/system/settings/General";
import EmailSettings from "./pages/system/settings/Email";
import ModuleManager from "./pages/system/settings/Modules";
import CurrenciesPage from "./pages/system/settings/Currencies";
import TaxRatesPage from "./pages/system/settings/TaxRates";
import EmailTemplatesPage from "./pages/system/settings/EmailTemplates";
import NumberSeriesPage from "./pages/system/settings/NumberSeries";
import AuditLogPage from "./pages/system/settings/AuditLog";
import SystemInfoPage from "./pages/system/settings/SystemInfo";

import { Toaster } from "@/components/ui/sonner";
import { AuthProvider } from "./lib/AuthContext";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
      <Routes>
        {/* Auth Routes */}
        <Route path="/login" element={<LoginPage />} />

        {/* Protected App Routes */}
        <Route element={<AppLayout />}>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          
          {/* CRM Module */}
          <Route path="/crm/dashboard" element={<CRMDashboard />} />
          <Route path="/crm/todos" element={<CRM_Todos />} />
          <Route path="/crm/todo-groups" element={<TodoGroups />} />
          <Route path="/crm/users" element={<UsersPage />} />
          <Route path="/crm/departments" element={<DepartmentsPage />} />
          <Route path="/crm/customers" element={<CRMCustomers />} />
          <Route path="/crm/contacts" element={<ContactsPage />} />

          {/* Sales Module */}
          <Route path="/sales/dashboard" element={<SalesDashboard />} />
          <Route path="/sales/leads" element={<LeadsPage />} />
          <Route path="/sales/leads/new" element={<LeadCreatePage />} />
          <Route path="/sales/leads/:id/edit" element={<LeadEditPage />} />
          <Route path="/sales/pipeline" element={<PipelinePage />} />
          <Route path="/sales/forecast" element={<SalesForecastingPage />} />
          <Route path="/sales/quotations" element={<QuotationsPage />} />
          <Route path="/sales/quotations/new" element={<QuotationCreatePage />} />
          <Route path="/sales/quotations/:id" element={<QuotationViewPage />} />
          <Route path="/sales/quotations/:id/edit" element={<QuotationCreatePage />} />
          <Route path="/sales/orders" element={<OrdersPage />} />
          <Route path="/sales/invoices" element={<InvoicesPage />} />
          <Route path="/sales/invoices/new" element={<InvoiceCreatePage />} />
          <Route path="/sales/payments" element={<PaymentsPage />} />

          {/* Purchase Module */}
          <Route path="/purchase/dashboard" element={<PurchaseDashboard />} />
          <Route path="/purchase/vendors" element={<VendorsPage />} />
          <Route path="/purchase/orders" element={<PurchaseOrdersPage />} />
          <Route path="/purchase/bills" element={<BillsPage />} />

          {/* Inventory Module */}
          <Route path="/inventory/dashboard" element={<InventoryDashboard />} />
          <Route path="/inventory/products" element={<InvProductsPage />} />
          <Route path="/inventory/categories" element={<InvCategoriesPage />} />
          <Route path="/inventory/stock" element={<StockPage />} />

          {/* Support Module */}
          <Route path="/support/dashboard" element={<SupportDashboard />} />
          <Route path="/support/tickets" element={<TicketsPage />} />
          <Route path="/support/tickets/new" element={<TicketCreatePage />} />
          <Route path="/support/categories" element={<SupportCategoriesPage />} />

          {/* Finance Module */}
          <Route path="/finance/dashboard" element={<FinanceDashboard />} />
          <Route path="/finance/expenses" element={<ExpensesPage />} />
          <Route path="/finance/ledger" element={<LedgerPage />} />
          <Route path="/finance/categories" element={<ExpenseCategoriesPage />} />

          {/* Reports Module */}
          <Route path="/reports/sales" element={<SalesReport />} />
          <Route path="/sales/reports/revenue" element={<SalesReport />} />
          <Route path="/reports/purchase" element={<PurchaseReport />} />
          <Route path="/reports/stock" element={<StockReport />} />
          <Route path="/reports/finance" element={<FinanceReport />} />

          {/* System Module */}
          <Route path="/system/roles" element={<RolesPage />} />
          <Route path="/system/permissions" element={<PermissionsPage />} />
          <Route path="/system/docs" element={<DocumentationPage />} />
          
          {/* Settings Sub-routes */}
          <Route path="/system/settings" element={<Navigate to="/system/settings/general" replace />} />
          <Route path="/system/settings/general" element={<GeneralSettings />} />
          <Route path="/system/settings/email" element={<EmailSettings />} />
          <Route path="/system/settings/modules" element={<ModuleManager />} />
          <Route path="/system/settings/currencies" element={<CurrenciesPage />} />
          <Route path="/system/settings/tax-rates" element={<TaxRatesPage />} />
          <Route path="/system/settings/templates" element={<EmailTemplatesPage />} />
          <Route path="/system/settings/number-series" element={<NumberSeriesPage />} />
          <Route path="/system/settings/audit-log" element={<AuditLogPage />} />
          <Route path="/system/settings/system-info" element={<SystemInfoPage />} />

          <Route path="*" element={<PlaceholderPage title="Module Coming Soon" />} />
        </Route>
      </Routes>
      <Toaster position="top-right" />
    </BrowserRouter>
    </AuthProvider>
  );
}

function PlaceholderPage({ title }: { title: string }) {
  return (
    <div className="flex flex-col items-center justify-center h-full text-slate-400 space-y-4">
      <div className="p-4 bg-slate-100 rounded-full">
        <ShieldCheck className="h-10 w-10 text-slate-300" />
      </div>
      <h1 className="text-2xl font-bold text-slate-600">{title}</h1>
      <p>This module is currently under active development.</p>
    </div>
  );
}

import { ShieldCheck } from "lucide-react";

