/**
 * SpendWise — Modern Personal Expense Tracker
 * Core Application Engine & State Architecture
 */

(function () {
  'use strict';

  // --- Constants & Storage Keys ---
  const STORAGE_KEYS = {
    TRANSACTIONS: 'spendwise_transactions',
    BUDGETS: 'spendwise_budgets',
    THEME: 'spendwise_theme',
    PROFILE: 'spendwise_profile'
  };

  const DEFAULT_CATEGORIES = {
    EXPENSE: [
      { id: 'Food', name: 'Food & Dining', icon: 'utensils' },
      { id: 'Shopping', name: 'Shopping', icon: 'shopping-bag' },
      { id: 'Travel', name: 'Travel & Commute', icon: 'plane' },
      { id: 'Bills', name: 'Bills & Utilities', icon: 'receipt' },
      { id: 'Education', name: 'Education', icon: 'graduation-cap' },
      { id: 'Entertainment', name: 'Entertainment', icon: 'film' },
      { id: 'Health', name: 'Health & Medical', icon: 'heart-pulse' },
      { id: 'Other', name: 'Other Expenses', icon: 'more-horizontal' }
    ],
    INCOME: [
      { id: 'Salary', name: 'Salary', icon: 'briefcase' },
      { id: 'Freelance', name: 'Freelance / Consulting', icon: 'laptop' },
      { id: 'Investments', name: 'Investment Returns', icon: 'trending-up' },
      { id: 'Business', name: 'Business Income', icon: 'building' },
      { id: 'Other', name: 'Other Inflow', icon: 'plus-circle' }
    ]
  };

  const CATEGORY_COLORS = {
    Food: '#16845B',          // Accent Green
    Shopping: '#3B82F6',      // Fintech Blue
    Travel: '#F59E0B',        // Amber
    Bills: '#8B5CF6',         // Slate Purple
    Education: '#06B6D4',      // Cyan
    Entertainment: '#EC4899',  // Rose
    Health: '#10B981',         // Emerald
    Salary: '#059669',
    Freelance: '#2563EB',
    Investments: '#7C3AED',
    Business: '#D97706',
    Other: '#64748B'           // Slate
  };

  const DEFAULT_BUDGETS = {
    monthlyOverall: 60000,
    categories: {
      Food: 15000,
      Shopping: 8000,
      Travel: 7000,
      Bills: 12000,
      Education: 5000,
      Entertainment: 4000,
      Health: 5000,
      Other: 4000
    }
  };

  const DEFAULT_PROFILE = {
    name: 'Alex Mercer',
    email: 'alex.mercer@fintech.dev',
    currency: 'INR'
  };

  // --- SVG Icons Fallback Map for 100% Offline Resilience ---
  const SVG_ICONS = {
    'layout-dashboard': '<svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="9"></rect><rect x="14" y="3" width="7" height="5"></rect><rect x="14" y="12" width="7" height="9"></rect><rect x="3" y="16" width="7" height="5"></rect></svg>',
    'arrow-left-right': '<svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><path d="m16 3 4 4-4 4"></path><path d="M20 7H4"></path><path d="m8 21-4-4 4-4"></path><path d="M4 17h16"></path></svg>',
    'bar-chart-3': '<svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><path d="M3 3v18h18"></path><path d="M18 17V9"></path><path d="M13 17V5"></path><path d="M8 17v-3"></path></svg>',
    'wallet': '<svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12V7H5a2 2 0 0 1 0-4h14v4"></path><path d="M3 5v14a2 2 0 0 0 2 2h16v-5"></path><path d="M18 12a2 2 0 0 0 0 4h4v-4Z"></path></svg>',
    'settings': '<svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"></path><circle cx="12" cy="12" r="3"></circle></svg>',
    'search': '<svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><path d="m21 21-4.3-4.3"></path></svg>',
    'plus': '<svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"></path><path d="M12 5v14"></path></svg>',
    'sun': '<svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"></circle><path d="M12 2v2"></path><path d="M12 20v2"></path><path d="m4.93 4.93 1.41 1.41"></path><path d="m17.66 17.66 1.41 1.41"></path><path d="M2 12h2"></path><path d="M20 12h2"></path><path d="m6.34 17.66-1.41 1.41"></path><path d="m19.07 4.93-1.41 1.41"></path></svg>',
    'moon': '<svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"></path></svg>',
    'edit-2': '<svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"></path></svg>',
    'trash-2': '<svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"></path><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path><line x1="10" x2="10" y1="11" y2="17"></line><line x1="14" x2="14" y1="11" y2="17"></line></svg>',
    'check': '<svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>',
    'x': '<svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"></path><path d="m6 6 12 12"></path></svg>',
    'arrow-up-right': '<svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><path d="M7 7h10v10"></path><path d="M7 17 17 7"></path></svg>',
    'arrow-down-left': '<svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><path d="M17 17H7V7"></path><path d="M17 7 7 17"></path></svg>',
    'trending-up': '<svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"></polyline><polyline points="16 7 22 7 22 13"></polyline></svg>',
    'pie-chart': '<svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><path d="M21.21 15.89A10 10 0 1 1 8 2.83"></path><path d="M22 12A10 10 0 0 0 12 2v10z"></path></svg>',
    'download': '<svg viewBox="0 0 24 24" width="15" height="15" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" x2="12" y1="15" y2="3"></line></svg>',
    'upload': '<svg viewBox="0 0 24 24" width="15" height="15" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" x2="12" y1="3" y2="15"></line></svg>',
    'alert-triangle': '<svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"></path><line x1="12" x2="12" y1="9" y2="13"></line><line x1="12" x2="12.01" y1="17" y2="17"></line></svg>',
    'menu': '<svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><line x1="4" x2="20" y1="12" y2="12"></line><line x1="4" x2="20" y1="6" y2="6"></line><line x1="4" x2="20" y1="18" y2="18"></line></svg>',
    'rotate-ccw': '<svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"></path><path d="M3 3v5h5"></path></svg>',
    'receipt': '<svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><path d="M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1Z"></path><path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8"></path><path d="M12 6v12"></path></svg>',
    'search-x': '<svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><path d="m21 21-4.3-4.3"></path><path d="m8 8 6 6"></path><path d="m14 8-6 6"></path></svg>',
    'sliders': '<svg viewBox="0 0 24 24" width="15" height="15" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><line x1="4" x2="4" y1="21" y2="14"></line><line x1="4" x2="4" y1="10" y2="3"></line><line x1="12" x2="12" y1="21" y2="12"></line><line x1="12" x2="12" y1="8" y2="3"></line><line x1="20" x2="20" y1="21" y2="16"></line><line x1="20" x2="20" y1="12" y2="3"></line><line x1="1" x2="7" y1="14" y2="14"></line><line x1="9" x2="15" y1="8" y2="8"></line><line x1="17" x2="23" y1="16" y2="16"></line></svg>',
    'user': '<svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>',
    'palette': '<svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><circle cx="13.5" cy="6.5" r=".5"></circle><circle cx="17.5" cy="10.5" r=".5"></circle><circle cx="8.5" cy="7.5" r=".5"></circle><circle cx="6.5" cy="12.5" r=".5"></circle><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z"></path></svg>',
    'database': '<svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><ellipse cx="12" cy="5" rx="9" ry="3"></ellipse><path d="M3 5V19A9 3 0 0 0 21 19V5"></path><path d="M3 12A9 3 0 0 0 21 12"></path></svg>',
    'file-spreadsheet': '<svg viewBox="0 0 24 24" width="15" height="15" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"></path><path d="M14 2v4a2 2 0 0 0 2 2h4"></path><path d="M8 13h2"></path><path d="M14 13h2"></path><path d="M8 17h2"></path><path d="M14 17h2"></path></svg>',
    'sparkles': '<svg viewBox="0 0 24 24" width="15" height="15" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"></path></svg>',
    'refresh-cw': '<svg viewBox="0 0 24 24" width="15" height="15" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"></path><path d="M21 3v5h-5"></path><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"></path><path d="M8 16H3v5"></path></svg>',
    'shield-check': '<svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path><path d="m9 12 2 2 4-4"></path></svg>',
    'chevron-left': '<svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>',
    'chevron-right': '<svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>',
    'arrow-right': '<svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>'
  };

  // --- Application State ---
  const state = {
    transactions: [],
    budgets: { ...DEFAULT_BUDGETS },
    profile: { ...DEFAULT_PROFILE },
    theme: 'light',
    currentPage: 'dashboard',
    
    // Transactions Table Filter State
    txFilters: {
      search: '',
      type: 'all',
      category: 'all',
      timeframe: 'all',
      sort: 'date_desc',
      page: 1,
      pageSize: 10
    },

    // Analytics Filter State
    analyticsFilters: {
      month: 'all',
      year: 'all'
    },

    // Dashboard Chart Mode
    dashboardChartMode: 'expense',

    // Modals & Callbacks
    deleteCandidateId: null,
    confirmActionCallback: null,

    // Chart instances
    charts: {
      overview: null,
      categoryDoughnut: null,
      analyticsCashFlow: null,
      analyticsCategoryBar: null
    }
  };

  // --- Dynamic Demo Transactions Generator ---
  // Generates 32 realistic transactions relative to the current calendar date
  function generateDemoTransactions() {
    const now = new Date();
    
    const formatDate = (monthOffset, day) => {
      const d = new Date(now.getFullYear(), now.getMonth() - monthOffset, day);
      const y = d.getFullYear();
      const m = String(d.getMonth() + 1).padStart(2, '0');
      const dt = String(d.getDate()).padStart(2, '0');
      return `${y}-${m}-${dt}`;
    };

    const items = [
      // Current Month (Month Offset 0)
      { desc: 'Monthly Salary Credit', amount: 95000.00, type: 'income', category: 'Salary', date: formatDate(0, 1), method: 'Net Banking', notes: 'Tech Corp India Ltd' },
      { desc: 'Apartment Maintenance & Rent', amount: 22000.00, type: 'expense', category: 'Bills', date: formatDate(0, 2), method: 'Net Banking', notes: 'Sobha Heights Apt 402' },
      { desc: 'Weekly Groceries at Nature\'s Basket', amount: 4850.00, type: 'expense', category: 'Food', date: formatDate(0, 3), method: 'Credit Card', notes: 'Fresh produce & dairy' },
      { desc: 'Electricity & High-Speed Fiber Bill', amount: 2450.00, type: 'expense', category: 'Bills', date: formatDate(0, 4), method: 'UPI / Online', notes: 'BESCOM + Jio Fiber' },
      { desc: 'Fuel & Highway Fastag Recharge', amount: 2500.00, type: 'expense', category: 'Travel', date: formatDate(0, 5), method: 'UPI / Online', notes: 'HPCL Auto-reload' },
      { desc: 'Weekend Dinner at Toit Brewpub', amount: 3200.00, type: 'expense', category: 'Food', date: formatDate(0, 6), method: 'Credit Card', notes: 'Dinner with team' },
      { desc: 'Annual Tech Cloud Subscription', amount: 1800.00, type: 'expense', category: 'Education', date: formatDate(0, 7), method: 'Credit Card', notes: 'Coursera & GitHub Pro' },
      { desc: 'Freelance Design Consultation', amount: 25000.00, type: 'income', category: 'Freelance', date: formatDate(0, 5), method: 'UPI / Online', notes: 'Fintech UI Audit milestone' },

      // Month -1
      { desc: 'Monthly Salary Credit', amount: 95000.00, type: 'income', category: 'Salary', date: formatDate(1, 1), method: 'Net Banking', notes: 'Tech Corp India Ltd' },
      { desc: 'Apartment Rent & Society Dues', amount: 22000.00, type: 'expense', category: 'Bills', date: formatDate(1, 2), method: 'Net Banking', notes: 'Rent transfer' },
      { desc: 'Festive Shopping & Gifts', amount: 12500.00, type: 'expense', category: 'Shopping', date: formatDate(1, 12), method: 'Credit Card', notes: 'Family gifts & electronics' },
      { desc: 'Organic Supermarket Groceries', amount: 5600.00, type: 'expense', category: 'Food', date: formatDate(1, 16), method: 'UPI / Online', notes: 'Monthly dry rations' },
      { desc: 'Health Checkup & Pharmacy Meds', amount: 3400.00, type: 'expense', category: 'Health', date: formatDate(1, 20), method: 'Debit Card', notes: 'Apollo Clinic routine' },
      { desc: 'Flight Tickets Roundtrip', amount: 8900.00, type: 'expense', category: 'Travel', date: formatDate(1, 23), method: 'Credit Card', notes: 'IndiGo weekend trip' },
      { desc: 'Mutual Fund Dividend Distribution', amount: 4800.00, type: 'income', category: 'Investments', date: formatDate(1, 26), method: 'Net Banking', notes: 'Nifty Index Dividend' },
      { desc: 'IMAX Movie & Dinner Night', amount: 2800.00, type: 'expense', category: 'Entertainment', date: formatDate(1, 28), method: 'UPI / Online', notes: 'PVR Cinema tickets' },

      // Month -2
      { desc: 'Monthly Salary Credit', amount: 95000.00, type: 'income', category: 'Salary', date: formatDate(2, 1), method: 'Net Banking', notes: 'Tech Corp India Ltd' },
      { desc: 'Apartment Rent Transfer', amount: 22000.00, type: 'expense', category: 'Bills', date: formatDate(2, 2), method: 'Net Banking', notes: 'Rent' },
      { desc: 'Ergonomic Desk Chair', amount: 14500.00, type: 'expense', category: 'Shopping', date: formatDate(2, 8), method: 'Credit Card', notes: 'Featherlite WFH setup' },
      { desc: 'Groceries & Household Supplies', amount: 6200.00, type: 'expense', category: 'Food', date: formatDate(2, 15), method: 'UPI / Online', notes: 'Zepto bulk order' },
      { desc: 'Quarterly Dental Cleaning', amount: 2000.00, type: 'expense', category: 'Health', date: formatDate(2, 20), method: 'UPI / Online', notes: 'Dental care' },
      { desc: 'Cab Commutes & Metro SmartCard', amount: 3100.00, type: 'expense', category: 'Travel', date: formatDate(2, 26), method: 'UPI / Online', notes: 'Uber & Metro' },

      // Month -3
      { desc: 'Monthly Salary Credit', amount: 92000.00, type: 'income', category: 'Salary', date: formatDate(3, 1), method: 'Net Banking', notes: 'Tech Corp India Ltd' },
      { desc: 'Apartment Rent', amount: 22000.00, type: 'expense', category: 'Bills', date: formatDate(3, 2), method: 'Net Banking', notes: 'Rent' },
      { desc: 'Weekend Getaway Resort Stay', amount: 9400.00, type: 'expense', category: 'Travel', date: formatDate(3, 15), method: 'Credit Card', notes: 'Safari resort lodge' },
      { desc: 'Gourmet Dining & Specialty Cafes', amount: 4900.00, type: 'expense', category: 'Food', date: formatDate(3, 20), method: 'Credit Card', notes: 'Third Wave & dining' },
      { desc: 'System Design Course & Books', amount: 3200.00, type: 'expense', category: 'Education', date: formatDate(3, 22), method: 'UPI / Online', notes: 'O\'Reilly library' },
      { desc: 'Streaming Subscriptions (OTT)', amount: 1499.00, type: 'expense', category: 'Entertainment', date: formatDate(3, 25), method: 'Credit Card', notes: 'Quarterly renewal' },

      // Month -4
      { desc: 'Monthly Salary Credit', amount: 92000.00, type: 'income', category: 'Salary', date: formatDate(4, 1), method: 'Net Banking', notes: 'Tech Corp India Ltd' },
      { desc: 'Apartment Rent', amount: 22000.00, type: 'expense', category: 'Bills', date: formatDate(4, 2), method: 'Net Banking', notes: 'Rent' },
      { desc: 'Mid-Year Apparel Clearance Sale', amount: 6800.00, type: 'expense', category: 'Shopping', date: formatDate(4, 11), method: 'Credit Card', notes: 'Wardrobe basics' },
      { desc: 'Monthly Groceries & Dairy', amount: 5100.00, type: 'expense', category: 'Food', date: formatDate(4, 16), method: 'UPI / Online', notes: 'Pantry restocking' },
      { desc: 'Freelance UI/UX Advisory', amount: 30000.00, type: 'income', category: 'Freelance', date: formatDate(4, 22), method: 'Net Banking', notes: 'Design token architecture' },

      // Month -5
      { desc: 'Monthly Salary Credit', amount: 92000.00, type: 'income', category: 'Salary', date: formatDate(5, 1), method: 'Net Banking', notes: 'Tech Corp India Ltd' },
      { desc: 'Apartment Rent', amount: 22000.00, type: 'expense', category: 'Bills', date: formatDate(5, 2), method: 'Net Banking', notes: 'Rent' },
      { desc: 'Annual Fitness Club Membership', amount: 16000.00, type: 'expense', category: 'Health', date: formatDate(5, 10), method: 'Credit Card', notes: 'Cult.fit Elite Pass' },
      { desc: 'Groceries & Dining Out', amount: 6400.00, type: 'expense', category: 'Food', date: formatDate(5, 18), method: 'UPI / Online', notes: 'Summer groceries' }
    ];

    return items.map((item, index) => ({
      id: 'tx_demo_' + (Date.now() - index * 86400000) + '_' + Math.random().toString(36).substring(2, 6),
      description: item.desc,
      amount: parseFloat(item.amount),
      type: item.type,
      category: item.category,
      date: item.date,
      method: item.method || 'UPI / Online',
      notes: item.notes || ''
    }));
  }

  // --- Storage Manager ---
  const Storage = {
    load() {
      try {
        const rawTx = localStorage.getItem(STORAGE_KEYS.TRANSACTIONS);
        if (rawTx) {
          state.transactions = JSON.parse(rawTx);
        } else {
          state.transactions = generateDemoTransactions();
          this.saveTransactions();
        }

        const rawBudgets = localStorage.getItem(STORAGE_KEYS.BUDGETS);
        if (rawBudgets) {
          state.budgets = { ...DEFAULT_BUDGETS, ...JSON.parse(rawBudgets) };
        } else {
          state.budgets = { ...DEFAULT_BUDGETS };
          this.saveBudgets();
        }

        const rawTheme = localStorage.getItem(STORAGE_KEYS.THEME);
        state.theme = rawTheme || 'light';

        const rawProfile = localStorage.getItem(STORAGE_KEYS.PROFILE);
        if (rawProfile) {
          state.profile = { ...DEFAULT_PROFILE, ...JSON.parse(rawProfile) };
        } else {
          state.profile = { ...DEFAULT_PROFILE };
        }
      } catch (err) {
        console.error('Failed to load from LocalStorage:', err);
        state.transactions = generateDemoTransactions();
        state.budgets = { ...DEFAULT_BUDGETS };
        state.profile = { ...DEFAULT_PROFILE };
        state.theme = 'light';
      }
    },

    saveTransactions() {
      try {
        localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(state.transactions));
      } catch (err) {
        console.error('Failed to save transactions:', err);
        Toast.show('Error saving to local storage. Quota exceeded?', 'error');
      }
    },

    saveBudgets() {
      try {
        localStorage.setItem(STORAGE_KEYS.BUDGETS, JSON.stringify(state.budgets));
      } catch (err) {
        console.error('Failed to save budgets:', err);
      }
    },

    saveTheme() {
      try {
        localStorage.setItem(STORAGE_KEYS.THEME, state.theme);
      } catch (err) {
        console.error('Failed to save theme:', err);
      }
    },

    saveProfile() {
      try {
        localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(state.profile));
      } catch (err) {
        console.error('Failed to save profile:', err);
      }
    },

    clearAllTransactions() {
      state.transactions = [];
      this.saveTransactions();
    },

    factoryReset() {
      localStorage.removeItem(STORAGE_KEYS.TRANSACTIONS);
      localStorage.removeItem(STORAGE_KEYS.BUDGETS);
      localStorage.removeItem(STORAGE_KEYS.THEME);
      localStorage.removeItem(STORAGE_KEYS.PROFILE);
      state.transactions = generateDemoTransactions();
      state.budgets = { ...DEFAULT_BUDGETS };
      state.profile = { ...DEFAULT_PROFILE };
      state.theme = 'light';
      this.saveTransactions();
      this.saveBudgets();
      this.saveTheme();
      this.saveProfile();
    }
  };

  // --- Formatting Helpers ---
  const Formatters = {
    currency(amount, includeSymbol = true) {
      const num = Number(amount) || 0;
      const formatted = new Intl.NumberFormat('en-IN', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      }).format(num);

      return includeSymbol ? `₹${formatted}` : formatted;
    },

    dateNice(dateString) {
      if (!dateString) return '-';
      const [y, m, d] = dateString.split('-').map(Number);
      const date = new Date(y, m - 1, d);
      return date.toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      });
    },

    monthYear(dateString) {
      if (!dateString) return '-';
      const [y, m, d] = dateString.split('-').map(Number);
      const date = new Date(y, m - 1, d);
      return date.toLocaleDateString('en-IN', {
        month: 'short',
        year: 'numeric'
      });
    },

    percent(val) {
      const num = Number(val) || 0;
      return `${Math.round(num * 10) / 10}%`;
    }
  };

  // --- Toast Notification Manager ---
  const Toast = {
    container: null,

    init() {
      this.container = document.getElementById('toastContainer');
    },

    show(message, type = 'success', duration = 3500) {
      if (!this.container) return;

      const toast = document.createElement('div');
      toast.className = `toast toast-${type}`;
      
      let iconMarkup = '';
      if (type === 'success') {
        iconMarkup = `<span class="toast-icon">${SVG_ICONS['check'] || '✓'}</span>`;
      } else if (type === 'error') {
        iconMarkup = `<span class="toast-icon">${SVG_ICONS['x'] || '✕'}</span>`;
      } else {
        iconMarkup = `<span class="toast-icon">${SVG_ICONS['alert-triangle'] || '⚠'}</span>`;
      }

      toast.innerHTML = `
        ${iconMarkup}
        <span class="toast-message">${escapeHtml(message)}</span>
        <button class="toast-close" aria-label="Dismiss">&times;</button>
      `;

      const closeBtn = toast.querySelector('.toast-close');
      const dismiss = () => {
        toast.classList.add('toast-hiding');
        setTimeout(() => toast.remove(), 200);
      };

      closeBtn.addEventListener('click', dismiss);
      this.container.appendChild(toast);

      if (duration > 0) {
        setTimeout(dismiss, duration);
      }
    }
  };

  // --- Icon Refresh Utility ---
  function refreshIcons() {
    if (window.lucide && typeof window.lucide.createIcons === 'function') {
      window.lucide.createIcons();
    } else {
      document.querySelectorAll('i[data-lucide]').forEach(el => {
        const iconName = el.getAttribute('data-lucide');
        if (SVG_ICONS[iconName]) {
          el.innerHTML = SVG_ICONS[iconName];
          el.style.display = 'inline-flex';
          el.style.alignItems = 'center';
          el.style.justifyContent = 'center';
        }
      });
    }
  }

  function escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  // --- Financial Calculation Engine ---
  const FinanceEngine = {
    getTotals(txList = state.transactions) {
      let totalIncome = 0;
      let totalExpense = 0;
      let incomeCount = 0;
      let expenseCount = 0;

      for (const tx of txList) {
        const amt = Number(tx.amount) || 0;
        if (tx.type === 'income') {
          totalIncome += amt;
          incomeCount++;
        } else if (tx.type === 'expense') {
          totalExpense += amt;
          expenseCount++;
        }
      }

      const totalBalance = totalIncome - totalExpense;
      const savingsRate = totalIncome > 0 
        ? Math.max(0, ((totalIncome - totalExpense) / totalIncome) * 100) 
        : 0;

      return {
        totalIncome,
        totalExpense,
        totalBalance,
        incomeCount,
        expenseCount,
        savingsRate
      };
    },

    getCurrentMonthBudgetStats() {
      const now = new Date();
      const currentYear = now.getFullYear();
      const currentMonth = now.getMonth();

      let currentMonthSpent = 0;
      let currentMonthIncome = 0;

      const categorySpends = {};
      DEFAULT_CATEGORIES.EXPENSE.forEach(cat => {
        categorySpends[cat.id] = 0;
      });

      for (const tx of state.transactions) {
        if (!tx.date) continue;
        const [y, m] = tx.date.split('-').map(Number);
        if (y === currentYear && m === (currentMonth + 1)) {
          const amt = Number(tx.amount) || 0;
          if (tx.type === 'expense') {
            currentMonthSpent += amt;
            if (categorySpends[tx.category] !== undefined) {
              categorySpends[tx.category] += amt;
            } else {
              categorySpends['Other'] = (categorySpends['Other'] || 0) + amt;
            }
          } else if (tx.type === 'income') {
            currentMonthIncome += amt;
          }
        }
      }

      const overallLimit = Number(state.budgets.monthlyOverall) || 60000;
      const remaining = overallLimit - currentMonthSpent;
      const pctUsed = overallLimit > 0 ? (currentMonthSpent / overallLimit) * 100 : 0;

      let status = 'normal';
      if (pctUsed >= 100) {
        status = 'exceeded';
      } else if (pctUsed >= 80) {
        status = 'warning';
      }

      return {
        overallLimit,
        currentMonthSpent,
        currentMonthIncome,
        remaining,
        pctUsed,
        status,
        categorySpends
      };
    },

    getLastSixMonthsData() {
      const months = [];
      const now = new Date();

      for (let i = 5; i >= 0; i--) {
        const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
        months.push({
          year: d.getFullYear(),
          month: d.getMonth(),
          key: `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`,
          label: d.toLocaleDateString('en-IN', { month: 'short' }),
          fullLabel: d.toLocaleDateString('en-IN', { month: 'short', year: 'numeric' }),
          expense: 0,
          income: 0
        });
      }

      for (const tx of state.transactions) {
        if (!tx.date) continue;
        const prefix = tx.date.substring(0, 7);
        const targetMonth = months.find(m => m.key === prefix);
        if (targetMonth) {
          const amt = Number(tx.amount) || 0;
          if (tx.type === 'expense') {
            targetMonth.expense += amt;
          } else if (tx.type === 'income') {
            targetMonth.income += amt;
          }
        }
      }

      return months;
    },

    getCategoryBreakdown(filteredTx = null) {
      const targetList = filteredTx || state.transactions;
      const categoryMap = {};

      let totalExpenses = 0;

      for (const tx of targetList) {
        if (tx.type === 'expense') {
          const cat = tx.category || 'Other';
          const amt = Number(tx.amount) || 0;
          categoryMap[cat] = (categoryMap[cat] || 0) + amt;
          totalExpenses += amt;
        }
      }

      const list = Object.keys(categoryMap).map(cat => ({
        category: cat,
        amount: categoryMap[cat],
        pct: totalExpenses > 0 ? (categoryMap[cat] / totalExpenses) * 100 : 0,
        color: CATEGORY_COLORS[cat] || '#64748B'
      }));

      list.sort((a, b) => b.amount - a.amount);

      return {
        categories: list,
        totalExpenses
      };
    }
  };

  // --- Views Controller ---
  const Views = {
    init() {
      const navLinks = document.querySelectorAll('.nav-link');
      navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
          e.preventDefault();
          const targetPage = link.getAttribute('data-page');
          this.switchPage(targetPage);
          
          document.getElementById('sidebar').classList.remove('open');
          document.getElementById('sidebarOverlay').classList.remove('active');
        });
      });

      const brandLogoLink = document.getElementById('brandLogoLink');
      if (brandLogoLink) {
        brandLogoLink.addEventListener('click', (e) => {
          e.preventDefault();
          this.switchPage('dashboard');
        });
      }

      const userProfileBtn = document.getElementById('userProfileBtn');
      if (userProfileBtn) {
        userProfileBtn.addEventListener('click', () => {
          this.switchPage('settings');
        });
      }

      const viewAllBtn = document.getElementById('viewAllTransactionsBtn');
      if (viewAllBtn) {
        viewAllBtn.addEventListener('click', () => {
          this.switchPage('transactions');
        });
      }
    },

    switchPage(pageName) {
      if (!pageName) return;
      state.currentPage = pageName;

      document.querySelectorAll('.nav-link').forEach(link => {
        if (link.getAttribute('data-page') === pageName) {
          link.classList.add('active');
        } else {
          link.classList.remove('active');
        }
      });

      document.querySelectorAll('.page-view').forEach(view => {
        view.classList.remove('active');
      });

      const activeView = document.getElementById(`view-${pageName}`);
      if (activeView) {
        activeView.classList.add('active');
      }

      const pageTitles = {
        dashboard: 'Dashboard',
        transactions: 'Transactions',
        analytics: 'Analytics',
        budgets: 'Budgets & Limits',
        settings: 'Settings'
      };
      const titleElem = document.getElementById('currentPageTitle');
      if (titleElem) {
        titleElem.textContent = pageTitles[pageName] || 'Dashboard';
      }

      this.renderCurrentPage();
      refreshIcons();
    },

    renderCurrentPage() {
      switch (state.currentPage) {
        case 'dashboard':
          DashboardView.render();
          break;
        case 'transactions':
          TransactionsView.render();
          break;
        case 'analytics':
          AnalyticsView.render();
          break;
        case 'budgets':
          BudgetsView.render();
          break;
        case 'settings':
          SettingsView.render();
          break;
      }
      this.updateCounters();
    },

    updateCounters() {
      const navTxCount = document.getElementById('navTxCount');
      if (navTxCount) {
        navTxCount.textContent = state.transactions.length;
      }
    }
  };

  // --- DASHBOARD VIEW CONTROLLER ---
  const DashboardView = {
    render() {
      this.renderSummaryCards();
      this.renderBudgetWidget();
      this.renderExpenseChart();
      this.renderCategoryChart();
      this.renderRecentTransactions();
    },

    renderSummaryCards() {
      const totals = FinanceEngine.getTotals();

      const balElem = document.getElementById('dashboardTotalBalance');
      const incElem = document.getElementById('dashboardTotalIncome');
      const expElem = document.getElementById('dashboardTotalExpense');
      const rateElem = document.getElementById('dashboardSavingsRate');
      const incCountElem = document.getElementById('dashboardIncomeCount');
      const expCountElem = document.getElementById('dashboardExpenseCount');

      if (balElem) balElem.textContent = Formatters.currency(totals.totalBalance);
      if (incElem) incElem.textContent = Formatters.currency(totals.totalIncome);
      if (expElem) expElem.textContent = Formatters.currency(totals.totalExpense);
      if (rateElem) rateElem.textContent = `${Formatters.percent(totals.savingsRate)} net`;
      if (incCountElem) incCountElem.textContent = `${totals.incomeCount} income deposits`;
      if (expCountElem) expCountElem.textContent = `${totals.expenseCount} total transactions`;
    },

    renderBudgetWidget() {
      const bStats = FinanceEngine.getCurrentMonthBudgetStats();
      const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
      const now = new Date();
      const monthLabel = `${monthNames[now.getMonth()]} ${now.getFullYear()} budget pace`;

      const monthLabelElem = document.getElementById('budgetMonthLabel');
      const limitElem = document.getElementById('budgetStatLimit');
      const spentElem = document.getElementById('budgetStatSpent');
      const remElem = document.getElementById('budgetStatRemaining');
      const pctElem = document.getElementById('budgetStatPercent');
      const barElem = document.getElementById('dashboardBudgetProgressBar');
      const tagElem = document.getElementById('budgetStatusTag');

      if (monthLabelElem) monthLabelElem.textContent = monthLabel;
      if (limitElem) limitElem.textContent = Formatters.currency(bStats.overallLimit);
      if (spentElem) spentElem.textContent = Formatters.currency(bStats.currentMonthSpent);
      
      const remVal = bStats.remaining;
      if (remElem) {
        remElem.textContent = remVal >= 0 ? Formatters.currency(remVal) : `-${Formatters.currency(Math.abs(remVal))}`;
        remElem.style.color = remVal < 0 ? 'var(--color-danger)' : 'var(--text-primary)';
      }

      if (pctElem) pctElem.textContent = Formatters.percent(bStats.pctUsed);

      if (barElem) {
        const clampedPct = Math.min(100, Math.max(0, bStats.pctUsed));
        barElem.style.width = `${clampedPct}%`;
        barElem.className = 'budget-progress-fill';
        if (bStats.status === 'exceeded') {
          barElem.classList.add('danger');
        } else if (bStats.status === 'warning') {
          barElem.classList.add('warning');
        }
      }

      if (tagElem) {
        tagElem.className = 'budget-status-tag';
        if (bStats.status === 'exceeded') {
          tagElem.textContent = 'Exceeded';
          tagElem.classList.add('tag-exceeded');
        } else if (bStats.status === 'warning') {
          tagElem.textContent = 'Approaching Limit';
          tagElem.classList.add('tag-warning');
        } else {
          tagElem.textContent = 'On Track';
          tagElem.classList.add('tag-normal');
        }
      }
    },

    renderExpenseChart() {
      const ctx = document.getElementById('expenseOverviewChart');
      if (!ctx || typeof Chart === 'undefined') return;

      const monthlyData = FinanceEngine.getLastSixMonthsData();
      const labels = monthlyData.map(m => m.label);
      const expenses = monthlyData.map(m => m.expense);
      const incomes = monthlyData.map(m => m.income);

      const isDark = state.theme === 'dark';
      const gridColor = isDark ? '#222B3D' : '#E8EDF2';
      const textColor = isDark ? '#94A3B8' : '#8992A3';

      if (state.charts.overview) {
        state.charts.overview.destroy();
      }

      let datasets = [];
      if (state.dashboardChartMode === 'expense') {
        datasets = [
          {
            label: 'Monthly Expenses',
            data: expenses,
            backgroundColor: isDark ? 'rgba(30, 184, 125, 0.22)' : 'rgba(22, 132, 91, 0.12)',
            borderColor: isDark ? '#1EB87D' : '#16845B',
            borderWidth: 2,
            borderRadius: 6,
            barPercentage: 0.55
          }
        ];
      } else {
        datasets = [
          {
            label: 'Income',
            data: incomes,
            backgroundColor: isDark ? 'rgba(30, 184, 125, 0.75)' : 'rgba(22, 132, 91, 0.85)',
            borderRadius: 5,
            barPercentage: 0.65
          },
          {
            label: 'Expenses',
            data: expenses,
            backgroundColor: isDark ? 'rgba(248, 113, 113, 0.75)' : 'rgba(217, 83, 79, 0.85)',
            borderRadius: 5,
            barPercentage: 0.65
          }
        ];
      }

      state.charts.overview = new Chart(ctx, {
        type: 'bar',
        data: { labels, datasets },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: state.dashboardChartMode === 'comparison',
              position: 'top',
              labels: {
                boxWidth: 10,
                color: textColor,
                font: { family: 'Inter', size: 11, weight: '500' }
              }
            },
            tooltip: {
              backgroundColor: isDark ? '#1C2436' : '#FFFFFF',
              titleColor: isDark ? '#F1F5F9' : '#172033',
              bodyColor: isDark ? '#F1F5F9' : '#172033',
              borderColor: isDark ? '#232B3E' : '#E8EDF2',
              borderWidth: 1,
              padding: 10,
              boxPadding: 4,
              usePointStyle: true,
              callbacks: {
                label(context) {
                  return ` ${context.dataset.label}: ${Formatters.currency(context.raw)}`;
                }
              }
            }
          },
          scales: {
            x: {
              grid: { display: false },
              ticks: { color: textColor, font: { family: 'Inter', size: 11 } }
            },
            y: {
              grid: { color: gridColor, drawBorder: false },
              ticks: {
                color: textColor,
                font: { family: 'Inter', size: 11 },
                callback(val) {
                  return val >= 1000 ? `₹${val / 1000}k` : `₹${val}`;
                }
              }
            }
          }
        }
      });
    },

    renderCategoryChart() {
      const ctx = document.getElementById('categoryBreakdownChart');
      if (!ctx || typeof Chart === 'undefined') return;

      const breakdown = FinanceEngine.getCategoryBreakdown();
      const centerValElem = document.getElementById('doughnutCenterValue');
      const legendListElem = document.getElementById('categoryLegendList');

      if (centerValElem) {
        centerValElem.textContent = Formatters.currency(breakdown.totalExpenses);
      }

      const isDark = state.theme === 'dark';

      if (legendListElem) {
        legendListElem.innerHTML = '';
        if (breakdown.categories.length === 0) {
          legendListElem.innerHTML = `<span style="font-size: 12px; color: var(--text-muted); padding: 8px 0;">No expense records yet.</span>`;
        } else {
          breakdown.categories.forEach(item => {
            const legendItem = document.createElement('div');
            legendItem.className = 'category-legend-item';
            legendItem.innerHTML = `
              <div class="legend-category-name">
                <span class="legend-color-dot" style="background-color: ${item.color};"></span>
                <span>${escapeHtml(item.category)}</span>
              </div>
              <div>
                <span class="legend-category-amount">${Formatters.currency(item.amount)}</span>
                <span class="legend-category-pct">(${Formatters.percent(item.pct)})</span>
              </div>
            `;
            legendListElem.appendChild(legendItem);
          });
        }
      }

      if (state.charts.categoryDoughnut) {
        state.charts.categoryDoughnut.destroy();
      }

      const labels = breakdown.categories.map(c => c.category);
      const data = breakdown.categories.map(c => c.amount);
      const colors = breakdown.categories.map(c => c.color);

      state.charts.categoryDoughnut = new Chart(ctx, {
        type: 'doughnut',
        data: {
          labels: labels.length > 0 ? labels : ['No Data'],
          datasets: [{
            data: data.length > 0 ? data : [1],
            backgroundColor: colors.length > 0 ? colors : [isDark ? '#232B3E' : '#E8EDF2'],
            borderWidth: 2,
            borderColor: isDark ? '#141A26' : '#FFFFFF',
            hoverOffset: 4
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          cutout: '72%',
          plugins: {
            legend: { display: false },
            tooltip: {
              enabled: data.length > 0,
              backgroundColor: isDark ? '#1C2436' : '#FFFFFF',
              titleColor: isDark ? '#F1F5F9' : '#172033',
              bodyColor: isDark ? '#F1F5F9' : '#172033',
              borderColor: isDark ? '#232B3E' : '#E8EDF2',
              borderWidth: 1,
              padding: 10,
              callbacks: {
                label(context) {
                  return ` ${context.label}: ${Formatters.currency(context.raw)}`;
                }
              }
            }
          }
        }
      });
    },

    renderRecentTransactions() {
      const tbody = document.getElementById('dashboardRecentTbody');
      const emptyState = document.getElementById('dashboardRecentEmptyState');
      if (!tbody) return;

      tbody.innerHTML = '';

      const sorted = [...state.transactions].sort((a, b) => new Date(b.date) - new Date(a.date));
      const recent = sorted.slice(0, 5);

      if (recent.length === 0) {
        if (emptyState) emptyState.classList.remove('hidden');
        return;
      }

      if (emptyState) emptyState.classList.add('hidden');

      recent.forEach(tx => {
        const tr = document.createElement('tr');
        const isIncome = tx.type === 'income';
        const formattedAmount = `${isIncome ? '+' : '-'} ${Formatters.currency(tx.amount)}`;

        tr.innerHTML = `
          <td>${Formatters.dateNice(tx.date)}</td>
          <td>
            <div style="font-weight: 500;">${escapeHtml(tx.description)}</div>
            ${tx.notes ? `<div style="font-size: 11px; color: var(--text-muted);">${escapeHtml(tx.notes)}</div>` : ''}
          </td>
          <td>
            <span class="category-badge">
              <span class="legend-color-dot" style="background-color: ${CATEGORY_COLORS[tx.category] || '#64748B'};"></span>
              <span>${escapeHtml(tx.category)}</span>
            </span>
          </td>
          <td>
            <span class="type-badge ${isIncome ? 'income' : 'expense'}">${tx.type}</span>
          </td>
          <td class="text-right table-amount ${isIncome ? 'income' : 'expense'}">${formattedAmount}</td>
          <td class="text-center">
            <button class="table-icon-btn" onclick="SpendWise.openEditTxModal('${tx.id}')" title="Edit transaction">
              <i data-lucide="edit-2"></i>
            </button>
            <button class="table-icon-btn delete-btn" onclick="SpendWise.promptDeleteTx('${tx.id}')" title="Delete transaction">
              <i data-lucide="trash-2"></i>
            </button>
          </td>
        `;
        tbody.appendChild(tr);
      });

      refreshIcons();
    }
  };

  // --- TRANSACTIONS MASTER VIEW CONTROLLER ---
  const TransactionsView = {
    render() {
      this.filterAndRenderTable();
    },

    filterAndRenderTable() {
      const tbody = document.getElementById('transactionsMasterTbody');
      const emptyState = document.getElementById('txMasterEmptyState');
      const countElem = document.getElementById('txFilteredCount');
      const paginationFooter = document.getElementById('txPaginationFooter');
      if (!tbody) return;

      tbody.innerHTML = '';

      let list = [...state.transactions];

      // 1. Search Query Filter
      const search = (state.txFilters.search || '').trim().toLowerCase();
      if (search) {
        list = list.filter(tx => 
          tx.description.toLowerCase().includes(search) ||
          tx.category.toLowerCase().includes(search) ||
          (tx.notes && tx.notes.toLowerCase().includes(search)) ||
          String(tx.amount).includes(search)
        );
      }

      // 2. Type Filter
      if (state.txFilters.type !== 'all') {
        list = list.filter(tx => tx.type === state.txFilters.type);
      }

      // 3. Category Filter
      if (state.txFilters.category !== 'all') {
        list = list.filter(tx => tx.category === state.txFilters.category);
      }

      // 4. Timeframe Filter
      if (state.txFilters.timeframe !== 'all') {
        const now = new Date();
        const currentYear = now.getFullYear();
        const currentMonth = now.getMonth();

        list = list.filter(tx => {
          if (!tx.date) return false;
          const [y, m, d] = tx.date.split('-').map(Number);
          const txDate = new Date(y, m - 1, d);

          if (state.txFilters.timeframe === 'this_month') {
            return y === currentYear && (m - 1) === currentMonth;
          } else if (state.txFilters.timeframe === 'last_month') {
            const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
            const targetYear = currentMonth === 0 ? currentYear - 1 : currentYear;
            return y === targetYear && (m - 1) === lastMonth;
          } else if (state.txFilters.timeframe === 'last_6_months') {
            const sixMonthsAgo = new Date(currentYear, currentMonth - 6, 1);
            return txDate >= sixMonthsAgo;
          } else if (state.txFilters.timeframe === 'this_year') {
            return y === currentYear;
          }
          return true;
        });
      }

      // 5. Sorting
      list.sort((a, b) => {
        switch (state.txFilters.sort) {
          case 'date_asc':
            return new Date(a.date) - new Date(b.date);
          case 'amount_desc':
            return b.amount - a.amount;
          case 'amount_asc':
            return a.amount - b.amount;
          case 'date_desc':
          default:
            return new Date(b.date) - new Date(a.date);
        }
      });

      const totalFiltered = list.length;
      if (countElem) {
        countElem.textContent = `Showing ${totalFiltered} transaction${totalFiltered === 1 ? '' : 's'}`;
      }

      if (totalFiltered === 0) {
        if (emptyState) emptyState.classList.remove('hidden');
        if (paginationFooter) paginationFooter.style.display = 'none';
        return;
      }

      if (emptyState) emptyState.classList.add('hidden');
      if (paginationFooter) paginationFooter.style.display = 'flex';

      // 6. Pagination
      const pageSize = state.txFilters.pageSize;
      const totalPages = Math.ceil(totalFiltered / pageSize) || 1;
      if (state.txFilters.page > totalPages) state.txFilters.page = totalPages;
      if (state.txFilters.page < 1) state.txFilters.page = 1;

      const startIndex = (state.txFilters.page - 1) * pageSize;
      const pageSlice = list.slice(startIndex, startIndex + pageSize);

      pageSlice.forEach(tx => {
        const tr = document.createElement('tr');
        const isIncome = tx.type === 'income';
        const formattedAmount = `${isIncome ? '+' : '-'} ${Formatters.currency(tx.amount)}`;

        tr.innerHTML = `
          <td>${Formatters.dateNice(tx.date)}</td>
          <td>
            <div style="font-weight: 500;">${escapeHtml(tx.description)}</div>
            ${tx.notes ? `<div style="font-size: 11px; color: var(--text-muted);">${escapeHtml(tx.notes)}</div>` : ''}
          </td>
          <td>
            <span class="category-badge">
              <span class="legend-color-dot" style="background-color: ${CATEGORY_COLORS[tx.category] || '#64748B'};"></span>
              <span>${escapeHtml(tx.category)}</span>
            </span>
          </td>
          <td>
            <span class="type-badge ${isIncome ? 'income' : 'expense'}">${tx.type}</span>
          </td>
          <td class="text-right table-amount ${isIncome ? 'income' : 'expense'}">${formattedAmount}</td>
          <td class="text-center table-actions">
            <button class="table-icon-btn" onclick="SpendWise.openEditTxModal('${tx.id}')" title="Edit transaction">
              <i data-lucide="edit-2"></i>
            </button>
            <button class="table-icon-btn delete-btn" onclick="SpendWise.promptDeleteTx('${tx.id}')" title="Delete transaction">
              <i data-lucide="trash-2"></i>
            </button>
          </td>
        `;
        tbody.appendChild(tr);
      });

      const paginationInfo = document.getElementById('paginationInfo');
      const pageNumberIndicator = document.getElementById('pageNumberIndicator');
      const prevBtn = document.getElementById('prevPageBtn');
      const nextBtn = document.getElementById('nextPageBtn');

      if (paginationInfo) {
        const start = startIndex + 1;
        const end = Math.min(startIndex + pageSize, totalFiltered);
        paginationInfo.textContent = `Showing ${start} to ${end} of ${totalFiltered}`;
      }

      if (pageNumberIndicator) {
        pageNumberIndicator.textContent = `Page ${state.txFilters.page} of ${totalPages}`;
      }

      if (prevBtn) prevBtn.disabled = state.txFilters.page <= 1;
      if (nextBtn) nextBtn.disabled = state.txFilters.page >= totalPages;

      refreshIcons();
    }
  };

  // --- ANALYTICS VIEW CONTROLLER ---
  const AnalyticsView = {
    render() {
      this.populateYearDropdown();
      const filtered = this.getFilteredTransactions();
      this.renderMetrics(filtered);
      this.renderCashFlowChart(filtered);
      this.renderCategoryBarChart(filtered);
      this.renderCategoryTable(filtered);
    },

    populateYearDropdown() {
      const yearSelect = document.getElementById('analyticsYearSelect');
      if (!yearSelect) return;

      const years = new Set();
      const nowYear = new Date().getFullYear();
      years.add(nowYear);
      years.add(nowYear - 1);

      state.transactions.forEach(t => {
        if (t.date) {
          const y = Number(t.date.split('-')[0]);
          if (!isNaN(y)) years.add(y);
        }
      });

      const sortedYears = Array.from(years).sort((a, b) => b - a);
      const currentSelected = state.analyticsFilters.year;

      yearSelect.innerHTML = `<option value="all">All Years</option>`;
      sortedYears.forEach(y => {
        const opt = document.createElement('option');
        opt.value = String(y);
        opt.textContent = String(y);
        if (String(y) === currentSelected) {
          opt.selected = true;
        }
        yearSelect.appendChild(opt);
      });
    },

    getFilteredTransactions() {
      let list = [...state.transactions];
      const mVal = state.analyticsFilters.month;
      const yVal = state.analyticsFilters.year;

      if (yVal !== 'all') {
        list = list.filter(tx => tx.date && tx.date.startsWith(yVal));
      }

      if (mVal !== 'all') {
        const targetMonth = Number(mVal) + 1;
        list = list.filter(tx => {
          if (!tx.date) return false;
          const [, m] = tx.date.split('-').map(Number);
          return m === targetMonth;
        });
      }

      return list;
    },

    renderMetrics(filtered) {
      const totals = FinanceEngine.getTotals(filtered);
      const breakdown = FinanceEngine.getCategoryBreakdown(filtered);

      const incElem = document.getElementById('analyticsTotalIncome');
      const expElem = document.getElementById('analyticsTotalExpense');
      const netElem = document.getElementById('analyticsNetSavings');
      const rateElem = document.getElementById('analyticsSavingsRateText');
      const topCatElem = document.getElementById('analyticsTopCategory');
      const topCatAmtElem = document.getElementById('analyticsTopCategoryAmount');
      const avgElem = document.getElementById('analyticsAvgMonthly');

      if (incElem) incElem.textContent = Formatters.currency(totals.totalIncome);
      if (expElem) expElem.textContent = Formatters.currency(totals.totalExpense);
      
      if (netElem) {
        netElem.textContent = totals.totalBalance >= 0 
          ? Formatters.currency(totals.totalBalance) 
          : `-${Formatters.currency(Math.abs(totals.totalBalance))}`;
        netElem.style.color = totals.totalBalance >= 0 ? 'var(--color-income)' : 'var(--color-danger)';
      }

      if (rateElem) {
        rateElem.textContent = `Savings rate: ${Formatters.percent(totals.savingsRate)}`;
      }

      if (breakdown.categories.length > 0) {
        const top = breakdown.categories[0];
        if (topCatElem) topCatElem.textContent = top.category;
        if (topCatAmtElem) topCatAmtElem.textContent = `${Formatters.currency(top.amount)} (${Formatters.percent(top.pct)})`;
      } else {
        if (topCatElem) topCatElem.textContent = 'None';
        if (topCatAmtElem) topCatAmtElem.textContent = '₹0.00 spent';
      }

      const monthsActive = new Set();
      filtered.forEach(tx => {
        if (tx.date) monthsActive.add(tx.date.substring(0, 7));
      });
      const monthCount = Math.max(1, monthsActive.size);
      const avgMonthly = totals.totalExpense / monthCount;

      if (avgElem) {
        avgElem.textContent = Formatters.currency(avgMonthly);
      }
    },

    renderCashFlowChart(filtered) {
      const ctx = document.getElementById('analyticsCashFlowChart');
      if (!ctx || typeof Chart === 'undefined') return;

      const isDark = state.theme === 'dark';
      const gridColor = isDark ? '#222B3D' : '#E8EDF2';
      const textColor = isDark ? '#94A3B8' : '#8992A3';

      let labels = [];
      let incomes = [];
      let expenses = [];

      const selectedYear = state.analyticsFilters.year;
      if (selectedYear !== 'all') {
        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        labels = monthNames;
        incomes = new Array(12).fill(0);
        expenses = new Array(12).fill(0);

        state.transactions.forEach(tx => {
          if (!tx.date || !tx.date.startsWith(selectedYear)) return;
          const [, m] = tx.date.split('-').map(Number);
          const idx = m - 1;
          if (idx >= 0 && idx < 12) {
            const amt = Number(tx.amount) || 0;
            if (tx.type === 'income') incomes[idx] += amt;
            else if (tx.type === 'expense') expenses[idx] += amt;
          }
        });
      } else {
        const monthlyData = FinanceEngine.getLastSixMonthsData();
        labels = monthlyData.map(m => m.fullLabel);
        incomes = monthlyData.map(m => m.income);
        expenses = monthlyData.map(m => m.expense);
      }

      if (state.charts.analyticsCashFlow) {
        state.charts.analyticsCashFlow.destroy();
      }

      state.charts.analyticsCashFlow = new Chart(ctx, {
        type: 'bar',
        data: {
          labels,
          datasets: [
            {
              label: 'Inflow',
              data: incomes,
              backgroundColor: isDark ? 'rgba(30, 184, 125, 0.75)' : '#16845B',
              borderRadius: 4,
              barPercentage: 0.65
            },
            {
              label: 'Outflow',
              data: expenses,
              backgroundColor: isDark ? 'rgba(248, 113, 113, 0.75)' : '#D9534F',
              borderRadius: 4,
              barPercentage: 0.65
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'top',
              labels: {
                boxWidth: 10,
                color: textColor,
                font: { family: 'Inter', size: 11 }
              }
            },
            tooltip: {
              backgroundColor: isDark ? '#1C2436' : '#FFFFFF',
              titleColor: isDark ? '#F1F5F9' : '#172033',
              bodyColor: isDark ? '#F1F5F9' : '#172033',
              borderColor: isDark ? '#232B3E' : '#E8EDF2',
              borderWidth: 1,
              padding: 10,
              callbacks: {
                label(context) {
                  return ` ${context.dataset.label}: ${Formatters.currency(context.raw)}`;
                }
              }
            }
          },
          scales: {
            x: {
              grid: { display: false },
              ticks: { color: textColor, font: { family: 'Inter', size: 11 } }
            },
            y: {
              grid: { color: gridColor },
              ticks: {
                color: textColor,
                font: { family: 'Inter', size: 11 },
                callback: val => val >= 1000 ? `₹${val / 1000}k` : `₹${val}`
              }
            }
          }
        }
      });
    },

    renderCategoryBarChart(filtered) {
      const ctx = document.getElementById('analyticsCategoryBarChart');
      if (!ctx || typeof Chart === 'undefined') return;

      const breakdown = FinanceEngine.getCategoryBreakdown(filtered);
      const isDark = state.theme === 'dark';
      const gridColor = isDark ? '#222B3D' : '#E8EDF2';
      const textColor = isDark ? '#94A3B8' : '#8992A3';

      if (state.charts.analyticsCategoryBar) {
        state.charts.analyticsCategoryBar.destroy();
      }

      const labels = breakdown.categories.map(c => c.category);
      const data = breakdown.categories.map(c => c.amount);
      const colors = breakdown.categories.map(c => c.color);

      state.charts.analyticsCategoryBar = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: labels.length > 0 ? labels : ['No Expenses'],
          datasets: [{
            label: 'Amount Spent',
            data: data.length > 0 ? data : [0],
            backgroundColor: colors.length > 0 ? colors : ['#64748B'],
            borderRadius: 5,
            barPercentage: 0.6
          }]
        },
        options: {
          indexAxis: 'y',
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            tooltip: {
              backgroundColor: isDark ? '#1C2436' : '#FFFFFF',
              titleColor: isDark ? '#F1F5F9' : '#172033',
              bodyColor: isDark ? '#F1F5F9' : '#172033',
              borderColor: isDark ? '#232B3E' : '#E8EDF2',
              borderWidth: 1,
              callbacks: {
                label(context) {
                  return ` Spent: ${Formatters.currency(context.raw)}`;
                }
              }
            }
          },
          scales: {
            x: {
              grid: { color: gridColor },
              ticks: {
                color: textColor,
                callback: val => val >= 1000 ? `₹${val / 1000}k` : `₹${val}`
              }
            },
            y: {
              grid: { display: false },
              ticks: { color: textColor }
            }
          }
        }
      });
    },

    renderCategoryTable(filtered) {
      const tbody = document.getElementById('analyticsCategoryTbody');
      if (!tbody) return;

      tbody.innerHTML = '';
      const breakdown = FinanceEngine.getCategoryBreakdown(filtered);

      if (breakdown.categories.length === 0) {
        tbody.innerHTML = `<tr><td colspan="5" class="text-center" style="padding: 24px; color: var(--text-muted);">No expense entries in this period.</td></tr>`;
        return;
      }

      const countMap = {};
      filtered.forEach(tx => {
        if (tx.type === 'expense') {
          countMap[tx.category] = (countMap[tx.category] || 0) + 1;
        }
      });

      breakdown.categories.forEach(item => {
        const tr = document.createElement('tr');
        const count = countMap[item.category] || 0;

        tr.innerHTML = `
          <td>
            <div style="display: flex; align-items: center; gap: 8px;">
              <span class="legend-color-dot" style="background-color: ${item.color};"></span>
              <span style="font-weight: 600;">${escapeHtml(item.category)}</span>
            </div>
          </td>
          <td>${count} tx</td>
          <td class="text-right table-amount expense">${Formatters.currency(item.amount)}</td>
          <td class="text-right">${Formatters.percent(item.pct)}</td>
          <td>
            <div class="category-share-track">
              <div class="category-share-fill" style="width: ${Math.min(100, item.pct)}%; background-color: ${item.color};"></div>
            </div>
          </td>
        `;
        tbody.appendChild(tr);
      });
    }
  };

  // --- BUDGETS VIEW CONTROLLER ---
  const BudgetsView = {
    render() {
      const bStats = FinanceEngine.getCurrentMonthBudgetStats();

      const heroSpent = document.getElementById('budgetHeroSpent');
      const heroLimit = document.getElementById('budgetHeroLimit');
      const heroRemainingHelper = document.getElementById('budgetHeroRemainingHelper');
      const heroPercent = document.getElementById('budgetHeroPercent');
      const heroProgressBar = document.getElementById('budgetHeroProgressBar');
      const heroBadge = document.getElementById('budgetHeroStatusBadge');

      if (heroSpent) heroSpent.textContent = Formatters.currency(bStats.currentMonthSpent);
      if (heroLimit) heroLimit.textContent = Formatters.currency(bStats.overallLimit);
      if (heroPercent) heroPercent.textContent = Formatters.percent(bStats.pctUsed);

      if (heroRemainingHelper) {
        if (bStats.remaining >= 0) {
          heroRemainingHelper.textContent = `You have ${Formatters.currency(bStats.remaining)} remaining for the rest of this month.`;
          heroRemainingHelper.style.color = 'var(--text-secondary)';
        } else {
          heroRemainingHelper.textContent = `Warning: Overspent by ${Formatters.currency(Math.abs(bStats.remaining))} this month!`;
          heroRemainingHelper.style.color = 'var(--color-danger)';
        }
      }

      if (heroProgressBar) {
        heroProgressBar.style.width = `${Math.min(100, Math.max(0, bStats.pctUsed))}%`;
        heroProgressBar.style.backgroundColor = bStats.status === 'exceeded' 
          ? 'var(--color-danger)' 
          : (bStats.status === 'warning' ? 'var(--color-warning)' : 'var(--accent-primary)');
      }

      if (heroBadge) {
        heroBadge.className = 'budget-hero-badge';
        if (bStats.status === 'exceeded') {
          heroBadge.textContent = 'Critical — Budget Exceeded';
          heroBadge.classList.add('tag-exceeded');
        } else if (bStats.status === 'warning') {
          heroBadge.textContent = 'Caution — Approaching Limit';
          heroBadge.classList.add('tag-warning');
        } else {
          heroBadge.textContent = 'On Track — Safe';
          heroBadge.classList.add('tag-normal');
        }
      }

      const grid = document.getElementById('categoryBudgetsGrid');
      if (!grid) return;

      grid.innerHTML = '';

      DEFAULT_CATEGORIES.EXPENSE.forEach(cat => {
        const spent = bStats.categorySpends[cat.id] || 0;
        const limit = state.budgets.categories[cat.id] !== undefined 
          ? state.budgets.categories[cat.id] 
          : 5000;
        
        const remaining = limit - spent;
        const pct = limit > 0 ? (spent / limit) * 100 : 0;

        let statusClass = 'tag-normal';
        let statusText = 'On Track';
        let barColor = 'var(--accent-primary)';

        if (pct >= 100) {
          statusClass = 'tag-exceeded';
          statusText = 'Exceeded';
          barColor = 'var(--color-danger)';
        } else if (pct >= 80) {
          statusClass = 'tag-warning';
          statusText = 'Near Cap';
          barColor = 'var(--color-warning)';
        }

        const card = document.createElement('div');
        card.className = 'card category-budget-card';
        card.innerHTML = `
          <div class="category-budget-header">
            <div class="category-budget-icon-name">
              <span class="category-budget-icon">
                <span class="legend-color-dot" style="background-color: ${CATEGORY_COLORS[cat.id] || '#64748B'};"></span>
              </span>
              <span class="category-budget-name">${escapeHtml(cat.name)}</span>
            </div>
            <span class="category-budget-status ${statusClass}">${statusText}</span>
          </div>

          <div class="category-budget-values">
            <span class="category-budget-spent ${pct >= 100 ? 'text-expense' : ''}">${Formatters.currency(spent)}</span>
            <span class="category-budget-limit">Cap: ${Formatters.currency(limit)}</span>
          </div>

          <div class="budget-progress-track">
            <div class="budget-progress-fill" style="width: ${Math.min(100, pct)}%; background-color: ${barColor};"></div>
          </div>

          <div class="category-budget-remaining">
            <span>${remaining >= 0 ? `${Formatters.currency(remaining)} left` : `Over by ${Formatters.currency(Math.abs(remaining))}`}</span>
            <span>${Formatters.percent(pct)}</span>
          </div>
        `;
        grid.appendChild(card);
      });
    }
  };

  // --- SETTINGS VIEW CONTROLLER ---
  const SettingsView = {
    render() {
      const nameInput = document.getElementById('settingsNameInput');
      const emailInput = document.getElementById('settingsEmailInput');
      const currencySelect = document.getElementById('settingsCurrencySelect');
      const sidebarName = document.getElementById('sidebarUserName');

      if (nameInput) nameInput.value = state.profile.name || '';
      if (emailInput) emailInput.value = state.profile.email || '';
      if (currencySelect) currencySelect.value = state.profile.currency || 'INR';
      if (sidebarName) sidebarName.textContent = state.profile.name || 'Alex Mercer';

      const lightCard = document.getElementById('themeSelectLight');
      const darkCard = document.getElementById('themeSelectDark');

      if (lightCard && darkCard) {
        if (state.theme === 'dark') {
          darkCard.classList.add('active');
          lightCard.classList.remove('active');
        } else {
          lightCard.classList.add('active');
          darkCard.classList.remove('active');
        }
      }
    }
  };

  // --- TRANSACTION MODAL & CRUD LOGIC ---
  const TransactionManager = {
    modal: null,
    form: null,

    init() {
      this.modal = document.getElementById('txModal');
      this.form = document.getElementById('txForm');

      if (!this.modal || !this.form) return;

      const expenseBtn = document.getElementById('segmentExpenseBtn');
      const incomeBtn = document.getElementById('segmentIncomeBtn');
      const typeInput = document.getElementById('txTypeInput');

      const setType = (type) => {
        typeInput.value = type;
        if (type === 'expense') {
          expenseBtn.classList.add('active');
          incomeBtn.classList.remove('active');
        } else {
          incomeBtn.classList.add('active');
          expenseBtn.classList.remove('active');
        }
        this.populateCategoryDropdown(type);
      };

      if (expenseBtn) {
        expenseBtn.addEventListener('click', () => setType('expense'));
      }
      if (incomeBtn) {
        incomeBtn.addEventListener('click', () => setType('income'));
      }

      const closeBtn = document.getElementById('closeTxModalBtn');
      const cancelBtn = document.getElementById('cancelTxModalBtn');
      if (closeBtn) closeBtn.addEventListener('click', () => this.close());
      if (cancelBtn) cancelBtn.addEventListener('click', () => this.close());

      this.modal.addEventListener('click', (e) => {
        if (e.target === this.modal) this.close();
      });

      this.form.addEventListener('submit', (e) => {
        e.preventDefault();
        this.handleSave();
      });
    },

    populateCategoryDropdown(type, selectedCategory = '') {
      const select = document.getElementById('txCategorySelect');
      if (!select) return;

      select.innerHTML = '';
      const list = type === 'income' ? DEFAULT_CATEGORIES.INCOME : DEFAULT_CATEGORIES.EXPENSE;

      list.forEach(cat => {
        const option = document.createElement('option');
        option.value = cat.id;
        option.textContent = cat.name;
        if (cat.id === selectedCategory) {
          option.selected = true;
        }
        select.appendChild(option);
      });
    },

    openAdd() {
      if (!this.modal || !this.form) return;

      this.form.reset();
      document.getElementById('txEditId').value = '';
      document.getElementById('txModalTitle').textContent = 'Add Transaction';
      document.getElementById('txModalSubtitle').textContent = 'Record a new income or expense item';
      document.getElementById('saveTxSubmitText').textContent = 'Save Transaction';

      document.getElementById('txTypeInput').value = 'expense';
      document.getElementById('segmentExpenseBtn').classList.add('active');
      document.getElementById('segmentIncomeBtn').classList.remove('active');
      this.populateCategoryDropdown('expense');

      const today = new Date().toISOString().split('T')[0];
      document.getElementById('txDateInput').value = today;

      this.clearErrors();
      this.modal.classList.add('active');
      document.getElementById('txDescriptionInput').focus();
      refreshIcons();
    },

    openEdit(id) {
      if (!this.modal || !this.form) return;

      const tx = state.transactions.find(t => t.id === id);
      if (!tx) {
        Toast.show('Transaction not found', 'error');
        return;
      }

      document.getElementById('txEditId').value = tx.id;
      document.getElementById('txModalTitle').textContent = 'Edit Transaction';
      document.getElementById('txModalSubtitle').textContent = 'Modify transaction details';
      document.getElementById('saveTxSubmitText').textContent = 'Update Transaction';

      document.getElementById('txDescriptionInput').value = tx.description;
      document.getElementById('txAmountInput').value = tx.amount;
      document.getElementById('txDateInput').value = tx.date;
      document.getElementById('txPaymentMethodSelect').value = tx.method || 'UPI / Online';
      document.getElementById('txNotesInput').value = tx.notes || '';

      const type = tx.type || 'expense';
      document.getElementById('txTypeInput').value = type;
      if (type === 'income') {
        document.getElementById('segmentIncomeBtn').classList.add('active');
        document.getElementById('segmentExpenseBtn').classList.remove('active');
      } else {
        document.getElementById('segmentExpenseBtn').classList.add('active');
        document.getElementById('segmentIncomeBtn').classList.remove('active');
      }

      this.populateCategoryDropdown(type, tx.category);
      this.clearErrors();
      this.modal.classList.add('active');
      refreshIcons();
    },

    close() {
      if (this.modal) {
        this.modal.classList.remove('active');
      }
    },

    clearErrors() {
      document.querySelectorAll('.form-input, .form-select').forEach(el => el.classList.remove('is-invalid'));
      document.querySelectorAll('.form-error-msg').forEach(el => el.classList.remove('visible'));
    },

    handleSave() {
      const editId = document.getElementById('txEditId').value.trim();
      const type = document.getElementById('txTypeInput').value;
      const descInput = document.getElementById('txDescriptionInput');
      const amountInput = document.getElementById('txAmountInput');
      const categorySelect = document.getElementById('txCategorySelect');
      const dateInput = document.getElementById('txDateInput');
      const methodSelect = document.getElementById('txPaymentMethodSelect');
      const notesInput = document.getElementById('txNotesInput');

      this.clearErrors();

      let hasError = false;

      const description = descInput.value.trim();
      if (!description) {
        descInput.classList.add('is-invalid');
        document.getElementById('txDescError').classList.add('visible');
        hasError = true;
      }

      const amount = parseFloat(amountInput.value);
      if (isNaN(amount) || amount <= 0) {
        amountInput.classList.add('is-invalid');
        document.getElementById('txAmountError').classList.add('visible');
        hasError = true;
      }

      const category = categorySelect.value;
      if (!category) {
        categorySelect.classList.add('is-invalid');
        document.getElementById('txCategoryError').classList.add('visible');
        hasError = true;
      }

      const dateVal = dateInput.value;
      if (!dateVal) {
        dateInput.classList.add('is-invalid');
        document.getElementById('txDateError').classList.add('visible');
        hasError = true;
      }

      if (hasError) return;

      if (editId) {
        const index = state.transactions.findIndex(t => t.id === editId);
        if (index !== -1) {
          state.transactions[index] = {
            ...state.transactions[index],
            description,
            amount,
            type,
            category,
            date: dateVal,
            method: methodSelect.value,
            notes: notesInput.value.trim()
          };
          Storage.saveTransactions();
          Toast.show('Transaction updated successfully', 'success');
        }
      } else {
        const newTx = {
          id: 'tx_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
          description,
          amount,
          type,
          category,
          date: dateVal,
          method: methodSelect.value,
          notes: notesInput.value.trim()
        };
        state.transactions.unshift(newTx);
        Storage.saveTransactions();
        Toast.show('Transaction added successfully', 'success');
      }

      this.close();
      Views.renderCurrentPage();
    }
  };

  // --- DELETE MODAL CONTROLLER ---
  const DeleteModal = {
    modal: null,

    init() {
      this.modal = document.getElementById('deleteModal');
      const closeBtn = document.getElementById('closeDeleteModalBtn');
      const cancelBtn = document.getElementById('cancelDeleteModalBtn');
      const confirmBtn = document.getElementById('confirmDeleteTxBtn');

      if (closeBtn) closeBtn.addEventListener('click', () => this.close());
      if (cancelBtn) cancelBtn.addEventListener('click', () => this.close());

      if (this.modal) {
        this.modal.addEventListener('click', (e) => {
          if (e.target === this.modal) this.close();
        });
      }

      if (confirmBtn) {
        confirmBtn.addEventListener('click', () => {
          if (state.deleteCandidateId) {
            this.executeDelete(state.deleteCandidateId);
          }
        });
      }
    },

    open(id) {
      const tx = state.transactions.find(t => t.id === id);
      if (!tx) return;

      state.deleteCandidateId = id;

      const descElem = document.getElementById('deletePreviewDesc');
      const dateElem = document.getElementById('deletePreviewDate');
      const amtElem = document.getElementById('deletePreviewAmount');

      if (descElem) descElem.textContent = tx.description;
      if (dateElem) dateElem.textContent = Formatters.dateNice(tx.date);
      if (amtElem) amtElem.textContent = Formatters.currency(tx.amount);

      if (this.modal) this.modal.classList.add('active');
      refreshIcons();
    },

    close() {
      state.deleteCandidateId = null;
      if (this.modal) this.modal.classList.remove('active');
    },

    executeDelete(id) {
      state.transactions = state.transactions.filter(t => t.id !== id);
      Storage.saveTransactions();
      this.close();
      Toast.show('Transaction deleted', 'success');
      Views.renderCurrentPage();
    }
  };

  // --- BUDGET CONFIGURATION MODAL ---
  const BudgetModal = {
    modal: null,
    form: null,

    init() {
      this.modal = document.getElementById('budgetModal');
      this.form = document.getElementById('budgetForm');

      const closeBtn = document.getElementById('closeBudgetModalBtn');
      const cancelBtn = document.getElementById('cancelBudgetModalBtn');

      if (closeBtn) closeBtn.addEventListener('click', () => this.close());
      if (cancelBtn) cancelBtn.addEventListener('click', () => this.close());

      if (this.modal) {
        this.modal.addEventListener('click', (e) => {
          if (e.target === this.modal) this.close();
        });
      }

      if (this.form) {
        this.form.addEventListener('submit', (e) => {
          e.preventDefault();
          this.handleSave();
        });
      }
    },

    open() {
      if (!this.modal || !this.form) return;

      const now = new Date();
      const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
      const subTitleElem = document.getElementById('budgetModalTitle');
      if (subTitleElem) {
        subTitleElem.textContent = `Configure Monthly Budgets (${monthNames[now.getMonth()]} ${now.getFullYear()})`;
      }

      const overallInput = document.getElementById('overallBudgetInput');
      if (overallInput) {
        overallInput.value = state.budgets.monthlyOverall || 60000;
      }

      const container = document.getElementById('budgetCategoryInputsContainer');
      if (container) {
        container.innerHTML = '';
        DEFAULT_CATEGORIES.EXPENSE.forEach(cat => {
          const limit = state.budgets.categories[cat.id] !== undefined
            ? state.budgets.categories[cat.id]
            : 5000;

          const item = document.createElement('div');
          item.className = 'category-budget-input-item';
          item.innerHTML = `
            <label class="form-label" style="font-size: 12px; margin-bottom: 2px;">${escapeHtml(cat.name)} (₹)</label>
            <div class="input-with-prefix">
              <span class="input-currency-prefix">₹</span>
              <input 
                type="number" 
                class="form-input form-input-sm cat-budget-field" 
                data-category="${cat.id}" 
                value="${limit}" 
                min="0" 
                step="500" 
                required
              >
            </div>
          `;
          container.appendChild(item);
        });
      }

      this.modal.classList.add('active');
      refreshIcons();
    },

    close() {
      if (this.modal) this.modal.classList.remove('active');
    },

    handleSave() {
      const overallInput = document.getElementById('overallBudgetInput');
      const newOverall = parseFloat(overallInput.value);

      if (isNaN(newOverall) || newOverall <= 0) {
        Toast.show('Overall budget must be greater than zero', 'error');
        return;
      }

      state.budgets.monthlyOverall = newOverall;

      const catInputs = document.querySelectorAll('.cat-budget-field');
      catInputs.forEach(input => {
        const catId = input.getAttribute('data-category');
        const val = parseFloat(input.value) || 0;
        state.budgets.categories[catId] = val;
      });

      Storage.saveBudgets();
      Toast.show('Monthly budget configuration saved', 'success');
      this.close();
      Views.renderCurrentPage();
    }
  };

  // --- CONFIRM ACTION MODAL ---
  const ConfirmModal = {
    modal: null,

    init() {
      this.modal = document.getElementById('confirmActionModal');
      const closeBtn = document.getElementById('closeConfirmActionModalBtn');
      const cancelBtn = document.getElementById('cancelConfirmActionBtn');
      const executeBtn = document.getElementById('executeConfirmActionBtn');

      if (closeBtn) closeBtn.addEventListener('click', () => this.close());
      if (cancelBtn) cancelBtn.addEventListener('click', () => this.close());

      if (this.modal) {
        this.modal.addEventListener('click', (e) => {
          if (e.target === this.modal) this.close();
        });
      }

      if (executeBtn) {
        executeBtn.addEventListener('click', () => {
          if (typeof state.confirmActionCallback === 'function') {
            state.confirmActionCallback();
          }
          this.close();
        });
      }
    },

    open({ title, subtitle, message, buttonText, onConfirm }) {
      if (!this.modal) return;

      document.getElementById('confirmActionTitle').textContent = title || 'Confirm Action';
      document.getElementById('confirmActionSubtitle').textContent = subtitle || 'Please confirm your selection';
      document.getElementById('confirmActionMessage').textContent = message || 'Are you sure you want to proceed?';
      
      const executeBtn = document.getElementById('executeConfirmActionBtn');
      if (executeBtn) {
        executeBtn.textContent = buttonText || 'Proceed';
      }

      state.confirmActionCallback = onConfirm;
      this.modal.classList.add('active');
      refreshIcons();
    },

    close() {
      state.confirmActionCallback = null;
      if (this.modal) this.modal.classList.remove('active');
    }
  };

  // --- CSV EXPORTER ---
  const CsvExporter = {
    exportTransactions(transactions = state.transactions) {
      if (!transactions || transactions.length === 0) {
        Toast.show('No transactions available to export', 'warning');
        return;
      }

      const headers = ['ID', 'Date', 'Description', 'Type', 'Category', 'Amount (INR)', 'Payment Method', 'Notes'];
      const rows = transactions.map(t => [
        `"${t.id}"`,
        `"${t.date}"`,
        `"${(t.description || '').replace(/"/g, '""')}"`,
        `"${t.type}"`,
        `"${t.category}"`,
        t.amount.toFixed(2),
        `"${(t.method || '').replace(/"/g, '""')}"`,
        `"${(t.notes || '').replace(/"/g, '""')}"`
      ]);

      const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\r\n');
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');

      const dateStr = new Date().toISOString().split('T')[0];
      link.setAttribute('href', url);
      link.setAttribute('download', `SpendWise_Transactions_${dateStr}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      Toast.show(`Exported ${transactions.length} transactions to CSV`, 'success');
    }
  };

  // --- THEME & APPEARANCE CONTROLLER ---
  const ThemeManager = {
    init() {
      this.applyTheme(state.theme);

      const toggleBtn = document.getElementById('themeToggleBtn');
      if (toggleBtn) {
        toggleBtn.addEventListener('click', () => {
          const next = state.theme === 'dark' ? 'light' : 'dark';
          this.applyTheme(next);
        });
      }

      const lightCard = document.getElementById('themeSelectLight');
      const darkCard = document.getElementById('themeSelectDark');

      if (lightCard) {
        lightCard.addEventListener('click', () => this.applyTheme('light'));
      }
      if (darkCard) {
        darkCard.addEventListener('click', () => this.applyTheme('dark'));
      }
    },

    applyTheme(theme) {
      state.theme = theme;
      Storage.saveTheme();

      const body = document.body;
      const themeIcon = document.getElementById('themeIcon');

      if (theme === 'dark') {
        body.classList.remove('light-theme');
        body.classList.add('dark-theme');
        if (themeIcon) themeIcon.setAttribute('data-lucide', 'sun');
      } else {
        body.classList.remove('dark-theme');
        body.classList.add('light-theme');
        if (themeIcon) themeIcon.setAttribute('data-lucide', 'moon');
      }

      refreshIcons();
      SettingsView.render();

      if (state.currentPage === 'dashboard') {
        DashboardView.renderExpenseChart();
        DashboardView.renderCategoryChart();
      } else if (state.currentPage === 'analytics') {
        AnalyticsView.renderCashFlowChart(AnalyticsView.getFilteredTransactions());
        AnalyticsView.renderCategoryBarChart(AnalyticsView.getFilteredTransactions());
      }
    }
  };

  // --- EVENT LISTENERS & WIRING ---
  function setupEventListeners() {
    // 1. Mobile Menu Drawer Toggle
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const mobileCloseBtn = document.getElementById('mobileCloseBtn');
    const sidebar = document.getElementById('sidebar');
    const sidebarOverlay = document.getElementById('sidebarOverlay');

    if (mobileMenuBtn && sidebar && sidebarOverlay) {
      mobileMenuBtn.addEventListener('click', () => {
        sidebar.classList.add('open');
        sidebarOverlay.classList.add('active');
      });
    }

    if (mobileCloseBtn && sidebar && sidebarOverlay) {
      mobileCloseBtn.addEventListener('click', () => {
        sidebar.classList.remove('open');
        sidebarOverlay.classList.remove('active');
      });
    }

    if (sidebarOverlay) {
      sidebarOverlay.addEventListener('click', () => {
        sidebar.classList.remove('open');
        sidebarOverlay.classList.remove('active');
      });
    }

    // 2. Global Add Transaction Button
    const addTxBtn = document.getElementById('openAddTxModalBtn');
    if (addTxBtn) {
      addTxBtn.addEventListener('click', () => TransactionManager.openAdd());
    }

    // 3. Global Search Input
    const globalSearch = document.getElementById('globalSearchInput');
    if (globalSearch) {
      globalSearch.addEventListener('input', (e) => {
        state.txFilters.search = e.target.value;
        state.txFilters.page = 1;
        if (state.currentPage !== 'transactions') {
          Views.switchPage('transactions');
          const tableSearch = document.getElementById('txFilterSearch');
          if (tableSearch) tableSearch.value = e.target.value;
        } else {
          TransactionsView.filterAndRenderTable();
        }
      });
    }

    // 4. Keyboard Shortcuts
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        TransactionManager.close();
        DeleteModal.close();
        BudgetModal.close();
        ConfirmModal.close();
      }

      if (e.key === '/' && !['INPUT', 'SELECT', 'TEXTAREA'].includes(document.activeElement.tagName)) {
        e.preventDefault();
        const searchInput = document.getElementById('globalSearchInput');
        if (searchInput) searchInput.focus();
      }

      if ((e.key === 'n' || e.key === 'N') && !['INPUT', 'SELECT', 'TEXTAREA'].includes(document.activeElement.tagName)) {
        e.preventDefault();
        TransactionManager.openAdd();
      }
    });

    // 5. Dashboard Edit Budget Button
    const dashboardEditBudgetBtn = document.getElementById('dashboardEditBudgetBtn');
    if (dashboardEditBudgetBtn) {
      dashboardEditBudgetBtn.addEventListener('click', () => BudgetModal.open());
    }

    // 6. Dashboard Chart Tab Toggles (Expenses vs Comparison)
    const tabExpense = document.getElementById('chartTabExpense');
    const tabCompare = document.getElementById('chartTabCompare');

    if (tabExpense && tabCompare) {
      tabExpense.addEventListener('click', () => {
        state.dashboardChartMode = 'expense';
        tabExpense.classList.add('active');
        tabCompare.classList.remove('active');
        DashboardView.renderExpenseChart();
      });

      tabCompare.addEventListener('click', () => {
        state.dashboardChartMode = 'comparison';
        tabCompare.classList.add('active');
        tabExpense.classList.remove('active');
        DashboardView.renderExpenseChart();
      });
    }

    // 7. Transactions Filter Controls
    const txFilterSearch = document.getElementById('txFilterSearch');
    const txFilterType = document.getElementById('txFilterType');
    const txFilterCategory = document.getElementById('txFilterCategory');
    const txFilterDateRange = document.getElementById('txFilterDateRange');
    const txFilterSort = document.getElementById('txFilterSort');
    const resetFiltersBtn = document.getElementById('resetFiltersBtn');
    const emptyStateResetBtn = document.getElementById('emptyStateResetFiltersBtn');

    if (txFilterSearch) {
      txFilterSearch.addEventListener('input', (e) => {
        state.txFilters.search = e.target.value;
        state.txFilters.page = 1;
        TransactionsView.filterAndRenderTable();
      });
    }

    if (txFilterType) {
      txFilterType.addEventListener('change', (e) => {
        state.txFilters.type = e.target.value;
        state.txFilters.page = 1;
        TransactionsView.filterAndRenderTable();
      });
    }

    if (txFilterCategory) {
      txFilterCategory.addEventListener('change', (e) => {
        state.txFilters.category = e.target.value;
        state.txFilters.page = 1;
        TransactionsView.filterAndRenderTable();
      });
    }

    if (txFilterDateRange) {
      txFilterDateRange.addEventListener('change', (e) => {
        state.txFilters.timeframe = e.target.value;
        state.txFilters.page = 1;
        TransactionsView.filterAndRenderTable();
      });
    }

    if (txFilterSort) {
      txFilterSort.addEventListener('change', (e) => {
        state.txFilters.sort = e.target.value;
        TransactionsView.filterAndRenderTable();
      });
    }

    const resetFilters = () => {
      state.txFilters.search = '';
      state.txFilters.type = 'all';
      state.txFilters.category = 'all';
      state.txFilters.timeframe = 'all';
      state.txFilters.sort = 'date_desc';
      state.txFilters.page = 1;

      if (txFilterSearch) txFilterSearch.value = '';
      if (globalSearch) globalSearch.value = '';
      if (txFilterType) txFilterType.value = 'all';
      if (txFilterCategory) txFilterCategory.value = 'all';
      if (txFilterDateRange) txFilterDateRange.value = 'all';
      if (txFilterSort) txFilterSort.value = 'date_desc';

      TransactionsView.filterAndRenderTable();
    };

    if (resetFiltersBtn) resetFiltersBtn.addEventListener('click', resetFilters);
    if (emptyStateResetBtn) emptyStateResetBtn.addEventListener('click', resetFilters);

    // 8. Pagination Controls
    const prevPageBtn = document.getElementById('prevPageBtn');
    const nextPageBtn = document.getElementById('nextPageBtn');

    if (prevPageBtn) {
      prevPageBtn.addEventListener('click', () => {
        if (state.txFilters.page > 1) {
          state.txFilters.page--;
          TransactionsView.filterAndRenderTable();
        }
      });
    }

    if (nextPageBtn) {
      nextPageBtn.addEventListener('click', () => {
        state.txFilters.page++;
        TransactionsView.filterAndRenderTable();
      });
    }

    // 9. Export CSV Buttons
    const exportCsvBtn = document.getElementById('exportCsvBtn');
    const settingsExportCsvBtn = document.getElementById('settingsExportCsvBtn');

    if (exportCsvBtn) {
      exportCsvBtn.addEventListener('click', () => CsvExporter.exportTransactions());
    }
    if (settingsExportCsvBtn) {
      settingsExportCsvBtn.addEventListener('click', () => CsvExporter.exportTransactions());
    }

    // 10. Analytics Filters
    const analyticsMonthSelect = document.getElementById('analyticsMonthSelect');
    const analyticsYearSelect = document.getElementById('analyticsYearSelect');

    if (analyticsMonthSelect) {
      analyticsMonthSelect.addEventListener('change', (e) => {
        state.analyticsFilters.month = e.target.value;
        AnalyticsView.render();
      });
    }

    if (analyticsYearSelect) {
      analyticsYearSelect.addEventListener('change', (e) => {
        state.analyticsFilters.year = e.target.value;
        AnalyticsView.render();
      });
    }

    // 11. Budgets Page Configure Button
    const openBudgetConfigModalBtn = document.getElementById('openBudgetConfigModalBtn');
    if (openBudgetConfigModalBtn) {
      openBudgetConfigModalBtn.addEventListener('click', () => BudgetModal.open());
    }

    // 12. Settings - Profile Form
    const profileForm = document.getElementById('profileForm');
    if (profileForm) {
      profileForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('settingsNameInput').value.trim();
        const email = document.getElementById('settingsEmailInput').value.trim();
        const currency = document.getElementById('settingsCurrencySelect').value;

        state.profile = { name, email, currency };
        Storage.saveProfile();
        SettingsView.render();
        Toast.show('Profile preferences updated', 'success');
      });
    }

    // 13. Settings - JSON Backup & Restore
    const settingsExportJsonBtn = document.getElementById('settingsExportJsonBtn');
    const importJsonFileInput = document.getElementById('importJsonFileInput');

    if (settingsExportJsonBtn) {
      settingsExportJsonBtn.addEventListener('click', () => {
        const backupData = {
          version: '2.4.0',
          exportedAt: new Date().toISOString(),
          profile: state.profile,
          budgets: state.budgets,
          theme: state.theme,
          transactions: state.transactions
        };

        const jsonStr = JSON.stringify(backupData, null, 2);
        const blob = new Blob([jsonStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `SpendWise_Backup_${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);

        Toast.show('Full JSON backup downloaded', 'success');
      });
    }

    if (importJsonFileInput) {
      importJsonFileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
          try {
            const data = JSON.parse(event.target.result);
            if (Array.isArray(data.transactions)) {
              state.transactions = data.transactions;
              Storage.saveTransactions();
            }
            if (data.budgets) {
              state.budgets = { ...DEFAULT_BUDGETS, ...data.budgets };
              Storage.saveBudgets();
            }
            if (data.profile) {
              state.profile = { ...DEFAULT_PROFILE, ...data.profile };
              Storage.saveProfile();
            }
            if (data.theme) {
              ThemeManager.applyTheme(data.theme);
            }
            Toast.show('Backup imported successfully', 'success');
            Views.renderCurrentPage();
          } catch (err) {
            console.error('Import parse error:', err);
            Toast.show('Invalid JSON backup file format', 'error');
          }
        };
        reader.readAsText(file);
      });
    }

    // 14. Settings - Reload Sample Data
    const loadSampleDataBtn = document.getElementById('loadSampleDataBtn');
    if (loadSampleDataBtn) {
      loadSampleDataBtn.addEventListener('click', () => {
        ConfirmModal.open({
          title: 'Reload Demonstration Data',
          subtitle: 'Overwrites existing sample dataset',
          message: 'This will load fresh 6-month realistic demo transactions for portfolio evaluation. Continue?',
          buttonText: 'Reload Demo Data',
          onConfirm: () => {
            state.transactions = generateDemoTransactions();
            Storage.saveTransactions();
            Toast.show('Demonstration data loaded', 'success');
            Views.renderCurrentPage();
          }
        });
      });
    }

    // 15. Settings - Danger Zone: Clear Transactions
    const clearAllTxBtn = document.getElementById('clearAllTxBtn');
    if (clearAllTxBtn) {
      clearAllTxBtn.addEventListener('click', () => {
        ConfirmModal.open({
          title: 'Clear All Transactions',
          subtitle: 'Permanent deletion',
          message: 'Are you sure you want to delete all recorded transactions? This action cannot be undone.',
          buttonText: 'Delete All',
          onConfirm: () => {
            Storage.clearAllTransactions();
            Toast.show('All transactions cleared', 'warning');
            Views.renderCurrentPage();
          }
        });
      });
    }

    // 16. Settings - Danger Zone: Factory Reset
    const factoryResetBtn = document.getElementById('factoryResetBtn');
    if (factoryResetBtn) {
      factoryResetBtn.addEventListener('click', () => {
        ConfirmModal.open({
          title: 'Factory Reset SpendWise',
          subtitle: 'Reset everything to default',
          message: 'This will reset all transactions, budgets, profile details, and theme settings to factory default. Proceed?',
          buttonText: 'Factory Reset',
          onConfirm: () => {
            Storage.factoryReset();
            ThemeManager.applyTheme('light');
            Toast.show('Application restored to factory state', 'success');
            Views.switchPage('dashboard');
          }
        });
      });
    }
  }

  // --- Live Clock & Date Badge ---
  function updateLiveDate() {
    const badge = document.getElementById('currentDateBadge');
    if (!badge) return;

    const now = new Date();
    const options = { weekday: 'long', day: 'numeric', month: 'short', year: 'numeric' };
    badge.textContent = now.toLocaleDateString('en-IN', options);
  }

  // --- Application Bootstrap ---
  function initApp() {
    Toast.init();
    Storage.load();
    ThemeManager.init();
    Views.init();
    TransactionManager.init();
    DeleteModal.init();
    BudgetModal.init();
    ConfirmModal.init();
    setupEventListeners();
    updateLiveDate();

    // Render initial page (Dashboard)
    Views.switchPage('dashboard');

    console.info('🚀 SpendWise Fintech Expense Tracker v2.4.0 Initialized.');
  }

  // --- Public API for HTML inline handlers ---
  window.SpendWise = {
    openAddTxModal: () => TransactionManager.openAdd(),
    openEditTxModal: (id) => TransactionManager.openEdit(id),
    promptDeleteTx: (id) => DeleteModal.open(id),
    openBudgetModal: () => BudgetModal.open(),
    exportCsv: () => CsvExporter.exportTransactions(),
    switchPage: (page) => Views.switchPage(page)
  };

  // Run on DOM Ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
  } else {
    initApp();
  }

})();
