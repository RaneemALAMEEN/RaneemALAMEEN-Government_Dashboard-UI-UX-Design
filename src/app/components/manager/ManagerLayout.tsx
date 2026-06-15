import { useState } from 'react';
import { ManagerSidebar } from './ManagerSidebar';
import { ManagerHeader } from './ManagerHeader';
import { ManagerDashboard } from './ManagerDashboard';
import { ManagerTransactions } from './ManagerTransactions';
import { TransactionDetails } from './TransactionDetails';
import { ManagerEmployees } from './ManagerEmployees';
import { EmployeeDetails } from './EmployeeDetails';
import { ManagerComplaints } from './ManagerComplaints';
import { TransactionCenter } from './TransactionCenter';
import { TransactionTypeSelector } from './TransactionTypeSelector';
import { TransactionForm } from './TransactionForm';
import { TransactionDetailView } from './TransactionDetailView';
import { TransactionTracking } from './TransactionTracking';
import { MyDrafts } from './MyDrafts';
import { MyTransactions } from './MyTransactions';
import { DepartmentTransactionsPage } from './DepartmentTransactionsPage';
import { WorkflowManagement } from './WorkflowManagement';

interface Employee {
  id: number;
  name: string;
  role: string;
  dept: string;
  active: number;
  completed: number;
  pending: number;
  load: number;
  status: string;
}

interface ManagerLayoutProps {
  onExit: () => void;
}

export function ManagerLayout({ onExit }: ManagerLayoutProps) {
  const [currentPage, setCurrentPage] = useState('manager-dashboard');

  // Manager Transactions (the old page)
  const [detailsId, setDetailsId] = useState<string | null>(null);
  const [autoReceive, setAutoReceive] = useState(false);
  // Employee details
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  // Transaction Center — form flow
  const [formTypeId, setFormTypeId] = useState<string | null>(null);
  const [formTxId, setFormTxId] = useState<string | undefined>(undefined);
  // Transaction Center — detail view
  const [viewTxId, setViewTxId] = useState<string | null>(null);

  // ── Navigation helpers ────────────────────────────────────────────────────

  const goTo = (page: string) => {
    setDetailsId(null);
    setAutoReceive(false);
    setSelectedEmployee(null);
    setFormTypeId(null);
    setFormTxId(undefined);
    setViewTxId(null);
    setCurrentPage(page);
  };

  // Old manager transactions
  const handleViewTransactionDetails = (id: string) => {
    setDetailsId(id);
    setCurrentPage('manager-transaction-details');
  };
  const handleBackFromTransaction = () => {
    setDetailsId(null);
    setCurrentPage('manager-transactions');
  };

  // Employee details
  const handleViewEmployee = (emp: Employee) => {
    setSelectedEmployee(emp);
    setCurrentPage('manager-employee-details');
  };
  const handleBackFromEmployee = () => {
    setSelectedEmployee(null);
    setCurrentPage('manager-employees');
  };

  // Internal Transactions (المعاملات الداخلية) — type selector
  const handleOpenTypeSelector = () => setCurrentPage('manager-transaction-type-selector');
  const handleSelectType = (typeId: string) => {
    setFormTypeId(typeId);
    setFormTxId(undefined);
    setCurrentPage('manager-transaction-form');
  };

  // Internal Transactions — detail view
  const handleViewTxDetails = (txId: string) => {
    setViewTxId(txId);
    setCurrentPage('manager-transaction-detail-view');
  };

  // Form back
  const handleBackFromForm = () => {
    setFormTypeId(null);
    setFormTxId(undefined);
    setCurrentPage('manager-transaction-center');
  };

  // Type selector back
  const handleBackFromTypeSelector = () => setCurrentPage('manager-transaction-center');

  // Detail view back
  const handleBackFromDetailView = () => {
    setViewTxId(null);
    setCurrentPage('manager-transaction-center');
  };

  // Drafts → continue
  const handleContinueDraft = (typeId: string, draftId: string) => {
    setFormTypeId(typeId);
    setFormTxId(draftId);
    setCurrentPage('manager-transaction-form');
  };

  // ── Sidebar active page ───────────────────────────────────────────────────

  const sidebarActivePage = () => {
    const txCenterPages = [
      'manager-transaction-center',
      'manager-transaction-type-selector',
      'manager-transaction-form',
      'manager-transaction-detail-view',
    ];
    if (txCenterPages.includes(currentPage)) return 'manager-transaction-center';
    if (currentPage === 'manager-my-tx-details')       return 'manager-my-transactions';
    if (currentPage === 'manager-transaction-details') return 'manager-transactions';
    if (currentPage === 'manager-employee-details')    return 'manager-employees';
    return currentPage;
  };

  // ── Page renderer ─────────────────────────────────────────────────────────

  const renderPage = () => {
    switch (currentPage) {
      case 'manager-dashboard':
        return <ManagerDashboard />;

      // ── Old transactions page (kept as is) ───────────────────────────────
      case 'manager-transactions':
        return <ManagerTransactions onViewDetails={handleViewTransactionDetails} />;
      case 'manager-transaction-details':
        return <TransactionDetails transactionId={detailsId ?? 'TXN-2024-441'} onBack={handleBackFromTransaction} />;

      // ── New: معاملاتي ─────────────────────────────────────────────────────
      case 'manager-my-transactions':
        return (
          <MyTransactions
            onViewDetails={(id, shouldAutoReceive) => {
              setDetailsId(id);
              setAutoReceive(!!shouldAutoReceive);
              setCurrentPage('manager-my-tx-details');
            }}
          />
        );
      case 'manager-my-tx-details':
        return (
          <TransactionDetails
            transactionId={detailsId ?? 'TXN-2024-441'}
            autoReceive={autoReceive}
            onBack={() => {
              setDetailsId(null);
              setAutoReceive(false);
              setCurrentPage('manager-my-transactions');
            }}
          />
        );

      // ── New: المعاملات الداخلية (renamed from مركز المعاملات) ─────────────
      case 'manager-transaction-center':
        return <TransactionCenter onOpenTypeSelector={handleOpenTypeSelector} onViewDetails={handleViewTxDetails} />;
      case 'manager-transaction-type-selector':
        return <TransactionTypeSelector onSelectType={handleSelectType} onBack={handleBackFromTypeSelector} />;
      case 'manager-transaction-form':
        return formTypeId
          ? <TransactionForm typeId={formTypeId} transactionId={formTxId} onBack={handleBackFromForm} />
          : <TransactionCenter onOpenTypeSelector={handleOpenTypeSelector} onViewDetails={handleViewTxDetails} />;
      case 'manager-transaction-detail-view':
        return viewTxId
          ? <TransactionDetailView transactionId={viewTxId} onBack={handleBackFromDetailView} />
          : <TransactionCenter onOpenTypeSelector={handleOpenTypeSelector} onViewDetails={handleViewTxDetails} />;

      // ── New: معاملات الدائرة ──────────────────────────────────────────────
      case 'manager-dept-transactions':
        return <DepartmentTransactionsPage />;

      // ── Employees ─────────────────────────────────────────────────────────
      case 'manager-employees':
        return <ManagerEmployees onViewEmployee={handleViewEmployee} />;
      case 'manager-employee-details':
        return selectedEmployee
          ? <EmployeeDetails employee={selectedEmployee} onBack={handleBackFromEmployee} />
          : <ManagerEmployees onViewEmployee={handleViewEmployee} />;

      // ── Other ─────────────────────────────────────────────────────────────
      case 'manager-complaints':
        return <ManagerComplaints />;
      case 'manager-tracking':
        return <TransactionTracking />;
      case 'manager-drafts':
        return <MyDrafts onContinue={handleContinueDraft} />;
      case 'manager-workflow-management':
        return <WorkflowManagement />;

      default:
        return <ManagerDashboard />;
    }
  };

  return (
    <div
      className="flex h-screen"
      style={{ backgroundColor: 'var(--background)', direction: 'rtl' }}
    >
      <ManagerSidebar
        currentPage={sidebarActivePage()}
        onPageChange={goTo}
        onExit={onExit}
      />
      <div className="flex-1 flex flex-col overflow-hidden">
        <ManagerHeader />
        <main className="flex-1 overflow-y-auto">
          {renderPage()}
        </main>
      </div>
    </div>
  );
}
