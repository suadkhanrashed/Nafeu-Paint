import React, { useState, useEffect, createContext, useContext, ReactNode, useRef } from 'react';
import { 
  BrowserRouter as Router, 
  Routes, 
  Route, 
  Navigate, 
  useNavigate,
  useLocation,
  Link,
  useSearchParams
} from 'react-router-dom';
import { 
  onAuthStateChanged, 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut, 
  User as FirebaseUser 
} from 'firebase/auth';
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import firebaseConfigLocal from '../firebase-applet-config.json';
import { 
  doc, 
  getDoc, 
  setDoc, 
  onSnapshot, 
  collection, 
  query, 
  where,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
  arrayUnion,
  getDocFromServer,
  orderBy,
  writeBatch
} from 'firebase/firestore';
import { auth, db, storage } from './firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import * as htmlToImage from 'html-to-image';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const updateShopDueInternal = async (shopCode: string, amount: number) => {
  if (amount === 0 || !shopCode) return;
  try {
    const shopsRef = collection(db, 'shops');
    const q = query(shopsRef, where('code', '==', shopCode));
    const snap = await getDocs(q);
    if (!snap.empty) {
      const shopDoc = snap.docs[0];
      const currentDue = shopDoc.data().totalDue || 0;
      await updateDoc(shopDoc.ref, { totalDue: currentDue + amount });
    }
  } catch (error) {
    console.error("Error updating shop due:", error);
  }
};
import { UserProfile, UserRole, UserStatus, Shop, Order, OrderItem, Transaction, ActivityType, Permission, RolePermissions, Product, AreaRequest } from './types';
import { 
  LayoutDashboard, 
  ShoppingCart, 
  Truck, 
  Users, 
  Store, 
  LogOut, 
  Plus, 
  Search, 
  Filter, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  ChevronRight,
  ChevronDown,
  Database,
  Menu,
  X,
  Package,
  BarChart3,
  PlusCircle,
  DollarSign,
  MapPin,
  Settings,
  AlertCircle,
  Shield,
  Wallet,
  History,
  ArrowUpCircle,
  ArrowDownCircle,
  FileText,
  ChevronLeft,
  ArrowLeft,
  ArrowRight,
  Download,
  UserCircle,
  Phone,
  PhoneCall,
  LayoutGrid,
  List,
  Contact2,
  Box,
  Minus,
  Activity as ActivityLogIcon,
  Trash2,
  Bell,
  Edit,
  Upload,
  Check,
  Image as ImageIcon,
  Library,
  ShieldAlert,
  Palette,
  ShieldCheck,
  CreditCard,
  TrendingUp,
  UserCircle2,
  Warehouse,
  Leaf,
  Eye,
  EyeOff
} from 'lucide-react';
import { motion, AnimatePresence, Reorder } from 'motion/react';
import { format } from 'date-fns';
import { useParams } from 'react-router-dom';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell,
  LineChart,
  Line,
  AreaChart,
  Area
} from 'recharts';

const PRODUCT_SIZES = ['1/2 Pound', '1 Pound', '2 Pound', 'Gallon', 'Liter', 'Kiloliter'];

/**
 * Calculates the best text color (black or white) for a given background hex color.
 */
function getContrastColor(hexColor: string) {
  if (!hexColor || !hexColor.startsWith('#')) return '#ffffff';
  const hex = hexColor.replace('#', '');
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;
  return brightness > 128 ? '#0f172a' : '#ffffff'; // slate-900 or white
}

function getProductBrandingColor(name: string, customColor?: string) {
  if (customColor) return customColor;
  
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  const colors = [
    '#2563eb', '#10b981', '#ef4444', '#f59e0b', '#8b5cf6', 
    '#ec4899', '#06b6d4', '#f97316', '#14b8a6', '#6366f1',
    '#3b82f6', '#059669', '#dc2626', '#d97706', '#7c3aed',
    '#db2777', '#0891b2', '#ea580c', '#0d9488', '#4f46e5'
  ];
  
  return colors[Math.abs(hash) % colors.length];
}

const CHART_COLORS = [
  '#2563eb', '#10b981', '#ef4444', '#f59e0b', '#8b5cf6', 
  '#ec4899', '#06b6d4', '#f97316', '#14b8a6', '#6366f1'
];

const DONUT_COLORS = [
  '#3b82f6', '#60a5fa', '#93c5fd', '#bfdbfe', '#dbeafe'
];

// --- Language Context ---
type Language = 'en' | 'bn';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const translations: Record<Language, Record<string, string>> = {
  en: {
    dashboard: "Dashboard",
    newOrder: "New Order",
    orders: "Orders",
    history: "History",
    shops: "Shops",
    products: "Products",
    users: "Users",
    reports: "Reports",
    productCalculation: "Product Calculation",
    lastYear: "Last Year",
    last6Months: "Last 6 Months",
    lastMonth: "Last Month",
    last15Days: "Last 15 Days",
    lastWeek: "Last Week",
    logout: "Logout",
    welcome: "Welcome Back",
    performanceOverview: "Performance Overview",
    monthlySales: "Monthly Sales",
    collection: "Collection",
    due: "Due",
    totalOrders: "Total Orders",
    recentOrders: "Recent Orders",
    viewDetails: "View Details",
    hideDetails: "Hide Details",
    myShop: "My Shop",
    alwaysGreen: "Always Green",
    fieldRep: "Field Rep",
    shopOwner: "Shop Owner",
    admin: "Admin",
    owner: "Owner",
    manager: "Manager",
    worker: "Worker",
    shop_owner: "Shop Owner",
    worker_foreman: "Worker Foreman",
    manager_foreman: "Manager Foreman",
    delivery_manager: "Delivery Manager",
    field_manager: "Field Manager",
    foreman: "Foreman",
    delivery_man: "Delivery Man",
    workerForeman: "Worker Foreman",
    managerForeman: "Manager Foreman",
    deliveryManager: "Delivery Manager",
    fieldManager: "Field Manager",
    deliveryMan: "Delivery Man",
    deliveryPersonnel: "Delivery",
    customer: "Customer",
    publicCatalog: "Public Catalog",
    selectLanguage: "Select Language",
    english: "English",
    bangla: "Bangla",
    orderSummary: "Order Summary",
    grandTotal: "Grand Total",
    subtotal: "Subtotal",
    totalQuantity: "Total Quantity",
    duplicateProductError: "A product with the same name, grade, and sizes already exists.",
    quantity: "Quantity",
    rate: "Rate",
    total: "Total",
    product: "Product",
    grade: "Grade",
    size: "Size",
    addShop: "Add Shop",
    shopName: "Shop Name",
    area: "Area",
    generateCode: "Generate Code & Save",
    cancel: "Cancel",
    editProduct: "Edit Product",
    addProduct: "Add Product",
    baseRate: "Base Rate",
    saveChanges: "Save Changes",
    delete: "Delete",
    confirmDelete: "Are you sure you want to delete this item?",
    errorOccurred: "An error occurred",
    requestModify: "Request Modification",
    catalog: "Catalog",
    shopList: "Shop List",
    orderList: "Order List",
    activeOrders: "Active Orders",
    orderDetails: "Order Details",
    orderId: "Order ID",
    orderDate: "Order Date",
    modificationHistory: "Modification History",
    lastModified: "Last Modified",
    at: "At",
    viewHistory: "View History",
    orderNotFound: "Order Not Found",
    backToOrders: "Back to Orders",
    all: "All",
    standardView: "Standard",
    deliveryView: "Delivery",
    delQty: "Delivered Qty",
    packed: "Packed",
    packedItems: "Packed",
    gradeAbbr: "Grade",
    productList: "Product List",
    details: "Details",
    shopCode: "Shop Code",
    ownerLabel: "Owner",
    status: "Status",
    actions: "Actions",
    paymentStatus: "Payment Status",
    amountPaid: "Amount Paid",
    dueAmount: "Due Amount",
    date: "Date",
    received: "Received",
    pending: "Pending",
    delivered: "Delivered",
    cancelled: "Cancelled",
    inTransport: "In Transport",
    paid: "Paid",
    partiallyPaid: "Partially Paid",
    unpaid: "Unpaid",
    addPayment: "Add Payment",
    markReceived: "Mark Received",
    noOrders: "No Orders Found",
    noShops: "No Shops Found",
    noProducts: "No Products Found",
    search: "Search",
    filter: "Filter",
    fillDetails: "Fill Details",
    createNewOrder: "Create New Order",
    shopSelection: "Shop Selection",
    selectShop: "Select Shop",
    selectProduct: "Select Product",
    selectSize: "Select Size",
    reviewOrder: "Review Order",
    shopDetails: "Shop Details",
    orderHistory: "Order History",
    viewPastOrders: "View Past Orders",
    enterShopCode: "Enter Shop Code",
    wantPermanentAccess: "Want Permanent Access?",
    requestPending: "Request Pending",
    requesting: "Requesting...",
    requestPermission: "Request Permission",
    userManagement: "User Management",
    manageUsers: "Manage Users",
    permissionManagement: "Permission Management",
    manageRoles: "Manage Roles & Permissions",
    role: "Role",
    permissions: "Permissions",
    savePermissions: "Save Permissions",
    manageProducts: "Manage Products",
    salesReports: "Sales Reports",
    financialOverview: "Financial Overview",
    shopPerformance: "Shop Performance",
    explorePaints: "Explore Paints",
    requestSent: "Request Sent",
    items: "Items",
    transactions: "Transactions",
    add: "Add",
    noTransactions: "No Transactions Found",
    noNote: "No Note",
    by: "By",
    addTransaction: "Add Transaction",
    previousDue: "Previous Due",
    previousOrder: "Previous Order",
    previousPayment: "Previous Payment",
    dueAddition: "Due Addition",
    type: "Type",
    payment: "Payment",
    addDue: "Add Due",
    amount: "Amount",
    note: "Note",
    save: "Save",
    grant: "Grant",
    deny: "Deny",
    granted: "Granted",
    customSizes: "Custom Sizes",
    variants: "Variants",
    orderItems: "Order Items",
    editOrder: "Edit Order",
    editTransaction: "Edit Transaction",
    update: "Update",
    edit: "Edit",
    placingOrder: "Placing Order...",
    confirmSubmit: "Confirm Order",
    deleteOrder: "Delete Order",
    deleteProduct: "Delete Product",
    deleteShop: "Delete Shop",
    manageBranding: "Manage Branding",
    totalSales: "Total Sales",
    totalReceived: "Total Received",
    totalOutstanding: "Total Outstanding",
    user: "User",
    name: "Name",
    quickActions: "Quick Actions",
    noHistory: "No History",
    shopNotFound: "Shop Not Found",
    invalidShopCode: "Invalid Shop Code",
    accountPending: "Account Pending Approval",
    accountSuspended: "Account Suspended",
    requestReAccess: "Request Re-access",
    reAccessRequested: "Re-access Requested",
    reAccessRequestSent: "Request Sent to Administrator",
    suspendedMessage: "Your account is suspended. Please contact support.",
    grantReAccess: "Grant Re-access",
    denyReAccess: "Deny Request",
    awaitingApproval: "Your account is awaiting approval.",
    signInWithGoogle: "Sign in with Google",
    loadingOrderflow: "Loading...",
    completeProfile: "Complete Your Profile",
    selectRole: "Select Your Role",
    administratorMaster: "Administrator",
    fieldRepresentative: "Field Representative",
    enterUniqueShopCode: "Enter Unique Shop Code",
    settingUp: "Setting Up...",
    getStarted: "Get Started",
    or: "or",
    day: "Day",
    week: "Week",
    month: "Month",
    loginToSeePrice: "Login to See Prices",
    noItemsYet: "No Items Yet",
    checkAsCustomer: "Explore as Customer",
    contactRepresentative: "Contact to Order",
    duplicateProduct: "Product Already Exists",
    successAdded: "Successfully Added",
    successUpdated: "Successfully Updated",
    successDeleted: "Successfully Deleted",
    permissionDenied: "Permission Denied: You do not have access to this action",
    contactInfo: "Contact Information",
    saveContactInfo: "Save Information",
    category: "Category",
    image: "Image",
    uploading: "Uploading...",
    chooseImage: "Choose Image",
    errorUploading: "Error Uploading",
    successUploaded: "Upload Successful",
    saveToGallery: "Save to Gallery",
    contactForOrder: "Contact for Order",
    contactName: "Name",
    contactNumber: "Number",
    attachReceipt: "Attach Receipt/Picture",
    imagePreview: "Image Preview",
    changeImage: "Change Image",
    uploadingImage: "Uploading Image...",
    profile: "Profile",
    profileSettings: "Profile Settings",
    updateProfile: "Update Profile",
    phoneNumber: "Phone Number",
    contacts: "Contacts",
    shopOwnerDashboard: "Shop Owner Dashboard",
    call: "Call",
    noContacts: "No Contacts Found",
    onlyWorkersVisible: "Only Field Rep Numbers Visible",
    areaRequests: "Area Requests",
    myAssignedAreas: "Assigned Areas",
    requestNewArea: "Request New Area",
    noAreasAssigned: "No Areas Assigned",
    enterAreaName: "Enter Area Name",
    submit: "Submit",
    recentRequests: "Recent Requests",
    noAreaRequests: "No Area Requests Found",
    requestedArea: "Requested Area",
    approve: "Approve",
    reject: "Reject",
    approved: "Approved",
    rejected: "Rejected",
    requestSubmitted: "Request Submitted",
    areas: "Areas",
    myAreas: "My Areas",
    branding: "Branding",
    logoSettings: "Logo Settings",
    logoSettingsDesc: "Update your brand logo (Max 200x200px)",
    uploadLogo: "Upload Logo",
    logoRequirements: "Max 500KB (PNG, JPG, SVG)",
    backgroundSettings: "Canvas Settings",
    backgroundSettingsDesc: "Update your application background theme",
    uploadBackground: "Upload Theme",
    bgRequirements: "Max 2MB (PNG, JPG)",
    noLogo: "No Logo Set",
    activityLog: "Activity Log",
    activityLogSubtitle: "Monitor system changes and audit trails",
    checkStatus: "Check Status",
    logoSizeError: "Logo size must be under 500KB",
    logoUploadError: "Logo upload failed",
    modifiedBy: "Modified By",
    notifications: "Notifications",
    newOrderNotification: "New order received",
    orderModifiedNotification: "Order has been updated",
    noNotifications: "No Notifications",
    finance: "Finance",
    deliverySector: "Delivery Sector",
    productShopSector: "Product/Shop Sector",
    workerSector: "Worker Sector",
    coreOperations: "Core Operations",
    inventoryCatalog: "Inventory & Catalog",
    managementControl: "Management & Control",
    analyticsPerformance: "Analytics & Performance",
    productRankings: "Product Rankings",
    demandChart: "Demand Chart",
    productDemandAnalytics: "Product Demand Analytics",
    areaBaseAnalytics: "Area Base Analytics",
    clickToExploreShops: "Click to Explore Shops",
    shopBaseDetails: "Shop Base Details",
    backToAreas: "Back to Areas",
    preparingDownload: "Preparing Download",
    paymentRate: "Payment Rate",
    preparingDownloadLong: "Preparing your download, please wait...",
    MANAGE_USERS: "Manage Users",
    MANAGE_ROLES: "Manage Roles",
    MANAGE_PERMISSIONS: "Manage Permissions",
    MANAGE_SHOPS: "Manage Shops",
    MANAGE_PRODUCTS: "Manage Products",
    CREATE_ORDERS: "Create Orders",
    VIEW_ORDERS: "View Orders",
    UPDATE_ORDER_STATUS: "Update Status",
    MANAGE_PAYMENTS: "Manage Payments",
    VIEW_REPORTS: "View Reports",
    VIEW_ACTIVITY_LOG: "View Activity Log",
    MANAGE_CATALOG: "Manage Catalog",
    VIEW_DASHBOARD: "View Dashboard",
    MARK_ORDER_RECEIVED: "Mark Received",
    VIEW_MY_SHOP: "View My Shop",
    VIEW_SHOPS: "View All Shops",
    DELETE_ORDER: "Delete Orders",
    EDIT_ORDER: "Edit Orders",
    DELETE_PRODUCT: "Delete Products",
    DELETE_SHOP: "Delete Shops",
    DELETE_TRANSACTION: "Delete Transactions",
    DELETE_USER: "Delete Users",
    MANAGE_BRANDING: "Manage Branding",
    MANAGE_USER_ROLES: "Manage User Roles",
    ACCESS_FINANCE_VIEW: "Finance View",
    ACCESS_FINANCE_EDIT: "Finance Edit",
    ACCESS_DELIVERY_VIEW: "Delivery View",
    ACCESS_DELIVERY_EDIT: "Delivery Edit",
    ACCESS_PRODUCT_SHOP_VIEW: "Product/Shop View",
    ACCESS_PRODUCT_SHOP_EDIT: "Product/Shop Edit",
    ACCESS_WORKER_VIEW: "Worker View",
    ACCESS_WORKER_EDIT: "Worker Edit",
  },
  bn: {
    dashboard: "ড্যাশবোর্ড",
    newOrder: "নতুন অর্ডার",
    orders: "অর্ডার",
    history: "ইতিহাস",
    shops: "দোকান",
    products: "পণ্য",
    users: "ব্যবহারকারী",
    reports: "রিপোর্ট",
    productCalculation: "প্রোডাক্ট ক্যালকুলেশন",
    lastYear: "গত বছর",
    last6Months: "গত ৬ মাস",
    lastMonth: "গত মাস",
    last15Days: "গত ১৫ দিন",
    lastWeek: "গত সপ্তাহ",
    logout: "লগআউট",
    welcome: "স্বাগতম",
    performanceOverview: "পারফরম্যান্স ওভারভিউ",
    monthlySales: "মাসিক বিক্রয়",
    collection: "সংগ্রহ",
    due: "বাকি",
    totalOrders: "মোট অর্ডার",
    recentOrders: "সাম্প্রতিক অর্ডার",
    viewDetails: "বিস্তারিত দেখুন",
    hideDetails: "বিস্তারিত লুকান",
    myShop: "আমার দোকান",
    alwaysGreen: "ALWAYS GREEN",
    fieldRep: "ফিল্ড প্রতিনিধি",
    shopOwner: "দোকানের মালিক",
    admin: "অ্যাডমিন",
    owner: "মালিক",
    manager: "ম্যানেজার",
    worker: "কর্মী",
    shop_owner: "দোকানের মালিক",
    worker_foreman: "কর্মী ফোরম্যান",
    manager_foreman: "ম্যানেজার ফোরম্যান",
    delivery_manager: "ডেলিভারি ম্যানেজার",
    field_manager: "ফিল্ড ম্যানেজার",
    foreman: "ফোরম্যান",
    delivery_man: "ডেলিভারি ম্যান",
    workerForeman: "কর্মী ফোরম্যান",
    managerForeman: "ম্যানেজার ফোরম্যান",
    deliveryManager: "ডেলিভারি ম্যানেজার",
    fieldManager: "ফিল্ড ম্যানেজার",
    deliveryMan: "ডেলিভারি ম্যান",
    deliveryPersonnel: "ডেলিভারি কর্মী",
    customer: "কাস্টমার",
    publicCatalog: "পাবলিক ক্যাটালগ",
    selectLanguage: "ভাষা নির্বাচন করুন",
    english: "ইংরেজি",
    bangla: "বাংলা",
    orderSummary: "অর্ডারের সারাংশ",
    grandTotal: "সর্বমোট",
    subtotal: "উপমোট",
    totalQuantity: "মোট পরিমাণ",
    duplicateProductError: "একই নাম, গ্রেড এবং সাইজের পণ্য আগে থেকেই আছে।",
    quantity: "পরিমাণ",
    rate: "দর",
    total: "মোট",
    product: "পণ্য",
    grade: "গ্রেড",
    size: "সাইজ",
    addShop: "দোকান যোগ করুন",
    shopName: "দোকানের নাম",
    area: "এলাকা",
    generateCode: "কোড তৈরি করুন এবং সংরক্ষণ করুন",
    cancel: "বাতিল",
    editProduct: "পণ্য সম্পাদনা করুন",
    editTransaction: "লেনদেন সম্পাদনা করুন",
    update: "আপডেট",
    edit: "সম্পাদনা",
    addProduct: "পণ্য যোগ করুন",
    baseRate: "বেস রেট",
    saveChanges: "পরিবর্তন সংরক্ষণ করুন",
    delete: "মুছে ফেলুন",
    confirmDelete: "আপনি কি নিশ্চিত যে এটি মুছে ফেলতে চান?",
    errorOccurred: "একটি ত্রুটি ঘটেছে",
    permissionDenied: "অনুমতি অস্বীকার করা হয়েছে: এই কাজটি করার জন্য আপনার অ্যাক্সেস নেই",
    requestModify: "পরিবর্তনের অনুরোধ করুন",
    catalog: "ক্যাটালগ",
    shopList: "দোকানের তালিকা",
    orderList: "অর্ডারের তালিকা",
    activeOrders: "সক্রিয় অর্ডার",
    orderDetails: "অর্ডারের বিস্তারিত",
    orderId: "অর্ডার আইডি",
    orderDate: "অর্ডারের তারিখ",
    modificationHistory: "পরিবর্তনের বিবরণ",
    lastModified: "সর্বশেষ পরিবর্তন",
    at: "সময়",
    viewHistory: "ইতিহাস দেখুন",
    orderNotFound: "অর্ডার পাওয়া যায়নি",
    backToOrders: "অর্ডারের তালিকায় ফিরে যান",
    all: "সবগুলো",
    standardView: "সাধারণ ভিউ",
    deliveryView: "ডেলিভারি ভিউ",
    delQty: "পরিমাণ",
    packed: "প্যাক করা হয়েছে",
    packedItems: "প্যাক করা",
    gradeAbbr: "গ্রেড",
    productList: "পণ্যের তালিকা",
    details: "বিস্তারিত",
    shopCode: "দোকান কোড",
    status: "অবস্থা",
    actions: "অ্যাকশন",
    paymentStatus: "পেমেন্ট অবস্থা",
    amountPaid: "পরিশোধিত টাকা",
    dueAmount: "বকেয়া টাকা",
    received: "গৃহীত",
    pending: "পেন্ডিং",
    delivered: "ডেলিভারি করা হয়েছে",
    cancelled: "বাতিল করা হয়েছে",
    inTransport: "পরিবহনে আছে",
    paid: "পরিশোধিত",
    partiallyPaid: "আংশিক পরিশোধিত",
    previousDue: "আগের বকেয়া",
    previousOrder: "আগের অর্ডার",
    previousPayment: "আগের পেমেন্ট",
    dueAddition: "বকেয়া যোগ",
    date: "তারিখ",
    unpaid: "অপরিদত্ত",
    addPayment: "পেমেন্ট যোগ করুন",
    markReceived: "গৃহীত হিসেবে চিহ্নিত করুন",
    noOrders: "কোন অর্ডার পাওয়া যায়নি",
    noShops: "কোন দোকান পাওয়া যায়নি",
    noProducts: "কোন পণ্য পাওয়া যায়নি",
    search: "অনুসন্ধান করুন",
    filter: "ফিল্টার করুন",
    fillDetails: "বিস্তারিত পূরণ করুন",
    createNewOrder: "নতুন অর্ডার তৈরি করুন",
    shopSelection: "দোকান নির্বাচন",
    selectShop: "দোকান নির্বাচন করুন",
    selectProduct: "পণ্য নির্বাচন করুন",
    selectSize: "সাইজ নির্বাচন করুন",
    reviewOrder: "অর্ডার পর্যালোচনা",
    shopDetails: "দোকানের বিস্তারিত",
    orderHistory: "অর্ডার ইতিহাস",
    viewPastOrders: "অতীতের অর্ডার দেখুন",
    enterShopCode: "দোকান কোড লিখুন",
    wantPermanentAccess: "স্থায়ী অ্যাক্সেস চান?",
    requestPending: "অনুরোধ পেন্ডিং",
    requesting: "অনুরোধ করা হচ্ছে...",
    requestPermission: "অনুমতির অনুরোধ করুন",
    userManagement: "ইউজার ম্যানেজমেন্ট",
    manageUsers: "ইউজার পরিচালনা",
    permissionManagement: "পারমিশন ম্যানেজমেন্ট",
    manageRoles: "রোল এবং পারমিশন",
    role: "রোল",
    permissions: "পারমিশন",
    savePermissions: "পারমিশন সেভ করুন",
    manageProducts: "প্রোডাক্ট ম্যানেজমেন্ট",
    salesReports: "সেলস রিপোর্ট",
    financialOverview: "আর্থিক বিবরণী",
    shopPerformance: "দোকানের পারফরম্যান্স",
    explorePaints: "পেইন্টস এক্সপ্লোর",
    requestSent: "অনুরোধ পাঠানো হয়েছে",
    items: "আইটেম",
    transactions: "লেনদেন",
    add: "যোগ করুন",
    noTransactions: "কোন লেনদেন পাওয়া যায়নি",
    noNote: "কোন নোট নেই",
    by: "দ্বারা",
    addTransaction: "লেনদেন যোগ করুন",
    type: "ধরণ",
    payment: "পেমেন্ট",
    addDue: "বকেয়া যোগ করুন",
    amount: "পরিমাণ",
    note: "নোট",
    save: "সেভ করুন",
    grant: "অনুমতি দিন",
    deny: "প্রত্যাখ্যান করুন",
    granted: "অনুমোদিত",
    customSizes: "কাস্টম সাইজ",
    variants: "ভ্যারিয়েন্ট",
    orderItems: "অর্ডারের আইটেম",
    editOrder: "অর্ডার এডিট করুন",
    placingOrder: "অর্ডার হচ্ছে...",
    confirmSubmit: "অর্ডার নিশ্চিত করুন",
    deleteOrder: "অর্ডার ডিলিট",
    deleteProduct: "প্রোডাক্ট ডিলিট",
    deleteShop: "দোকান ডিলিট",
    manageBranding: "ব্র্যান্ডিং ম্যানেজমেন্ট",
    totalSales: "মোট সেলস",
    totalReceived: "মোট কালেকশন",
    totalOutstanding: "মোট বকেয়া",
    user: "ইউজার",
    name: "নাম",
    quickActions: "কুইক অ্যাকশন",
    noHistory: "ইতিহাস নেই",
    shopNotFound: "দোকান পাওয়া যায়নি",
    invalidShopCode: "ভুল শপ কোড",
    accountPending: "অ্যাকাউন্ট অনুমোদনের অপেক্ষায়",
    accountSuspended: "অ্যাকাউন্ট স্থগিত",
    requestReAccess: "পুনরায় অ্যাক্সেসের অনুরোধ",
    reAccessRequested: "অনুরোধ পাঠানো হয়েছে",
    reAccessRequestSent: "আপনার আবেদনটি প্রশাসকের কাছে পাঠানো হয়েছে।",
    suspendedMessage: "আপনার অ্যাকাউন্টটি স্থগিত করা হয়েছে। অনুগ্রহ করে যোগাযোগ করুন।",
    grantReAccess: "অ্যাক্সেস ফিরিয়ে দিন",
    denyReAccess: "বাতিল করুন",
    awaitingApproval: "আপনার অ্যাকাউন্টটি অনুমোদনের অপেক্ষায় আছে।",
    signInWithGoogle: "গুগল সাইন-ইন",
    loadingOrderflow: "লোড হচ্ছে...",
    completeProfile: "প্রোফাইল সম্পন্ন করুন",
    selectRole: "পদ নির্বাচন করুন",
    administratorMaster: "অ্যাডমিনিস্ট্রেটর",
    fieldRepresentative: "ফিল্ড রিপ্রেজেন্টেটিভ",
    enterUniqueShopCode: "ইউনিক শপ কোড দিন",
    settingUp: "প্রস্তুত হচ্ছে...",
    getStarted: "শুরু করুন",
    or: "অথবা",
    day: "দিন",
    week: "সপ্তাহ",
    month: "মাস",
    loginToSeePrice: "মূল্য দেখতে লগইন করুন",
    noItemsYet: "কিছুই যোগ করা হয়নি",
    checkAsCustomer: "কাস্টমার হিসেবে দেখুন",
    contactRepresentative: "যোগাযোগ করুন",
    duplicateProduct: "প্রোডাক্ট ইতিমধ্যে আছে",
    successAdded: "সফলভাবে যোগ হয়েছে",
    successUpdated: "সফলভাবে আপডেট হয়েছে",
    successDeleted: "সফলভাবে মুছেছে",
    contactInfo: "কন্টাক্ট ইনফো",
    saveContactInfo: "সেভ করুন",
    category: "ক্যাটাগরি",
    image: "ছবি",
    uploading: "আপলোড হচ্ছে...",
    chooseImage: "ছবি সিলেক্ট করুন",
    errorUploading: "আপলোডে ত্রুটি",
    successUploaded: "আপলোড সফল",
    saveToGallery: "গ্যালারিতে সেভ করুন",
    contactForOrder: "অর্ডারের জন্য কল করুন",
    contactName: "নাম",
    contactNumber: "নম্বর",
    attachReceipt: "রসিদ/ছবি যুক্ত করুন",
    imagePreview: "ছবির প্রিভিউ",
    changeImage: "ছবি পরিবর্তন করুন",
    uploadingImage: "ছবি আপলোড হচ্ছে...",
    profile: "প্রোফাইল",
    profileSettings: "প্রোফাইল সেটিংস",
    updateProfile: "Update Profile",
    phoneNumber: "ফোন নম্বর",
    contacts: "কন্টাক্টস",
    shopOwnerDashboard: "দোকান ড্যাশবোর্ড",
    call: "কল",
    noContacts: "কোন নম্বর নেই",
    onlyWorkersVisible: "শুধুমাত্র ফিল্ড প্রতিনিধিদের নম্বর",
    areaRequests: "এলাকার আবেদন",
    myAssignedAreas: "বরাদ্দকৃত এলাকা",
    requestNewArea: "নতুন এলাকা আবেদন",
    noAreasAssigned: "কোন এলাকা নেই",
    enterAreaName: "এলাকার নাম দিন",
    submit: "সাবমিট",
    recentRequests: "সাম্প্রতিক আবেদন",
    noAreaRequests: "কোন আবেদন নেই",
    requestedArea: "আবেদনকৃত এলাকা",
    approve: "অনুমোদন",
    reject: "বাতিল",
    approved: "অনুমোদিত",
    rejected: "বাতিলকৃত",
    requestSubmitted: "আবেদন জমা হয়েছে",
    areas: "এলাকা",
    myAreas: "আমার এলাকা",
    branding: "ব্র্যান্ডিং",
    logoSettings: "লোগো সেটিংস",
    logoSettingsDesc: "লোগো আপডেট করুন (সর্বোচ্চ ২০০x২০০ পিএক্স)",
    uploadLogo: "লোগো আপলোড",
    logoRequirements: "৫০০কেবি এর নিচে (PNG, JPG, SVG)",
    backgroundSettings: "ব্যাকগ্রাউন্ড সেটিংস",
    backgroundSettingsDesc: "অ্যাপের থিম ব্যাকগ্রাউন্ড পরিবর্তন করুন",
    uploadBackground: "থিম আপলোড",
    bgRequirements: "২এমবি এর নিচে (PNG, JPG)",
    noLogo: "লোগো নেই",
    activityLog: "অ্যাক্টিভিটি লগ",
    activityLogSubtitle: "সিস্টেম পরিবর্তন এবং অডিট ট্রেইল মনিটর করুন",
    checkStatus: "অবস্থা পরীক্ষা",
    logoSizeError: "লোগো ৫০০কেবি এর নিচে হবে",
    logoUploadError: "লোগো আপলোড হয়নি",
    modifiedBy: "পরিবর্তনকারী",
    notifications: "নোটিফিকেশন",
    newOrderNotification: "নতুন অর্ডার এসেছে",
    orderModifiedNotification: "অর্ডার আপডেট হয়েছে",
    noNotifications: "কোন নোটিফিকেশন নেই",
    finance: "ফাইন্যান্স",
    deliverySector: "ডেলিভারি সেক্টর",
    productShopSector: "পণ্য/দোকান সেক্টর",
    workerSector: "কর্মী সেক্টর",
    coreOperations: "মূল অপারেশন",
    inventoryCatalog: "ইনভেন্টরি এবং ক্যাটালগ",
    managementControl: "ম্যানেজমেন্ট এবং কন্ট্রোল",
    analyticsPerformance: "অ্যানালিটিক্স এবং পারফরম্যান্স",
    accountSupport: "অ্যাকাউন্ট এবং সাপোর্ট",
    MANAGE_USERS: "ইউজার কন্ট্রোল",
    MANAGE_ROLES: "রোল কন্ট্রোল",
    MANAGE_PERMISSIONS: "পারমিশন কন্ট্রোল",
    MANAGE_SHOPS: "দোকান কন্ট্রোল",
    MANAGE_PRODUCTS: "মালামাল কন্ট্রোল",
    CREATE_ORDERS: "অর্ডার তৈরি",
    VIEW_ORDERS: "অর্ডার লিস্ট",
    UPDATE_ORDER_STATUS: "স্ট্যাটাস আপডেট",
    MANAGE_PAYMENTS: "পেমেন্ট কন্ট্রোল",
    VIEW_REPORTS: "রিপোর্ট দেখা",
    VIEW_ACTIVITY_LOG: "লগ দেখা",
    MANAGE_CATALOG: "ক্যাটালগ কন্ট্রোল",
    VIEW_DASHBOARD: "ড্যাশবোর্ড দেখা",
    MARK_ORDER_RECEIVED: "রিসিভ কনফার্মেশন",
    VIEW_MY_SHOP: "নিজের দোকান",
    VIEW_SHOPS: "সব দোকান",
    DELETE_ORDER: "অর্ডার মুছে ফেলা",
    EDIT_ORDER: "অর্ডার সংশোধন",
    DELETE_PRODUCT: "পণ্য মুছে ফেলা",
    DELETE_SHOP: "দোকান মুছে ফেলা",
    DELETE_TRANSACTION: "লেনদেন মুছে ফেলা",
    DELETE_USER: "ইউজার মুছে ফেলা",
    MANAGE_BRANDING: "ব্র্যান্ডিং পরিবর্তন",
    MANAGE_USER_ROLES: "ইউজার রোল ম্যানেজমেন্ট",
    ACCESS_FINANCE_VIEW: "ফাইন্যান্স (ভিউ)",
    ACCESS_FINANCE_EDIT: "ফাইন্যান্স (এডিট)",
    ACCESS_DELIVERY_VIEW: "ডেলিভারি (ভিউ)",
    ACCESS_DELIVERY_EDIT: "ডেলিভারি (এডিট)",
    ACCESS_PRODUCT_SHOP_VIEW: "পণ্য/দোকান (ভিউ)",
    ACCESS_PRODUCT_SHOP_EDIT: "পণ্য/দোকান (এডিট)",
    ACCESS_WORKER_VIEW: "কর্মী (ভিউ)",
    ACCESS_WORKER_EDIT: "কর্মী (এডিট)",
  }
};

const ALL_ROLES: UserRole[] = [
  'owner', 'admin', 'manager', 'worker', 'shop_owner', 
  'worker_foreman', 'manager_foreman', 'delivery_manager', 'field_manager', 
  'foreman', 'delivery_man'
];

const ALL_PERMISSIONS: Permission[] = [
  'MANAGE_USERS', 'MANAGE_ROLES', 'MANAGE_USER_ROLES', 'MANAGE_PERMISSIONS', 'MANAGE_SHOPS', 'MANAGE_PRODUCTS', 
  'CREATE_ORDERS', 'VIEW_ORDERS', 'UPDATE_ORDER_STATUS', 'MANAGE_PAYMENTS', 
  'VIEW_REPORTS', 'VIEW_ACTIVITY_LOG', 'MANAGE_CATALOG', 'VIEW_DASHBOARD',
  'MARK_ORDER_RECEIVED', 'VIEW_MY_SHOP', 'VIEW_SHOPS', 'DELETE_ORDER', 'EDIT_ORDER',
  'DELETE_PRODUCT', 'DELETE_SHOP', 'DELETE_TRANSACTION', 'DELETE_USER', 'MANAGE_BRANDING',
  'ACCESS_FINANCE_VIEW', 'ACCESS_FINANCE_EDIT',
  'ACCESS_DELIVERY_VIEW', 'ACCESS_DELIVERY_EDIT',
  'ACCESS_PRODUCT_SHOP_VIEW', 'ACCESS_PRODUCT_SHOP_EDIT',
  'ACCESS_WORKER_VIEW', 'ACCESS_WORKER_EDIT'
];

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem('app_lang');
    return (saved as Language) || 'en';
  });

  useEffect(() => {
    localStorage.setItem('app_lang', language);
  }, [language]);

  const t = (key: string) => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) throw new Error("useLanguage must be used within LanguageProvider");
  return context;
};

// --- Branding Context ---
const BrandingContext = createContext<{ 
  logoUrl: string | null; 
  backgroundUrl: string | null;
  accentColor: string;
  grade1Label: string;
  grade2Label: string;
}>({ logoUrl: null, backgroundUrl: null, accentColor: '#2563eb', grade1Label: 'Grade 1', grade2Label: 'Grade 2' });

function BrandingProvider({ children }: { children: ReactNode }) {
  const { profile } = useAuth();
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [backgroundUrl, setBackgroundUrl] = useState<string | null>(null);
  const [accentColor, setAccentColor] = useState<string>('#2563eb');
  const [grade1Label, setGrade1Label] = useState<string>('Grade 1');
  const [grade2Label, setGrade2Label] = useState<string>('Grade 2');

  useEffect(() => {
    const unsubscribe = onSnapshot(doc(db, 'settings', 'branding'), (doc) => {
      if (doc.exists()) {
        const data = doc.data();
        setLogoUrl(data.logoUrl || null);
        setBackgroundUrl(data.backgroundUrl || null);
        setGrade1Label(data.grade1Label || 'Grade 1');
        setGrade2Label(data.grade2Label || 'Grade 2');
      }
    }, (error) => handleFirestoreError(error, OperationType.GET, 'settings/branding'));
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (profile?.accentColor) {
      setAccentColor(profile.accentColor);
    } else {
      setAccentColor('#2563eb');
    }
  }, [profile]);

  return (
    <BrandingContext.Provider value={{ logoUrl, backgroundUrl, accentColor, grade1Label, grade2Label }}>
      <div 
        className="min-h-screen bg-slate-50 transition-all duration-700 bg-cover bg-center bg-no-repeat bg-fixed"
        style={{
          ...(backgroundUrl ? { backgroundImage: `linear-gradient(rgba(248, 250, 252, 0.95), rgba(248, 250, 252, 0.95)), url(${backgroundUrl})` } : {}),
          // @ts-ignore
          '--primary': accentColor,
        }}
      >
        {children}
      </div>
    </BrandingContext.Provider>
  );
}

const useBranding = () => useContext(BrandingContext);

// --- Toast Notification ---
interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error';
}

const ToastContext = createContext<{
  showToast: (message: string, type?: 'success' | 'error') => void;
}>({ showToast: () => {} });

function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3000);
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 pointer-events-none">
        <AnimatePresence>
          {toasts.map(t => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, x: 20, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 20, scale: 0.9 }}
              className={cn(
                "px-6 py-3 rounded-xl shadow-lg border font-bold text-sm flex items-center gap-3 pointer-events-auto",
                t.type === 'success' ? "bg-emerald-50 border-emerald-100 text-emerald-600" : "bg-red-50 border-red-100 text-red-600"
              )}
            >
              {t.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <XCircle className="w-5 h-5" />}
              {t.message}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

const useToast = () => useContext(ToastContext);

// --- Notification Context ---
interface AppNotification {
  id: string;
  to: string;
  type: 'NEW_ORDER' | 'ORDER_MODIFIED';
  orderId: string;
  by: string;
  read: boolean;
  createdAt: string;
}

const NotificationContext = createContext<{
  notifications: AppNotification[];
  unreadCount: number;
  markAsRead: (id: string) => void;
}>({ notifications: [], unreadCount: 0, markAsRead: () => {} });

export function NotificationProvider({ children }: { children: ReactNode }) {
  const { profile } = useAuth();
  const [notifications, setNotifications] = useState<AppNotification[]>([]);

  useEffect(() => {
    if (!profile || (profile.role !== 'admin' && profile.role !== 'owner' && profile.status !== 'approved')) return;
    
    let q = query(collection(db, 'notifications'));
    
    // Shop owners see notifications sent to their shopCode
    if (profile.role === 'shop_owner') {
      q = query(q, where('to', '==', profile.shopCode));
    } else if (profile.role === 'admin' || profile.role === 'manager') {
      // Admins/Managers might want to see all? 
      // User requested "sent to shop owner"
      // So mainly for shop owners.
    } else {
      return; 
    }

    const unsubscribe = onSnapshot(query(q, orderBy('createdAt', 'desc')), (snapshot) => {
      setNotifications(snapshot.docs.map(d => ({ id: d.id, ...d.data() } as AppNotification)));
    }, (error) => handleFirestoreError(error, OperationType.LIST, 'notifications'));

    return () => unsubscribe();
  }, [profile]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = async (id: string) => {
    try {
      await updateDoc(doc(db, 'notifications', id), { read: true });
    } catch (error) {
      console.error("Mark as read error:", error);
    }
  };

  const markAllAsRead = async () => {
    try {
      const batch: Promise<any>[] = [];
      notifications.filter(n => !n.read).forEach(n => {
        batch.push(updateDoc(doc(db, 'notifications', n.id), { read: true }));
      });
      await Promise.all(batch);
    } catch (error) {
      console.error("Mark all as read error:", error);
    }
  };

  return (
    <NotificationContext.Provider value={{ notifications, unreadCount, markAsRead, markAllAsRead }}>
      {children}
    </NotificationContext.Provider>
  );
}

const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) throw new Error('useNotifications must be used within NotificationProvider');
  return context;
};

// --- Auth Context ---
// --- Auth Context ---

const secondaryApp = initializeApp(firebaseConfigLocal, 'Secondary');
const secondaryAuth = getAuth(secondaryApp);

interface AuthContextType {
  user: FirebaseUser | null;
  profile: UserProfile | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  registerUser: (email: string, password: string, role: UserRole, displayName: string, shopCode?: string) => Promise<void>;
  hasPermission: (permission: Permission) => boolean;
  rolePermissions: RolePermissions[];
  connectionError: string | null;
  initializeDefaultPermissions: () => Promise<void>;
  saving: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [rolePermissions, setRolePermissions] = useState<RolePermissions[]>([]);
  const [loading, setLoading] = useState(true);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const [saving, setSaving] = useState<string | null>(null);
  const { showToast } = useToast();

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser) {
        // Fetch profile
        const path = `users/${firebaseUser.uid}`;
        try {
          const docRef = doc(db, 'users', firebaseUser.uid);
          const docSnap = await getDoc(docRef);
          
          if (docSnap.exists()) {
            setProfile(docSnap.data() as UserProfile);
          } else if (firebaseUser.email?.toLowerCase() === "suadkhan.s1.qc@gmail.com" || firebaseUser.uid === "NhlZjK6RjQMEREHmIIKVrUWoYYY2") {
            // Master Admin fallback if no document exists
            setProfile({
              uid: firebaseUser.uid,
              email: firebaseUser.email || "suadkhan.s1.qc@gmail.com",
              displayName: firebaseUser.displayName || "Master Admin",
              role: 'owner',
              status: 'approved',
              createdAt: new Date().toISOString()
            } as UserProfile);
          } else {
            setProfile(null);
          }
        } catch (error) {
          console.error("Firestore connection error:", error);
          setConnectionError("Could not connect to database. Please check your internet connection.");
          handleFirestoreError(error, OperationType.GET, path);
        }
      } else {
        setProfile(null);
      }
      setLoading(false);
    });

    return () => unsubscribeAuth();
  }, []);

  useEffect(() => {
    if (!user) {
      setRolePermissions([]);
      return;
    }

    const unsubscribeRP = onSnapshot(collection(db, 'role_permissions'), (snapshot) => {
      const rps = snapshot.docs.map(d => d.data() as RolePermissions);
      setRolePermissions(rps);
      
      // Initialize default permissions if collection is empty (first run)
      // We check if profile exists and is owner
      if (rps.length === 0 && profile?.role === 'owner') {
        initializeDefaultPermissions();
      }
    }, (error) => {
      console.error("Role permissions snapshot error:", error);
      // Only show error if we are supposedly signed in but still blocked
      if (user) {
        setConnectionError("Could not connect to database. Please check your internet connection.");
        handleFirestoreError(error, OperationType.LIST, 'role_permissions');
      }
    });

    return () => unsubscribeRP();
  }, [user, profile]);

  const initializeDefaultPermissions = async () => {
    const defaults: RolePermissions[] = [
      { role: 'owner', permissions: [...ALL_PERMISSIONS, 'MANAGE_PRODUCT_COLORS'] },
      { role: 'admin', permissions: [...ALL_PERMISSIONS, 'MANAGE_PRODUCT_COLORS'] },
      { role: 'manager', permissions: [...ALL_PERMISSIONS, 'DELETE_TRANSACTION', 'MANAGE_PRODUCT_COLORS'] },
      { role: 'worker', permissions: ['CREATE_ORDERS', 'VIEW_ORDERS', 'MANAGE_CATALOG', 'VIEW_DASHBOARD', 'MARK_ORDER_RECEIVED', 'VIEW_SHOPS', 'ACCESS_PRODUCT_SHOP_VIEW'] },
      { role: 'shop_owner', permissions: ['VIEW_ORDERS', 'MANAGE_CATALOG', 'VIEW_DASHBOARD', 'VIEW_MY_SHOP', 'ACCESS_PRODUCT_SHOP_VIEW'] },
      { role: 'foreman', permissions: ['VIEW_ORDERS', 'MARK_ORDER_RECEIVED', 'VIEW_SHOPS', 'ACCESS_WORKER_VIEW'] },
      { role: 'delivery_man', permissions: ['VIEW_ORDERS', 'UPDATE_ORDER_STATUS', 'ACCESS_DELIVERY_VIEW'] },
      { role: 'worker_foreman', permissions: ['CREATE_ORDERS', 'VIEW_ORDERS', 'MARK_ORDER_RECEIVED', 'VIEW_SHOPS', 'ACCESS_WORKER_VIEW', 'ACCESS_WORKER_EDIT'] },
      { role: 'manager_foreman', permissions: ['VIEW_ORDERS', 'UPDATE_ORDER_STATUS', 'MANAGE_PAYMENTS', 'VIEW_REPORTS', 'ACCESS_FINANCE_VIEW', 'ACCESS_FINANCE_EDIT'] },
      { role: 'delivery_manager', permissions: ['VIEW_ORDERS', 'UPDATE_ORDER_STATUS', 'ACCESS_DELIVERY_VIEW', 'ACCESS_DELIVERY_EDIT'] },
      { role: 'field_manager', permissions: ['MANAGE_SHOPS', 'VIEW_ORDERS', 'VIEW_SHOPS', 'DELETE_SHOP', 'ACCESS_PRODUCT_SHOP_VIEW', 'ACCESS_PRODUCT_SHOP_EDIT'] }
    ];

    setSaving('ALL');
    try {
      for (const d of defaults) {
        await setDoc(doc(db, 'role_permissions', d.role), d, { merge: true });
      }
      showToast("Permissions updated successfully");
    } catch (error) {
      console.error("Initialization error:", error);
      showToast("Failed to update permissions", "error");
    } finally {
      setSaving(null);
    }
  };

  const hasPermission = (permission: Permission): boolean => {
    // Master Admin override - Always grant ALL permissions
    if (user?.email?.toLowerCase() === "suadkhan.s1.qc@gmail.com" || user?.uid === "NhlZjK6RjQMEREHmIIKVrUWoYYY2") return true;
    
    if (!profile) return false;
    if (profile.role === 'owner' || profile.role === 'admin') return true; 
    
    if (profile.customPermissions?.includes(permission)) return true;

    const rolePerms = rolePermissions.find(rp => rp.role === profile.role);
    return rolePerms?.permissions.includes(permission) || false;
  };

  const signIn = async (email: string, password: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      console.error("Sign in error:", error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const registerUser = async (email: string, password: string, role: UserRole, displayName: string, shopCode?: string) => {
    try {
      // Use secondary auth to create user without signing out the current owner
      const userCredential = await createUserWithEmailAndPassword(secondaryAuth, email, password);
      const newUser = userCredential.user;
      
      await setDoc(doc(db, 'users', newUser.uid), {
        uid: newUser.uid,
        email,
        displayName,
        role,
        status: 'approved',
        shopCode: shopCode || '',
        customPermissions: [],
        createdAt: new Date().toISOString()
      });

      // Log activity
      if (profile) {
        await addDoc(collection(db, 'activity'), {
          uid: profile.uid,
          userName: profile.displayName || profile.email,
          action: 'USER_CREATED',
          details: `Created user ${email} with role ${role}`,
          timestamp: new Date().toISOString()
        });
      }

      // Sign out from secondary auth immediately
      await signOut(secondaryAuth);
    } catch (error) {
      console.error("Registration error:", error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, profile, loading, signIn, logout, registerUser, hasPermission, 
      rolePermissions, connectionError, initializeDefaultPermissions, saving 
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};

// --- Components ---

function LoadingScreen() {
  const { t } = useLanguage();
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
        <p className="text-slate-600 font-medium">{t('loadingOrderflow')}</p>
      </div>
    </div>
  );
}

function LoginScreen() {
  const { signIn } = useAuth();
  const { t } = useLanguage();
  const { logoUrl } = useBranding();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await signIn(email, password);
    } catch (err: any) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-slate-50">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full bg-white rounded-3xl shadow-xl p-6 md:p-8 text-center space-y-6 md:space-y-8"
      >
        <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto shadow-lg shadow-blue-200 overflow-hidden">
          <img src={logoUrl || "https://ais-dev-2t2xxqjcfxzhtv7w5ldbav-180523243505.asia-southeast1.run.app/api/attachments/a7f5a265-27f9-4674-846f-c1249683935b"} alt="Nafeu Paints" className="w-full h-full object-contain mix-blend-multiply" referrerPolicy="no-referrer" />
        </div>
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-slate-900 mb-1 uppercase tracking-tight">Nafeu Paints</h1>
          <p className="text-blue-600 font-bold text-xs md:text-sm uppercase tracking-widest">{t('alwaysGreen')}</p>
        </div>
        
        <form onSubmit={handleLogin} className="space-y-4 md:space-y-5 text-left">
          {error && (
            <div className="p-3 bg-red-50 text-red-600 rounded-xl text-sm font-medium flex items-center gap-2">
              <AlertCircle className="w-4 h-4" />
              {error}
            </div>
          )}
          <div>
            <label className="block text-[8px] md:text-xs font-bold text-slate-500 uppercase mb-1 ml-1 tracking-widest leading-none">{t('email')}</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2.5 md:p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm md:text-base font-bold shadow-sm"
              placeholder="admin@nafeupaints.com"
            />
          </div>
          <div>
            <label className="block text-[8px] md:text-xs font-bold text-slate-500 uppercase mb-1 ml-1 tracking-widest leading-none">{t('password')}</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-2.5 md:p-3 pr-12 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm md:text-base font-bold shadow-sm"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-slate-400 hover:text-slate-600 transition-colors"
              >
                {showPassword ? <EyeOff className="w-4 h-4 md:w-5 md:h-5" /> : <Eye className="w-4 h-4 md:w-5 md:h-5" />}
              </button>
            </div>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-slate-900 text-white font-black py-3 md:py-4 px-4 rounded-xl md:rounded-2xl hover:bg-black transition-all disabled:opacity-50 shadow-xl shadow-slate-200 uppercase tracking-[0.2em] text-[10px] md:text-xs"
          >
            {loading ? (t('settingUp') || t('loggingIn')) : (t('signIn') || t('login'))}
          </button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-100"></div></div>
            <div className="relative flex justify-center text-xs uppercase"><span className="bg-white px-2 text-slate-400">{t('or')}</span></div>
          </div>

          <Link
            to="/catalog"
            className="w-full flex items-center justify-center gap-3 bg-blue-50 text-blue-600 py-3 px-4 rounded-xl font-bold hover:bg-blue-100 transition-all"
          >
            <UserCircle className="w-5 h-5" />
            {t('checkAsCustomer')}
          </Link>
        </form>
      </motion.div>
    </div>
  );
}

function RegistrationScreen() {
  const { user, profile } = useAuth();
  const { t } = useLanguage();
  const [role, setRole] = useState<UserRole>('worker');
  const [shopCode, setShopCode] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  if (profile) return <Navigate to="/" />;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setSubmitting(true);
    
    const newProfile: UserProfile = {
      uid: user.uid,
      email: user.email!,
      displayName: user.displayName || 'User',
      phoneNumber,
      role,
      status: role === 'admin' ? 'approved' : 'pending',
      createdAt: new Date().toISOString()
    };

    if (role === 'shop_owner') {
      newProfile.shopCode = shopCode;
    }

    try {
      await setDoc(doc(db, 'users', user.uid), newProfile);
      window.location.reload(); // Refresh to pick up new profile
    } catch (error) {
      console.error("Registration error:", error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-slate-50">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full bg-white rounded-3xl shadow-xl p-6 md:p-8 space-y-6"
      >
        <h2 className="text-xl md:text-2xl font-black text-slate-900 mb-2 uppercase tracking-tight">{t('completeProfile')}</h2>
        <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
          <div>
            <label className="block text-[10px] md:text-sm font-black text-slate-400 uppercase mb-2 tracking-widest">{t('selectRole')}</label>
            <div className="grid grid-cols-1 gap-2 md:gap-3">
              {[
                { id: 'admin', label: t('admin'), icon: Shield, hidden: user?.email !== "suadkhan.s1.qc@gmail.com" },
                { id: 'owner', label: t('owner'), icon: Shield, hidden: user?.email !== "suadkhan.s1.qc@gmail.com" },
                { id: 'manager', label: t('manager'), icon: LayoutDashboard },
                { id: 'field_manager', label: t('field_manager'), icon: LayoutDashboard },
                { id: 'shop_owner', label: t('shop_owner'), icon: Store },
                { id: 'worker', label: t('worker'), icon: ShoppingCart },
                { id: 'worker_foreman', label: t('worker_foreman'), icon: Users },
                { id: 'manager_foreman', label: t('manager_foreman'), icon: Shield },
                { id: 'foreman', label: t('foreman'), icon: Users },
                { id: 'delivery_manager', label: t('delivery_manager'), icon: Truck },
                { id: 'delivery_man', label: t('delivery_man'), icon: Truck },
              ].filter(r => !r.hidden).map((r) => (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => setRole(r.id as UserRole)}
                  className={cn(
                    "flex items-center gap-3 md:gap-4 p-3 md:p-4 rounded-xl border-2 text-left transition-all",
                    role === r.id 
                      ? "border-blue-600 bg-blue-50 text-blue-700 shadow-sm" 
                      : "border-slate-100 hover:border-slate-200 text-slate-600"
                  )}
                >
                  <r.icon className={cn("w-5 h-5 md:w-6 md:h-6", role === r.id ? "text-blue-600" : "text-slate-400")} />
                  <span className="font-black uppercase text-[10px] md:text-xs tracking-wide">{r.label}</span>
                </button>
              ))}
            </div>
          </div>

          {role === 'shop_owner' && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}>
              <label className="block text-[10px] md:text-sm font-black text-slate-400 uppercase mb-2 tracking-widest">{t('shopCode')}</label>
              <input
                type="text"
                required
                value={shopCode}
                onChange={(e) => setShopCode(e.target.value.toUpperCase())}
                placeholder={t('enterUniqueShopCode')}
                className="w-full p-2.5 md:p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none text-sm md:text-base font-bold"
              />
            </motion.div>
          )}

          <div>
            <label className="block text-[10px] md:text-sm font-black text-slate-400 uppercase mb-2 tracking-widest">{t('phoneNumber')}</label>
            <input
              type="tel"
              required
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="01XXXXXXXXX"
              className="w-full p-2.5 md:p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none text-sm md:text-base font-bold"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-slate-900 text-white font-black py-3 md:py-4 px-4 rounded-xl md:rounded-2xl hover:bg-black transition-all disabled:opacity-50 shadow-xl shadow-slate-200 uppercase tracking-[0.2em] text-[10px] md:text-xs"
          >
            {submitting ? t('settingUp') : t('getStarted')}
          </button>
        </form>
      </motion.div>
    </div>
  );
}

function PendingApproval() {
  const { user, logout } = useAuth();
  const { t } = useLanguage();
  const [initializing, setInitializing] = useState(false);

  const initializeOwner = async () => {
    if (user?.email !== 'suadkhan.s1.qc@gmail.com') return;
    setInitializing(true);
    try {
      await setDoc(doc(db, 'users', user.uid), {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName || 'Owner',
        role: 'owner',
        status: 'approved',
        createdAt: new Date().toISOString()
      });
    } catch (error) {
      console.error("Owner initialization error:", error);
    } finally {
      setInitializing(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
        <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <Clock className="text-amber-600 w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2 uppercase">{t('accountPending')}</h2>
        <p className="text-slate-500 mb-8">{t('awaitingApproval')}</p>
        
        {user?.email === 'suadkhan.s1.qc@gmail.com' && (
          <button
            onClick={initializeOwner}
            disabled={initializing}
            className="w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-xl hover:bg-blue-700 transition-colors uppercase mb-4"
          >
            {initializing ? 'Initializing...' : 'Initialize Owner Account'}
          </button>
        )}

        <button
          onClick={logout}
          className="w-full bg-slate-100 text-slate-700 font-bold py-3 px-4 rounded-xl hover:bg-slate-200 transition-colors uppercase"
        >
          {t('logout')}
        </button>
      </div>
    </div>
  );
}

function SuspendedScreen() {
  const { profile, logout } = useAuth();
  const { t } = useLanguage();
  const { showToast } = useToast();
  const [requesting, setRequesting] = useState(false);

  const handleRequestReAccess = async () => {
    if (!profile) return;
    setRequesting(true);
    try {
      await updateDoc(doc(db, 'users', profile.uid), {
        reAccessRequested: true
      });
      showToast(t('reAccessRequestSent'));
    } catch (error) {
      console.error("Re-access request error:", error);
    } finally {
      setRequesting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center space-y-6"
      >
        <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto">
          <XCircle className="w-10 h-10 text-red-500" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 uppercase">{t('accountSuspended')}</h2>
        <p className="text-slate-500">{t('suspendedMessage')}</p>
        
        <div className="space-y-3">
          {!profile?.reAccessRequested ? (
            <button
              onClick={handleRequestReAccess}
              disabled={requesting}
              className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white font-bold py-3 rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 disabled:opacity-50"
            >
              <AlertCircle className="w-5 h-5" />
              {requesting ? t('settingUp') : t('requestReAccess')}
            </button>
          ) : (
            <div className="p-3 bg-amber-50 text-amber-700 rounded-xl text-sm font-bold flex items-center justify-center gap-2">
              <Clock className="w-4 h-4" />
              {t('reAccessRequested')}
            </div>
          )}
          
          <button
            onClick={logout}
            className="w-full flex items-center justify-center gap-2 bg-slate-100 text-slate-600 font-bold py-3 rounded-xl hover:bg-slate-200 transition-all"
          >
            <LogOut className="w-5 h-5" />
            {t('logout')}
          </button>
        </div>
      </motion.div>
    </div>
  );
}

function Sidebar({ isOpen, setIsOpen }: { isOpen: boolean, setIsOpen: (v: boolean) => void }) {
  const { user, profile, logout, hasPermission } = useAuth();
  const { language, setLanguage, t } = useLanguage();
  const { logoUrl } = useBranding();
  const navigate = useNavigate();
  const location = useLocation();

  const [isLg, setIsLg] = useState(false);

  useEffect(() => {
    const checkLg = () => setIsLg(window.innerWidth >= 1024);
    checkLg();
    window.addEventListener('resize', checkLg);
    return () => window.removeEventListener('resize', checkLg);
  }, []);

  const [usage, setUsage] = useState<Record<string, number>>(() => {
    try {
      const saved = localStorage.getItem('nav_usage');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const trackUsage = (path: string) => {
    const newUsage = { ...usage, [path]: (usage[path] || 0) + 1 };
    setUsage(newUsage);
    localStorage.setItem('nav_usage', JSON.stringify(newUsage));
  };

  const rawNavItems = [
    { label: t('dashboard'), icon: LayoutDashboard, path: '/', permission: 'VIEW_DASHBOARD' as Permission },
    { label: t('newOrder'), icon: PlusCircle, path: '/new-order', permission: 'CREATE_ORDERS' as Permission },
    { label: t('orders'), icon: Package, path: '/orders', permission: 'VIEW_ORDERS' as Permission },
    { label: t('products'), icon: Box, path: '/products', permission: 'MANAGE_PRODUCTS' as Permission, sector: 'ACCESS_PRODUCT_SHOP_VIEW' as Permission },
    { label: t('shops'), icon: Store, path: '/shops', permission: 'VIEW_SHOPS' as Permission, sector: 'ACCESS_PRODUCT_SHOP_VIEW' as Permission },
    { label: t('users'), icon: Users, path: '/users', permission: 'MANAGE_USERS' as Permission, sector: 'ACCESS_WORKER_VIEW' as Permission },
    { label: t('activityLog'), icon: ShieldCheck, path: '/activity', permission: 'VIEW_ACTIVITY_LOG' as Permission },
    { label: t('history'), icon: History, path: '/history', permission: 'VIEW_ORDERS' as Permission },
    { label: t('reports'), icon: BarChart3, path: '/reports', permission: 'VIEW_REPORTS' as Permission, sector: 'ACCESS_FINANCE_VIEW' as Permission },
    { label: t('productCalculation'), icon: TrendingUp, path: '/product-calculation', permission: 'VIEW_REPORTS' as Permission },
    { label: t('contacts'), icon: Contact2, path: '/contacts' },
    { label: t('explorePaints'), icon: Library, path: '/catalog', permission: 'MANAGE_CATALOG' as Permission },
  ];

  let baseNavItems = [...rawNavItems];

  if (profile?.role === 'shop_owner') {
    if (profile.permissionStatus === 'granted' && profile.shopCode) {
      baseNavItems.unshift({ label: t('myShop'), icon: Warehouse, path: `/shops/${profile.shopCode}`, permission: 'VIEW_MY_SHOP' as Permission, sector: undefined });
    } else {
      baseNavItems.unshift({ label: t('shopOwnerDashboard'), icon: LayoutDashboard, path: '/shop-dashboard', permission: 'VIEW_DASHBOARD' as Permission, sector: undefined });
    }
    baseNavItems = baseNavItems.filter(item => item.label !== t('dashboard'));
  }

  // Most used after Dashboard logic
  const dashboardItem = baseNavItems.find(i => i.path === '/' || i.path === '/shop-dashboard' || i.path.includes('/shops/'));
  const others = baseNavItems.filter(i => i !== dashboardItem);
  const sortedOthers = [...others].sort((a, b) => (usage[b.path] || 0) - (usage[a.path] || 0));
  const navItems = dashboardItem ? [dashboardItem, ...sortedOthers] : sortedOthers;

  const visibleItems = navItems.filter(item => {
    if (item.path === '/profile' || item.path === '/contacts') return !!profile;
    const hasBasePermission = item.permission ? hasPermission(item.permission as Permission) : true;
    const hasSectorPermission = item.sector ? hasPermission(item.sector as Permission) : true;
    return hasBasePermission && hasSectorPermission;
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { x: -30, opacity: 0 },
    visible: {
      x: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 30
      }
    }
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-slate-900/40 z-40 lg:hidden backdrop-blur-md"
          />
        )}
      </AnimatePresence>

      <motion.aside
        initial={{ x: -280 }}
        animate={{ x: (isOpen || isLg) ? 0 : -280 }}
        transition={{ type: 'spring', damping: 28, stiffness: 250 }}
        className={cn(
          "fixed top-0 left-0 bottom-0 w-[280px] bg-white z-50 flex flex-col border-r border-slate-100 transition-all lg:!translate-x-0 shadow-2xl lg:shadow-none",
          isLg && "lg:translate-x-0"
        )}
      >
        <div className="p-8 pb-6 flex items-center gap-4 shrink-0 overflow-hidden text-right font-['Georgia']">
          <motion.div 
            initial={{ scale: 0.8, rotate: -10 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring' }}
            className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-2xl shadow-blue-100 border border-slate-100 overflow-hidden shrink-0"
          >
            {logoUrl ? (
              <img src={logoUrl} alt="Logo" className="w-full h-full object-contain" />
            ) : (
              <Leaf className="w-6 h-6 text-green-600" />
            )}
          </motion.div>
          <div className="min-w-0">
            <h1 className="text-xl font-black text-slate-900 tracking-tighter uppercase leading-none truncate">
              Nafeu Paints
            </h1>
            <p className="text-[10px] font-bold text-blue-600 mt-1 tracking-widest uppercase leading-none">
              {t('alwaysGreen')}
            </p>
          </div>
        </div>

        <div className="px-6 pb-6 shrink-0">
          <div className="bg-slate-50 p-1.5 rounded-2xl flex items-center gap-1 border border-slate-200/50">
            {(['en', 'bn'] as const).map((l) => (
              <button
                key={l}
                onClick={() => setLanguage(l)}
                className={cn(
                  "flex-1 py-2 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all",
                  language === l ? "bg-white text-slate-900 shadow-sm border border-slate-200/50" : "text-slate-400 hover:text-slate-600"
                )}
              >
                {l === 'en' ? 'English' : 'বাংলা'}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-4 space-y-8 scrollbar-hide pb-8">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-1"
          >
            {visibleItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <motion.button
                  key={item.path}
                  variants={itemVariants}
                  whileHover={{ x: 6 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => {
                    trackUsage(item.path);
                    navigate(item.path);
                    setIsOpen(false);
                  }}
                  className={cn(
                    "w-full flex items-center gap-4 px-4 py-3 rounded-2xl text-[11px] font-black tracking-wider uppercase transition-all relative group",
                    isActive 
                      ? "bg-slate-900 text-white shadow-xl shadow-slate-200" 
                      : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                  )}
                >
                  <item.icon className={cn(
                    "w-5 h-5 group-hover:scale-110 transition-transform",
                    isActive ? "text-blue-400" : ""
                  )} />
                  <span>{item.label}</span>
                  {isActive && (
                    <motion.div 
                      layoutId="nav-dot"
                      className="ml-auto w-1.5 h-1.5 bg-blue-400 rounded-full" 
                    />
                  )}
                </motion.button>
              );
            })}
          </motion.div>
        </div>

        <div className="p-6 border-t border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-4 p-3 bg-white rounded-2xl border border-slate-100 shadow-sm mb-4">
            <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center border border-slate-100 font-black text-slate-400">
              {profile?.displayName?.[0]?.toUpperCase() || 'U'}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <p className="text-xs font-black text-slate-900 truncate uppercase tracking-tighter">{profile?.displayName}</p>
                {(user?.email?.toLowerCase() === "suadkhan.s1.qc@gmail.com" || user?.uid === "NhlZjK6RjQMEREHmIIKVrUWoYYY2") && (
                  <span className="bg-amber-100 text-amber-600 text-[8px] font-black px-1.5 py-0.5 rounded uppercase tracking-tighter border border-amber-200">
                    Master
                  </span>
                )}
              </div>
              <p className="text-[10px] font-bold text-blue-600 uppercase tracking-widest leading-none mt-1">
                {profile?.role ? t(profile.role) : ''}
              </p>
            </div>
          </div>
          
          <div className="flex gap-2">
            <button
              onClick={() => {
                navigate('/profile');
                setIsOpen(false);
              }}
              className="flex-1 flex items-center justify-center gap-2 py-3 bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 rounded-xl transition-all text-[10px] font-black uppercase tracking-widest shadow-sm"
            >
              <UserCircle2 className="w-4 h-4" />
              {t('profile')}
            </button>
            <button
              onClick={logout}
              className="flex items-center justify-center gap-2 py-3 px-4 bg-red-50 text-red-600 hover:bg-red-100 border border-red-100 rounded-xl transition-all text-[10px] font-black uppercase tracking-widest shadow-sm shadow-red-50"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </motion.aside>
    </>
  );
}

function NotificationBell() {
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();
  const { t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (isOpen && unreadCount > 0) {
      markAllAsRead();
    }
  }, [isOpen, unreadCount, markAllAsRead]);

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 transition-colors"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-600 text-white text-[10px] font-black rounded-full flex items-center justify-center border-2 border-white">
            {unreadCount}
          </span>
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              className="absolute right-0 mt-2 w-80 bg-white rounded-2xl border-2 border-slate-900 shadow-2xl z-50 overflow-hidden"
            >
              <div className="p-4 border-b-2 border-slate-900 bg-blue-50">
                <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest">{t('notifications')}</h3>
              </div>
              <div className="max-h-96 overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="p-8 text-center text-slate-400">
                    <Bell className="w-8 h-8 mx-auto mb-2 opacity-20" />
                    <p className="text-xs font-bold uppercase">{t('noNotifications')}</p>
                  </div>
                ) : (
                  notifications.map(n => (
                    <button
                      key={n.id}
                      onClick={() => {
                        markAsRead(n.id);
                        setIsOpen(false);
                      }}
                      className={cn(
                        "w-full p-4 text-left border-b border-slate-100 last:border-0 hover:bg-slate-50 transition-colors flex gap-3",
                        !n.read && "bg-blue-50/50"
                      )}
                    >
                      <div className={cn(
                        "w-2 h-2 rounded-full shrink-0 mt-1.5",
                        !n.read ? "bg-blue-600" : "bg-transparent"
                      )} />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-black text-slate-900 uppercase tracking-tight mb-1">
                          {n.type === 'NEW_ORDER' ? t('newOrderNotification') : t('orderModifiedNotification')}
                        </p>
                        <p className="text-[10px] text-slate-500 font-medium">
                          {n.by} • {format(new Date(n.createdAt), 'MMM d, h:mm a')}
                        </p>
                      </div>
                    </button>
                  ))
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

function MainLayout({ children }: { children: ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { t } = useLanguage();

  return (
    <div className="min-h-screen">
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
      
      <div className="lg:pl-72">
        <header className="sticky top-0 bg-white/80 backdrop-blur-md border-b-2 border-slate-900 z-30 px-4 md:px-6 lg:px-12 h-16 md:h-20 flex items-center justify-between">
          <button onClick={() => setIsSidebarOpen(true)} className="lg:hidden p-2 text-slate-900">
            <Menu className="w-6 h-6" />
          </button>
          <div className="flex-1" />
          <div className="flex items-center gap-4 md:gap-6">
            <NotificationBell />
            <div className="hidden sm:block text-right">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-tight">{t('date')}</p>
              <p className="text-sm font-black text-slate-900 uppercase tracking-tighter">{format(new Date(), 'EEEE, MMM do')}</p>
            </div>
          </div>
        </header>

        <main className="p-4 md:p-6 lg:p-12 max-w-7xl mx-auto overflow-x-hidden">
          {children}
        </main>
      </div>
    </div>
  );
}

// --- Pages ---

function Dashboard() {
  const { profile, hasPermission } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    monthlySales: 0,
    collection: 0,
    due: 0,
    totalOrders: 0
  });
  const [activeStat, setActiveStat] = useState<'monthlySales' | 'collection' | 'due' | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [orderRequests, setOrderRequests] = useState<any[]>([]);
  const [chartData, setChartData] = useState<any[]>([]);
  const [selectedArea, setSelectedArea] = useState<string | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [shops, setShops] = useState<Shop[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  
  const chartSectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (activeStat && chartSectionRef.current) {
      setTimeout(() => {
        chartSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 300);
    }
  }, [activeStat]);

  useEffect(() => {
    if (profile?.role === 'shop_owner') {
      navigate('/shop-dashboard');
      return;
    }
    if (!profile) return;
    
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);
    
    let q;
    if (hasPermission('VIEW_REPORTS') && hasPermission('ACCESS_FINANCE_VIEW')) {
      q = query(collection(db, 'orders'));
    } else if (profile.role === 'shop_owner') {
      q = query(collection(db, 'orders'), where('shopCode', '==', profile.shopCode));
    } else {
      q = query(collection(db, 'orders'), where('workerUid', '==', profile.uid));
    }
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const allOrders = snapshot.docs.map(d => ({ id: d.id, ...d.data() })) as Order[];
      setOrders(allOrders);
      setRecentOrders(allOrders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 5));
    }, (error) => handleFirestoreError(error, OperationType.LIST, 'orders_dashboard'));

    const unsubscribeTrans = onSnapshot(collection(db, 'transactions'), (transSnap) => {
      const allTrans = transSnap.docs.map(d => ({ id: d.id, ...d.data() })) as Transaction[];
      setTransactions(allTrans);
    }, (error) => handleFirestoreError(error, OperationType.LIST, 'trans_dashboard'));

    const unsubscribeShops = onSnapshot(collection(db, 'shops'), (snapshot) => {
      setShops(snapshot.docs.map(d => ({ id: d.id, ...d.data() } as any)));
    });
    
    const reqQ = query(collection(db, 'order_requests'), where('status', '==', 'pending'));
    const unsubscribeRequests = onSnapshot(reqQ, (snapshot) => {
      setOrderRequests(snapshot.docs.map(d => ({ id: d.id, ...d.data() })));
    }, (error) => handleFirestoreError(error, OperationType.LIST, 'order_requests'));
    
    return () => {
      unsubscribe();
      unsubscribeTrans();
      unsubscribeShops();
      unsubscribeRequests();
    };
  }, [profile, hasPermission]);

  useEffect(() => {
    if (!profile) return;
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const monthlyOrders = orders.filter(o => new Date(o.createdAt) >= startOfMonth);
    const monthlySales = monthlyOrders.reduce((sum, i) => sum + (i.grandTotal || 0), 0);
    const totalOrdersNum = orders.filter(o => o.status === 'pending').length;
    const totalDue = orders.reduce((sum, o) => sum + (o.dueAmount || 0), 0);
    
    // Collection includes order amountPaid AND payment transactions
    // BUT we must avoid double counting.
    // Standard: Transaction records are the source of truth for payments.
    // However, some legacy orders might have amountPaid set without a transaction record.
    // For now, let's sum all payment transactions and only add order.amountPaid if it doesn't have a linked transaction.
    // Simplification: Sum all 'payment' and 'previous_payment' transactions.
    
    const totalCollection = transactions
      .filter(t => t.type === 'payment' || t.type === 'previous_payment')
      .reduce((sum, t) => sum + (t.amount || 0), 0);
    
    setStats({
      monthlySales,
      collection: totalCollection,
      due: totalDue,
      totalOrders: totalOrdersNum
    });
  }, [orders, transactions]);

  useEffect(() => {
    if (!activeStat) {
      setChartData([]);
      setSelectedArea(null);
      return;
    }

    // Process data for charts
    const areaDataMap: Record<string, number> = {};
    
    if (activeStat === 'monthlySales' || activeStat === 'due') {
      orders.forEach(order => {
        const shop = shops.find(s => s.code === order.shopCode);
        const area = shop?.area || 'Unknown';
        let value = 0;
        if (activeStat === 'monthlySales') {
          const startOfMonth = new Date();
          startOfMonth.setDate(1);
          startOfMonth.setHours(0, 0, 0, 0);
          if (new Date(order.createdAt) >= startOfMonth) {
            value = order.grandTotal;
          }
        } else if (activeStat === 'due') {
          value = order.dueAmount || 0;
        }

        if (value > 0) {
          areaDataMap[area] = (areaDataMap[area] || 0) + value;
        }
      });
    } else if (activeStat === 'collection') {
      transactions.forEach(trans => {
        if (trans.type === 'payment' || trans.type === 'previous_payment') {
          const shop = shops.find(s => s.code === trans.shopCode);
          const area = shop?.area || 'Unknown';
          areaDataMap[area] = (areaDataMap[area] || 0) + trans.amount;
        }
      });
    }

    const formattedData = Object.entries(areaDataMap).map(([name, value]) => ({ name, value }));
    setChartData(formattedData.sort((a, b) => b.value - a.value));
  }, [activeStat, orders, shops, transactions]);

  const getShopDetailsForArea = (area: string) => {
    const shopDataMap: Record<string, number> = {};
    
    if (activeStat === 'monthlySales' || activeStat === 'due') {
      orders.forEach(order => {
        const shop = shops.find(s => s.code === order.shopCode);
        if (shop?.area === area) {
          let value = 0;
          if (activeStat === 'monthlySales') {
            const startOfMonth = new Date();
            startOfMonth.setDate(1);
            startOfMonth.setHours(0, 0, 0, 0);
            if (new Date(order.createdAt) >= startOfMonth) value = order.grandTotal;
          } else if (activeStat === 'due') {
            value = order.dueAmount || 0;
          }
          
          if (value > 0) {
            shopDataMap[shop.name] = (shopDataMap[shop.name] || 0) + value;
          }
        }
      });
    } else if (activeStat === 'collection') {
      transactions.forEach(trans => {
        if (trans.type === 'payment' || trans.type === 'previous_payment') {
          const shop = shops.find(s => s.code === trans.shopCode);
          if (shop?.area === area) {
            shopDataMap[shop.name] = (shopDataMap[shop.name] || 0) + trans.amount;
          }
        }
      });
    }
    
    return Object.entries(shopDataMap).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value);
  };

  if (profile?.role === 'shop_owner' && profile.permissionStatus !== 'granted') {
    return <ShopOwnerDashboard />;
  }

  return (
    <div className="space-y-8">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">{t('welcome')}, {profile?.displayName}!</h1>
          <p className="text-slate-500 font-medium">{t('performanceOverview')}</p>
        </div>
        {hasPermission('VIEW_REPORTS') && hasPermission('ACCESS_FINANCE_VIEW') && (
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="flex items-center gap-2 px-6 py-2.5 bg-white border border-slate-200 rounded-2xl text-slate-700 font-black text-sm uppercase tracking-wider hover:bg-slate-50 transition-all shadow-sm active:scale-95"
          >
            {showDetails ? <X className="w-4 h-4" /> : <BarChart3 className="w-4 h-4" />}
            {showDetails ? t('hideDetails') : t('viewDetails')}
          </button>
        )}
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {[
          { id: 'monthlySales', label: t('monthlySales'), value: `৳${stats.monthlySales.toLocaleString()}`, icon: DollarSign, color: 'blue', sector: 'ACCESS_FINANCE_VIEW' },
          { id: 'collection', label: t('collection'), value: `৳${stats.collection.toLocaleString()}`, icon: Wallet, color: 'emerald', sector: 'ACCESS_FINANCE_VIEW' },
          { id: 'due', label: t('due'), value: `৳${stats.due.toLocaleString()}`, icon: AlertCircle, color: 'amber', sector: 'ACCESS_FINANCE_VIEW' },
          { id: 'totalOrders', label: t('totalOrders'), value: stats.totalOrders.toString(), icon: Package, color: 'indigo', isTotalOrders: true },
        ].filter(s => s.sector ? hasPermission(s.sector as Permission) : true).map((stat) => (
          <motion.div 
            key={stat.label} 
            whileHover={{ y: -5 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              if (stat.isTotalOrders) {
                navigate('/orders');
              } else {
                setActiveStat(activeStat === stat.id ? null : stat.id as any);
                setShowDetails(activeStat !== stat.id);
              }
            }}
            className={cn(
              "bg-white p-4 md:p-6 rounded-2xl md:rounded-3xl shadow-sm border border-slate-100 relative overflow-hidden group cursor-pointer transition-all",
              activeStat === stat.id ? "ring-2 ring-slate-900 shadow-xl" : "hover:shadow-md"
            )}
          >
            <div className={cn(
              "w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl flex items-center justify-center mb-3 md:mb-4 transition-transform group-hover:scale-110",
              stat.color === 'blue' && "bg-blue-50 text-blue-600",
              stat.color === 'amber' && "bg-amber-50 text-amber-600",
              stat.color === 'emerald' && "bg-emerald-50 text-emerald-600",
              stat.color === 'indigo' && "bg-indigo-50 text-indigo-600",
            )}>
              <stat.icon className="w-5 h-5 md:w-6 md:h-6" />
            </div>
            <p className="text-slate-400 text-[8px] md:text-[10px] font-black uppercase tracking-[0.2em] mb-1">{stat.label}</p>
            <p className="text-xl md:text-2xl font-black text-slate-800 tracking-tight">{stat.value}</p>
            
            {stat.isTotalOrders && (
              <div className="mt-2 md:mt-3 space-y-1.5">
                <div className="flex items-center justify-between text-[7px] md:text-[8px] font-black uppercase tracking-widest text-slate-400">
                  <span>{t('paymentRate') || 'Payment Rate'}</span>
                  <span className="text-emerald-600">{Math.round((stats.collection / (stats.collection + stats.due || 1)) * 100)}%</span>
                </div>
                <div className="w-full h-1 md:h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${(stats.collection / (stats.collection + stats.due || 1)) * 100}%` }}
                    className="h-full bg-emerald-500 rounded-full shadow-[0_0_8px_rgba(16,185,129,0.4)]"
                  />
                </div>
              </div>
            )}

            <div className={cn(
              "absolute top-0 right-0 w-24 h-24 -mr-8 -mt-8 rounded-full opacity-[0.03] transition-transform group-hover:scale-150",
              stat.color === 'blue' && "bg-blue-600",
              stat.color === 'amber' && "bg-amber-600",
              stat.color === 'emerald' && "bg-emerald-600",
              stat.color === 'indigo' && "bg-indigo-600",
            )} />
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {showDetails && activeStat && (
          <motion.div
            ref={chartSectionRef}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="space-y-6 pt-4"
          >
            <div className="bg-white p-6 md:p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                  <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">
                    {t(activeStat)} - {selectedArea ? `${t('details')} (${selectedArea})` : t('areaBaseAnalytics') || 'Area-wise Analytics'}
                  </h3>
                  <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-1">
                    {selectedArea ? t('shopBaseDetails') || 'Shop-based Details' : t('clickToExploreShops') || 'Click a data point to explore shops'}
                  </p>
                </div>
                {selectedArea && (
                  <button 
                    onClick={() => setSelectedArea(null)}
                    className="p-3 bg-slate-100 hover:bg-slate-200 rounded-2xl transition-all text-slate-900 flex items-center gap-2 font-black text-[10px] uppercase tracking-widest"
                  >
                    <ArrowLeft className="w-4 h-4" /> {t('backToAreas') || 'Back to Areas'}
                  </button>
                )}
              </div>

              <div className="h-[400px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  {activeStat === 'monthlySales' ? (
                    <PieChart>
                      <Pie
                        data={selectedArea ? getShopDetailsForArea(selectedArea) : chartData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={5}
                        dataKey="value"
                        label={({ name }) => name}
                        animationDuration={1500}
                        onClick={(data) => {
                          if (data && data.name && !selectedArea) {
                            setSelectedArea(data.name);
                          }
                        }}
                      >
                        {(selectedArea ? getShopDetailsForArea(selectedArea) : chartData).map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} stroke="transparent" />
                        ))}
                      </Pie>
                      <Tooltip 
                        content={({ active, payload }) => {
                          if (active && payload && payload.length) {
                            return (
                              <div className="bg-white p-4 rounded-3xl shadow-xl border border-slate-100 min-w-[180px]">
                                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">{payload[0].payload.name}</p>
                                <p className="text-xl font-black text-slate-900">৳{payload[0].value.toLocaleString()}</p>
                              </div>
                            );
                          }
                          return null;
                        }}
                      />
                    </PieChart>
                  ) : activeStat === 'collection' ? (
                    <BarChart 
                      layout="vertical"
                      data={selectedArea ? getShopDetailsForArea(selectedArea) : chartData}
                      margin={{ left: 60, right: 40, top: 20, bottom: 20 }}
                      onClick={(data) => {
                        if (data && data.activeLabel && !selectedArea) {
                          setSelectedArea(data.activeLabel);
                        }
                      }}
                    >
                      <defs>
                        <linearGradient id="collectionGradient" x1="0" y1="0" x2="1" y2="0">
                          <stop offset="0%" stopColor="#10b981" stopOpacity={1}/>
                          <stop offset="100%" stopColor="#059669" stopOpacity={0.9}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="4 4" horizontal={false} stroke="#f1f5f9" />
                      <XAxis 
                        type="number"
                        axisLine={false} 
                        tickLine={false} 
                        tick={{ fill: '#475569', fontSize: 11, fontWeight: 900 }}
                        tickFormatter={(value) => `৳${value >= 1000 ? `${(value/1000).toFixed(1)}k` : value}`}
                      />
                      <YAxis 
                        dataKey="name" 
                        type="category"
                        axisLine={false} 
                        tickLine={false} 
                        tick={{ fill: '#475569', fontSize: 11, fontWeight: 900 }}
                        width={140}
                      />
                      <Tooltip 
                        cursor={{ fill: 'rgba(16, 185, 129, 0.08)' }}
                        content={({ active, payload }) => {
                          if (active && payload && payload.length) {
                            return (
                              <div className="bg-slate-900 border border-slate-700/50 text-white p-5 rounded-[2rem] shadow-2xl backdrop-blur-xl">
                                <div className="flex items-center gap-3 mb-3">
                                  <div className="w-3 h-3 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">{payload[0].payload.name}</p>
                                </div>
                                <p className="text-2xl font-black tracking-tight">৳{payload[0].value.toLocaleString()}</p>
                                <p className="text-[9px] font-bold text-emerald-400 uppercase mt-2 tracking-widest">Collection Target Met</p>
                              </div>
                            );
                          }
                          return null;
                        }}
                      />
                      <Bar 
                        dataKey="value" 
                        fill="url(#collectionGradient)"
                        radius={[0, 15, 15, 0]}
                        barSize={36}
                        className="cursor-pointer transition-transform duration-300"
                        animationDuration={2000}
                      />
                    </BarChart>
                  ) : activeStat === 'due' ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 h-full">
                      <div className="h-full relative">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={selectedArea ? getShopDetailsForArea(selectedArea) : chartData}
                              cx="50%"
                              cy="50%"
                              innerRadius={60}
                              outerRadius={100}
                              paddingAngle={5}
                              dataKey="value"
                              label={({ name }) => name}
                              onClick={(data) => {
                                if (data && data.name && !selectedArea) {
                                  setSelectedArea(data.name);
                                }
                              }}
                            >
                              {(selectedArea ? getShopDetailsForArea(selectedArea) : chartData).map((entry, index) => (
                                <Cell key={`cell-due-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} className="cursor-pointer" />
                              ))}
                            </Pie>
                            <Tooltip />
                          </PieChart>
                        </ResponsiveContainer>
                         <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                            <p className="text-[8px] font-black text-slate-400 uppercase tracking-[0.2em] mb-0.5">{t('due')}</p>
                            <p className="text-xl font-black text-red-600">৳{stats.due.toLocaleString()}</p>
                         </div>
                      </div>
                      <div className="h-full overflow-y-auto px-2 scrollbar-hide">
                        <div style={{ height: Math.max(400, (selectedArea ? getShopDetailsForArea(selectedArea) : chartData).length * 40) }}>
                          <ResponsiveContainer width="100%" height="100%">
                            <BarChart 
                              data={selectedArea ? getShopDetailsForArea(selectedArea) : chartData} 
                              layout="vertical"
                              onClick={(data) => {
                                if (data && data.activeLabel && !selectedArea) {
                                  setSelectedArea(data.activeLabel);
                                }
                              }}
                            >
                              <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                              <XAxis type="number" hide />
                              <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} width={100} tick={{ fontSize: 9, fontWeight: 700 }} />
                              <Bar dataKey="value" fill="#ef4444" radius={[0, 4, 4, 0]} className="cursor-pointer" />
                              <Tooltip />
                            </BarChart>
                          </ResponsiveContainer>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="relative h-full flex items-center justify-center">
                      <PieChart>
                        <defs>
                          {CHART_COLORS.map((color, i) => (
                            <filter key={i} id={`pieShadow-${i}`} height="200%">
                              <feGaussianBlur in="SourceAlpha" stdDeviation="3" />
                              <feOffset dx="0" dy="4" result="offsetblur" />
                              <feFlood floodColor={color} floodOpacity="0.2" />
                              <feComposite in2="offsetblur" operator="in" />
                              <feMerge>
                                <feMergeNode />
                                <feMergeNode in="SourceGraphic" />
                              </feMerge>
                            </filter>
                          ))}
                        </defs>
                        <Pie
                          data={selectedArea ? getShopDetailsForArea(selectedArea) : chartData}
                          cx="50%"
                          cy="50%"
                          innerRadius={110}
                          outerRadius={150}
                          paddingAngle={10}
                          dataKey="value"
                          onClick={(data) => {
                            if (data && data.name && !selectedArea) {
                              setSelectedArea(data.name);
                            }
                          }}
                          className="cursor-pointer outline-none"
                          animationBegin={200}
                          animationDuration={1800}
                        >
                          {(selectedArea ? getShopDetailsForArea(selectedArea) : chartData).map((entry, index) => (
                            <Cell 
                              key={`cell-${index}`} 
                              fill={CHART_COLORS[index % CHART_COLORS.length]} 
                              stroke="white"
                              strokeWidth={6}
                              filter={`url(#pieShadow-${index % CHART_COLORS.length})`}
                              className="hover:opacity-80 transition-opacity"
                            />
                          ))}
                        </Pie>
                        <Tooltip 
                          content={({ active, payload }) => {
                            if (active && payload && payload.length) {
                              return (
                                <div className="bg-slate-900 text-white p-5 rounded-[2rem] shadow-2xl border border-slate-700/50 backdrop-blur-xl">
                                  <div className="flex items-center gap-3 mb-3">
                                    <div className="w-3 h-3 rounded-full shadow-lg" style={{ backgroundColor: payload[0].payload.fill }} />
                                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">{payload[0].name}</p>
                                  </div>
                                  <p className="text-3xl font-black tracking-tighter">৳{payload[0].value.toLocaleString()}</p>
                                  <div className="mt-3 pt-3 border-t border-slate-800">
                                     <p className="text-[10px] font-bold text-amber-500 uppercase tracking-widest">{t('outstandingBalance') || 'Outstanding Balance'}</p>
                                  </div>
                                </div>
                              );
                            }
                            return null;
                          }}
                        />
                      </PieChart>
                      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                         <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-1">{t('totalDue')}</p>
                         <p className="text-3xl font-black text-slate-900">৳{stats.due.toLocaleString()}</p>
                      </div>
                    </div>
                  )}
                </ResponsiveContainer>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {orderRequests.length > 0 && (
          <div className="lg:col-span-2 bg-amber-50 p-6 rounded-2xl border border-amber-100 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-amber-900 uppercase flex items-center gap-2">
                <ShoppingCart className="w-5 h-5" />
                {t('pendingRequests')} ({orderRequests.length})
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {orderRequests.map((req) => (
                <div key={req.id} className="bg-white p-4 rounded-xl border border-amber-100 shadow-sm space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-bold text-slate-900">{req.shopName}</p>
                      <p className="text-[10px] text-slate-500 uppercase tracking-widest">{format(new Date(req.createdAt), 'MMM d, h:mm a')}</p>
                    </div>
                    <button 
                      onClick={() => navigate('/new-order', { state: { request: req } })}
                      className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      title={t('createOrder')}
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="space-y-1">
                    {req.items.map((item: any, i: number) => (
                      <div key={i} className="flex justify-between text-sm text-slate-600">
                        <span>{item.productName}</span>
                        <span className="font-bold text-blue-600">x{item.quantity}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="bg-white p-4 md:p-6 rounded-2xl shadow-sm border border-slate-100">
          <div className="flex items-center justify-between mb-4 md:mb-6">
            <h2 className="text-lg md:text-xl font-bold text-slate-900 uppercase">{t('recentOrders')}</h2>
            <Link to="/orders" className="text-blue-600 text-[10px] md:text-sm font-bold hover:underline uppercase">{t('viewDetails')}</Link>
          </div>
          <div className="space-y-3 md:space-y-4">
            {recentOrders.length === 0 ? (
              <div className="p-6 md:p-8 text-center text-slate-400 uppercase text-xs">{t('noOrders')}</div>
            ) : (
              recentOrders.map((order) => (
                <div key={order.id} className="flex items-center gap-3 md:gap-4 p-3 md:p-4 rounded-xl bg-slate-50">
                  <div className="w-8 h-8 md:w-10 md:h-10 bg-white rounded-lg flex items-center justify-center shadow-sm">
                    <Store className="text-slate-400 w-4 h-4 md:w-5 md:h-5" />
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-slate-900 text-sm md:text-base">{order.shopName}</p>
                    <p className="text-[10px] md:text-xs text-slate-500">{order.items.length} items • ৳{order.grandTotal.toFixed(2)}</p>
                  </div>
                  <div className={cn(
                    "px-2 md:px-3 py-0.5 md:py-1 rounded-full text-[8px] md:text-[10px] font-bold uppercase",
                    order.status === 'delivered' ? "bg-emerald-100 text-emerald-700" : "bg-blue-100 text-blue-700"
                  )}>
                    {order.status}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="bg-white p-4 md:p-6 rounded-2xl shadow-sm border border-slate-100">
          <h2 className="text-lg md:text-xl font-bold text-slate-900 mb-4 md:mb-6 uppercase">{t('quickActions')}</h2>
          <div className="grid grid-cols-2 gap-3 md:gap-4">
            {hasPermission('CREATE_ORDERS') && (
              <Link to="/new-order" className="flex flex-col items-center gap-2 md:gap-3 p-4 md:p-6 rounded-2xl bg-blue-600 text-white hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200">
                <Plus className="w-6 h-6 md:w-8 md:h-8" />
                <span className="font-bold text-xs md:text-base">{t('newOrder')}</span>
              </Link>
            )}
            <Link to="/history" className="flex flex-col items-center gap-2 md:gap-3 p-4 md:p-6 rounded-2xl bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors">
              <History className="w-6 h-6 md:w-8 md:h-8" />
              <span className="font-bold text-xs md:text-base">{t('history')}</span>
            </Link>
            {hasPermission('MANAGE_PRODUCTS') && (
              <Link to="/products" className="flex flex-col items-center gap-2 md:gap-3 p-4 md:p-6 rounded-2xl bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors">
                <Package className="w-6 h-6 md:w-8 md:h-8 text-slate-400" />
                <span className="font-bold text-xs md:text-base">{t('products')}</span>
              </Link>
            )}
            {hasPermission('MANAGE_SHOPS') && (
              <Link to="/shops" className="flex flex-col items-center gap-2 md:gap-3 p-4 md:p-6 rounded-2xl bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors">
                <Store className="w-6 h-6 md:w-8 md:h-8 text-slate-400" />
                <span className="font-bold text-xs md:text-base">{t('shops')}</span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function NewOrder() {
  const { profile, hasPermission } = useAuth();
  const { t } = useLanguage();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const [shops, setShops] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [selectedShop, setSelectedShop] = useState('');
  const [items, setItems] = useState<any[]>([{ productName: '', size: '', grade: '1', quantity: 1, rate: 0, total: 0 }]);
  const [submitting, setSubmitting] = useState(false);
  const [showSummary, setShowSummary] = useState(false);
  const [editOrderId, setEditOrderId] = useState<string | null>(null);
  const [blinkIndex, setBlinkIndex] = useState<number | null>(null);
  const summaryRef = useRef<HTMLDivElement>(null);

  const handleSaveToGallery = async () => {
    if (!summaryRef.current) return;
    try {
      const dataUrl = await htmlToImage.toJpeg(summaryRef.current, { 
        quality: 1,
        pixelRatio: 4,
        backgroundColor: '#ffffff'
      });
      const link = document.createElement('a');
      link.download = `Order_Summary_${Date.now()}.jpg`;
      link.href = dataUrl;
      link.click();
      showToast(t('successUploaded'));
    } catch (error) {
      console.error("Screenshot error:", error);
    }
  };

  useEffect(() => {
    const fetchMetadata = async () => {
      const shopsSnap = await getDocs(collection(db, 'shops'));
      const fetchedShops = shopsSnap.docs
        .map(d => d.data() as Shop)
        .filter(s => profile?.role !== 'worker' || profile.assignedAreas?.map(a => a.toLowerCase()).includes(s.area.toLowerCase()));
      setShops(fetchedShops);
      
      const productsSnap = await getDocs(collection(db, 'products'));
      const fetchedProducts = productsSnap.docs.map(d => ({ id: d.id, ...d.data() } as Product));
      setProducts(fetchedProducts);

      // Handle incoming request or edit
      if (location.state?.request) {
        const req = location.state.request;
        setSelectedShop(req.shopCode);
        
        const initialItems = req.items.map((reqItem: any) => {
          const prod = fetchedProducts.find(p => p.id === reqItem.productId);
          return {
            productName: reqItem.productName,
            size: prod?.sizes?.[0] || '',
            grade: prod?.grade || '1',
            quantity: reqItem.quantity,
            rate: prod?.baseRate || 0,
            total: (prod?.baseRate || 0) * reqItem.quantity
          };
        });
        setItems(initialItems);
      } else if (location.state?.editOrder) {
        const order = location.state.editOrder;
        setEditOrderId(order.id);
        setSelectedShop(order.shopCode);
        setItems(order.items);
      }
    };
    fetchMetadata();
  }, [location.state]);

  const addItem = () => {
    if (!hasPermission('CREATE_ORDERS')) {
      showToast(t('permissionDenied'), 'error');
      return;
    }
    setItems([{ productName: '', size: '', grade: '1', quantity: 1, rate: 0, total: 0 }, ...items]);
  };

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const updateItem = (index: number, field: string, value: any) => {
    const newItems = [...items];
    const oldItem = { ...newItems[index] };
    newItems[index][field] = value;
    
    const item = newItems[index];
    
    // Rate update logic: product, grade, or size change resets the rate to official base rate
    if (field === 'productName' || field === 'size' || field === 'grade') {
      if (field === 'productName' && value) {
        const prod = products.find(p => p.name === value);
        if (prod && prod.sizes && prod.sizes.length > 0) {
          newItems[index].size = prod.sizes[0];
          item.size = prod.sizes[0]; // Update local item reference for following logic
        }
      }
      
      if (item.productName && item.grade && item.size) {
        // Find matching product - match name, grade AND size (if size is explicitly matched in list)
        // Note: the current schema stores sizes as string array in one product.
        // We find the product that matches name and grade and HAS the requested size.
        const prod = products.find(p => 
          p.name === item.productName && 
          p.grade === item.grade && 
          p.sizes.includes(item.size)
        );
        
        if (prod) {
          // Instantly change the rate in new order to follow product list rate
          newItems[index].rate = prod.baseRate || 0;
        } else {
          // Fallback search if size-matching fails (maybe some generic entry)
          const genericProd = products.find(p => p.name === item.productName && p.grade === item.grade);
          if (genericProd) {
            newItems[index].rate = genericProd.baseRate || 0;
          } else {
            newItems[index].rate = 0;
          }
        }

        // Check for duplicates
        const duplicateIndex = newItems.findIndex((it, i) => 
          i !== index && 
          it.productName === item.productName && 
          it.size === item.size && 
          it.grade === item.grade
        );

        if (duplicateIndex !== -1) {
          setBlinkIndex(index);
          showToast(t('duplicateProduct'), 'error');
          setTimeout(() => {
            setItems(prev => {
              const updated = [...prev];
              if (updated[index]) updated[index] = oldItem;
              return updated;
            });
            setBlinkIndex(null);
          }, 2000);
          setItems(newItems);
          return;
        }
      }
    }
    
    if (field === 'rate') {
      if (item.productName && item.size && item.grade) {
        const key = `rate_${item.productName}_${item.size}_${item.grade}`;
        localStorage.setItem(key, value.toString());
      }
    }
    
    newItems[index].total = newItems[index].quantity * newItems[index].rate;
    setItems(newItems);
  };

  const grandTotal = items.reduce((sum, item) => sum + item.total, 0);

  // Grouped summary for preview
  const groupedItems = items.reduce((acc: any, item) => {
    const size = item.size || 'Other';
    const grade = item.grade || '1';
    
    if (!acc[size]) acc[size] = { grades: {}, totalQty: 0, totalAmount: 0 };
    if (!acc[size].grades[grade]) acc[size].grades[grade] = { items: [], qty: 0, amount: 0 };
    
    acc[size].grades[grade].items.push(item);
    acc[size].grades[grade].qty += item.quantity;
    acc[size].grades[grade].amount += item.total;
    acc[size].totalQty += item.quantity;
    acc[size].totalAmount += item.total;
    
    return acc;
  }, {});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!hasPermission('CREATE_ORDERS')) {
      showToast(t('permissionDenied'), 'error');
      return;
    }
    if (!selectedShop || items.length === 0 || items.some(i => !i.productName)) return;
    
    if (!showSummary) {
      setShowSummary(true);
      return;
    }

    setSubmitting(true);
    const shop = shops.find(s => s.code === selectedShop);
    
    try {
      const orderData: any = {
        shopCode: selectedShop,
        shopName: shop?.name || 'Unknown',
        items,
        grandTotal,
        updatedAt: new Date().toISOString()
      };

      if (editOrderId) {
        const orderRef = doc(db, 'orders', editOrderId);
        const orderSnap = await getDoc(orderRef);
        const existingOrder = orderSnap.data() as Order;
        
        const history = existingOrder.modificationHistory || [];
        const newModification = {
          uid: profile?.uid || 'unknown',
          userName: profile?.displayName || profile?.email || 'Unknown',
          timestamp: new Date().toISOString(),
          action: 'ORDER_EDITED'
        };

        const newDueAmount = grandTotal - (existingOrder.amountPaid || 0);

        await updateDoc(orderRef, {
          ...orderData,
          dueAmount: newDueAmount,
          modificationHistory: [...history, newModification]
        });

        // Update shop due if already finalized
        if (['delivered', 'received'].includes(existingOrder.status)) {
          await updateShopDueInternal(orderData.shopCode, newDueAmount - (existingOrder.dueAmount || 0));
        }

        // Notify shop owner about modification
        await addDoc(collection(db, 'notifications'), {
          to: orderData.shopCode,
          type: 'ORDER_MODIFIED',
          orderId: editOrderId,
          by: profile?.displayName,
          read: false,
          createdAt: new Date().toISOString()
        });
      } else {
        const newOrder = {
          ...orderData,
          workerUid: profile?.uid,
          workerName: profile?.displayName,
          status: 'pending',
          paymentStatus: 'unpaid',
          amountPaid: 0,
          dueAmount: grandTotal,
          createdAt: new Date().toISOString(),
          modificationHistory: []
        };
        const orderRef = await addDoc(collection(db, 'orders'), newOrder);

        // Notify shop owner about new order
        await addDoc(collection(db, 'notifications'), {
          to: orderData.shopCode,
          type: 'NEW_ORDER',
          orderId: orderRef.id,
          by: profile?.displayName,
          read: false,
          createdAt: new Date().toISOString()
        });
      }

      // If it was from a request, mark it as converted
      if (location.state?.request?.id) {
        await updateDoc(doc(db, 'order_requests', location.state.request.id), {
          status: 'converted'
        });
      }

      showToast(t('successAdded'));
      navigate('/orders');
    } catch (error) {
      console.error("Order creation error:", error);
    } finally {
      setSubmitting(false);
    }
  };

  const uniqueProductNames = Array.from(new Set(products.map(p => p.name)));

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <header>
        <h1 className="text-3xl font-bold text-slate-900">{t('createNewOrder')}</h1>
        <p className="text-slate-500">{t('fillDetails')}</p>
      </header>

      <div className="space-y-6">
        {/* Main Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 space-y-4">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Store className="w-5 h-5 text-blue-600" />
            {t('shopSelection')}
          </h2>
          <select
            required
            value={selectedShop}
            onChange={(e) => setSelectedShop(e.target.value)}
            className="w-full p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none"
          >
            <option value="">{t('selectShop')}</option>
            {shops.map(s => (
              <option key={s.code} value={s.code}>{s.name} ({s.code})</option>
            ))}
          </select>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Package className="w-5 h-5 text-blue-600" />
              {t('orderItems')}
            </h2>
            <button
              type="button"
              onClick={addItem}
              className="text-blue-600 font-bold text-sm flex items-center gap-1 hover:underline"
            >
              <Plus className="w-4 h-4" /> {t('addProduct')}
            </button>
          </div>

          <div className="space-y-4">
            {items.length === 0 ? (
              <div className="p-12 text-center bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200">
                <Box className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                <p className="text-slate-500 font-bold uppercase tracking-widest text-sm">{t('noItemsYet')}</p>
                <button
                  type="button"
                  onClick={addItem}
                  className="mt-4 px-6 py-2 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-all text-sm"
                >
                  {t('addProduct')}
                </button>
              </div>
            ) : (
              items.map((item, index) => {
              const isComplete = item.productName && item.size && item.grade && item.rate > 0;
              const availableProductsForName = products.filter(p => p.name === item.productName);
              const availableSizes = Array.from(new Set(availableProductsForName.filter(p => p.grade === item.grade).flatMap(p => p.sizes)));

              return (
                <div key={index} className={cn(
                  "p-4 rounded-xl border transition-all duration-300 space-y-4 relative",
                  blinkIndex === index ? "bg-red-50 border-red-500 animate-pulse scale-[1.02] shadow-[0_0_20px_rgba(239,68,68,0.2)] z-10" :
                  isComplete ? "bg-emerald-50 border-emerald-100 shadow-sm" : "bg-slate-50 border-slate-100"
                )}>
                  {blinkIndex === index && (
                    <div className="absolute inset-0 bg-red-500/5 rounded-xl pointer-events-none" />
                  )}
                  <button
                    type="button"
                    onClick={() => removeItem(index)}
                    className="absolute top-4 right-4 text-slate-400 hover:text-red-500 transition-colors p-2 hover:bg-red-50 rounded-lg group"
                    title={t('delete')}
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase mb-1">{t('product')}</label>
                      <select
                        required
                        value={item.productName}
                        onChange={(e) => updateItem(index, 'productName', e.target.value)}
                        className="w-full p-2 rounded-lg border border-slate-200 bg-white"
                      >
                        <option value="">{t('selectProduct')}</option>
                        {uniqueProductNames.map(name => <option key={name} value={name}>{name}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase mb-1">{t('grade')}</label>
                      <select
                        required
                        value={item.grade}
                        onChange={(e) => updateItem(index, 'grade', e.target.value)}
                        className="w-full p-2 rounded-lg border border-slate-200 bg-white"
                      >
                        <option value="1">{t('grade')} 1</option>
                        <option value="2">{t('grade')} 2</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase mb-1">{t('size')}</label>
                      <select
                        required
                        value={item.size}
                        onChange={(e) => updateItem(index, 'size', e.target.value)}
                        className="w-full p-2 rounded-lg border border-slate-200 bg-white"
                      >
                        <option value="">{t('selectSize')}</option>
                        {availableSizes.map((s: string) => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase mb-1">{t('quantity')}</label>
                      <input
                        type="number"
                        required
                        min="1"
                        value={item.quantity}
                        onChange={(e) => updateItem(index, 'quantity', Number(e.target.value))}
                        className="w-full p-2 rounded-lg border border-slate-200 bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase mb-1">{t('rate')}</label>
                      <input
                        type="number"
                        required
                        min="0"
                        step="0.01"
                        value={item.rate}
                        onChange={(e) => updateItem(index, 'rate', Number(e.target.value))}
                        className="w-full p-2 rounded-lg border border-slate-200 bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase mb-1">{t('total')}</label>
                      <div className="w-full p-2 rounded-lg bg-slate-100 font-bold text-slate-700">
                        ৳{item.total.toFixed(2)}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
        </div>

        {showSummary && (
          <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm z-[100] flex items-start justify-center p-4 overflow-y-auto pt-20 pb-20">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white w-full max-w-2xl rounded-[2rem] shadow-2xl overflow-hidden flex flex-col"
            >
              <div className="p-8 sm:p-12 space-y-12">
                <div ref={summaryRef} className="space-y-8 bg-white">
                  <div className="flex justify-between items-start">
                  <div className="space-y-4">
                    <div className="bg-blue-600 text-white px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] inline-block">
                      {editOrderId ? t('editOrder') : t('orderSummary')}
                    </div>
                    <div>
                      <h2 className="text-4xl font-black text-slate-900 uppercase tracking-tight leading-none">
                        {shops.find(s => s.code === selectedShop)?.name || selectedShop}
                      </h2>
                      <p className="text-slate-400 font-bold text-xs uppercase tracking-widest mt-2">{format(new Date(), 'EEEE, MMMM do • h:mm a')}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-1">{t('grandTotal')}</p>
                    <p className="text-4xl font-mono font-black text-blue-600">৳{grandTotal.toLocaleString()}</p>
                  </div>
                </div>

                <div className="space-y-12">
                  {Object.entries(groupedItems).map(([size, sizeData]: [string, any]) => (
                    <div key={size} className="space-y-6">
                      <div className="flex items-center gap-4">
                        <div className="h-px flex-1 bg-slate-100" />
                        <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.3em] whitespace-nowrap bg-white px-4">
                          {size} {t('size')}
                        </h3>
                        <div className="h-px flex-1 bg-slate-100" />
                      </div>

                      <div className="space-y-8">
                        {Object.entries(sizeData.grades).map(([grade, gradeData]: [string, any]) => (
                          <div key={grade} className="space-y-4">
                            <div className="flex items-center justify-between px-2">
                              <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest bg-blue-50 px-2 py-1 rounded-md border border-blue-100/50">
                                {t('grade')} {grade}
                              </span>
                            </div>

                            <div className="grid grid-cols-1 gap-3">
                              {gradeData.items.map((item: any, i: number) => (
                                <div key={i} className="flex gap-4 items-center p-4 bg-white rounded-2xl border border-slate-100 shadow-sm relative overflow-hidden group">
                                  <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center shrink-0 font-black text-slate-400 text-sm border border-slate-100 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
                                    {item.quantity}
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <h4 className="text-base font-black text-slate-800 uppercase tracking-tight truncate mb-0.5">{item.productName}</h4>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">৳{item.rate.toLocaleString()} / unit</p>
                                  </div>
                                  <div className="text-right shrink-0">
                                    <p className="text-sm font-black text-slate-900">৳{item.total.toLocaleString()}</p>
                                  </div>
                                </div>
                              ))}
                            </div>
                            
                            <div className="flex justify-between items-center px-6 py-4 bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
                               <div className="space-y-1">
                                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{t('subtotal')}</p>
                                 <p className="text-lg font-black text-slate-900">৳{gradeData.amount.toLocaleString()}</p>
                               </div>
                               <div className="text-right space-y-1">
                                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{t('items')}</p>
                                 <p className="text-lg font-black text-blue-600">{gradeData.qty}</p>
                               </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Final Summary Table */}
                <div className="bg-slate-50 p-8 rounded-[2rem] border border-slate-200 space-y-8">
                  <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.3em] text-center">{t('orderSummary')}</h3>
                  <div className="space-y-4">
                    {Object.entries(groupedItems).map(([size, sizeData]: [string, any]) => (
                      <div key={size} className="flex justify-between items-center pb-4 border-b border-slate-200 last:border-0 last:pb-0">
                        <div>
                          <span className="text-sm font-black text-slate-900 uppercase tracking-tight">{size} {t('size')}</span>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{t('totalQuantity')}</p>
                        </div>
                        <div className="text-right">
                          <span className="text-lg font-black text-blue-600">{sizeData.totalQty} <span className="text-[10px] opacity-50">UNITS</span></span>
                          <p className="text-[10px] font-black text-slate-900 uppercase tracking-widest">৳{sizeData.totalAmount.toLocaleString()}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-6 bg-blue-50 rounded-3xl border border-blue-100">
                    <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-2">{t('worker')}</p>
                    <p className="font-black text-blue-900 uppercase truncate">{profile?.displayName}</p>
                  </div>
                  <div className="p-6 bg-slate-900 rounded-3xl">
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">{t('items')}</p>
                    <p className="font-black text-white uppercase">{items.reduce((sum, it) => sum + it.quantity, 0)} {t('items')}</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="p-8 bg-slate-50 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-3 gap-4">
                <button
                  type="button"
                  onClick={() => setShowSummary(false)}
                  className="px-6 py-4 rounded-2xl font-black uppercase text-xs tracking-widest text-slate-500 hover:bg-white hover:text-slate-900 transition-all border border-transparent hover:border-slate-200"
                >
                  {t('cancel')}
                </button>
                <button
                  type="button"
                  onClick={handleSaveToGallery}
                  className="px-6 py-4 rounded-2xl font-black uppercase text-xs tracking-widest text-blue-600 hover:bg-blue-600 hover:text-white transition-all border border-blue-200"
                >
                  {t('saveToGallery')}
                </button>
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={submitting}
                  className="sm:col-span-1 bg-blue-600 text-white font-black uppercase text-xs tracking-widest py-4 rounded-2xl hover:bg-blue-700 transition-all shadow-xl shadow-blue-200 disabled:opacity-50 flex items-center justify-center gap-3"
                >
                  {submitting ? t('saving') : t('confirmSubmit')}
                  {!submitting && <ArrowRight className="w-4 h-4" />}
                </button>
              </div>
            </motion.div>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-4">
          {showSummary ? (
            <>
              <button
                type="button"
                onClick={() => setShowSummary(false)}
                className="flex-1 bg-white text-slate-600 font-bold py-4 rounded-2xl border border-slate-200 hover:bg-slate-50 transition-colors flex items-center justify-center gap-2"
              >
                <Edit className="w-5 h-5" />
                {t('editOrder')}
              </button>
              <button
                type="button"
                onClick={handleSaveToGallery}
                className="flex-1 bg-slate-900 text-white font-bold py-4 rounded-2xl hover:bg-slate-800 transition-all shadow-lg shadow-slate-200 flex items-center justify-center gap-2"
              >
                <Download className="w-5 h-5" />
                {t('saveToGallery')}
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="flex-[2] bg-blue-600 text-white font-bold py-4 rounded-2xl hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {submitting ? t('placingOrder') : t('confirmSubmit')}
              </button>
            </>
          ) : (
            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-blue-600 text-white font-bold py-4 rounded-2xl hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200 disabled:opacity-50"
            >
              {t('reviewOrder')}
            </button>
          )}
        </div>
      </form>
    </div>
  </div>
);
}

function ShopDetails() {
  const { code } = useParams();
  const { user, profile, hasPermission } = useAuth();
  const { t } = useLanguage();
  const { showToast } = useToast();
  const [shop, setShop] = useState<Shop | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [showTransactionModal, setShowTransactionModal] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [newTransaction, setNewTransaction] = useState({ 
    amount: 0, 
    discount: 0, 
    type: 'payment' as 'payment' | 'due_addition' | 'discount' | 'previous_order' | 'previous_payment' | 'previous_due', 
    note: '',
    date: format(new Date(), 'yyyy-MM-dd'),
    receiptImage: ''
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const reportRef = useRef<HTMLDivElement>(null);
  const [exporting, setExporting] = useState(false);
  const [dateRange, setDateRange] = useState({ start: '', end: '' });

  const syncShopBalance = async () => {
    if (!shop || !code || !shop.id) return;
    try {
      const ordersSnap = await getDocs(query(collection(db, 'orders'), where('shopCode', '==', code)));
      const transactionsSnap = await getDocs(query(collection(db, 'transactions'), where('shopCode', '==', code)));

      let totalDueFromOrders = 0;
      ordersSnap.forEach(doc => {
        const order = doc.data();
        if (['delivered', 'received'].includes(order.status)) {
          totalDueFromOrders += (order.grandTotal || 0);
        }
      });

      let totalFromTransactions = 0;
      transactionsSnap.forEach(doc => {
        const trans = doc.data();
        if (['payment', 'previous_payment', 'discount'].includes(trans.type)) {
          totalFromTransactions -= trans.amount;
        } else if (['due_addition', 'previous_order', 'previous_due'].includes(trans.type)) {
          totalFromTransactions += trans.amount;
        }
      });

      const calculatedDue = totalDueFromOrders + totalFromTransactions;
      if (Math.abs(calculatedDue - (shop.totalDue || 0)) > 0.01) {
        await updateDoc(doc(db, 'shops', shop.id), { totalDue: calculatedDue });
        // The onSnapshot will update the local state
      }
    } catch (error) {
      console.error("Sync balancer error:", error);
    }
  };

  useEffect(() => {
    if (!code) return;

    setLoading(true);
    const shopQ = query(collection(db, 'shops'), where('code', '==', code));
    const unsubscribeShop = onSnapshot(shopQ, (snapshot) => {
      if (!snapshot.empty) {
        setShop({ id: snapshot.docs[0].id, ...snapshot.docs[0].data() } as any);
      }
      setLoading(false);
    }, (error) => handleFirestoreError(error, OperationType.GET, 'shop_details'));

    const ordersQ = query(collection(db, 'orders'), where('shopCode', '==', code));
    const unsubscribeOrders = onSnapshot(ordersQ, (snapshot) => {
      setOrders(snapshot.docs.map(d => ({ id: d.id, ...d.data() } as any)));
    }, (error) => handleFirestoreError(error, OperationType.LIST, 'shop_orders'));

    const transQ = query(collection(db, 'transactions'), where('shopCode', '==', code));
    const unsubscribeTrans = onSnapshot(transQ, (snapshot) => {
      setTransactions(snapshot.docs.map(d => ({ id: d.id, ...d.data() } as any)));
    }, (error) => handleFirestoreError(error, OperationType.LIST, 'shop_transactions'));
    
    return () => {
      unsubscribeShop();
      unsubscribeOrders();
      unsubscribeTrans();
    };
  }, [code]);

  useEffect(() => {
    if (!loading && shop) {
       syncShopBalance();
    }
  }, [loading, !!shop, code]);

  const downloadReport = async (title: string, elementId: string) => {
    const element = document.getElementById(elementId);
    if (!element) return;
    
    setExporting(true);
    showToast(t('Preparing Download') || 'Preparing download...');
    
    try {
      // Small delay to let UI settle if needed
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const dataUrl = await htmlToImage.toJpeg(element, {
        quality: 0.95,
        backgroundColor: '#ffffff',
        style: {
          transform: 'scale(1)',
          transformOrigin: 'top left',
          width: element.scrollWidth + 'px',
          height: element.scrollHeight + 'px'
        }
      });
      
      const link = document.createElement('a');
      link.download = `${shop?.name || 'Shop'}_${title}_${format(new Date(), 'yyyy-MM-dd')}.jpg`;
      link.href = dataUrl;
      link.click();
      showToast(t('successDownloaded') || 'Downloaded successfully');
    } catch (error) {
      console.error('Export error:', error);
      showToast(t('errorDownloading') || 'Error downloading report', 'error');
    } finally {
      setExporting(false);
    }
  };

  const filteredOrders = orders.filter(o => {
    if (!dateRange.start && !dateRange.end) return true;
    const orderDate = new Date(o.createdAt);
    const start = dateRange.start ? new Date(dateRange.start) : new Date(0);
    const end = dateRange.end ? new Date(dateRange.end) : new Date();
    end.setHours(23, 59, 59, 999);
    return orderDate >= start && orderDate <= end;
  });

  const filteredTransactions = transactions.filter(t => {
    if (!dateRange.start && !dateRange.end) return true;
    const transDate = new Date(t.date);
    const start = dateRange.start ? new Date(dateRange.start) : new Date(0);
    const end = dateRange.end ? new Date(dateRange.end) : new Date();
    end.setHours(23, 59, 59, 999);
    return transDate >= start && transDate <= end;
  });

  const handleTransactionSubmit = async () => {
    if (!shop || !profile) return;
    setUploadingImage(true);
    try {
      let receiptImageUrl = newTransaction.receiptImage;

      if (selectedFile) {
        try {
          const storageRef = ref(storage, `receipts/${shop.code}_${Date.now()}_${selectedFile.name}`);
          const snapshot = await uploadBytes(storageRef, selectedFile);
          receiptImageUrl = await getDownloadURL(snapshot.ref);
        } catch (uploadErr) {
          console.error("Image upload failed:", uploadErr);
          showToast(t('errorUploading'));
          // Continue without image or stop? Let's stop if user specifically tried to upload
          setUploadingImage(false);
          return;
        }
      }

      const transData = {
        shopCode: shop.code,
        amount: newTransaction.amount,
        discount: newTransaction.discount,
        type: newTransaction.type,
        workerUid: editingTransaction ? editingTransaction.workerUid : profile.uid,
        workerName: editingTransaction ? editingTransaction.workerName : (profile.displayName || profile.email),
        date: new Date(newTransaction.date).toISOString(),
        note: newTransaction.note,
        receiptImage: receiptImageUrl
      };

      if (editingTransaction) {
        await updateDoc(doc(db, 'transactions', editingTransaction.id!), transData);
        showToast(t('successUpdated'));
      } else {
        await addDoc(collection(db, 'transactions'), transData);
        showToast(t('successAdded'));
      }
      
      await syncShopBalance();
      
      setShowTransactionModal(false);
      setEditingTransaction(null);
      setSelectedFile(null);
      setImagePreview(null);
      setNewTransaction({ 
        amount: 0, 
        discount: 0, 
        type: 'payment', 
        note: '', 
        date: format(new Date(), 'yyyy-MM-dd'),
        receiptImage: ''
      });
    } catch (error) {
      console.error("Transaction error:", error);
      showToast(t('errorOccurred'));
    } finally {
      setUploadingImage(false);
    }
  };

  const handleDeleteTransaction = async (id: string) => {
    if (!hasPermission('DELETE_TRANSACTION')) {
      showToast(t('permissionDenied'), 'error');
      return;
    }
    if (!id) {
       showToast("Error: Missing transaction ID", "error");
       return;
    }
    if (!window.confirm(t('confirmDelete') || 'Are you sure you want to delete this transaction?')) return;
    
    // Optimistically update UI could be here, but let's stick to safe delete
    try {
      await deleteDoc(doc(db, 'transactions', id));
      showToast(t('successDeleted'));
      
      // We don't necessarily need syncShopBalance here because we should have a more robust mechanism
      // but let's keep it for now but make it safer.
      if (shop?.id) {
         await syncShopBalance();
      }
    } catch (error: any) {
       console.error("Delete transaction error:", error);
       const errorMessage = error.message?.includes('permission') ? "Permission Denied by Firestore" : error.message;
       showToast(`${t('errorOccurred')}: ${errorMessage}`, "error");
       handleFirestoreError(error, OperationType.DELETE, `transactions/${id}`);
    }
  };

  const openEditTransaction = (trans: Transaction) => {
    setEditingTransaction(trans);
    setImagePreview(trans.receiptImage || null);
    setNewTransaction({
      amount: trans.amount,
      discount: trans.discount || 0,
      type: trans.type as any,
      note: trans.note || '',
      date: format(new Date(trans.date), 'yyyy-MM-dd'),
      receiptImage: trans.receiptImage || ''
    });
    setShowTransactionModal(true);
  };

  if (loading) return <div className="flex justify-center p-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div></div>;
  if (!shop) return <div className="p-12 text-center text-slate-500 uppercase font-bold">{t('shopNotFound')}</div>;

  const isOwner = profile?.role === 'owner' || profile?.role === 'admin' || user?.email?.toLowerCase() === "suadkhan.s1.qc@gmail.com" || user?.uid === "NhlZjK6RjQMEREHmIIKVrUWoYYY2";
  const canManagePayments = isOwner || (hasPermission('MANAGE_PAYMENTS') && hasPermission('ACCESS_FINANCE_EDIT'));

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20">
      {/* Export Controls & Date Filters */}
      <div className="bg-slate-900 p-6 rounded-[2rem] shadow-2xl space-y-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
              <Download className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-white font-bold uppercase tracking-tight">{t('generateReport') || 'Generate Report'}</h3>
              <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest">{t('selectDateRange') || 'Select Date Range'}</p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <input 
              type="date" 
              value={dateRange.start}
              onChange={e => setDateRange(prev => ({ ...prev, start: e.target.value }))}
              className="bg-slate-800 border border-slate-700 text-white rounded-xl px-4 py-2 text-xs focus:ring-2 ring-blue-500 outline-none"
            />
            <span className="text-slate-500 text-xs font-black uppercase">{t('to') || 'TO'}</span>
            <input 
              type="date" 
              value={dateRange.end}
              onChange={e => setDateRange(prev => ({ ...prev, end: e.target.value }))}
              className="bg-slate-800 border border-slate-700 text-white rounded-xl px-4 py-2 text-xs focus:ring-2 ring-blue-500 outline-none"
            />
            <button 
              onClick={() => setDateRange({ start: '', end: '' })}
              className="p-2 hover:bg-slate-800 text-slate-400 hover:text-white rounded-lg transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <button 
            onClick={() => downloadReport('Full_Details', 'shop-full-report')}
            className="flex items-center justify-center gap-2 bg-blue-600 text-white py-3 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-blue-700 transition-all shadow-lg shadow-blue-900/40"
          >
            <ImageIcon className="w-4 h-4" /> {t('fullDetails') || 'Full Details'}
          </button>
          <button 
            onClick={() => downloadReport('Orders', 'shop-orders-section')}
            className="flex items-center justify-center gap-2 bg-slate-800 text-white py-3 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-700 transition-all"
          >
            <ShoppingCart className="w-4 h-4" /> {t('orders') || 'Orders Only'}
          </button>
          <button 
            onClick={() => downloadReport('Payments', 'shop-payments-section')}
            className="flex items-center justify-center gap-2 bg-slate-800 text-white py-3 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-700 transition-all"
          >
            <Wallet className="w-4 h-4" /> {t('payments') || 'Payments Only'}
          </button>
          <button 
            onClick={() => window.print()}
            className="flex items-center justify-center gap-2 bg-slate-800 text-white py-3 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-700 transition-all"
          >
            <FileText className="w-4 h-4" /> {t('printPDF') || 'Print PDF'}
          </button>
        </div>
      </div>

      <div id="shop-full-report" className="p-4 bg-slate-50 rounded-[2.5rem] -mx-4 md:mx-0">
        <div className="space-y-8">
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-blue-600 font-bold text-sm uppercase tracking-wider">
                <Store className="w-4 h-4" />
                {t('shopDetails')}
              </div>
              <div className="flex items-center gap-4">
                <h1 className="text-3xl font-bold text-slate-900">{shop.name}</h1>
                {hasPermission('DELETE_SHOP') && (
                  <button
                    onClick={() => {
                        if (window.confirm(t('confirmDelete'))) {
                          deleteDoc(doc(db, 'shops', shop.id!))
                            .then(() => {
                              showToast(t('successDeleted'));
                              window.history.back();
                            })
                            .catch(err => {
                              const errorMessage = err.message?.includes('permission') ? "Permission Denied" : err.message;
                              showToast(`${t('errorOccurred')}: ${errorMessage}`, "error");
                              handleFirestoreError(err, OperationType.DELETE, `shops/${shop.id}`);
                            });
                        }
                    }}
                    className="p-1 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                    title={t('deleteShop')}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
              <p className="text-slate-500 flex items-center gap-2">
                <MapPin className="w-4 h-4" /> {shop.area} • {t('shopCode')}: {shop.code}
              </p>
            </div>
            <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100 text-right">
              <p className="text-blue-600 text-sm font-bold uppercase mb-1">{t('dueAmount')}</p>
              <p className="text-3xl font-bold text-blue-900">৳{(shop.totalDue || 0).toFixed(2)}</p>
              <p className="text-[10px] text-slate-400 font-black uppercase mt-2">{t('reportGenerated') || 'Report Generated'}: {format(new Date(), 'MMM d, yyyy')}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div id="shop-orders-section" className="space-y-6 bg-white/50 p-4 rounded-[2rem]">
              <div className="flex items-center justify-between px-2">
                <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2 uppercase tracking-tighter">
                  <History className="w-5 h-5 text-blue-600" />
                  {t('orderHistory')}
                  {dateRange.start && <span className="text-[10px] bg-blue-100 text-blue-700 px-2 rounded-full">Filtered</span>}
                </h2>
              </div>
              <div className="space-y-4">
                {filteredOrders.length === 0 ? (
                  <p className="text-slate-500 text-sm italic px-2">{t('noOrders')}</p>
                ) : (
                  filteredOrders.sort((a, b) => b.createdAt.localeCompare(a.createdAt)).map(order => (
                    <div key={order.id} className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="font-bold text-slate-900">৳{order.grandTotal.toFixed(2)}</p>
                          <p className="text-xs text-slate-500">{new Date(order.createdAt).toLocaleDateString()}</p>
                        </div>
                        <span className={cn(
                          "px-3 py-1 rounded-full text-xs font-bold uppercase",
                          order.status === 'delivered' ? "bg-emerald-100 text-emerald-700" :
                          order.status === 'pending' ? "bg-amber-100 text-amber-700" :
                          order.status === 'cancelled' ? "bg-red-100 text-red-700" : "bg-blue-100 text-blue-700"
                        )}>
                          {t(order.status === 'in_transport' ? 'inTransport' : order.status)}
                        </span>
                      </div>
                      <div className="text-xs text-slate-600">
                        {order.items.length} {t('items')} • {t(order.paymentStatus)}
                      </div>
                      <div className="mt-2 pt-2 border-t border-slate-50 space-y-1">
                        {order.items.map((item: any, idx: number) => (
                          <div key={idx} className="flex justify-between text-[10px] text-slate-400">
                            <span>{item.productName} (G{item.grade}, {item.size}) x {item.quantity}</span>
                            <span className="font-bold text-slate-500">৳{item.total.toFixed(2)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div id="shop-payments-section" className="space-y-6 bg-white/50 p-4 rounded-[2rem]">
              <div className="flex items-center justify-between px-2">
                <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2 uppercase tracking-tighter">
                  <DollarSign className="w-5 h-5 text-emerald-600" />
                  {t('transactions')}
                  {dateRange.start && <span className="text-[10px] bg-emerald-100 text-emerald-700 px-2 rounded-full">Filtered</span>}
                </h2>
                {!exporting && canManagePayments && (
                  <button 
                    onClick={() => setShowTransactionModal(true)}
                    className="text-blue-600 font-bold text-sm flex items-center gap-1 hover:underline"
                  >
                    <Plus className="w-4 h-4" /> {t('add')}
                  </button>
                )}
              </div>
              <div className="space-y-4">
                {filteredTransactions.length === 0 ? (
                  <p className="text-slate-500 text-sm italic px-2">{t('noTransactions')}</p>
                ) : (
                  filteredTransactions.sort((a, b) => b.date.localeCompare(a.date)).map(trans => (
                    <div key={trans.id} className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm group">
                      <div className="flex justify-between items-start mb-1">
                        <span className={cn(
                          "font-bold",
                          trans.type === 'payment' || trans.type === 'previous_payment' ? "text-emerald-600" : 
                          trans.type === 'discount' ? "text-blue-600" : 
                          trans.type === 'previous_order' || trans.type === 'previous_due' || trans.type === 'due_addition' ? "text-red-600" : "text-slate-600"
                        )}>
                          {['payment', 'previous_payment', 'discount'].includes(trans.type) ? '-' : '+'}৳{trans.amount.toLocaleString()}
                          {trans.type === 'discount' && <span className="ml-2 text-[10px] uppercase tracking-widest">({t('discount')})</span>}
                          {trans.type === 'previous_order' && <span className="ml-2 text-[10px] uppercase tracking-widest">({t('previousOrder')})</span>}
                          {trans.type === 'previous_payment' && <span className="ml-2 text-[10px] uppercase tracking-widest">({t('previousPayment')})</span>}
                          {trans.type === 'previous_due' && <span className="ml-2 text-[10px] uppercase tracking-widest">({t('previousDue')})</span>}
                        </span>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-slate-400">{new Date(trans.date).toLocaleDateString()}</span>
                          {!exporting && canManagePayments && (
                            <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button 
                                onClick={() => openEditTransaction(trans)}
                                className="p-1 hover:bg-blue-50 text-blue-600 rounded-md transition-colors"
                              >
                                <Edit className="w-3 h-3" />
                              </button>
                              {hasPermission('DELETE_TRANSACTION') && (
                                <button 
                                  onClick={() => handleDeleteTransaction(trans.id!)}
                                  className="p-1 hover:bg-red-50 text-red-600 rounded-md transition-colors"
                                >
                                  <Trash2 className="w-3 h-3" />
                                </button>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                      <p className="text-xs text-slate-600">{trans.note || t('noNote')}</p>
                      {trans.receiptImage && (
                        <div className="mt-3">
                          <button 
                            onClick={() => window.open(trans.receiptImage, '_blank')}
                            className="relative group/img overflow-hidden rounded-xl border border-slate-100 block"
                          >
                            <img 
                              src={trans.receiptImage} 
                              alt="Receipt" 
                              className="w-full max-h-32 object-cover transition-transform group-hover/img:scale-110"
                              referrerPolicy="no-referrer"
                            />
                            <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center">
                              <Eye className="w-5 h-5 text-white" />
                            </div>
                          </button>
                        </div>
                      )}
                      <p className="text-[10px] text-slate-400 mt-1 uppercase tracking-tighter">{t('by')}: {trans.workerName}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {showTransactionModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-start justify-center z-[100] p-4 overflow-y-auto pt-20">
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl space-y-6 mb-20"
          >
            <h2 className="text-2xl font-bold text-slate-900">
              {editingTransaction ? t('editTransaction') || 'Edit Transaction' : t('addTransaction')}
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">{t('type')}</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  <button
                    onClick={() => setNewTransaction({ ...newTransaction, type: 'payment' })}
                    className={cn(
                      "py-2 rounded-xl font-bold transition-all text-xs",
                      newTransaction.type === 'payment' ? "bg-emerald-600 text-white" : "bg-slate-100 text-slate-600"
                    )}
                  >
                    {t('payment')}
                  </button>
                  <button
                    onClick={() => setNewTransaction({ ...newTransaction, type: 'previous_payment' })}
                    className={cn(
                      "py-2 rounded-xl font-bold transition-all text-xs",
                      newTransaction.type === 'previous_payment' ? "bg-emerald-500 text-white" : "bg-slate-100 text-slate-600"
                    )}
                  >
                    {t('previousPayment')}
                  </button>
                  <button
                    onClick={() => setNewTransaction({ ...newTransaction, type: 'due_addition' })}
                    className={cn(
                      "py-2 rounded-xl font-bold transition-all text-xs",
                      newTransaction.type === 'due_addition' ? "bg-red-600 text-white" : "bg-slate-100 text-slate-600"
                    )}
                  >
                    {t('addDue')}
                  </button>
                  <button
                    onClick={() => setNewTransaction({ ...newTransaction, type: 'previous_due' })}
                    className={cn(
                      "py-2 rounded-xl font-bold transition-all text-xs",
                      newTransaction.type === 'previous_due' ? "bg-red-500 text-white" : "bg-slate-100 text-slate-600"
                    )}
                  >
                    {t('previousDue')}
                  </button>
                  <button
                    onClick={() => setNewTransaction({ ...newTransaction, type: 'previous_order' })}
                    className={cn(
                      "py-2 rounded-xl font-bold transition-all text-xs",
                      newTransaction.type === 'previous_order' ? "bg-indigo-600 text-white" : "bg-slate-100 text-slate-600"
                    )}
                  >
                    {t('previousOrder')}
                  </button>
                  <button
                    onClick={() => setNewTransaction({ ...newTransaction, type: 'discount' })}
                    className={cn(
                      "py-2 rounded-xl font-bold transition-all text-xs",
                      newTransaction.type === 'discount' ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-600"
                    )}
                  >
                    {t('discount')}
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">{t('date')}</label>
                <input
                  type="date"
                  value={newTransaction.date}
                  onChange={(e) => setNewTransaction({ ...newTransaction, date: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 font-bold text-slate-900"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">{t('amount')}</label>
                <input
                  type="number"
                  value={newTransaction.amount}
                  onChange={(e) => setNewTransaction({ ...newTransaction, amount: Number(e.target.value) })}
                  className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 font-bold text-slate-900"
                  placeholder="0.00"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">{t('note')}</label>
                <textarea
                  value={newTransaction.note}
                  onChange={(e) => setNewTransaction({ ...newTransaction, note: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 font-bold text-slate-900 h-24"
                  placeholder={t('addNote')}
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">{t('attachReceipt')}</label>
                {imagePreview ? (
                  <div className="relative group">
                    <img src={imagePreview} alt="Preview" className="w-full h-40 object-cover rounded-2xl border border-slate-200" referrerPolicy="no-referrer" />
                    <button 
                      onClick={() => {
                        setSelectedFile(null);
                        setImagePreview(null);
                        setNewTransaction({ ...newTransaction, receiptImage: '' });
                      }}
                      className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="w-4 h-4" />
                    </button>
                    <label className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer rounded-2xl">
                      <span className="text-white text-[10px] font-black uppercase tracking-widest">{t('changeImage')}</span>
                      <input 
                        type="file" 
                        accept="image/*" 
                        className="hidden" 
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            setSelectedFile(file);
                            setImagePreview(URL.createObjectURL(file));
                          }
                        }} 
                      />
                    </label>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center w-full h-40 bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl cursor-pointer hover:bg-slate-100 transition-all group">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <div className="w-12 h-12 bg-white rounded-2xl shadow-sm flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                        <Upload className="w-6 h-6 text-slate-400" />
                      </div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{t('chooseImage')}</p>
                    </div>
                    <input 
                      type="file" 
                      accept="image/*" 
                      className="hidden" 
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          setSelectedFile(file);
                          setImagePreview(URL.createObjectURL(file));
                        }
                      }} 
                    />
                  </label>
                )}
              </div>
            </div>
            <div className="flex gap-4">
              <button
                disabled={uploadingImage}
                onClick={() => {
                  setShowTransactionModal(false);
                  setEditingTransaction(null);
                  setSelectedFile(null);
                  setImagePreview(null);
                }}
                className="flex-1 py-4 bg-slate-100 text-slate-600 font-bold rounded-2xl hover:bg-slate-200 transition-all disabled:opacity-50"
              >
                {t('cancel')}
              </button>
              <button
                onClick={handleTransactionSubmit}
                disabled={!newTransaction.amount || uploadingImage}
                className="flex-1 py-4 bg-slate-900 text-white font-black rounded-2xl hover:bg-black transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {uploadingImage ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    {t('processing') || 'Processing...'}
                  </>
                ) : (
                  editingTransaction ? t('update') : t('saveTransaction')
                )}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}

function OrderDetails() {
  const { id } = useParams<{ id: string }>();
  const { profile, hasPermission } = useAuth();
  const { t } = useLanguage();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'standard' | 'delivery'>('standard');

  useEffect(() => {
    if (!id) return;
    const unsubscribe = onSnapshot(doc(db, 'orders', id), (doc) => {
      if (doc.exists()) {
        setOrder({ id: doc.id, ...doc.data() });
      } else {
        setOrder(null);
      }
      setLoading(false);
    }, (error) => handleFirestoreError(error, OperationType.GET, `orders/${id}`));

    return () => unsubscribe();
  }, [id]);

  const updateItem = async (index: number, updates: Partial<any>) => {
    if (!id || !order) return;
    const newItems = [...order.items];
    const item = { ...newItems[index], ...updates };
    
    // Recalculate total for this item
    const qty = item.deliveredQuantity !== undefined ? item.deliveredQuantity : item.quantity;
    item.total = qty * item.rate;
    newItems[index] = item;

    // Recalculate grand total
    const newGrandTotal = newItems.reduce((sum, i) => sum + i.total, 0);
    const newDueAmount = newGrandTotal - (order.amountPaid || 0);

    try {
      await updateDoc(doc(db, 'orders', id), {
        items: newItems,
        grandTotal: newGrandTotal,
        dueAmount: newDueAmount,
        updatedAt: new Date().toISOString(),
        modificationHistory: arrayUnion({
          uid: profile?.uid || 'unknown',
          userName: profile?.displayName || profile?.email || 'Unknown',
          timestamp: new Date().toISOString(),
          action: `ITEM_UPDATED: ${item.productName} (Packed: ${item.packed ? 'Yes' : 'No'}, D.Qty: ${qty})`
        })
      });

      // Update shop due if already finalized
      if (['delivered', 'received'].includes(order.status)) {
        await updateShopDueInternal(order.shopCode, newDueAmount - order.dueAmount);
      }

      showToast(t('successUpdated'));
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `orders/${id}`);
    }
  };

  if (loading) return <LoadingScreen />;
  if (!order) return (
    <div className="flex flex-col items-center justify-center p-12 space-y-4">
      <Package className="w-16 h-16 text-slate-200" />
      <h2 className="text-xl font-bold text-slate-800">{t('orderNotFound')}</h2>
      <button onClick={() => navigate('/orders')} className="text-blue-600 font-bold hover:underline">
        {t('backToOrders')}
      </button>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/orders')}
            className="p-3 bg-white rounded-2xl shadow-sm border border-slate-100 text-slate-400 hover:text-blue-600 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-black text-slate-900 uppercase tracking-tight">{t('orderDetails')}</h1>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{t('orderId')}: #{order.id}</p>
          </div>
        </div>
        {(profile?.role === 'manager' || profile?.role === 'delivery' || profile?.role === 'delivery_manager' || profile?.role === 'admin' || profile?.role === 'owner') && (
          <div className="flex bg-white p-1 rounded-2xl border border-slate-100 shadow-sm self-start md:self-auto">
            <button
              onClick={() => setViewMode('standard')}
              className={cn(
                "px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                viewMode === 'standard' ? "bg-slate-900 text-white shadow-lg shadow-slate-200" : "text-slate-400 hover:text-slate-600"
              )}
            >
              {t('standardView')}
            </button>
            <button
              onClick={() => setViewMode('delivery')}
              className={cn(
                "px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                viewMode === 'delivery' ? "bg-blue-600 text-white shadow-lg shadow-blue-100" : "text-slate-400 hover:text-slate-600"
              )}
            >
              {t('deliveryView')}
            </button>
          </div>
        )}
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-6">
          <section className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 space-y-8">
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <div className={cn(
                  "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest inline-block mb-2",
                  order.status === 'pending' && "bg-amber-50 text-amber-600",
                  order.status === 'in_transport' && "bg-blue-50 text-blue-600",
                  order.status === 'delivered' && "bg-emerald-50 text-emerald-600",
                  order.status === 'cancelled' && "bg-red-50 text-red-600",
                  order.status === 'received' && "bg-purple-50 text-purple-600",
                )}>
                  {t(order.status)}
                </div>
                <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tighter">{order.shopName}</h2>
                <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">{order.shopCode}</p>
              </div>
              <div className="text-right">
                <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-1">{t('orderDate')}</p>
                <p className="font-bold text-slate-900">{format(new Date(order.createdAt), 'MMM d, yyyy')}</p>
                <p className="text-xs text-slate-400 font-medium">{format(new Date(order.createdAt), 'h:mm a')}</p>
              </div>
            </div>

            <div className="h-px bg-slate-50" />
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">{t('items')}</h3>
                {viewMode === 'delivery' && (
                   <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest">
                     {order.items.filter((i: any) => i.packed).length} / {order.items.length} {t('packedItems') || 'PACKED'}
                   </span>
                )}
              </div>
              
              {/* Grouped Items List */}
              {Object.entries(order.items.reduce((acc: any, item: any) => {
                const cat = item.productCategory || 'General';
                if (!acc[cat]) acc[cat] = [];
                acc[cat].push(item);
                return acc;
              }, {}) as Record<string, any[]>).map(([category, catItems]) => (
                <div key={category} className="space-y-4">
                  <div className="flex items-center gap-3">
                    <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em]">{category}</p>
                    <div className="h-px flex-1 bg-slate-50" />
                  </div>
                  <div className="space-y-4">
                    {viewMode === 'standard' ? (
                      catItems.map((item: any, i: number) => {
                        const originalIdx = order.items.findIndex((oi: any) => oi === item);
                        return (
                          <div key={originalIdx} className="flex flex-col sm:flex-row gap-4 sm:items-center p-6 bg-slate-50 rounded-3xl border border-slate-100 transition-all hover:bg-white hover:border-blue-200">
                            <div className="flex items-center gap-4 flex-1">
                              <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm shrink-0 font-black text-blue-600">
                                {item.deliveredQuantity !== undefined ? item.deliveredQuantity : item.quantity}
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-0.5">
                                  <span className="px-1.5 py-0.5 bg-slate-900 text-white text-[8px] font-black uppercase rounded">{t('gradeAbbr') || 'G'}{item.grade}</span>
                                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{item.size}</span>
                                </div>
                                <h4 className="text-sm font-black text-slate-800 uppercase truncate">{item.productName}</h4>
                                {item.deliveredQuantity !== undefined && item.deliveredQuantity !== item.quantity && (
                                  <p className="text-[10px] text-red-500 font-black uppercase mt-1">
                                    Ordered: {item.quantity}
                                  </p>
                                )}
                              </div>
                            </div>

                            <div className="flex items-center gap-6 justify-between sm:justify-end">
                              {(profile?.role === 'manager' || profile?.role === 'delivery' || profile?.role === 'delivery_manager' || profile?.role === 'admin' || profile?.role === 'owner') && (
                                <div className="flex items-center gap-4 bg-white p-2 rounded-2xl border border-slate-100 shrink-0">
                                  <div className="flex items-center gap-2">
                                    <label className="text-[9px] font-black text-slate-300 uppercase">{t('delQty') || 'QTY'}</label>
                                    <input 
                                      type="number"
                                      min="0"
                                      value={item.deliveredQuantity !== undefined ? item.deliveredQuantity : item.quantity}
                                      onChange={(e) => updateItem(originalIdx, { deliveredQuantity: Number(e.target.value) })}
                                      className="w-12 bg-slate-50 rounded-lg text-center font-black text-xs py-1"
                                    />
                                  </div>
                                  <button
                                    onClick={() => updateItem(originalIdx, { packed: !item.packed })}
                                    className={cn(
                                      "flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all",
                                      item.packed ? "bg-emerald-500 text-white" : "bg-slate-100 text-slate-400 hover:bg-slate-200"
                                    )}
                                  >
                                    {item.packed ? <Check className="w-3 h-3" /> : null}
                                    {t('packed')}
                                  </button>
                                </div>
                              )}
                              <div className="text-right shrink-0">
                                <p className="text-sm font-black text-slate-900">৳{item.total.toLocaleString()}</p>
                                <p className="text-[9px] font-bold text-slate-300">৳{item.rate.toLocaleString()} / unit</p>
                              </div>
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <div className="divide-y divide-slate-50 border border-slate-50 rounded-3xl overflow-hidden shadow-sm">
                        {catItems.map((item: any, idxInGroup: number) => {
                          const originalIdx = order.items.findIndex((oi: any) => oi === item);
                          return (
                            <div 
                              key={originalIdx} 
                              className={cn(
                                "flex items-center gap-4 p-5 transition-colors",
                                item.packed ? "bg-emerald-50/30" : "bg-white"
                              )}
                            >
                              <button
                                onClick={() => updateItem(originalIdx, { packed: !item.packed })}
                                className={cn(
                                  "w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all shrink-0",
                                  item.packed ? "bg-emerald-500 border-emerald-500 text-white" : "border-slate-100 bg-slate-50 text-transparent"
                                )}
                              >
                                <Check className="w-5 h-5 stroke-[4]" />
                              </button>
                              <div className="flex-1 grid grid-cols-2 sm:grid-cols-4 gap-4 items-center">
                                <div>
                                  <p className="text-[8px] font-black text-slate-300 uppercase tracking-widest leading-none mb-1">{t('product') || 'PRODUCT'}</p>
                                  <p className="text-xs font-black text-slate-900 uppercase truncate">{item.productName}</p>
                                </div>
                                <div>
                                   <p className="text-[8px] font-black text-slate-300 uppercase tracking-widest leading-none mb-1">{t('size')}</p>
                                   <p className="text-xs font-black text-slate-900 uppercase">{item.size} ({t('gradeAbbr')}{item.grade})</p>
                                </div>
                                <div>
                                   <p className="text-[8px] font-black text-slate-300 uppercase tracking-widest leading-none mb-1">{t('quantity')}</p>
                                   <div className="flex items-center gap-3">
                                     <span className="text-sm font-black text-blue-600">{item.deliveredQuantity !== undefined ? item.deliveredQuantity : item.quantity}</span>
                                     <div className="flex gap-1">
                                       <button 
                                         onClick={() => {
                                           const cur = item.deliveredQuantity !== undefined ? item.deliveredQuantity : item.quantity;
                                           if (cur > 0) updateItem(originalIdx, { deliveredQuantity: cur - 1 });
                                         }}
                                         className="w-5 h-5 rounded-md bg-slate-100 flex items-center justify-center text-slate-600 hover:bg-slate-200"
                                       >-</button>
                                       <button 
                                         onClick={() => {
                                           const cur = item.deliveredQuantity !== undefined ? item.deliveredQuantity : item.quantity;
                                           updateItem(originalIdx, { deliveredQuantity: cur + 1 });
                                         }}
                                         className="w-5 h-5 rounded-md bg-slate-100 flex items-center justify-center text-slate-600 hover:bg-slate-200"
                                       >+</button>
                                     </div>
                                   </div>
                                </div>
                                <div className="text-right sm:block hidden">
                                   <p className="text-[8px] font-black text-slate-300 uppercase tracking-widest leading-none mb-1">{t('total')}</p>
                                   <p className="text-xs font-black text-slate-900">৳{item.total.toLocaleString()}</p>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Action History */}
          <section className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 space-y-6">
            <div className="flex items-center gap-2">
              <ActivityLogIcon className="w-4 h-4 text-blue-600" />
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">{t('modificationHistory')}</h3>
            </div>
            <div className="space-y-4 relative before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-px before:bg-slate-100">
              {order.modificationHistory?.slice().reverse().map((log: any, i: number) => (
                <div key={i} className="flex gap-4 relative">
                  <div className="w-6 h-6 bg-white border-2 border-slate-100 rounded-full flex items-center justify-center shrink-0 z-10">
                    <div className="w-2 h-2 bg-blue-600 rounded-full" />
                  </div>
                  <div className="flex-1 pb-4">
                    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                      <div className="flex justify-between items-start mb-1">
                        <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest">{log.action.replace(/_/g, ' ')}</span>
                        <span className="text-[9px] font-bold text-slate-400">{format(new Date(log.timestamp), 'MMM d, h:mm a')}</span>
                      </div>
                      <p className="text-xs font-bold text-slate-700 capitalize">{log.userName}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        <div className="space-y-8">
          {/* Summary Card */}
          <section className="bg-slate-900 p-8 rounded-[2.5rem] shadow-xl text-white space-y-6 overflow-hidden relative group">
            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform duration-500">
              <Package className="w-32 h-32" />
            </div>
            <div className="relative z-10">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">{t('grandTotal')}</p>
              <h2 className="text-4xl font-black tracking-tighter">৳{order.grandTotal.toLocaleString()}</h2>
            </div>
            <div className="space-y-3 relative z-10">
              <div className="flex justify-between items-center py-2 border-b border-white/10">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{t('subtotal')}</span>
                <span className="text-sm font-bold">৳{order.grandTotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-white/10">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{t('paid') || 'PAID'}</span>
                <span className="text-sm font-bold text-emerald-400">৳{(order.amountPaid || 0).toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center py-4">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{t('due') || 'DUE'}</span>
                <span className="text-xl font-black text-red-400">৳{(order.grandTotal - (order.amountPaid || 0)).toLocaleString()}</span>
              </div>
            </div>
          </section>

          {/* User Info */}
          <section className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 space-y-6">
             <div className="space-y-4">
               <div>
                  <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-1">{t('worker')}</p>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center font-black text-blue-600 text-sm">
                      {order.workerName.charAt(0)}
                    </div>
                    <p className="text-sm font-black text-slate-800 uppercase">{order.workerName}</p>
                  </div>
               </div>
               {order.creatorName && (
                 <div>
                    <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-1">{t('creator') || 'CREATOR'}</p>
                    <p className="text-sm font-black text-slate-800 uppercase">{order.creatorName}</p>
                 </div>
               )}
               {order.note && (
                 <div>
                    <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-1">{t('note')}</p>
                    <p className="text-xs font-medium text-slate-600 bg-slate-50 p-4 rounded-xl border border-slate-100">{order.note}</p>
                 </div>
               )}
             </div>
          </section>

          <div className="grid grid-cols-1 gap-4">
               {hasPermission('EDIT_ORDER') && (
                  <button 
                    onClick={() => navigate('/new-order', { state: { editOrder: order } })}
                    className="w-full py-4 bg-slate-900 text-white font-black rounded-2xl hover:bg-black transition-all flex items-center justify-center gap-2"
                  >
                    <Edit className="w-4 h-4" /> {t('editOrder')}
                  </button>
               )}
          </div>
        </div>
      </div>
    </div>
  );
}

function OrderList() {
  const { profile, hasPermission } = useAuth();
  const { t } = useLanguage();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('active');
  const [areaRequests, setAreaRequests] = useState<AreaRequest[]>([]);
  const [requestingArea, setRequestingArea] = useState(false);
  const [newAreaName, setNewAreaName] = useState('');
  const [viewingHistory, setViewingHistory] = useState<Order | null>(null);

  const [shops, setShops] = useState<Shop[]>([]);

  useEffect(() => {
    if (!profile) return;
    let q = query(collection(db, 'orders'));
    
    if (profile?.role === 'worker') {
      q = query(q, where('workerUid', '==', profile.uid));
    } else if (profile?.role === 'shop_owner') {
      q = query(q, where('shopCode', '==', profile.shopCode));
    }

    const unsubscribe = onSnapshot(q, (snapshot) => {
      setOrders(snapshot.docs.map(d => ({ id: d.id, ...d.data() })));
      setLoading(false);
    }, (error) => handleFirestoreError(error, OperationType.LIST, 'orders_list'));

    const unsubscribeShops = onSnapshot(collection(db, 'shops'), (snapshot) => {
      setShops(snapshot.docs.map(d => ({ id: d.id, ...d.data() } as any)));
    });

    return () => {
      unsubscribe();
      unsubscribeShops();
    };
  }, [profile]);

  useEffect(() => {
    if (!profile || profile.role !== 'worker') return;
    const q = query(collection(db, 'area_requests'), where('workerUid', '==', profile.uid));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setAreaRequests(snapshot.docs.map(d => ({ id: d.id, ...d.data() } as AreaRequest)));
    }, (error) => handleFirestoreError(error, OperationType.LIST, 'area_requests'));
    return () => unsubscribe();
  }, [profile]);

  const submitAreaRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAreaName.trim()) return;
    try {
      const formattedArea = newAreaName.trim();
      await addDoc(collection(db, 'area_requests'), {
        workerUid: profile?.uid,
        workerName: profile?.displayName || profile?.email,
        requestedArea: formattedArea,
        status: 'pending',
        createdAt: new Date().toISOString()
      });
      setNewAreaName('');
      setRequestingArea(false);
      showToast(t('requestSubmitted'));
    } catch (error) {
      console.error("Area request error:", error);
    }
  };

  const updateStatus = async (id: string, status: string) => {
    try {
      const orderRef = doc(db, 'orders', id);
      const snap = await getDoc(orderRef);
      if (!snap.exists()) return;
      const orderData = snap.data();
      const oldStatus = orderData.status;

      await updateDoc(orderRef, { 
        status, 
        updatedAt: new Date().toISOString(),
        modificationHistory: arrayUnion({
          uid: profile?.uid || 'unknown',
          userName: profile?.displayName || profile?.email || 'Unknown',
          timestamp: new Date().toISOString(),
          action: `STATUS_UPDATED: ${status.toUpperCase()}`
        })
      });

      // Update shop due if transitioning to/from delivered/received
      const wasFinalized = ['delivered', 'received'].includes(oldStatus);
      const isFinalized = ['delivered', 'received'].includes(status);

      if (!wasFinalized && isFinalized) {
        await updateShopDueInternal(orderData.shopCode, orderData.dueAmount || 0);
      } else if (wasFinalized && !isFinalized) {
        await updateShopDueInternal(orderData.shopCode, -(orderData.dueAmount || 0));
      }

      showToast(t('successUpdated'));
    } catch (error) {
      console.error("Status update error:", error);
    }
  };

  const markReceived = async (id: string) => {
    try {
      const orderRef = doc(db, 'orders', id);
      const snap = await getDoc(orderRef);
      if (!snap.exists()) return;
      const orderData = snap.data();
      const oldStatus = orderData.status;

      await updateDoc(orderRef, { 
        receivedByWorker: true,
        status: 'received',
        updatedAt: new Date().toISOString(),
        modificationHistory: arrayUnion({
          uid: profile?.uid || 'unknown',
          userName: profile?.displayName || profile?.email || 'Unknown',
          timestamp: new Date().toISOString(),
          action: 'ORDER_MARKED_RECEIVED'
        })
      });

      // Update shop due if transitioning from non-finalized to received
      const wasFinalized = ['delivered', 'received'].includes(oldStatus);
      if (!wasFinalized) {
        await updateShopDueInternal(orderData.shopCode, orderData.dueAmount || 0);
      }

      showToast(t('successUpdated'));
    } catch (error) {
      console.error("Mark received error:", error);
      handleFirestoreError(error, OperationType.UPDATE, `orders/${id}`);
    }
  };

  const handleDeleteOrder = async (id: string) => {
    if (!hasPermission('DELETE_ORDER')) {
      showToast(t('permissionDenied'), 'error');
      return;
    }
    if (!window.confirm(t('confirmDelete'))) return;
    try {
      const orderRef = doc(db, 'orders', id);
      const snap = await getDoc(orderRef);
      if (snap.exists()) {
        const orderData = snap.data();
        if (['delivered', 'received'].includes(orderData.status)) {
           await updateShopDueInternal(orderData.shopCode, -(orderData.dueAmount || 0));
        }
      }
      await deleteDoc(orderRef);
      showToast(t('successDeleted'));
    } catch (error: any) {
      console.error("Delete order error:", error);
      const errorMessage = error.message?.includes('permission') ? t('permissionDenied') : error.message;
      showToast(`${t('errorOccurred')}: ${errorMessage}`, "error");
      handleFirestoreError(error, OperationType.DELETE, `orders/${id}`);
    }
  };

  const addPayment = async (order: any) => {
    const amount = prompt("Enter payment amount:", "0");
    if (amount !== null) {
      try {
        const paid = parseFloat(amount);
        const newPaid = (order.amountPaid || 0) + paid;
        const newDue = order.grandTotal - newPaid;

        await updateDoc(doc(db, 'orders', order.id), {
          amountPaid: newPaid,
          dueAmount: newDue,
          paymentStatus: newPaid >= order.grandTotal ? 'paid' : 'partially_paid',
          updatedAt: new Date().toISOString(),
          modificationHistory: arrayUnion({
            uid: profile?.uid || 'unknown',
            userName: profile?.displayName || profile?.email || 'Unknown',
            timestamp: new Date().toISOString(),
            action: `PAYMENT_ADDED: ${paid}`
          })
        });

        // Add a transaction record for this payment
        await addDoc(collection(db, 'transactions'), {
          shopCode: order.shopCode,
          amount: paid,
          type: 'payment',
          workerUid: profile?.uid,
          workerName: profile?.displayName || profile?.email,
          date: new Date().toISOString(),
          note: `Payment for Order #${order.id?.slice(-6) || ''}`
        });

        // Update shop due if finalized
        if (['delivered', 'received'].includes(order.status)) {
          await updateShopDueInternal(order.shopCode, -paid);
        }

        showToast(t('successUpdated'));
      } catch (error) {
        console.error("Add payment error:", error);
      }
    }
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.shopName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.shopCode?.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (!matchesSearch) return false;

    if (statusFilter === 'active') {
      return !['delivered', 'received', 'cancelled', 'in_transport'].includes(order.status);
    }
    if (statusFilter === 'all') {
      return order.status !== 'cancelled';
    }
    return order.status === statusFilter;
  });

  // Group filtered orders by Area and Shop
  const groupedOrders = filteredOrders.reduce((acc: Record<string, Record<string, any[]>>, order) => {
    const shop = shops.find(s => s.code === order.shopCode);
    const area = shop?.area || 'Other';
    const shopName = shop?.name || order.shopName || 'Unknown Shop';
    if (!acc[area]) acc[area] = {};
    if (!acc[area][shopName]) acc[area][shopName] = [];
    acc[area][shopName].push(order);
    return acc;
  }, {});

  return (
    <div className="space-y-8">
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">{t('orders')}</h1>
          <p className="text-slate-500">{t('orderList')}</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={`${t('search')}...`}
              className="pl-10 pr-4 py-2 rounded-xl border border-slate-200 bg-white focus:ring-2 focus:ring-blue-500 outline-none w-full sm:w-64"
            />
          </div>
          <div className="flex items-center gap-2 bg-white p-1 rounded-xl border border-slate-200">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 bg-transparent text-xs font-black uppercase tracking-widest outline-none border-none"
            >
              <option value="active">{t('activeOrders') || 'ACTIVE'}</option>
              <option value="pending">{t('pending')}</option>
              <option value="in_transport">{t('inTransport')}</option>
              <option value="delivered">{t('delivered')}</option>
              <option value="all">{t('all')}</option>
            </select>
          </div>
        </div>
      </header>

      {profile?.role === 'worker' && (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-blue-600" />
              <h2 className="text-lg font-bold text-slate-900">{t('myAssignedAreas')}</h2>
            </div>
            <button 
              onClick={() => setRequestingArea(true)}
              className="text-sm font-bold text-blue-600 hover:underline flex items-center gap-1"
            >
              <PlusCircle className="w-4 h-4" /> {t('requestNewArea')}
            </button>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {profile.assignedAreas && profile.assignedAreas.length > 0 ? (
              profile.assignedAreas.map(area => (
                <span key={area} className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-bold">
                  {area}
                </span>
              ))
            ) : (
              <p className="text-sm text-slate-500 italic">{t('noAreasAssigned')}</p>
            )}
          </div>

          <AnimatePresence>
            {requestingArea && (
              <motion.form 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                onSubmit={submitAreaRequest}
                className="pt-4 border-t border-slate-50 flex gap-2 overflow-hidden"
              >
                <input
                  type="text"
                  required
                  value={newAreaName}
                  onChange={(e) => setNewAreaName(e.target.value)}
                  placeholder={t('enterAreaName')}
                  className="flex-1 p-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                />
                <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-bold">
                  {t('submit')}
                </button>
                <button type="button" onClick={() => setRequestingArea(false)} className="bg-slate-100 text-slate-600 px-4 py-2 rounded-lg text-sm font-bold">
                  {t('cancel')}
                </button>
              </motion.form>
            )}
          </AnimatePresence>

          {areaRequests.length > 0 && (
            <div className="pt-4 border-t border-slate-50">
              <h3 className="text-xs font-bold text-slate-400 uppercase mb-2">{t('recentRequests')}</h3>
              <div className="space-y-2">
                {areaRequests.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 3).map(req => (
                  <div key={req.id} className="flex items-center justify-between text-xs">
                    <span className="text-slate-600 font-medium">{req.requestedArea}</span>
                    <span className={cn(
                      "font-bold uppercase",
                      req.status === 'approved' ? "text-green-600" :
                      req.status === 'rejected' ? "text-red-600" :
                      "text-yellow-600"
                    )}>
                      {t(req.status)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      <div className="space-y-16">
        {loading ? (
          <div className="h-64 flex items-center justify-center">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : Object.keys(groupedOrders).length === 0 ? (
          <div className="bg-white p-12 rounded-2xl text-center border border-dashed border-slate-200">
            <Package className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-500 font-medium">{t('noOrders')}</p>
          </div>
        ) : (
          Object.entries(groupedOrders).sort(([a], [b]) => a.localeCompare(b)).map(([area, shopsMap]) => (
            <div key={area} className="space-y-8">
              <div className="flex items-center gap-4">
                <div className="h-10 w-2 bg-gradient-to-b from-blue-600 to-blue-400 rounded-full" />
                <h2 className="text-4xl font-black text-slate-900 uppercase tracking-tight flex items-center gap-4 italic font-[Georgia]">
                  {area}
                  <span className="text-sm bg-blue-100 text-blue-700 px-4 py-1 rounded-2xl font-black not-italic font-sans">
                    {Object.values(shopsMap).flat().length}
                  </span>
                </h2>
              </div>
              
              <div className="space-y-10 pl-4 md:pl-8 border-l-2 border-slate-50">
                {Object.entries(shopsMap).sort(([a], [b]) => a.localeCompare(b)).map(([shopName, shopOrders]) => (
                  <div key={shopName} className="space-y-4">
                    <h3 className="text-xl font-bold text-slate-700 flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-slate-300" />
                      {shopName}
                    </h3>

                    <div className="grid grid-cols-1 gap-4">
                      {shopOrders.sort((a, b) => b.createdAt.localeCompare(a.createdAt)).map((order) => (
                        <motion.div
                          layout
                          key={order.id}
                          onClick={() => navigate(`/orders/${order.id}`)}
                          className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col md:flex-row md:items-center gap-6 cursor-pointer hover:border-blue-200 hover:shadow-md transition-all group relative overflow-hidden"
                        >
                          <div className="flex-1 space-y-3">
                            <div className="flex items-center gap-3">
                              <span className="text-[10px] font-black text-slate-400 bg-slate-100 px-2 py-1 rounded tracking-widest leading-none">#{order.shopCode}</span>
                              <div className="h-1 flex-1 bg-slate-50" />
                            </div>
                            
                            <div className="flex flex-wrap gap-4 text-xs font-bold uppercase tracking-wider text-slate-400">
                              <span className="flex items-center gap-1.5"><Users className="w-3.5 h-3.5 text-blue-500" /> {order.workerName}</span>
                              <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5 text-blue-500" /> {format(new Date(order.createdAt), 'MMM d, h:mm a')}</span>
                            </div>

                            <div className="text-2xl font-black text-slate-900 tracking-tighter">৳{order.grandTotal.toFixed(2)}</div>
                            
                            {order.items && (
                              <div className="mt-4 pt-4 border-t border-slate-50 space-y-3">
                                {Object.entries(order.items.reduce((acc: any, item: any) => {
                                  const cat = item.productCategory || 'General';
                                  if (!acc[cat]) acc[cat] = [];
                                  acc[cat].push(item);
                                  return acc;
                                }, {}) as Record<string, any[]>).map(([category, catItems]) => (
                                  <div key={category} className="space-y-1">
                                    <p className="text-[8px] font-black text-slate-300 uppercase tracking-[0.2em]">{category}</p>
                                    <div className="space-y-1">
                                      {catItems.map((item, idx) => (
                                        <div key={idx} className="flex justify-between text-xs">
                                          <span className="text-slate-500 font-medium">
                                            {item.productName} 
                                            <span className="text-[9px] text-slate-400 ml-2">G{item.grade}, {item.size} × {item.quantity}</span>
                                          </span>
                                          <span className="font-black text-slate-900">৳{item.total.toFixed(2)}</span>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}

                            {order.modificationHistory && order.modificationHistory.length > 0 && (
                              <div className="mt-4 pt-2 border-t border-slate-50 flex items-center justify-between">
                                <div className="flex items-center gap-2 text-[8px] text-slate-300 font-black uppercase tracking-widest">
                                  <ActivityLogIcon className="w-3 h-3" />
                                  {t('lastModified')}: {order.modificationHistory[order.modificationHistory.length - 1].userName} {t('at')} {format(new Date(order.modificationHistory[order.modificationHistory.length - 1].timestamp), 'MMM d, h:mm a')}
                                </div>
                              </div>
                            )}
                          </div>

                          <div className="flex flex-wrap items-center gap-4 shrink-0">
                            {hasPermission('DELETE_ORDER') && (
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDeleteOrder(order.id);
                                }}
                                className="p-2.5 text-slate-400 hover:text-red-600 bg-white border border-slate-100 rounded-xl hover:border-red-100 transition-all shadow-sm"
                                title={t('deleteOrder')}
                              >
                                <Trash2 className="w-5 h-5" />
                              </button>
                            )}
                            <div className={cn(
                              "px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-sm",
                              order.status === 'pending' && "bg-amber-50 text-amber-600 border border-amber-100",
                              order.status === 'in_transport' && "bg-blue-50 text-blue-600 border border-blue-100",
                              order.status === 'delivered' && "bg-emerald-50 text-emerald-600 border border-emerald-100",
                              order.status === 'cancelled' && "bg-red-50 text-red-600 border border-red-100",
                              order.status === 'received' && "bg-purple-50 text-purple-600 border border-purple-100",
                            )}>
                              {t(order.status === 'in_transport' ? 'inTransport' : order.status)}
                            </div>

                            <div className="flex items-center gap-2">
                              {hasPermission('EDIT_ORDER') && (
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    if (['delivered', 'in_transport'].includes(order.status)) {
                                      const statusText = t(order.status === 'in_transport' ? 'inTransport' : order.status);
                                      showToast(`${t('orderCannotBeEdited')}: ${statusText}`, 'error');
                                      return;
                                    }
                                    navigate('/new-order', { state: { editOrder: order } });
                                  }}
                                  className="p-3 bg-slate-50 text-slate-400 rounded-xl hover:bg-blue-50 hover:text-blue-600 transition-all border border-transparent hover:border-blue-100"
                                  title={t('editOrder')}
                                >
                                  <Edit className="w-5 h-5" />
                                </button>
                              )}

                              {hasPermission('MARK_ORDER_RECEIVED') && order.status === 'delivered' && !order.receivedByWorker && (
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    markReceived(order.id);
                                  }}
                                  className="flex items-center gap-2 bg-slate-900 text-white font-black py-3 px-6 rounded-xl hover:bg-black transition-all shadow-xl shadow-slate-200 text-xs tracking-widest uppercase"
                                >
                                  <CheckCircle2 className="w-4 h-4" /> {t('markReceived')}
                                </button>
                              )}
                            </div>

                            {hasPermission('UPDATE_ORDER_STATUS') && hasPermission('ACCESS_DELIVERY_EDIT') && (
                              <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                                <select
                                  value={order.status}
                                  onChange={(e) => updateStatus(order.id, e.target.value)}
                                  className="px-4 py-2.5 rounded-xl border border-slate-100 text-[10px] font-black uppercase tracking-widest outline-none bg-slate-50 focus:bg-white focus:border-blue-200 transition-all"
                                >
                                  <option value="pending">{t('pending')}</option>
                                  <option value="in_transport">{t('inTransport')}</option>
                                  <option value="delivered">{t('delivered')}</option>
                                  <option value="cancelled">{t('cancelled')}</option>
                                </select>
                                
                                {hasPermission('MANAGE_PAYMENTS') && hasPermission('ACCESS_FINANCE_EDIT') && (
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      addPayment(order);
                                    }}
                                    className="px-4 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 text-[10px] font-black uppercase tracking-widest shadow-lg shadow-blue-100 transition-all"
                                  >
                                    {t('addPayment')}
                                  </button>
                                )}
                              </div>
                            )}
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>

      <AnimatePresence>
        {viewingHistory && (
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[100] flex items-start justify-center p-4 overflow-y-auto pt-20">
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 20, opacity: 0 }}
              className="bg-white rounded-3xl p-8 max-w-lg w-full shadow-2xl space-y-6 mb-20"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-slate-900">{t('orderHistory')}</h2>
                  <p className="text-slate-500 text-sm">#{viewingHistory.id}</p>
                </div>
                <button onClick={() => setViewingHistory(null)} className="p-2 hover:bg-slate-100 rounded-full">
                  <X className="w-6 h-6 text-slate-400" />
                </button>
              </div>

              <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
                {viewingHistory.modificationHistory?.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()).map((log, idx) => (
                  <div key={idx} className="flex gap-4 p-4 bg-slate-50 rounded-2xl">
                    <div className="p-2 bg-white rounded-xl shadow-sm h-fit">
                      <Clock className="w-4 h-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-900 truncate max-w-[200px]">{log.action.replace(/_/g, ' ')}</p>
                      <p className="text-xs text-slate-500">{log.userName}</p>
                      <p className="text-[10px] font-bold text-slate-400 uppercase mt-1">
                        {format(new Date(log.timestamp), 'MMM d, yyyy · h:mm a')}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <button
                onClick={() => setViewingHistory(null)}
                className="w-full bg-slate-900 text-white font-bold py-4 rounded-2xl hover:bg-slate-800 transition-all"
              >
                {t('close')}
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

function PermissionManagement() {
  const { t } = useLanguage();
  const { showToast } = useToast();
  const { rolePermissions, profile, initializeDefaultPermissions, saving: authSaving } = useAuth();
  const [saving, setSaving] = useState<string | null>(null);

  const togglePermission = async (role: UserRole, permission: Permission) => {
    if (profile?.role !== 'owner' && profile?.role !== 'admin') return;
    
    const rolePerm = rolePermissions.find(rp => rp.role === role) || { role, permissions: [] };

    let newPermissions: Permission[];
    if (rolePerm.permissions.includes(permission)) {
      newPermissions = rolePerm.permissions.filter(p => p !== permission);
    } else {
      newPermissions = [...rolePerm.permissions, permission];
    }

    setSaving(role);
    try {
      await setDoc(doc(db, 'role_permissions', role), {
        role,
        permissions: newPermissions
      }, { merge: true });
      showToast(t('successUpdated'));
    } catch (error) {
      console.error("Permission update error:", error);
      showToast("Failed to update permissions", "error");
    } finally {
      setSaving(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-900 uppercase tracking-tight">{t('permissionManagement')}</h2>
        <button
          onClick={initializeDefaultPermissions}
          disabled={authSaving === 'ALL'}
          className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white text-xs font-bold rounded-xl hover:bg-black transition-all shadow-lg shadow-slate-200 disabled:opacity-50"
        >
          <Database className="w-4 h-4" />
          {authSaving === 'ALL' ? 'RESETTING...' : 'RESTORE DEFAULTS'}
        </button>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {ALL_ROLES.filter(r => r !== 'owner').map((role) => {
          const rp = rolePermissions.find(p => p.role === role) || { role, permissions: [] };
          return (
            <div key={role} className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
              <div className="p-4 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
                <h3 className="font-bold text-slate-900 uppercase tracking-tight flex items-center gap-2">
                  <Shield className="w-4 h-4 text-blue-600" />
                  {t(role)}
                </h3>
                {saving === role && <span className="text-[10px] font-bold text-blue-600 animate-pulse uppercase">{t('saving')}</span>}
              </div>
              <div className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
                {ALL_PERMISSIONS.map((perm) => (
                  <label 
                    key={perm} 
                    className={cn(
                      "flex items-center gap-3 p-3 rounded-xl border transition-all cursor-pointer group",
                      rp.permissions.includes(perm) 
                        ? "bg-blue-50 border-blue-100 text-blue-700" 
                        : "bg-white border-slate-100 text-slate-500 hover:border-slate-200"
                    )}
                  >
                    <input
                      type="checkbox"
                      checked={rp.permissions.includes(perm)}
                      onChange={() => togglePermission(role, perm)}
                      className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-xs font-bold uppercase tracking-tight">{t(perm)}</span>
                  </label>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function BrandingSettings() {
  const { t } = useLanguage();
  const { showToast } = useToast();
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [backgroundUrl, setBackgroundUrl] = useState<string | null>(null);
  const [grade1Label, setGrade1Label] = useState<string>('Grade 1');
  const [grade2Label, setGrade2Label] = useState<string>('Grade 2');
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [uploadingBg, setUploadingBg] = useState(false);

  useEffect(() => {
    const unsubscribe = onSnapshot(doc(db, 'settings', 'branding'), (doc) => {
      if (doc.exists()) {
        const data = doc.data();
        setLogoUrl(data.logoUrl || null);
        setBackgroundUrl(data.backgroundUrl || null);
        setGrade1Label(data.grade1Label || 'Grade 1');
        setGrade2Label(data.grade2Label || 'Grade 2');
      }
    }, (error) => handleFirestoreError(error, OperationType.GET, 'settings/branding_mgmt'));
    return () => unsubscribe();
  }, []);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: 'logo' | 'background') => {
    const file = e.target.files?.[0];
    if (!file) return;

    const maxSize = type === 'logo' ? 500000 : 2000000;
    if (file.size > maxSize) {
      showToast(type === 'logo' ? t('logoSizeError') : "Background size too large (max 2MB)", "error");
      return;
    }

    if (type === 'logo') setUploadingLogo(true);
    else setUploadingBg(true);

    try {
      const storageRef = ref(storage, `branding/${type}_${Date.now()}`);
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);
      
      await setDoc(doc(db, 'settings', 'branding'), { 
        [type === 'logo' ? 'logoUrl' : 'backgroundUrl']: url 
      }, { merge: true });
      showToast(t('successUpdated'));
    } catch (error) {
      const userMessage = handleStorageError(error, StorageOperationType.UPLOAD, `branding/${type}`);
      showToast(userMessage, "error");
    } finally {
      if (type === 'logo') setUploadingLogo(false);
      else setUploadingBg(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8 space-y-6">
        <div>
          <h3 className="text-xl font-bold text-slate-900 mb-2 uppercase tracking-tight">Grade Name Customization</h3>
          <p className="text-slate-500 text-sm">Change how "Grade 1" and "Grade 2" labels appear throughout the app.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Grade 1 Label</label>
            <input 
              type="text" 
              defaultValue={grade1Label} 
              onBlur={async (e) => {
                await setDoc(doc(db, 'settings', 'branding'), { grade1Label: e.target.value }, { merge: true });
                showToast(t('successUpdated'));
              }}
              className="w-full p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Grade 2 Label</label>
            <input 
              type="text" 
              defaultValue={grade2Label} 
              onBlur={async (e) => {
                await setDoc(doc(db, 'settings', 'branding'), { grade2Label: e.target.value }, { merge: true });
                showToast(t('successUpdated'));
              }}
              className="w-full p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8 space-y-6">
        <div>
          <h3 className="text-xl font-bold text-slate-900 mb-2 uppercase tracking-tight">{t('logoSettings')}</h3>
          <p className="text-slate-500 text-sm">{t('logoSettingsDesc')}</p>
        </div>

        <div className="flex flex-col md:flex-row items-center gap-8 p-8 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200">
          <div className="w-32 h-32 bg-white rounded-2xl shadow-sm border-2 border-slate-900 flex items-center justify-center overflow-hidden">
            {logoUrl ? (
              <img src={logoUrl} alt="Logo Preview" className="w-full h-full object-contain mix-blend-multiply" referrerPolicy="no-referrer" />
            ) : (
              <div className="text-slate-300 text-xs font-bold uppercase">{t('noLogo')}</div>
            )}
          </div>
          
          <div className="flex-1 space-y-4 text-center md:text-left">
            <div className="relative inline-block">
              <input
                type="file"
                accept="image/png, image/jpeg, image/jpg"
                onChange={(e) => handleFileUpload(e, 'logo')}
                className="hidden"
                id="logo-upload"
                disabled={uploadingLogo}
              />
              <label
                htmlFor="logo-upload"
                className={cn(
                  "flex items-center justify-center gap-2 px-6 py-3 bg-slate-900 text-white font-bold rounded-xl cursor-pointer hover:bg-slate-800 transition-all shadow-lg shadow-slate-200",
                  uploadingLogo && "opacity-50 cursor-not-allowed"
                )}
              >
                <ArrowUpCircle className="w-5 h-5" />
                {uploadingLogo ? t('uploading') : t('uploadLogo')}
              </label>
            </div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              {t('logoRequirements')}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8 space-y-6">
        <div>
          <h3 className="text-xl font-bold text-slate-900 mb-2 uppercase tracking-tight">{t('backgroundSettings')}</h3>
          <p className="text-slate-500 text-sm">{t('backgroundSettingsDesc')}</p>
        </div>

        <div className="flex flex-col md:flex-row items-center gap-8 p-8 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200">
          <div className="w-48 h-24 bg-white rounded-2xl shadow-sm border-2 border-slate-900 flex items-center justify-center overflow-hidden">
            {backgroundUrl ? (
              <img src={backgroundUrl} alt="BG Preview" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
            ) : (
              <div className="text-slate-300 text-xs font-bold uppercase">No Background</div>
            )}
          </div>
          
          <div className="flex-1 space-y-4 text-center md:text-left">
            <div className="relative inline-block">
              <input
                type="file"
                accept="image/png, image/jpeg, image/jpg"
                onChange={(e) => handleFileUpload(e, 'background')}
                className="hidden"
                id="bg-upload"
                disabled={uploadingBg}
              />
              <label
                htmlFor="bg-upload"
                className={cn(
                  "flex items-center justify-center gap-2 px-6 py-3 bg-slate-900 text-white font-bold rounded-xl cursor-pointer hover:bg-slate-800 transition-all shadow-lg shadow-slate-200",
                  uploadingBg && "opacity-50 cursor-not-allowed"
                )}
              >
                <ImageIcon className="w-5 h-5" />
                {uploadingBg ? t('uploading') : t('uploadBackground')}
              </label>
            </div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              {t('bgRequirements')}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function UserManagement() {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const { t } = useLanguage();
  const { showToast } = useToast();
  const { profile, registerUser, hasPermission } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [newUser, setNewUser] = useState({ email: '', password: '', displayName: '', role: 'worker' as UserRole, shopCode: '' });
  const [creating, setCreating] = useState(false);
  
  const initialTab = (searchParams.get('tab') as 'users' | 'permissions' | 'area_requests' | 'branding') || 'users';
  const [activeTab, setActiveTab] = useState<'users' | 'permissions' | 'area_requests' | 'branding'>(initialTab);

  useEffect(() => {
    const tabFromUrl = searchParams.get('tab') as 'users' | 'permissions' | 'area_requests' | 'branding';
    if (tabFromUrl && tabFromUrl !== activeTab) {
      setActiveTab(tabFromUrl);
    }
  }, [searchParams]);

  const handleTabChange = (tab: 'users' | 'permissions' | 'area_requests' | 'branding') => {
    setActiveTab(tab);
    setSearchParams({ tab });
  };
  const [editingPermissions, setEditingPermissions] = useState<UserProfile | null>(null);
  const [areaRequests, setAreaRequests] = useState<AreaRequest[]>([]);
  const [requestingArea, setRequestingArea] = useState(false);
  const [newAreaRequest, setNewAreaRequest] = useState('');

  useEffect(() => {
    if (!profile) return;
    
    const unsubscribe = onSnapshot(collection(db, 'users'), (snapshot) => {
      // Use document ID as UID to ensure uniqueness and fallback
      const allUsers = snapshot.docs.map(d => ({
        ...d.data(),
        uid: d.id
      } as UserProfile));
      
      // Deduplicate by email to handle potential duplicate entries for the same user
      const uniqueUsersMap = new Map<string, UserProfile>();
      allUsers.forEach(u => {
        if (u.email) {
          uniqueUsersMap.set(u.email.toLowerCase(), u);
        } else {
          uniqueUsersMap.set(u.uid, u);
        }
      });
      
      const uniqueUsers = Array.from(uniqueUsersMap.values());
      const filtered = uniqueUsers.filter(u => u.role !== 'owner');
      
      setUsers(filtered);
      setLoading(false);
    }, (error) => handleFirestoreError(error, OperationType.LIST, 'users'));
    return () => unsubscribe();
  }, [profile]);

  useEffect(() => {
    if (!profile) return;
    const unsubscribe = onSnapshot(collection(db, 'area_requests'), (snapshot) => {
      setAreaRequests(snapshot.docs.map(d => ({ id: d.id, ...d.data() } as AreaRequest)));
    }, (error) => handleFirestoreError(error, OperationType.LIST, 'area_requests_mgmt'));
    return () => unsubscribe();
  }, [profile]);

  const handleAreaRequestAction = async (requestId: string, status: 'approved' | 'rejected') => {
    try {
      const request = areaRequests.find(r => r.id === requestId);
      if (!request) return;

      await updateDoc(doc(db, 'area_requests', requestId), { 
        status,
        updatedAt: new Date().toISOString()
      });

      if (status === 'approved') {
        const userRef = doc(db, 'users', request.workerUid);
        const userDoc = await getDoc(userRef);
        if (userDoc.exists()) {
          const userData = userDoc.data() as UserProfile;
          const currentAreas = userData.assignedAreas || [];
          if (!currentAreas.includes(request.requestedArea)) {
            await updateDoc(userRef, {
              assignedAreas: [...currentAreas, request.requestedArea]
            });
          }
        }
      }

      showToast(t('successUpdated'));
    } catch (error) {
      console.error("Area request update error:", error);
    }
  };

  const handleDeleteAreaRequest = async (id: string) => {
    if (!hasPermission('MANAGE_USERS')) return;
    if (!window.confirm(t('confirmDelete'))) return;
    try {
      await deleteDoc(doc(db, 'area_requests', id));
      showToast(t('successDeleted'));
    } catch (error) {
      console.error("Delete area request error:", error);
      handleFirestoreError(error, OperationType.DELETE, `area_requests/${id}`);
    }
  };

  const updateWorkerAreas = async (uid: string, areas: string[]) => {
    try {
      await updateDoc(doc(db, 'users', uid), { assignedAreas: areas });
      showToast(t('successUpdated'));
    } catch (error) {
      console.error("Worker areas update error:", error);
    }
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);
    try {
      await registerUser(newUser.email, newUser.password, newUser.role, newUser.displayName, newUser.shopCode);
      showToast(t('successAdded'));
      setNewUser({ email: '', password: '', displayName: '', role: 'worker', shopCode: '' });
      setIsAdding(false);
    } catch (error: any) {
      showToast(error.message || 'Failed to create user');
    } finally {
      setCreating(false);
    }
  };

  const updateStatus = async (uid: string, status: UserStatus) => {
    try {
      const updateData: any = { status };
      if (status === 'approved') {
        updateData.reAccessRequested = false;
      }
      await updateDoc(doc(db, 'users', uid), updateData);
      showToast(t('successUpdated'));
      
      // Log activity
      await addDoc(collection(db, 'activity'), {
        uid: profile?.uid,
        userName: profile?.displayName || profile?.email,
        action: 'USER_STATUS_UPDATED',
        details: `Updated status of user ${uid} to ${status}`,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error("User update error:", error);
    }
  };

  const handleDeleteUser = async (uid: string) => {
    if (!hasPermission('DELETE_USER')) {
      showToast(t('permissionDenied'), 'error');
      return;
    }
    if (!window.confirm(t('confirmDelete'))) return;
    try {
      await deleteDoc(doc(db, 'users', uid));
      showToast(t('successDeleted'));
    } catch (error: any) {
      console.error("Delete user error:", error);
      const errorMessage = error.message?.includes('permission') ? t('permissionDenied') : error.message;
      showToast(`${t('errorOccurred')}: ${errorMessage}`, "error");
      handleFirestoreError(error, OperationType.DELETE, `users/${uid}`);
    }
  };

  const updateRole = async (uid: string, role: UserRole) => {
    try {
      await updateDoc(doc(db, 'users', uid), { role });
      showToast(t('successUpdated'));

      // Log activity
      await addDoc(collection(db, 'activity'), {
        uid: profile?.uid,
        userName: profile?.displayName || profile?.email,
        action: 'USER_ROLE_UPDATED',
        details: `Updated role of user ${uid} to ${role}`,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error("Role update error:", error);
    }
  };

  const updatePermission = async (uid: string, status: 'granted' | 'denied') => {
    try {
      await updateDoc(doc(db, 'users', uid), { permissionStatus: status });
      showToast(t('successUpdated'));
    } catch (error) {
      console.error("Permission update error:", error);
    }
  };

  const toggleUserCustomPermission = async (uid: string, permission: Permission) => {
    const user = users.find(u => u.uid === uid);
    if (!user) return;

    const currentPerms = user.customPermissions || [];
    const newPerms = currentPerms.includes(permission)
      ? currentPerms.filter(p => p !== permission)
      : [...currentPerms, permission];

    try {
      await updateDoc(doc(db, 'users', uid), { customPermissions: newPerms });
      showToast(t('successUpdated'));
    } catch (error) {
      console.error("Custom permission update error:", error);
    }
  };

  return (
    <div className="space-y-8">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">{t('userManagement')}</h1>
          <p className="text-slate-500">{t('manageUsers')}</p>
        </div>
        <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-xl">
          <button
            onClick={() => handleTabChange('users')}
            className={cn(
              "px-4 py-2 rounded-lg text-sm font-bold transition-all",
              activeTab === 'users' ? "bg-white text-blue-600 shadow-sm" : "text-slate-500 hover:text-slate-700"
            )}
          >
            {t('users')}
          </button>
          {hasPermission('MANAGE_PERMISSIONS') && (
            <button
              onClick={() => handleTabChange('permissions')}
              className={cn(
                "px-4 py-2 rounded-lg text-sm font-bold transition-all",
                activeTab === 'permissions' ? "bg-white text-blue-600 shadow-sm" : "text-slate-500 hover:text-slate-700"
              )}
            >
              {t('permissions')}
            </button>
          )}
          <button
            onClick={() => handleTabChange('area_requests')}
            className={cn(
              "px-4 py-2 rounded-lg text-sm font-bold transition-all",
              activeTab === 'area_requests' ? "bg-white text-blue-600 shadow-sm" : "text-slate-500 hover:text-slate-700"
            )}
          >
            {t('areaRequests')}
            {areaRequests.filter(r => r.status === 'pending').length > 0 && (
              <span className="ml-2 bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full">
                {areaRequests.filter(r => r.status === 'pending').length}
              </span>
            )}
          </button>
          {hasPermission('MANAGE_BRANDING') && (
            <button
              onClick={() => handleTabChange('branding')}
              className={cn(
                "px-4 py-2 rounded-lg text-sm font-bold transition-all",
                activeTab === 'branding' ? "bg-white text-blue-600 shadow-sm" : "text-slate-500 hover:text-slate-700"
              )}
            >
              {t('branding')}
            </button>
          )}
        </div>
        {hasPermission('MANAGE_USERS') && hasPermission('ACCESS_WORKER_EDIT') && activeTab === 'users' && (
          <button
            onClick={() => setIsAdding(true)}
            className="flex items-center gap-2 bg-blue-600 text-white font-bold py-2 px-4 rounded-xl hover:bg-blue-700 shadow-lg shadow-blue-200"
          >
            <Plus className="w-5 h-5" /> {t('createUser')}
          </button>
        )}
      </header>

      {activeTab === 'users' ? (
        <>
          <AnimatePresence>
            {isAdding && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100"
          >
            <form onSubmit={handleCreateUser} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1 ml-1">{t('displayName')}</label>
                <input
                  type="text"
                  required
                  value={newUser.displayName}
                  onChange={(e) => setNewUser({ ...newUser, displayName: e.target.value })}
                  className="w-full p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1 ml-1">{t('email')}</label>
                <input
                  type="email"
                  required
                  value={newUser.email}
                  onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                  className="w-full p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1 ml-1">{t('password')}</label>
                <input
                  type="password"
                  required
                  value={newUser.password}
                  onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                  className="w-full p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1 ml-1">{t('role')}</label>
                  <select
                    value={newUser.role}
                    onChange={(e) => setNewUser({ ...newUser, role: e.target.value as UserRole })}
                    className="w-full p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none font-bold uppercase text-xs"
                  >
                    {ALL_ROLES.filter(r => r !== 'owner').map(r => (
                      <option key={r} value={r}>{t(r)}</option>
                    ))}
                  </select>
              </div>
              {newUser.role === 'shop_owner' && (
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1 ml-1">{t('shopCode')}</label>
                  <input
                    type="text"
                    required
                    value={newUser.shopCode}
                    onChange={(e) => setNewUser({ ...newUser, shopCode: e.target.value })}
                    className="w-full p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
              )}
              <div className="md:col-span-2 flex gap-3">
                <button
                  type="submit"
                  disabled={creating}
                  className="flex-1 bg-blue-600 text-white font-bold py-3 rounded-xl hover:bg-blue-700 disabled:opacity-50"
                >
                  {creating ? t('creating') : t('createUser')}
                </button>
                <button
                  type="button"
                  onClick={() => setIsAdding(false)}
                  className="flex-1 bg-slate-100 text-slate-600 font-bold py-3 rounded-xl hover:bg-slate-200"
                >
                  {t('cancel')}
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">{t('user')}</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">{t('role')}</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">{t('status')}</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">{t('areas')}</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">{t('permissions')}</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">{t('actions')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {users.map((u) => (
                <tr key={u.uid} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center font-bold text-slate-600">
                        {u.displayName?.[0]}
                      </div>
                      <div>
                        <p className="font-bold text-slate-900">{u.displayName}</p>
                        <p className="text-xs text-slate-500">{u.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {hasPermission('MANAGE_USER_ROLES') ? (
                      <select
                        value={u.role}
                        onChange={(e) => updateRole(u.uid, e.target.value as UserRole)}
                        className="text-sm font-medium text-slate-600 bg-transparent border-none focus:ring-0 cursor-pointer hover:text-blue-600 font-bold uppercase p-0"
                      >
                        {ALL_ROLES.filter(r => r !== 'owner').map(r => (
                          <option key={r} value={r}>{t(r)}</option>
                        ))}
                      </select>
                    ) : (
                      <span className="text-sm font-medium text-slate-600 capitalize">{t(u.role)}</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-1">
                      <span className={cn(
                        "px-3 py-1 rounded-full text-xs font-bold w-fit",
                        u.status === 'approved' && "bg-emerald-50 text-emerald-600",
                        u.status === 'pending' && "bg-amber-50 text-amber-600",
                        u.status === 'suspended' && "bg-red-50 text-red-600",
                      )}>
                        {t(u.status)}
                      </span>
                      {u.status === 'suspended' && u.reAccessRequested && (
                        <span className="text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full animate-pulse w-fit">
                          {t('reAccessRequested')}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {u.role === 'worker' ? (
                      <div className="flex flex-wrap gap-1">
                        {u.assignedAreas?.map(area => (
                          <span key={area} className="px-2 py-0.5 bg-blue-50 text-blue-600 text-[10px] font-bold rounded flex items-center gap-1">
                            {area}
                            <button onClick={() => updateWorkerAreas(u.uid, u.assignedAreas!.filter(a => a !== area))} className="hover:text-red-500">
                              <X className="w-3 h-3" />
                            </button>
                          </span>
                        ))}
                        <button 
                          onClick={() => {
                            const area = prompt(t('enterAreaName'));
                            if (area) updateWorkerAreas(u.uid, [...(u.assignedAreas || []), area]);
                          }}
                          className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    ) : '-'}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      {u.role === 'shop_owner' && (
                        <div className="flex items-center gap-2">
                          {u.permissionStatus === 'pending' ? (
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-bold text-amber-600 bg-amber-50 px-2 py-1 rounded">{t('shopCode')}: {u.shopCode}</span>
                              {hasPermission('MANAGE_USERS') && (
                                <>
                                  <button onClick={() => updatePermission(u.uid, 'granted')} className="text-emerald-600 hover:text-emerald-700 font-bold text-xs underline">{t('grant')}</button>
                                  <button onClick={() => updatePermission(u.uid, 'denied')} className="text-red-600 hover:text-red-700 font-bold text-xs underline">{t('deny')}</button>
                                </>
                              )}
                            </div>
                          ) : u.permissionStatus === 'granted' ? (
                            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded">{t('granted')}: {u.shopCode}</span>
                          ) : null}
                        </div>
                      )}
                      {hasPermission('MANAGE_PERMISSIONS') && (
                        <button
                          onClick={() => setEditingPermissions(u)}
                          className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors flex items-center gap-2"
                          title={t('permissions')}
                        >
                          <Shield className="w-4 h-4" />
                          <span className="text-[10px] font-bold uppercase">{u.customPermissions?.length || 0} {t('custom')}</span>
                        </button>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      {hasPermission('MANAGE_USERS') && (
                        <>
                          {u.status === 'pending' && (
                            <button
                              onClick={() => updateStatus(u.uid, 'approved')}
                              className="p-2 bg-emerald-50 text-emerald-600 rounded-lg hover:bg-emerald-100"
                            >
                              <CheckCircle2 className="w-5 h-5" />
                            </button>
                          )}
                          {u.status !== 'suspended' && (
                            <button
                              onClick={() => updateStatus(u.uid, 'suspended')}
                              className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100"
                            >
                              <XCircle className="w-5 h-5" />
                            </button>
                          )}
                          {u.status === 'suspended' && (
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => updateStatus(u.uid, 'approved')}
                                className="p-2 bg-emerald-50 text-emerald-600 rounded-lg hover:bg-emerald-100 flex items-center gap-2"
                                title={t('grantReAccess')}
                              >
                                <CheckCircle2 className="w-5 h-5" />
                                {u.reAccessRequested && <span className="text-xs font-bold">{t('grant')}</span>}
                              </button>
                              {u.reAccessRequested && (
                                <button
                                  onClick={() => updateDoc(doc(db, 'users', u.uid), { reAccessRequested: false })}
                                  className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 flex items-center gap-2"
                                  title={t('denyReAccess')}
                                >
                                  <XCircle className="w-5 h-5" />
                                  <span className="text-xs font-bold">{t('deny')}</span>
                                </button>
                              )}
                            </div>
                          )}
                          {hasPermission('DELETE_USER') && (
                            <button
                               onClick={() => handleDeleteUser(u.uid)}
                               className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100"
                               title={t('delete')}
                            >
                               <Trash2 className="w-5 h-5" />
                            </button>
                          )}
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Custom Permissions Modal */}
      <AnimatePresence>
        {editingPermissions && (
          <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-start justify-center z-[100] p-4 overflow-y-auto pt-20">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="bg-white rounded-3xl p-8 max-w-2xl w-full shadow-2xl space-y-6 mb-20"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-slate-900">{t('permissions')}</h2>
                  <p className="text-slate-500">{editingPermissions.displayName} ({t(editingPermissions.role)})</p>
                </div>
                <button onClick={() => setEditingPermissions(null)} className="p-2 hover:bg-slate-100 rounded-full">
                  <X className="w-6 h-6 text-slate-400" />
                </button>
              </div>

              <div className="space-y-6">
                {/* Granular Activity Limits */}
                <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 space-y-4">
                  <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest flex items-center gap-2">
                    <LayoutGrid className="w-4 h-4 text-blue-600" />
                    Activity Limits (Sectors)
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {[
                      { id: 'finance', label: t('finance'), permissions: ['ACCESS_FINANCE_VIEW', 'ACCESS_FINANCE_EDIT'] as Permission[] },
                      { id: 'delivery', label: t('deliverySector'), permissions: ['ACCESS_DELIVERY_VIEW', 'ACCESS_DELIVERY_EDIT'] as Permission[] },
                      { id: 'product_shop', label: t('productShopSector'), permissions: ['ACCESS_PRODUCT_SHOP_VIEW', 'ACCESS_PRODUCT_SHOP_EDIT'] as Permission[] },
                      { id: 'worker', label: t('workerSector'), permissions: ['ACCESS_WORKER_VIEW', 'ACCESS_WORKER_EDIT'] as Permission[] },
                    ].map((sector) => {
                      const hasPartialAccess = sector.permissions.some(p => editingPermissions.customPermissions?.includes(p));
                      return (
                        <div key={sector.id} className="p-4 bg-white rounded-xl border border-slate-200">
                          <label className="flex items-center justify-between cursor-pointer mb-3">
                            <span className="text-xs font-black uppercase tracking-tight text-slate-700">{sector.label}</span>
                            <div className={cn(
                              "w-8 h-4 rounded-full relative transition-colors",
                              hasPartialAccess ? "bg-blue-600" : "bg-slate-200"
                            )}>
                              <div className={cn(
                                "w-3 h-3 bg-white rounded-full absolute top-0.5 transition-all",
                                hasPartialAccess ? "left-4.5" : "left-0.5"
                              )} />
                            </div>
                          </label>
                          <div className="flex gap-2">
                            {sector.permissions.map(perm => (
                              <button
                                key={perm}
                                onClick={() => toggleUserCustomPermission(editingPermissions.uid, perm)}
                                className={cn(
                                  "flex-1 py-1.5 px-2 rounded-lg text-[10px] font-bold uppercase transition-all",
                                  editingPermissions.customPermissions?.includes(perm)
                                    ? "bg-blue-600 text-white shadow-sm"
                                    : "bg-slate-100 text-slate-400 hover:bg-slate-200"
                                )}
                              >
                                {perm.split('_').pop()}
                              </button>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest flex items-center gap-2">
                    <Shield className="w-4 h-4 text-blue-600" />
                    Granular Permissions
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {ALL_PERMISSIONS.filter(p => !p.startsWith('ACCESS_')).map((perm) => {
                      const isCustom = editingPermissions.customPermissions?.includes(perm);
                      return (
                        <label
                          key={perm}
                          className={cn(
                            "flex items-center gap-3 p-3 rounded-xl border transition-all cursor-pointer group",
                            isCustom
                              ? "bg-blue-50 border-blue-100 text-blue-700"
                              : "bg-white border-slate-100 text-slate-500 hover:border-slate-200"
                          )}
                        >
                          <input
                            type="checkbox"
                            checked={isCustom}
                            onChange={() => toggleUserCustomPermission(editingPermissions.uid, perm)}
                            className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                          />
                          <span className="text-xs font-bold uppercase tracking-tight">{t(perm)}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>
              </div>

              <button
                onClick={() => setEditingPermissions(null)}
                className="w-full bg-slate-900 text-white font-bold py-4 rounded-2xl hover:bg-slate-800 transition-all"
              >
                {t('save')}
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  ) : activeTab === 'permissions' ? (
    <PermissionManagement />
  ) : activeTab === 'branding' ? (
    <BrandingSettings />
  ) : (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-100">
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">{t('worker')}</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">{t('requestedArea')}</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">{t('status')}</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">{t('actions')}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {areaRequests.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-6 py-8 text-center text-slate-500">{t('noAreaRequests')}</td>
              </tr>
            ) : (
              areaRequests.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).map((request) => (
                <tr key={request.id}>
                  <td className="px-6 py-4">
                    <div className="font-bold text-slate-900">{request.workerName}</div>
                  </td>
                  <td className="px-6 py-4 text-slate-600">{request.requestedArea}</td>
                  <td className="px-6 py-4">
                    <span className={cn(
                      "px-2 py-1 rounded-full text-[10px] font-bold uppercase",
                      request.status === 'approved' ? "bg-green-100 text-green-600" :
                      request.status === 'rejected' ? "bg-red-100 text-red-600" :
                      "bg-yellow-100 text-yellow-600"
                    )}>
                      {t(request.status)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {request.status === 'pending' && (
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleAreaRequestAction(request.id, 'approved')}
                          className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                          title={t('approve')}
                        >
                          <CheckCircle2 className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleAreaRequestAction(request.id, 'rejected')}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title={t('reject')}
                        >
                          <XCircle className="w-5 h-5" />
                        </button>
                      </div>
                    )}
                    {hasPermission('MANAGE_USERS') && (
                      <button
                        onClick={() => handleDeleteAreaRequest(request.id)}
                        className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title={t('delete')}
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )}
</div>
);
}

function ActivityLog() {
  const [activities, setActivities] = useState<ActivityType[]>([]);
  const { t } = useLanguage();
  const { profile } = useAuth();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!profile) return;
    
    const unsubscribe = onSnapshot(query(collection(db, 'activity'), orderBy('timestamp', 'desc')), (snapshot) => {
      setActivities(snapshot.docs.map(d => ({ id: d.id, ...d.data() } as ActivityType)));
      setLoading(false);
    }, (error) => handleFirestoreError(error, OperationType.LIST, 'activity'));
    return () => unsubscribe();
  }, [profile]);

  if (loading) return <LoadingScreen />;

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-bold text-slate-900 uppercase tracking-tight">{t('activityLog')}</h1>
        <p className="text-slate-500 font-medium">{t('activityLogSubtitle')}</p>
      </header>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="divide-y divide-slate-100">
          {activities.length === 0 ? (
            <div className="p-12 text-center">
              <History className="w-12 h-12 text-slate-200 mx-auto mb-4" />
              <p className="text-slate-400 font-medium">{t('noHistory')}</p>
            </div>
          ) : (
            activities.map((activity) => (
              <div key={activity.id} className="p-6 hover:bg-slate-50 transition-colors flex items-start gap-4">
                <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center shrink-0">
                  <Clock className="w-5 h-5 text-blue-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-4 mb-1">
                    <p className="font-bold text-slate-900 truncate">{activity.userName}</p>
                    <span className="text-xs text-slate-400 whitespace-nowrap">
                      {format(new Date(activity.timestamp), 'MMM d, h:mm a')}
                    </span>
                  </div>
                  <p className="text-sm font-bold text-blue-600 mb-1">{activity.action}</p>
                  <p className="text-sm text-slate-600">{activity.details}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

function ShopManagement() {
  const [shops, setShops] = useState<Shop[]>([]);
  const { t } = useLanguage();
  const { showToast } = useToast();
  const { profile, hasPermission } = useAuth();
  const [isAdding, setIsAdding] = useState(false);
  const [editingCode, setEditingCode] = useState<string | null>(null);
  const [newShop, setNewShop] = useState({ code: '', name: '', area: '' });
  const [selectedArea, setSelectedArea] = useState('All');

  useEffect(() => {
    if (!profile) return;
    const unsubscribe = onSnapshot(collection(db, 'shops'), (snapshot) => {
      const allShops = snapshot.docs.map(d => ({ id: d.id, ...d.data() } as Shop));
      if (profile.role === 'worker') {
        const filtered = allShops.filter(s => profile.assignedAreas?.map(a => a.toLowerCase()).includes(s.area.toLowerCase()));
        setShops(filtered);
      } else {
        setShops(allShops);
      }
    }, (error) => handleFirestoreError(error, OperationType.LIST, 'shops'));
    return () => unsubscribe();
  }, [profile]);

  const handleSaveShop = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!hasPermission('MANAGE_SHOPS')) {
      showToast(t('permissionDenied'), 'error');
      return;
    }
    try {
      const formattedName = newShop.name.trim();
      const formattedArea = newShop.area.trim();
      
      if (editingCode) {
        await updateDoc(doc(db, 'shops', editingCode), {
          name: formattedName,
          area: formattedArea,
        });
        showToast(t('successUpdated'));
      } else {
        const areaShort = formattedArea.substring(0, 2).toUpperCase().replace(/[^A-Z]/g, '');
        const nameShort = formattedName.substring(0, 2).toUpperCase().replace(/[^A-Z]/g, '');
        // Improved unique code generation: Area(2) + Name(2) + Unique(2-3)
        const randomStr = Math.random().toString(36).substring(2, 5).toUpperCase();
        const generatedCode = `${areaShort}${nameShort}${randomStr}`.substring(0, 7);

        await setDoc(doc(db, 'shops', generatedCode), {
          ...newShop,
          name: formattedName,
          area: formattedArea,
          code: generatedCode,
          createdAt: new Date().toISOString()
        });
        showToast(t('successAdded'));
      }
      
      setNewShop({ code: '', name: '', area: '' });
      setIsAdding(false);
      setEditingCode(null);
    } catch (error) {
      console.error("Shop save error:", error);
    }
  };

  const handleDeleteShop = async (shop: Shop) => {
    if (!hasPermission('DELETE_SHOP')) {
      showToast(t('permissionDenied'), 'error');
      return;
    }
    if (!window.confirm(t('confirmDelete'))) return;
    try {
      const shopId = shop.id || shop.code;
      if (shopId) {
        await deleteDoc(doc(db, 'shops', shopId));
        showToast(t('successDeleted'));
      } else {
        showToast("Error: Shop ID is missing", "error");
      }
    } catch (error: any) {
      console.error("Delete shop error:", error);
      const errorMessage = error.message?.includes('permission') ? "Permission Denied" : error.message;
      showToast(`${t('errorOccurred')}: ${errorMessage}`, "error");
      handleFirestoreError(error, OperationType.DELETE, `shops/${shop.id || shop.code}`);
    }
  };

  const startEdit = (shop: Shop) => {
    setNewShop({ code: shop.code, name: shop.name, area: shop.area });
    setEditingCode(shop.code);
    setIsAdding(true);
  };

  const uniqueAreas = Array.from(new Set(shops.map(s => s.area))).sort();

  const filteredShops = selectedArea === 'All' 
    ? shops 
    : shops.filter(s => s.area === selectedArea);

  // Group shops by area for display within selected view
  const groupedShops = filteredShops.reduce((acc: any, shop) => {
    if (!acc[shop.area]) acc[shop.area] = [];
    acc[shop.area].push(shop);
    return acc;
  }, {});

  return (
    <div className="space-y-12">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b-4 border-slate-900 pb-8">
        <div>
          <p className="label-tech mb-2">{t('shops')}</p>
          <h1 className="text-5xl font-black text-slate-900 uppercase tracking-tighter">{t('shopList')}</h1>
        </div>
        {hasPermission('MANAGE_SHOPS') && hasPermission('ACCESS_PRODUCT_SHOP_EDIT') && (
          <button
            onClick={() => setIsAdding(true)}
            className="btn-industrial flex items-center gap-2"
          >
            <Plus className="w-5 h-5" /> {t('addShop')}
          </button>
        )}
      </header>

      <AnimatePresence>
        {isAdding && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-white border-2 border-slate-900 p-8"
          >
            <form onSubmit={handleSaveShop} className="grid grid-cols-1 md:grid-cols-3 gap-8 items-end">
              <div>
                <label className="label-tech mb-2 block">{t('shopName')}</label>
                <input
                  type="text"
                  required
                  value={newShop.name}
                  onChange={e => setNewShop({ ...newShop, name: e.target.value })}
                  className="w-full p-3 border-2 border-slate-200 focus:border-slate-900 outline-none font-bold uppercase text-sm"
                />
              </div>
              <div>
                <label className="label-tech mb-2 block">{t('area')}</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Dhaka"
                  value={newShop.area}
                  onChange={e => setNewShop({ ...newShop, area: e.target.value })}
                  className="w-full p-3 border-2 border-slate-200 focus:border-slate-900 outline-none font-bold uppercase text-sm"
                />
              </div>
              <div className="flex gap-2">
                <button type="submit" className="flex-1 btn-industrial text-xs">
                  {editingCode ? t('saveChanges') : t('generateCode')}
                </button>
                <button 
                  type="button" 
                  onClick={() => {
                    setIsAdding(false);
                    setEditingCode(null);
                    setNewShop({ code: '', name: '', area: '' });
                  }} 
                  className="flex-1 bg-slate-100 text-slate-900 font-black uppercase text-[10px] tracking-widest border border-slate-200"
                >
                  {t('cancel')}
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Area selection bar */}
      <div className="bg-slate-100 p-1.5 md:p-2 rounded-2xl md:rounded-[2rem] border border-slate-200/50">
        <div className="flex items-center gap-3 w-full relative">
          <div className="flex items-center gap-1 md:gap-1.5 overflow-x-auto scrollbar-hide no-scrollbar flex-1 py-0.5 px-0.5 snap-x scroll-smooth">
            <button
              onClick={() => setSelectedArea('All')}
              className={cn(
                "px-4 md:px-6 py-2 md:py-2.5 rounded-lg md:rounded-xl text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] transition-all whitespace-nowrap snap-start relative overflow-hidden flex items-center justify-center min-w-[70px] md:min-w-[100px]",
                selectedArea === 'All' 
                  ? "text-white shadow-lg shadow-slate-900/20" 
                  : "text-slate-500 hover:text-slate-800 hover:bg-white bg-white/40 border border-transparent hover:border-slate-200"
              )}
            >
              {selectedArea === 'All' && (
                <motion.div
                  layoutId="activeArea"
                  className="absolute inset-0 bg-slate-900"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
              <span className="relative z-10">{t('all')}</span>
            </button>

            {uniqueAreas.map(area => (
              <button
                key={area}
                onClick={() => setSelectedArea(area)}
                className={cn(
                  "px-4 md:px-6 py-2 md:py-2.5 rounded-lg md:rounded-xl text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] transition-all whitespace-nowrap relative overflow-hidden flex items-center justify-center min-w-[70px] md:min-w-[100px]",
                  selectedArea === area 
                    ? "text-white shadow-lg shadow-slate-900/20" 
                    : "text-slate-500 hover:text-slate-800 hover:bg-white bg-white/40 border border-transparent hover:border-slate-200"
                )}
              >
                {selectedArea === area && (
                  <motion.div
                    layoutId="activeArea"
                    className="absolute inset-0 bg-slate-900"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
                <span className="relative z-10">{area}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="space-y-12">
        {Object.entries(groupedShops)
          .sort(([areaA], [areaB]) => {
            const countA = profile?.areaInteractions?.[areaA] || 0;
            const countB = profile?.areaInteractions?.[areaB] || 0;
            if (countA !== countB) return countB - countA;
            return areaA.localeCompare(areaB);
          })
          .map(([area, areaShops]: [string, any]) => (
            <div key={area} className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="h-8 w-1.5 bg-slate-900 rounded-full" />
                <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight flex items-center gap-3">
                  {area}
                  <span className="text-xs bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full font-bold">
                    {areaShops.length}
                  </span>
                </h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-0 grid-structure">
                {areaShops.map((shop: any) => (
                  <div key={shop.code} className="grid-cell group hover:bg-slate-50 transition-all flex flex-col justify-between min-h-[240px]">
                    <div>
                      <div className="flex items-center justify-between mb-6">
                        <div className="w-12 h-12 border-2 border-slate-900 flex items-center justify-center">
                          <Store className="w-6 h-6" />
                        </div>
                        <span className="text-[10px] font-mono font-black text-slate-400 uppercase tracking-widest">CODE: {shop.code}</span>
                      </div>
                      <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tight">{shop.name}</h3>
                      <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest flex items-center gap-2 mt-2">
                        <MapPin className="w-3 h-3 text-slate-400" /> {shop.area}
                      </p>
                    </div>
                    <div className="flex items-center justify-between mt-8 pt-6 border-t border-slate-100">
                      <div className="flex gap-2">
                        {hasPermission('MANAGE_SHOPS') && (
                          <button
                            onClick={() => startEdit(shop)}
                            className="w-10 h-10 border border-slate-200 flex items-center justify-center text-slate-400 hover:text-slate-900 hover:border-slate-900 transition-all"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                        )}
                        {hasPermission('DELETE_SHOP') && (
                          <button
                            onClick={() => handleDeleteShop(shop)}
                            className="w-10 h-10 border border-slate-200 flex items-center justify-center text-slate-400 hover:text-red-600 hover:border-red-600 transition-all"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                        <Link 
                          to={`/shops/${shop.code}`}
                          onClick={async () => {
                            if (profile) {
                              const currentCount = profile.areaInteractions?.[shop.area] || 0;
                              await updateDoc(doc(db, 'users', profile.uid), {
                                [`areaInteractions.${shop.area}`]: currentCount + 1
                              });
                            }
                          }}
                          className="w-10 h-10 bg-slate-900 text-white flex items-center justify-center hover:bg-blue-600 transition-all"
                        >
                          <ChevronRight className="w-4 h-4" />
                        </Link>
                      </div>
                      <div className="text-right">
                        <p className="label-tech">{t('dueAmount')}</p>
                        <p className="text-xl font-black text-red-600 data-mono">৳{(shop.totalDue || 0).toLocaleString()}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}

// --- Error Handling ---
enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId: string | undefined;
    email: string | null | undefined;
    emailVerified: boolean | undefined;
    isAnonymous: boolean | undefined;
    tenantId: string | null | undefined;
    providerInfo: {
      providerId: string;
      displayName: string | null;
      email: string | null;
      photoUrl: string | null;
    }[];
  }
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData.map(provider => ({
        providerId: provider.providerId,
        displayName: provider.displayName,
        email: provider.email,
        photoUrl: provider.photoURL
      })) || []
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// --- Storage Error Handling ---
enum StorageOperationType {
  UPLOAD = 'upload',
  DOWNLOAD = 'download',
  DELETE = 'delete',
}

function handleStorageError(error: unknown, operationType: StorageOperationType, path: string) {
  const message = error instanceof Error ? error.message : String(error);
  const code = (error as any)?.code;
  
  let userMessage = "Storage operation failed.";
  
  if (code === 'storage/retry-limit-exceeded') {
    userMessage = "Upload connection timed out. This often means Firebase Storage isn't enabled in the Firebase Console or the bucket is unreachable.";
  } else if (code === 'storage/unauthorized') {
    userMessage = "Permission denied. Check your Firebase Storage security rules.";
  } else if (code === 'storage/quota-exceeded') {
    userMessage = "Storage quota exceeded.";
  } else if (code === 'storage/invalid-checksum') {
    userMessage = "File uploaded with an invalid checksum. Please try again.";
  }

  const errInfo = {
    error: message,
    code,
    operationType,
    path,
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
    }
  };
  
  console.error("Storage Error:", JSON.stringify(errInfo));
  return userMessage;
}

// --- Pages ---

function Reports() {
  const [orders, setOrders] = useState<Order[]>([]);
  const { t } = useLanguage();
  const { profile } = useAuth();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!profile) return;
    const q = query(collection(db, 'orders'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setOrders(snapshot.docs.map(d => ({ id: d.id, ...d.data() })) as Order[]);
      setLoading(false);
    }, (error) => handleFirestoreError(error, OperationType.LIST, 'reports_orders'));
    return () => unsubscribe();
  }, [profile]);

  // Data processing for charts
  const totalSales = orders.reduce((sum, o) => sum + (o.grandTotal || 0), 0);
  const totalPaid = orders.reduce((sum, o) => sum + (o.amountPaid || 0), 0);
  const totalDue = orders.reduce((sum, o) => sum + (o.dueAmount || 0), 0);

  // Shop Performance Data
  const shopData = Array.from(new Set(orders.map(o => o.shopName))).map(shopName => {
    const shopOrders = orders.filter(o => o.shopName === shopName);
    return {
      name: shopName,
      value: shopOrders.reduce((sum, o) => sum + (o.grandTotal || 0), 0)
    };
  }).sort((a, b) => b.value - a.value).slice(0, 5);

  // Category Breakdown
  const categoryData: Record<string, number> = {};
  orders.forEach(order => {
    order.items.forEach(item => {
      const cat = item.category || 'General';
      categoryData[cat] = (categoryData[cat] || 0) + (item.total || 0);
    });
  });
  const pieData = Object.entries(categoryData).map(([name, value]) => ({ name, value }));

  // Sales Trend (Last 7 days/months)
  const salesTrend = orders.reduce((acc: any, order) => {
    const date = format(new Date(order.createdAt), 'MMM dd');
    acc[date] = (acc[date] || 0) + order.grandTotal;
    return acc;
  }, {});
  const trendData = Object.entries(salesTrend).map(([name, value]) => ({ name, value })).reverse().slice(-10);

  return (
    <div className="space-y-8 pb-12">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">{t('salesReports')}</h1>
          <p className="text-slate-500 font-medium">{t('financialOverview')}</p>
        </div>
        <div className="flex gap-2">
          <button className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-slate-600 text-sm font-bold shadow-sm hover:bg-slate-50 transition-all flex items-center gap-2">
            <Download className="w-4 h-4" />
            PDF
          </button>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-bold shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all flex items-center gap-2">
            <Filter className="w-4 h-4" />
            {t('filter')}
          </button>
        </div>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: t('totalSales'), value: totalSales, color: 'text-blue-600', bg: 'bg-blue-50', icon: DollarSign },
          { label: t('totalReceived'), value: totalPaid, color: 'text-emerald-600', bg: 'bg-emerald-50', icon: Wallet },
          { label: t('totalOutstanding'), value: totalDue, color: 'text-red-600', bg: 'bg-red-50', icon: AlertCircle },
        ].map((stat) => (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            key={stat.label} 
            className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-6"
          >
            <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center shrink-0", stat.bg, stat.color)}>
              <stat.icon className="w-7 h-7" />
            </div>
            <div>
              <p className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">{stat.label}</p>
              <p className={cn("text-2xl font-black", stat.color)}>৳{stat.value.toLocaleString()}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Sales Trend Chart */}
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <ActivityLogIcon className="w-5 h-5 text-blue-500" />
              {t('monthlySales')}
            </h2>
          </div>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={trendData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                  animationDuration={1500}
                >
                  {trendData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} stroke="transparent" />
                  ))}
                </Pie>
                <Tooltip 
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-slate-900 text-white p-3 rounded-2xl shadow-xl border border-slate-800">
                          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">{payload[0].payload.name}</p>
                          <p className="text-lg font-black tracking-tighter">৳{payload[0].value.toLocaleString()}</p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Breakdown (Pie) */}
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
          <h2 className="text-lg font-bold text-slate-800 mb-8 flex items-center gap-2">
            <LayoutGrid className="w-5 h-5 text-emerald-500" />
            {t('catalog')} {t('details')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={8}
                    dataKey="value"
                    animationDuration={1500}
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} stroke="transparent" />
                    ))}
                  </Pie>
                  <Tooltip 
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="bg-white p-3 rounded-xl shadow-lg border border-slate-100">
                            <p className="text-[10px] font-black uppercase text-slate-400">{payload[0].name}</p>
                            <p className="text-sm font-black text-slate-900">৳{payload[0].value.toLocaleString()}</p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-3">
              {pieData.map((entry, index) => (
                <div key={entry.name} className="flex items-center justify-between group">
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-2.5 h-2.5 rounded-full ring-2 ring-offset-2 ring-transparent group-hover:ring-slate-100 transition-all" 
                      style={{ backgroundColor: CHART_COLORS[index % CHART_COLORS.length] }} 
                    />
                    <span className="text-xs font-bold text-slate-600 uppercase tracking-tight">{entry.name}</span>
                  </div>
                  <span className="text-sm font-black text-slate-900 tabular-nums">৳{entry.value.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Shop Performance (Pie/Sale Chart) */}
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
          <h2 className="text-lg font-bold text-slate-800 mb-8 flex items-center gap-2">
            <Store className="w-5 h-5 text-purple-500" />
            {t('shopPerformance')} (Sale Chart)
          </h2>
          <div className="h-80 w-full relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={shopData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                  label={({ name }) => name}
                  animationDuration={1500}
                >
                  {shopData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} stroke="transparent" />
                  ))}
                </Pie>
                <Tooltip 
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-white p-3 rounded-xl shadow-lg border border-slate-100 font-bold">
                          <p className="text-[10px] font-black uppercase text-slate-400">{payload[0].payload.name}</p>
                          <p className="text-sm font-black text-slate-900">৳{payload[0].value.toLocaleString()}</p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Due Breakdown (Bar Chart) */}
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
          <h2 className="text-lg font-bold text-slate-800 mb-8 flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-red-500" />
            {t('dueBreakdown')} (Due Chart)
          </h2>
          <div className="h-80 w-full overflow-y-auto scrollbar-hide">
            <div style={{ height: Math.max(300, orders.length > 0 ? Array.from(new Set(orders.map(o => o.shopName))).length * 40 : 300) }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart 
                  layout="vertical"
                  data={Array.from(new Set(orders.map(o => o.shopName))).map(shopName => ({
                    name: shopName,
                    value: orders.filter(o => o.shopName === shopName).reduce((sum, o) => sum + (o.dueAmount || 0), 0)
                  })).filter(d => d.value > 0).sort((a, b) => b.value - a.value).slice(0, 10)}
                  margin={{ left: 60, right: 20, top: 0, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                  <XAxis type="number" hide />
                  <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} width={100} tick={{ fontSize: 9, fontWeight: 700 }} />
                  <Bar dataKey="value" fill="#ef4444" radius={[0, 10, 10, 0]} barSize={20} />
                  <Tooltip 
                    cursor={{ fill: 'rgba(239, 68, 68, 0.05)' }}
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="bg-slate-900 text-white p-3 rounded-2xl shadow-xl font-bold">
                            <p className="text-[10px] font-black uppercase text-slate-400">{payload[0].payload.name}</p>
                            <p className="text-sm font-black">৳{payload[0].value.toLocaleString()}</p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Due Chart (Pie then Bar) */}
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 lg:col-span-2">
          <h2 className="text-lg font-bold text-slate-800 mb-8 flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-red-500" />
            {t('due')} Chart
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 h-[400px]">
             <div className="h-full">
                <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Due Distribution (Pie)</p>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={shopData.map(s => ({ ...s, value: orders.filter(o => o.shopName === s.name).reduce((sum, o) => sum + (o.dueAmount || 0), 0) })).sort((a,b) => b.value - a.value).slice(0, 8)}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {shopData.map((_, index) => (
                        <Cell key={`cell-due-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                       content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          return (
                            <div className="bg-white p-3 rounded-xl shadow-lg border border-slate-100">
                              <p className="text-[10px] font-black uppercase text-slate-400">{payload[0].payload.name}</p>
                              <p className="text-sm font-black text-red-600">৳{payload[0].value.toLocaleString()}</p>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
             </div>
             <div className="h-full">
                <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Top Debts (Bar)</p>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={shopData.map(s => ({ name: s.name, value: orders.filter(o => o.shopName === s.name).reduce((sum, o) => sum + (o.dueAmount || 0), 0) })).sort((a,b) => b.value - a.value).slice(0, 5)} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                    <XAxis type="number" hide />
                    <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} width={100} tick={{ fontSize: 9, fontWeight: 700 }} />
                    <Bar dataKey="value" fill="#ef4444" radius={[0, 4, 4, 0]} />
                    <Tooltip />
                  </BarChart>
                </ResponsiveContainer>
             </div>
          </div>
        </div>

        {/* Recent Transactions List (Role-Specific) */}
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <History className="w-5 h-5 text-amber-500" />
              {t('history')}
            </h2>
            <Link to="/history" className="text-blue-600 text-xs font-black uppercase hover:underline">
              {t('viewPastOrders')}
            </Link>
          </div>
          <div className="space-y-4">
            {orders.slice(0, 5).map(order => (
              <div key={order.id} className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-100 hover:border-slate-200 transition-all cursor-pointer">
                <div className="flex items-center gap-4">
                  <div className={cn(
                    "w-10 h-10 rounded-xl flex items-center justify-center",
                    order.status === 'delivered' ? "bg-emerald-100 text-emerald-600" : "bg-blue-100 text-blue-600"
                  )}>
                    <Package className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-black text-slate-900 text-sm leading-none mb-1">{order.shopName}</p>
                    <p className="text-slate-500 text-[10px] font-bold uppercase tracking-tight">
                      {format(new Date(order.createdAt), 'MMM dd, hh:mm a')}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-black text-slate-900 leading-none mb-1">৳{order.grandTotal.toLocaleString()}</p>
                  <p className={cn(
                    "text-[10px] font-black uppercase tracking-widest",
                    order.status === 'delivered' ? "text-emerald-500" : "text-amber-500"
                  )}>
                    {t(order.status)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function ProductManagement() {
  const { t } = useLanguage();
  const { showToast } = useToast();
  const { profile, hasPermission } = useAuth();
  const [products, setProducts] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [expandedProduct, setExpandedProduct] = useState<string | null>(null);
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [newProduct, setNewProduct] = useState({ name: '', sizes: '', grade: '1' as '1' | '2', baseRate: 0, category: '', imageUrl: '', threeDPictureURL: '', customColor: '#2563eb' });
  const [contactName, setContactName] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [uploading, setUploading] = useState(false);
  const [categoryOrder, setCategoryOrder] = useState<string[]>([]);
  const formRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const unsubCategories = onSnapshot(doc(db, 'settings', 'categories'), (doc) => {
      if (doc.exists()) {
        setCategoryOrder(doc.data().order || []);
      }
    }, (error) => console.error("Category order fetch error:", error));
    return () => unsubCategories();
  }, []);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'products'), (snapshot) => {
      setProducts(snapshot.docs.map(d => ({ id: d.id, ...d.data() })));
    }, (error) => handleFirestoreError(error, OperationType.LIST, 'products'));
    
    const unsubscribeContact = onSnapshot(doc(db, 'settings', 'contact_info'), (doc) => {
      if (doc.exists()) {
        const data = doc.data();
        setContactName(data.name || '');
        setContactNumber(data.number || '');
      }
    }, (error) => handleFirestoreError(error, OperationType.GET, 'settings/contact_info'));

    return () => {
      unsubscribe();
      unsubscribeContact();
    };
  }, []);

  const handleSaveContact = async () => {
    if (!hasPermission('MANAGE_BRANDING')) {
      showToast(t('permissionDenied'), 'error');
      return;
    }
    try {
      await setDoc(doc(db, 'settings', 'contact_info'), { 
        name: contactName,
        number: contactNumber 
      });
      showToast(t('successUpdated'));
    } catch (error: any) {
      console.error("Contact info update error:", error);
      const errorMessage = error.message?.includes('permission') ? t('permissionDenied') : error.message;
      showToast(`${t('errorOccurred')}: ${errorMessage}`, "error");
      handleFirestoreError(error, OperationType.UPDATE, 'settings/contact_info');
    }
  };

  const handleUpdateBrandingColor = async (name: string, color: string) => {
    try {
      const productsToUpdate = products.filter(p => p.name === name);
      const batch = writeBatch(db);
      productsToUpdate.forEach(p => {
        batch.update(doc(db, 'products', p.id), { customColor: color });
      });
      await batch.commit();
      showToast(t('successUpdated'));
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, 'products');
    }
  };

  const handleReorderCategories = async (newOrder: string[]) => {
    if (!hasPermission('MANAGE_CATALOG')) {
      showToast(t('permissionDenied'), 'error');
      return;
    }
    setCategoryOrder(newOrder);
    try {
      await setDoc(doc(db, 'settings', 'categories'), { order: newOrder });
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, 'settings/categories');
    }
  };

  const handleDeleteCategory = async (categoryName: string) => {
    if (categoryName === 'General') {
      showToast("Cannot delete General category", 'error');
      return;
    }
    if (!window.confirm(`Are you sure you want to delete the category "${categoryName}"? All products in this category will be moved to General.`)) return;

    try {
      const batch = writeBatch(db);
      
      // Move products to General
      const productsInCategory = products.filter(p => p.category === categoryName);
      productsInCategory.forEach(p => {
        batch.update(doc(db, 'products', p.id), { category: 'General' });
      });

      // Update category order
      const newOrder = categoryOrder.filter(c => c !== categoryName);
      batch.set(doc(db, 'settings', 'categories'), { order: newOrder });

      await batch.commit();
      setCategoryOrder(newOrder);
      showToast(t('successDeleted'));
    } catch (error) {
      console.error("Delete category error:", error);
      handleFirestoreError(error, OperationType.WRITE, 'settings/categories');
    }
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!hasPermission('MANAGE_PRODUCTS')) {
      showToast(t('permissionDenied'), 'error');
      return;
    }
    try {
      const formattedName = newProduct.name.trim();
      const formattedSizes = newProduct.sizes.split(',').map(s => s.trim()).filter(s => s !== '');
      
      // Duplicate protection: Check if same name, grade, and sizes already exists
      const isDuplicate = products.some(p => 
        p.id !== editingId &&
        p.name.toLowerCase() === formattedName.toLowerCase() &&
        String(p.grade) === String(newProduct.grade) &&
        JSON.stringify(p.sizes.slice().sort()) === JSON.stringify(formattedSizes.slice().sort())
      );

      if (isDuplicate) {
        showToast(t('duplicateProductError') || "Product with same specifications already exists", 'error');
        return;
      }

      const data = {
        name: formattedName,
        sizes: formattedSizes,
        grade: newProduct.grade,
        baseRate: Number(newProduct.baseRate),
        category: newProduct.category || 'General',
        imageUrl: newProduct.imageUrl || '',
        threeDPictureURL: newProduct.threeDPictureURL || '',
        customColor: newProduct.customColor || '#2563eb'
      };

      if (editingId) {
        await updateDoc(doc(db, 'products', editingId), data);
        showToast(t('successUpdated'));
      } else {
        await addDoc(collection(db, 'products'), data);
        showToast(t('successAdded'));
      }
      
      setNewProduct({ name: '', sizes: '', grade: '1', baseRate: 0, category: '', imageUrl: '', threeDPictureURL: '', customColor: '#2563eb' });
      setIsAdding(false);
      setIsAddingCategory(false);
      setEditingId(null);
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, 'products');
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const storagePath = `products/${Date.now()}_${file.name}`;
      const storageRef = ref(storage, storagePath);
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);
      setNewProduct(prev => ({ ...prev, imageUrl: url }));
      showToast(t('successUploaded'));
    } catch (error) {
      const userMessage = handleStorageError(error, StorageOperationType.UPLOAD, 'products');
      showToast(userMessage, 'error');
    } finally {
      setUploading(false);
    }
  };

  const startEdit = (product: any) => {
    setNewProduct({
      name: product.name,
      sizes: product.sizes.join(', '),
      grade: String(product.grade) as '1' | '2',
      baseRate: product.baseRate,
      category: product.category || '',
      imageUrl: product.imageUrl || '',
      threeDPictureURL: product.threeDPictureURL || '',
      customColor: product.customColor || '#2563eb'
    });
    setEditingId(product.id);
    setIsAdding(true);
    setTimeout(() => {
      formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  const seedInitialProducts = async () => {
    const initialNames = ['Bash Green', 'White', 'Blue', 'Green', 'Maroon'];
    // For "Black" product details, we'll try to find an existing black product or use defaults
    const blackProduct = products.find(p => p.name.toLowerCase() === 'black');
    
    const sizes = blackProduct?.sizes || PRODUCT_SIZES;
    const grade = blackProduct?.grade || '1';
    const baseRate = blackProduct?.baseRate || 500;
    const category = blackProduct?.category || 'General';

    setUploading(true);
    try {
      for (const name of initialNames) {
        const isDuplicate = products.some(p => 
          p.name.toLowerCase() === name.toLowerCase() && 
          String(p.grade) === String(grade)
        );
        if (!isDuplicate) {
          await addDoc(collection(db, 'products'), {
            name,
            sizes,
            grade,
            baseRate: Number(baseRate),
            category,
            imageUrl: '',
            threeDPictureURL: ''
          });
        }
      }
      showToast("Initial products added!");
    } catch (error) {
      console.error("Seeding error:", error);
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!hasPermission('DELETE_PRODUCT')) {
      showToast(t('permissionDenied'), 'error');
      return;
    }
    console.log("Attempting to delete product with ID:", id);
    if (!id) {
      showToast("Error: Invalid Product ID", "error");
      return;
    }
    
    if (window.confirm(t('confirmDelete'))) {
      try {
        await deleteDoc(doc(db, 'products', id));
        showToast(t('successDeleted'));
        console.log("Delete successful for ID:", id);
      } catch (error: any) {
        console.error("Product delete error:", error);
        const errorMessage = error.message?.includes('permission') ? "Permission Denied" : error.message;
        showToast(`${t('errorOccurred')}: ${errorMessage}`, "error");
        handleFirestoreError(error, OperationType.DELETE, 'products');
      }
    }
  };

  // Group products by name
  const derivedCategories = [...new Set(products.map(p => p.category || 'General'))];
  const reorderableCategories = [
    ...categoryOrder.filter(c => derivedCategories.includes(c)),
    ...derivedCategories.filter(c => !categoryOrder.includes(c))
  ];
  const categories = ['All', ...reorderableCategories];
  
  const filteredProducts = selectedCategory === 'All' 
    ? products 
    : products.filter(p => (p.category || 'General') === selectedCategory);

  const groupedProducts = filteredProducts.reduce((acc: any, p) => {
    if (!acc[p.name]) acc[p.name] = [];
    acc[p.name].push(p);
    
    // Sort variants by grade (1 first, then 2) and then by size (using PRODUCT_SIZES order)
    acc[p.name].sort((a: any, b: any) => {
      if (a.grade !== b.grade) {
        return Number(a.grade) - Number(b.grade);
      }
      // Then sort by size index in PRODUCT_SIZES
      const sizeA = a.sizes[0] || '';
      const sizeB = b.sizes[0] || '';
      const indexA = PRODUCT_SIZES.indexOf(sizeA);
      const indexB = PRODUCT_SIZES.indexOf(sizeB);
      if (indexA !== -1 && indexB !== -1) {
        return indexA - indexB;
      }
      return sizeA.localeCompare(sizeB);
    });
    
    return acc;
  }, {});

  return (
    <div className="space-y-6 md:space-y-8">
      {/* Row 1: Title and Stats */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-5xl font-black text-slate-900 uppercase tracking-tight leading-none">{t('productManagement') || t('products')}</h1>
          <p className="text-slate-500 text-[10px] md:text-xs font-black uppercase tracking-[0.3em] mt-2 opacity-70">
            {products.length} {t('totalProducts')} • {reorderableCategories.length} {t('categories')}
          </p>
        </div>
        
        {/* Row 2: Consolidated Action Buttons (Desktop can stay here, Mobile will stack) */}
        <div className="flex flex-wrap items-center gap-2 md:gap-2.5">
          {hasPermission('MANAGE_PRODUCTS') && hasPermission('ACCESS_PRODUCT_SHOP_EDIT') && (
            <div className="flex items-center gap-1.5 md:gap-2 bg-slate-100 p-1 rounded-xl md:rounded-2xl border border-slate-200/50">
              <button
                onClick={seedInitialProducts}
                className="flex items-center gap-1.5 bg-white text-slate-600 font-black py-2 md:py-2 px-4 md:px-5 rounded-lg md:rounded-xl border border-transparent hover:border-slate-200 transition-all text-[9px] md:text-[10px] uppercase tracking-[0.2em] whitespace-nowrap shadow-sm"
              >
                <Database className="w-3.5 h-3.5" /> <span>{t('seedProducts') || 'Seed'}</span>
              </button>
              <button 
                onClick={() => {
                  setEditingId(null);
                  setNewProduct({ 
                    name: '', 
                    sizes: '', 
                    grade: '1', 
                    baseRate: 0, 
                    category: selectedCategory !== 'All' ? selectedCategory : '', 
                    imageUrl: '', 
                    threeDPictureURL: '',
                    customColor: '#2563eb'
                  });
                  setIsAddingCategory(false);
                  setIsAdding(true);
                }}
                disabled={isAdding}
                className={cn(
                  "flex items-center gap-1.5 font-black py-2 md:py-2 px-4 md:px-5 rounded-lg md:rounded-xl transition-all text-[9px] md:text-[10px] uppercase tracking-[0.2em] whitespace-nowrap",
                  isAdding 
                    ? "bg-slate-200 text-slate-400 cursor-not-allowed" 
                    : "bg-blue-600 text-white hover:bg-blue-700 shadow-md shadow-blue-900/10"
                )}
              >
                <Plus className="w-3.5 h-3.5 md:w-4 md:h-4" />
                <span>{t('addProduct')}</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Row 3: Categories - Dedicated visible row */}
      <div className="bg-slate-100 p-1.5 md:p-2 rounded-2xl md:rounded-[2.5rem] border border-slate-200/50">
        <div className="flex items-center gap-3 w-full relative">
          <div className="flex items-center gap-1 md:gap-1.5 overflow-x-auto scrollbar-hide no-scrollbar flex-1 py-0.5 px-0.5 snap-x scroll-smooth">
            <button
              onClick={() => setSelectedCategory('All')}
              className={cn(
                "px-4 md:px-6 py-2 md:py-2.5 rounded-lg md:rounded-xl text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] transition-all whitespace-nowrap snap-start relative overflow-hidden flex items-center justify-center min-w-[70px] md:min-w-[100px]",
                selectedCategory === 'All' 
                  ? "text-white shadow-lg shadow-slate-900/20" 
                  : "text-slate-500 hover:text-slate-800 hover:bg-white bg-white/40 border border-transparent hover:border-slate-200"
              )}
            >
              {selectedCategory === 'All' && (
                <motion.div
                  layoutId="activeCategory"
                  className="absolute inset-0 bg-slate-900"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
              <span className="relative z-10">{t('all')}</span>
            </button>

            <Reorder.Group 
              axis="x" 
              values={reorderableCategories} 
              onReorder={handleReorderCategories}
              className="flex items-center gap-1 md:gap-1.5"
            >
              {reorderableCategories.map(cat => (
                <Reorder.Item
                  key={cat}
                  value={cat}
                  className="relative cursor-grab active:cursor-grabbing snap-start group"
                >
                  <button
                    onClick={() => setSelectedCategory(cat)}
                    className={cn(
                      "px-4 md:px-6 py-2 md:py-2.5 rounded-lg md:rounded-xl text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] transition-all whitespace-nowrap relative overflow-hidden flex items-center justify-center min-w-[70px] md:min-w-[100px] pr-8",
                      selectedCategory === cat 
                        ? "text-white shadow-lg shadow-slate-900/20" 
                        : "text-slate-500 hover:text-slate-800 hover:bg-white bg-white/40 border border-transparent hover:border-slate-200"
                    )}
                  >
                    {selectedCategory === cat && (
                      <motion.div
                        layoutId="activeCategory"
                        className="absolute inset-0 bg-slate-900"
                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                      />
                    )}
                    <span className="relative z-10">{cat}</span>
                  </button>
                  {cat !== 'General' && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteCategory(cat);
                      }}
                      className={cn(
                        "absolute right-1.5 top-1/2 -translate-y-1/2 p-1 rounded-full transition-all z-20 md:opacity-0 group-hover:opacity-100",
                        selectedCategory === cat ? "text-white/60 hover:text-white" : "text-slate-400 hover:text-red-600"
                      )}
                    >
                      <X className="w-3 h-3" />
                    </button>
                  )}
                </Reorder.Item>
              ))}
            </Reorder.Group>
          </div>
        </div>
      </div>


      <AnimatePresence>
        {isAdding && (
          <motion.div
            ref={formRef}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100"
          >
            <form onSubmit={handleSaveProduct} className="grid grid-cols-1 md:grid-cols-7 gap-4 items-end">
              <div className="md:col-span-1">
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">{t('product')} {t('name')}</label>
                <input
                  type="text"
                  required
                  value={newProduct.name}
                  onChange={e => setNewProduct({ ...newProduct, name: e.target.value })}
                  className="w-full p-2 rounded-lg border border-slate-200"
                />
              </div>
              <div className="md:col-span-1">
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{t('category')}</label>
                <div className="relative group">
                  {isAddingCategory ? (
                    <div className="relative flex items-center">
                      <input
                        type="text"
                        placeholder={t('typeNewCategory') || "Type category..."}
                        required
                        autoFocus
                        value={newProduct.category}
                        onChange={e => setNewProduct({ ...newProduct, category: e.target.value })}
                        className="w-full p-2 rounded-lg border border-slate-200 outline-none text-sm font-bold pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setIsAddingCategory(false)}
                        className="absolute right-2 p-1 text-slate-400 hover:text-slate-600 transition-colors"
                        title={t('back') || "Back"}
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <div className="relative">
                      <select
                        value={newProduct.category}
                        onChange={e => {
                          if (e.target.value === 'NEW') {
                            setNewProduct({ ...newProduct, category: '' });
                            setIsAddingCategory(true);
                          } else {
                            setNewProduct({ ...newProduct, category: e.target.value });
                          }
                        }}
                        className="w-full p-2 rounded-lg border border-slate-200 outline-none appearance-none bg-white text-sm font-bold pr-10"
                      >
                        <option value="">Select Category</option>
                        {categories.filter(c => c !== 'All').map(c => (
                          <option key={c} value={c}>{c}</option>
                        ))}
                        <option value="NEW">+ {t('newCategory') || 'New Category'}</option>
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                    </div>
                  )}
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">{t('grade')}</label>
                <select
                  value={newProduct.grade}
                  onChange={e => setNewProduct({ ...newProduct, grade: e.target.value as '1' | '2' })}
                  className="w-full p-2 rounded-lg border border-slate-200"
                >
                  <option value="1">{t('grade')} 1</option>
                  <option value="2">{t('grade')} 2</option>
                </select>
              </div>
              <div className="md:col-span-1">
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">{t('image')}</label>
                <div className="flex items-center gap-2">
                  {newProduct.imageUrl && (
                    <img src={newProduct.imageUrl} className="w-10 h-10 rounded object-cover border" referrerPolicy="no-referrer" />
                  )}
                  <label className="flex-1 cursor-pointer bg-slate-50 border border-dashed border-slate-300 rounded-lg p-2 text-center text-[10px] font-bold text-slate-500 hover:bg-slate-100">
                    {uploading ? t('uploading') : t('chooseImage')}
                    <input type="file" accept="image/png, image/jpeg, image/jpg" onChange={handleImageUpload} className="hidden" />
                  </label>
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">3D Picture URL</label>
                <input
                  type="url"
                  placeholder="https://..."
                  value={newProduct.threeDPictureURL}
                  onChange={e => setNewProduct({ ...newProduct, threeDPictureURL: e.target.value })}
                  className="w-full p-2 rounded-lg border border-slate-200"
                />
              </div>
              <div className="md:col-span-1">
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">{t('baseRate')}</label>
                <input
                  type="number"
                  required
                  value={newProduct.baseRate}
                  onChange={e => setNewProduct({ ...newProduct, baseRate: Number(e.target.value) })}
                  className="w-full p-2 rounded-lg border border-slate-200"
                />
              </div>
              {hasPermission('MANAGE_PRODUCT_COLORS') && (
                <div className="md:col-span-1">
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">{t('accentColor') || 'Color'}</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={newProduct.customColor}
                      onChange={e => setNewProduct({ ...newProduct, customColor: e.target.value })}
                      className="w-10 h-10 rounded-lg p-0 border-none cursor-pointer"
                    />
                    <input 
                      type="text" 
                      value={newProduct.customColor} 
                      onChange={e => setNewProduct({ ...newProduct, customColor: e.target.value })}
                      className="flex-1 p-2 rounded-lg border border-slate-200 text-[10px] font-mono"
                    />
                  </div>
                </div>
              )}
              <div className="md:col-span-1">
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">{t('size')}</label>
                <div className="flex flex-wrap gap-1 mb-1">
                  {PRODUCT_SIZES.slice(0, 4).map(size => (
                    <button
                      key={size}
                      type="button"
                      onClick={() => {
                        const currentSizes = newProduct.sizes ? newProduct.sizes.split(',').map(s => s.trim()) : [];
                        const updatedSizes = currentSizes.includes(size)
                          ? currentSizes.filter(s => s !== size)
                          : [...currentSizes, size];
                        setNewProduct({ ...newProduct, sizes: updatedSizes.join(', ') });
                      }}
                      className={cn(
                        "px-2 py-0.5 rounded text-[8px] font-bold border transition-all",
                        newProduct.sizes.split(',').map(s => s.trim()).includes(size)
                          ? "bg-blue-600 border-blue-600 text-white"
                          : "bg-white border-slate-200 text-slate-500"
                      )}
                    >
                      {size}
                    </button>
                  ))}
                </div>
                <input
                  type="text"
                  required
                  placeholder={t('customSizes')}
                  value={newProduct.sizes}
                  onChange={e => setNewProduct({ ...newProduct, sizes: e.target.value })}
                  className="w-full p-2 rounded-lg border border-slate-200 text-xs"
                />
              </div>
              <div className="md:col-span-7 flex gap-2 mt-2">
                <button type="submit" className="flex-1 bg-blue-600 text-white font-bold py-2 rounded-lg">
                  {editingId ? t('saveChanges') : t('addProduct')}
                </button>
                <button 
                  type="button" 
                  onClick={() => {
                    setIsAdding(false);
                    setEditingId(null);
                    setNewProduct({ name: '', sizes: '', grade: '1', baseRate: 0, category: '', imageUrl: '', threeDPictureURL: '', customColor: '#2563eb' });
                  }} 
                  className="flex-1 bg-slate-100 text-slate-600 font-bold py-2 rounded-lg"
                >
                  {t('cancel')}
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {Object.entries(groupedProducts).map(([name, variants]: [string, any]) => {
          const mainProduct = variants[0];
          const isExpanded = expandedProduct === name;
          const customColor = getProductBrandingColor(name, mainProduct.customColor);
          const contrastColor = getContrastColor(customColor);

          return (
            <motion.div 
              key={name} 
              layout
              className="bg-white rounded-[2.5rem] shadow-xl border border-slate-100 overflow-hidden flex flex-col group hover:shadow-2xl hover:shadow-blue-100/50 transition-all duration-500 relative"
            >
              <div className="p-8 pb-4">
                <div 
                  className="p-6 rounded-[2rem] transition-all duration-300 shadow-lg relative overflow-hidden mb-6"
                  style={{ backgroundColor: customColor, color: contrastColor }}
                >
                  <div className="flex justify-between items-start relative z-10">
                    <div className="space-y-2">
                      <div className="flex items-center gap-3">
                        <h3 className="text-xl font-black uppercase tracking-tight">{name}</h3>
                        {hasPermission('MANAGE_PRODUCT_COLORS') && (
                          <div className="relative">
                            <input
                              type="color"
                              value={customColor}
                              onChange={(e) => handleUpdateBrandingColor(name, e.target.value)}
                              className="w-6 h-6 rounded-full border-2 border-white/50 shadow-sm cursor-pointer appearance-none bg-transparent"
                              title="Edit Branding Color"
                            />
                          </div>
                        )}
                      </div>
                      <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-80">
                        {variants.length} {t('variants')} • {mainProduct.category || 'General'}
                      </p>
                    </div>
                    {mainProduct.imageUrl && (
                      <div className="w-14 h-14 rounded-2xl overflow-hidden shadow-xl border-2 border-white/30 backdrop-blur-sm shrink-0">
                        <img src={mainProduct.imageUrl} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                      </div>
                    )}
                  </div>
                  {/* Subtle background decoration */}
                  <div className="absolute top-0 right-0 w-32 h-32 -mr-16 -mt-16 bg-white/10 rounded-full blur-3xl pointer-events-none" />
                  <div className="absolute bottom-0 left-0 w-24 h-24 -ml-12 -mb-12 bg-black/5 rounded-full blur-2xl pointer-events-none" />
                </div>
                
                <button
                  onClick={() => setExpandedProduct(name)}
                  className="w-full py-3 px-6 rounded-2xl bg-slate-50 hover:bg-slate-100 text-slate-600 text-[10px] font-black uppercase tracking-widest flex items-center justify-between transition-colors mb-2"
                >
                  {t('viewDetails') || 'View Details'}
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Product Details Modal */}
      <AnimatePresence>
        {expandedProduct && (
          <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center p-0 md:p-8">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setExpandedProduct(null)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm cursor-pointer"
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 100 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 100 }}
              className="relative w-full max-w-2xl bg-white rounded-t-[2rem] md:rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col max-h-[95vh] md:max-h-[90vh]"
            >
              {(() => {
                const variants = groupedProducts[expandedProduct];
                if (!variants) return null;
                const mainProduct = variants[0];
                const customColor = getProductBrandingColor(expandedProduct, mainProduct.customColor);
                const contrastColor = getContrastColor(customColor);

                return (
                  <>
                    {/* Modal Header */}
                    <div className="p-4 md:p-8 pb-0 shrink-0">
                      <div 
                        className="p-5 md:p-8 rounded-2xl md:rounded-[2rem] shadow-xl relative overflow-hidden mb-4 md:mb-6"
                        style={{ backgroundColor: customColor, color: contrastColor }}
                      >
                        <div className="flex justify-between items-start relative z-10">
                          <div className="space-y-2 md:space-y-3">
                            <div className="flex items-center gap-3">
                              <h3 className="text-lg md:text-2xl font-black uppercase tracking-tight">{expandedProduct}</h3>
                            </div>
                            <p className="text-[10px] md:text-xs font-black uppercase tracking-[0.2em] opacity-80">
                              {variants.length} {t('variants')} • {mainProduct.category || 'General'}
                            </p>
                          </div>
                          <button 
                            onClick={() => setExpandedProduct(null)}
                            className="p-1.5 md:p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors backdrop-blur-md"
                          >
                            <X className="w-5 h-5 md:w-6 md:h-6" />
                          </button>
                        </div>
                        {/* Subtle background decoration */}
                        <div className="absolute top-0 right-0 w-32 md:w-48 h-32 md:h-48 -mr-12 md:-mr-16 -mt-12 md:-mt-16 bg-white/10 rounded-full blur-3xl pointer-events-none" />
                        <div className="absolute bottom-0 left-0 w-24 md:w-32 h-24 md:h-32 -ml-8 md:-ml-12 -mb-8 md:-mb-12 bg-black/5 rounded-full blur-2xl pointer-events-none" />
                      </div>
                    </div>

                    {/* Modal Body (Scrollable) */}
                    <div className="p-4 md:p-8 pt-0 overflow-y-auto scrollbar-hide flex-1 space-y-3 md:space-y-4">
                      {variants.map((v: any) => (
                        <div key={v.id} className="p-4 md:p-6 rounded-2xl md:rounded-3xl bg-slate-50 border border-slate-100 hover:border-blue-200 transition-all group/variant relative overflow-hidden">
                          <div className="flex justify-between items-start relative z-10">
                            <div className="space-y-2 md:space-y-3">
                              <div className="flex items-center gap-2 md:gap-3">
                                <span 
                                  className="px-2 md:px-3 py-1 md:py-1.5 rounded-lg md:rounded-xl text-[8px] md:text-[10px] font-black uppercase tracking-widest shadow-sm"
                                  style={{ backgroundColor: customColor, color: contrastColor }}
                                >
                                  {t('grade')} {v.grade}
                                </span>
                                <span className="text-xl md:text-2xl font-black text-slate-900 font-mono tracking-tighter">৳{v.baseRate.toLocaleString()}</span>
                              </div>
                              <div className="flex flex-wrap gap-1.5 md:gap-2">
                                {v.sizes.slice().sort((a: string, b: string) => {
                                  const indexA = PRODUCT_SIZES.indexOf(a);
                                  const indexB = PRODUCT_SIZES.indexOf(b);
                                  if (indexA !== -1 && indexB !== -1) return indexA - indexB;
                                  return a.localeCompare(b);
                                }).map((s: string) => (
                                  <span key={s} className="px-2 md:px-3 py-0.5 md:py-1 bg-white text-slate-500 rounded-md md:rounded-lg text-[8px] md:text-[10px] font-black uppercase tracking-tight border border-slate-200/50 shadow-sm">
                                    {s}
                                  </span>
                                ))}
                              </div>
                            </div>
                            <div className="flex gap-1.5 md:gap-2">
                              {hasPermission('MANAGE_PRODUCTS') && hasPermission('ACCESS_PRODUCT_SHOP_EDIT') && (
                                <>
                                  <button
                                    onClick={() => {
                                      setExpandedProduct(null);
                                      startEdit(v);
                                    }}
                                    className="p-2 md:p-2.5 text-slate-400 hover:text-blue-600 bg-white shadow-sm rounded-lg md:rounded-xl transition-colors"
                                  >
                                    <Edit className="w-4 h-4 md:w-5 md:h-5" />
                                  </button>
                                {hasPermission('DELETE_PRODUCT') && (
                                  <button
                                    onClick={() => handleDelete(v.id)}
                                    className="p-2 md:p-2.5 text-slate-400 hover:text-red-600 bg-white shadow-sm rounded-lg md:rounded-xl transition-colors"
                                  >
                                    <Trash2 className="w-4 h-4 md:w-5 md:h-5" />
                                  </button>
                                )}
                                </>
                              )}
                            </div>
                          </div>
                          {v.threeDPictureURL && (
                            <div className="mt-3 md:mt-4 p-3 md:p-4 bg-white rounded-xl md:rounded-2xl border border-slate-100 flex items-center justify-between">
                              <span className="text-[8px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">3D Visualization</span>
                              <a 
                                href={v.threeDPictureURL} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="px-3 md:px-4 py-1.5 md:py-2 bg-slate-900 text-white text-[8px] md:text-[10px] font-black uppercase rounded-lg md:rounded-xl hover:bg-black transition-colors"
                              >
                                View 3D
                              </a>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>

                    {/* Modal Footer */}
                    <div className="p-6 md:p-8 pt-2 md:pt-4 bg-slate-50 relative z-10 shrink-0 flex justify-end">
                      <button 
                        onClick={() => setExpandedProduct(null)}
                        className="w-full md:w-auto px-8 py-3 bg-white text-slate-900 font-black uppercase tracking-widest text-[9px] md:text-[10px] rounded-xl md:rounded-2xl shadow-sm border border-slate-200 hover:bg-slate-50 transition-colors"
                      >
                        {t('close') || 'Close'}
                      </button>
                    </div>
                  </>
                );
              })()}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

function PublicCatalog() {
  const [products, setProducts] = useState<any[]>([]);
  const [contactName, setContactName] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [loading, setLoading] = useState(true);
  const [categoryOrder, setCategoryOrder] = useState<string[]>([]);
  const { t } = useLanguage();
  const { showToast } = useToast();
  const { logoUrl } = useBranding();
  const navigate = useNavigate();
  const { profile, hasPermission } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [cart, setCart] = useState<{ [key: string]: number }>({});
  const [showCartModal, setShowCartModal] = useState(false);
  const [submittingRequest, setSubmittingRequest] = useState(false);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'products'), (snapshot) => {
      setProducts(snapshot.docs.map(d => ({ id: d.id, ...d.data() })));
      setLoading(false);
    }, (error) => handleFirestoreError(error, OperationType.LIST, 'products'));
    
    const unsubscribeContact = onSnapshot(doc(db, 'settings', 'contact_info'), (doc) => {
      if (doc.exists()) {
        const data = doc.data();
        setContactName(data.name || '');
        setContactNumber(data.number || '');
      }
    }, (error) => handleFirestoreError(error, OperationType.GET, 'settings/contact_info'));

    const unsubscribeCategories = onSnapshot(doc(db, 'settings', 'categories'), (doc) => {
      if (doc.exists()) {
        setCategoryOrder(doc.data().order || []);
      }
    });

    return () => {
      unsubscribe();
      unsubscribeContact();
      unsubscribeCategories();
    };
  }, []);

  const handleAddToCart = (productId: string) => {
    setCart(prev => ({
      ...prev,
      [productId]: (prev[productId] || 0) + 1
    }));
    showToast(t('successAdded'));
  };

  const handleRemoveFromCart = (productId: string) => {
    setCart(prev => {
      const newCart = { ...prev };
      if (newCart[productId] > 1) {
        newCart[productId] -= 1;
      } else {
        delete newCart[productId];
      }
      return newCart;
    });
  };

  const submitOrderRequest = async () => {
    if (!profile?.shopCode) return;
    setSubmittingRequest(true);
    try {
      const items = Object.entries(cart).map(([productId, quantity]) => {
        const product = products.find(p => p.id === productId);
        return {
          productId,
          productName: product?.name || 'Unknown',
          quantity
        };
      });

      await addDoc(collection(db, 'order_requests'), {
        shopCode: profile.shopCode,
        shopName: profile.displayName,
        items,
        status: 'pending',
        createdAt: new Date().toISOString()
      });

      setCart({});
      setShowCartModal(false);
      showToast(t('requestSent'));
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, 'order_requests');
    } finally {
      setSubmittingRequest(false);
    }
  };

  // Group products by category
  const derivedCategories = [...new Set(products.map(p => p.category || 'General'))];
  const categories = ['All', ...categoryOrder.filter(c => derivedCategories.includes(c)), ...derivedCategories.filter(c => !categoryOrder.includes(c))];

  const filteredProducts = selectedCategory === 'All'
    ? products
    : products.filter(p => (p.category || 'General') === selectedCategory);

  const productsByCategory = filteredProducts.reduce((acc: any, p) => {
    const cat = p.category || 'General';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(p);
    
    // Sort products by grade then size
    acc[cat].sort((a: any, b: any) => {
      if (a.grade !== b.grade) return Number(a.grade) - Number(b.grade);
      const sizeA = a.sizes[0] || '';
      const sizeB = b.sizes[0] || '';
      const indexA = PRODUCT_SIZES.indexOf(sizeA);
      const indexB = PRODUCT_SIZES.indexOf(sizeB);
      if (indexA !== -1 && indexB !== -1) return indexA - indexB;
      return sizeA.localeCompare(sizeB);
    });
    
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-slate-50/50 p-4 md:p-6">
      <div className="max-w-5xl mx-auto space-y-6 md:space-y-8">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 md:gap-6">
          <div className="flex items-center gap-3 md:gap-4">
            <button onClick={() => navigate(-1)} className="p-1.5 md:p-2 hover:bg-white rounded-xl transition-colors">
              <ChevronLeft className="w-5 h-5 md:w-6 md:h-6 text-slate-600" />
            </button>
            <div>
              <h1 className="text-xl md:text-3xl font-black text-slate-900 uppercase tracking-tight">{t('publicCatalog')}</h1>
              <p className="text-[10px] md:text-sm font-bold text-slate-500 uppercase tracking-widest">{t('explorePaints')}</p>
            </div>
          </div>
          
          <div className="flex flex-wrap items-center gap-2 md:gap-3">
            <div className="flex items-center gap-1.5 md:gap-2 bg-white p-1 rounded-xl border border-slate-200 shadow-sm overflow-x-auto no-scrollbar">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={cn(
                    "px-3 md:px-4 py-1.5 rounded-lg text-[10px] font-black uppercase transition-all whitespace-nowrap",
                    selectedCategory === cat
                      ? "bg-slate-900 text-white shadow-md shadow-slate-100"
                      : "text-slate-500 hover:bg-slate-50"
                  )}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-3 md:gap-4">
              {Object.keys(cart).length > 0 && (
                <button 
                  onClick={() => setShowCartModal(true)}
                  className="relative p-2.5 md:p-3 bg-blue-600 text-white rounded-xl md:rounded-2xl shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all"
                >
                  <ShoppingCart className="w-5 h-5 md:w-6 md:h-6" />
                  <span className="absolute -top-1.5 md:-top-2 -right-1.5 md:-right-2 bg-red-500 text-white text-[8px] md:text-[10px] font-bold w-4 h-4 md:w-5 md:h-5 rounded-full flex items-center justify-center border-2 border-white">
                    {Object.values(cart).reduce((a: number, b: number) => a + b, 0)}
                  </span>
                </button>
              )}
              <div className="w-10 h-10 md:w-12 md:h-12 bg-white rounded-xl md:rounded-2xl flex items-center justify-center shadow-lg shadow-blue-50 overflow-hidden border border-slate-100">
                <img src={logoUrl || "https://ais-dev-2t2xxqjcfxzhtv7w5ldbav-180523243505.asia-southeast1.run.app/api/attachments/a7f5a265-27f9-4674-846f-c1249683935b"} alt="Nafeu Paints" className="w-full h-full object-contain mix-blend-multiply" referrerPolicy="no-referrer" />
              </div>
            </div>
          </div>
        </header>

        {(contactName || contactNumber) && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-blue-600 p-4 md:p-6 rounded-2xl md:rounded-3xl text-white shadow-xl shadow-blue-200 flex flex-col md:flex-row items-center justify-between gap-4"
          >
            <div className="flex items-center gap-3 md:gap-4">
              <div className="w-10 h-10 md:w-12 md:h-12 bg-white/20 rounded-xl md:rounded-2xl flex items-center justify-center backdrop-blur-sm">
                <Phone className="w-5 h-5 md:w-6 md:h-6" />
              </div>
              <div>
                <p className="text-blue-100 text-[8px] md:text-xs font-black uppercase tracking-widest mb-1">{t('contactForOrder')}</p>
                <div className="flex flex-col">
                  {contactName && <p className="text-sm md:text-lg font-black leading-tight uppercase">{contactName}</p>}
                  {contactNumber && <p className="text-lg md:text-xl font-black">{contactNumber}</p>}
                </div>
              </div>
            </div>
            {!profile && (
              <button 
                onClick={() => navigate('/')}
                className="w-full md:w-auto bg-white text-blue-600 px-6 py-2.5 md:py-3 rounded-xl md:rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-blue-50 transition-colors shadow-lg"
              >
                {t('login')}
              </button>
            )}
          </motion.div>
        )}

        <div className="space-y-12">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array(6).fill(0).map((_, i) => (
                <div key={i} className="bg-white h-64 rounded-3xl animate-pulse border border-slate-100" />
              ))}
            </div>
          ) : (
            Object.entries(productsByCategory).map(([category, catProducts]: [string, any]) => (
              <div key={category} className="space-y-6">
                <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
                  <span className="w-2 h-8 bg-blue-600 rounded-full" />
                  {category}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {catProducts.map((product: any) => {
                      const customColor = getProductBrandingColor(product.name, product.customColor);
                      const contrastColor = getContrastColor(customColor);

                      return (
                        <motion.div
                          key={product.id}
                          initial={{ opacity: 0, y: 20 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true }}
                          className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden group hover:shadow-xl transition-all duration-500"
                        >
                          <div className="aspect-square bg-slate-50 relative overflow-hidden">
                            {product.imageUrl ? (
                              <img 
                                src={product.imageUrl} 
                                alt={product.name} 
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                referrerPolicy="no-referrer"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <Package className="w-12 h-12 text-slate-200" />
                              </div>
                            )}
                            <div className="absolute top-6 right-4 flex flex-col gap-2 z-20">
                              <span 
                                className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest shadow-xl border border-white/20 backdrop-blur-md"
                                style={{ backgroundColor: customColor, color: contrastColor }}
                              >
                                {t('grade')} {product.grade}
                              </span>
                              {product.threeDPictureURL && (
                                <a 
                                  href={product.threeDPictureURL} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="bg-white/90 backdrop-blur text-slate-900 p-2 rounded-full shadow-lg hover:bg-white transition-colors flex items-center justify-center"
                                  title="View 3D"
                                >
                                  <Box className="w-4 h-4" />
                                </a>
                              )}
                            </div>
                          </div>
                      
                          <div className="p-6 space-y-4">
                            <h3 className="text-xl font-bold text-slate-900">{product.name}</h3>
                            <div className="flex flex-wrap gap-2 mb-4">
                              {product.sizes.slice().sort((a: string, b: string) => {
                                const indexA = PRODUCT_SIZES.indexOf(a);
                                const indexB = PRODUCT_SIZES.indexOf(b);
                                if (indexA !== -1 && indexB !== -1) return indexA - indexB;
                                return a.localeCompare(b);
                              }).map((size: string) => (
                                <span key={size} className="px-2 py-1 bg-slate-50 text-slate-500 rounded-lg text-[10px] font-bold uppercase">
                                  {size}
                                </span>
                              ))}
                            </div>
                            <div className="pt-4 border-t border-slate-50 flex justify-between items-center">
                              <div>
                                <span className="text-slate-400 text-xs font-medium">{t('baseRate')}</span>
                                {profile ? (
                                  <p className="text-lg font-bold text-blue-600">৳{product.baseRate.toFixed(2)}</p>
                                ) : (
                                  <p className="text-sm font-bold text-slate-400 italic">{t('loginToSeePrice')}</p>
                                )}
                              </div>
                              <div className="flex gap-2">
                                {profile?.role === 'shop_owner' && (
                                  <button 
                                    onClick={() => handleAddToCart(product.id)}
                                    className="p-2 bg-blue-600 text-white hover:bg-blue-700 rounded-lg transition-colors flex items-center gap-2"
                                    title={t('add')}
                                  >
                                    <ShoppingCart className="w-5 h-5" />
                                    <span className="text-[10px] font-bold uppercase">{t('add')}</span>
                                  </button>
                                )}
                                {hasPermission('MANAGE_PRODUCTS') && (
                                  <button 
                                    onClick={() => navigate('/products')}
                                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                    title={t('editProduct')}
                                  >
                                    <Settings className="w-5 h-5" />
                                  </button>
                                )}
                                {hasPermission('CREATE_ORDERS') && (
                                  <button 
                                    onClick={() => navigate('/new-order')}
                                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                    title={t('newOrder')}
                                  >
                                    <Plus className="w-5 h-5" />
                                  </button>
                                )}
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      );
                  })}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Cart Modal */}
      <AnimatePresence>
        {showCartModal && (
          <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-start justify-center z-[100] p-4 overflow-y-auto pt-20">
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 20, opacity: 0 }}
              className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl space-y-6 mb-20"
            >
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-slate-900">{t('orderItems')}</h2>
                <button onClick={() => setShowCartModal(false)} className="p-2 hover:bg-slate-100 rounded-full">
                  <X className="w-6 h-6 text-slate-400" />
                </button>
              </div>

              <div className="space-y-4 max-h-[40vh] overflow-y-auto pr-2">
                {Object.entries(cart).map(([productId, quantity]) => {
                  const product = products.find(p => p.id === productId);
                  return (
                    <div key={productId} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                      <div>
                        <p className="font-bold text-slate-900">{product?.name}</p>
                        <p className="text-sm font-bold text-blue-600">{t('quantity')}: {quantity}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={() => handleRemoveFromCart(productId)}
                          className="p-2 bg-white text-slate-400 hover:text-red-600 rounded-lg border border-slate-100"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleAddToCart(productId)}
                          className="p-2 bg-white text-slate-400 hover:text-blue-600 rounded-lg border border-slate-100"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="pt-6 border-t border-slate-100 space-y-4">
                <p className="text-sm text-slate-500 text-center">
                  {t('requestPermission')} {t('for')} {t('newOrder')}
                </p>
                <button
                  onClick={submitOrderRequest}
                  disabled={submittingRequest}
                  className="w-full bg-blue-600 text-white font-bold py-4 rounded-2xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 disabled:opacity-50"
                >
                  {submittingRequest ? t('requesting') : t('confirmSubmit')}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}



function ShopOwnerDashboard() {
  const { profile, hasPermission } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    monthlySales: 0,
    collection: 0,
    due: 0,
    totalOrders: 0
  });
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!profile?.shopCode) return;

    if (profile.permissionStatus === 'granted') {
      navigate(`/shops/${profile.shopCode}`);
      return;
    }

    const q = query(collection(db, 'orders'), where('shopCode', '==', profile.shopCode));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const orders = snapshot.docs.map(d => ({ id: d.id, ...d.data() })) as Order[];
      const totalSales = orders.reduce((sum, o) => sum + (o.grandTotal || 0), 0);
      const totalDue = orders.reduce((sum, o) => sum + (o.dueAmount || 0), 0);
      const totalCollection = orders.reduce((sum, o) => sum + (o.amountPaid || 0), 0);
      
      setStats({
        monthlySales: totalSales,
        collection: totalCollection,
        due: totalDue,
        totalOrders: orders.length
      });
      setRecentOrders(orders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 5));
      setLoading(false);
    }, (error) => handleFirestoreError(error, OperationType.LIST, 'shop_owner_dashboard'));

    return () => unsubscribe();
  }, [profile, navigate]);

  if (loading) return <LoadingScreen />;

  return (
    <div className="space-y-8">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 uppercase tracking-tight">{t('shopOwnerDashboard')}</h1>
          <p className="text-slate-500 font-medium">{t('performanceOverview')}</p>
        </div>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: t('totalSales'), value: `৳${stats.monthlySales.toFixed(2)}`, icon: BarChart3, color: "text-blue-600", bg: "bg-blue-50" },
          { label: t('totalReceived'), value: `৳${stats.collection.toFixed(2)}`, icon: DollarSign, color: "text-emerald-600", bg: "bg-emerald-50" },
          { label: t('totalOutstanding'), value: `৳${stats.due.toFixed(2)}`, icon: AlertCircle, color: "text-red-600", bg: "bg-red-50" },
          { label: t('totalOrders'), value: stats.totalOrders, icon: Package, color: "text-amber-600", bg: "bg-amber-50" },
        ].map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100"
          >
            <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center mb-4", stat.bg)}>
              <stat.icon className={cn("w-6 h-6", stat.color)} />
            </div>
            <p className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">{stat.label}</p>
            <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Collection Distribution Donut */}
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 flex flex-col items-center">
          <h2 className="text-sm font-black text-slate-400 uppercase tracking-[0.2em] mb-8 w-full">{t('paymentStatus')}</h2>
          <div className="h-64 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={[
                    { name: t('received'), value: stats.collection },
                    { name: t('due'), value: stats.due }
                  ]}
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  <Cell fill="#10b981" strokeWidth={0} />
                  <Cell fill="#ef4444" strokeWidth={0} />
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-4">
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{t('received')}</p>
                <p className="text-xl font-black text-emerald-600">৳{stats.collection.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{t('due')}</p>
                <p className="text-xl font-black text-red-600">৳{stats.due.toLocaleString()}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Performance mini-chart */}
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 flex flex-col">
          <h2 className="text-sm font-black text-slate-400 uppercase tracking-[0.2em] mb-8">{t('recentOrders')}</h2>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={recentOrders.slice(0, 7).reverse().map(o => ({ 
                    name: format(new Date(o.createdAt), 'dd MMM'), 
                    value: o.grandTotal 
                  }))}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={5}
                  dataKey="value"
                  animationDuration={1500}
                >
                  {recentOrders.slice(0, 7).map((_, index) => (
                    <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} stroke="transparent" />
                  ))}
                </Pie>
                <Tooltip 
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-white p-3 rounded-xl shadow-lg border border-slate-100">
                          <p className="text-[10px] font-black uppercase text-slate-400">{payload[0].payload.name}</p>
                          <p className="text-sm font-black text-slate-900">৳{payload[0].value.toLocaleString()}</p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2 uppercase tracking-tight">
            <History className="w-5 h-5 text-blue-600" />
            {t('recentOrders')}
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50">
                <th className="px-6 py-4 text-left text-[10px] font-bold text-slate-500 uppercase tracking-widest">{t('date')}</th>
                <th className="px-6 py-4 text-left text-[10px] font-bold text-slate-500 uppercase tracking-widest">{t('total')}</th>
                <th className="px-6 py-4 text-left text-[10px] font-bold text-slate-500 uppercase tracking-widest">{t('status')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {recentOrders.map((order) => (
                <tr key={order.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 text-sm text-slate-600">{format(new Date(order.createdAt), 'MMM do, yyyy')}</td>
                  <td className="px-6 py-4 text-sm font-bold text-slate-900">৳{order.grandTotal.toFixed(2)}</td>
                  <td className="px-6 py-4">
                    <span className={cn(
                      "px-3 py-1 rounded-full text-[10px] font-bold uppercase",
                      order.status === 'delivered' ? "bg-emerald-100 text-emerald-700" :
                      order.status === 'pending' ? "bg-amber-100 text-amber-700" :
                      order.status === 'cancelled' ? "bg-red-100 text-red-700" : "bg-blue-100 text-blue-700"
                    )}>
                      {t(order.status)}
                    </span>
                  </td>
                </tr>
              ))}
              {recentOrders.length === 0 && (
                <tr>
                  <td colSpan={3} className="px-6 py-8 text-center text-slate-500 italic">{t('noOrders')}</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function Contacts() {
  const { profile } = useAuth();
  const { t } = useLanguage();
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list' | 'details'>('grid');

  useEffect(() => {
    if (!profile) return;
    const unsubscribe = onSnapshot(collection(db, 'users'), (snapshot) => {
      const allUsers = snapshot.docs.map(d => ({ ...d.data(), uid: d.id } as UserProfile));
      
      // Filter based on role and status
      let filtered = allUsers.filter(u => u.status === 'approved');
      
      // Visibility logic:
      // 1. Only Owner can see Owner
      if (profile.role !== 'owner') {
        filtered = filtered.filter(u => u.role !== 'owner');
      }

      // 2. Shop Owner can only see Workers
      if (profile.role === 'shop_owner') {
        filtered = filtered.filter(u => u.role === 'worker');
      }

      // Sort by hierarchy: Owner -> Admin -> Manager -> Worker -> Shop Owner
      const roleOrder: Record<string, number> = {
        'owner': 0,
        'admin': 1,
        'manager': 2,
        'worker': 3,
        'shop_owner': 4
      };

      filtered.sort((a, b) => (roleOrder[a.role] || 99) - (roleOrder[b.role] || 99));
      
      setUsers(filtered);
      setLoading(false);
    }, (error) => handleFirestoreError(error, OperationType.LIST, 'users_contacts'));
    return () => unsubscribe();
  }, [profile]);

  if (loading) return <LoadingScreen />;

  return (
    <div className="space-y-12">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b-4 border-slate-900 pb-8">
        <div>
          <p className="label-tech mb-2">{t('contacts')}</p>
          <h1 className="text-5xl font-black text-slate-900 uppercase tracking-tighter">{t('hierarchy')}</h1>
          <p className="text-slate-500 font-bold uppercase text-xs tracking-widest mt-2">{profile?.role === 'shop_owner' ? t('onlyWorkersVisible') : t('hierarchy')}</p>
        </div>
        <div className="flex items-center bg-slate-900 p-1 rounded-none self-start">
          <button 
            onClick={() => setViewMode('grid')}
            className={cn(
              "p-2 rounded-none transition-all",
              viewMode === 'grid' ? "bg-white text-slate-900" : "text-slate-400 hover:text-white"
            )}
            title={t('gridView')}
          >
            <LayoutGrid className="w-5 h-5" />
          </button>
          <button 
            onClick={() => setViewMode('list')}
            className={cn(
              "p-2 rounded-none transition-all",
              viewMode === 'list' ? "bg-white text-slate-900" : "text-slate-400 hover:text-white"
            )}
            title={t('listView')}
          >
            <List className="w-5 h-5" />
          </button>
          <button 
            onClick={() => setViewMode('details')}
            className={cn(
              "p-2 rounded-none transition-all",
              viewMode === 'details' ? "bg-white text-slate-900" : "text-slate-400 hover:text-white"
            )}
            title={t('detailsView')}
          >
            <Contact2 className="w-5 h-5" />
          </button>
        </div>
      </header>

      {viewMode === 'grid' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-0 grid-structure">
          {users.map((user) => (
            <motion.div
              key={user.uid}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid-cell group hover:bg-slate-50 transition-all flex items-center gap-4"
            >
              <div className="w-16 h-16 border-2 border-slate-900 overflow-hidden flex-shrink-0">
                {user.photoURL ? (
                  <img src={user.photoURL} alt={user.displayName} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-400 bg-slate-50">
                    <UserCircle className="w-8 h-8" />
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-black text-slate-900 truncate uppercase tracking-tight">{user.displayName || user.email}</h3>
                <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-2">{t(user.role)}</p>
                {user.phoneNumber && (
                  <a 
                    href={`tel:${user.phoneNumber}`}
                    className="inline-flex items-center gap-2 text-xs font-black text-emerald-600 hover:text-emerald-700 transition-colors uppercase tracking-widest"
                  >
                    <Phone className="w-3 h-3" />
                    {user.phoneNumber}
                  </a>
                )}
              </div>
              {user.phoneNumber && (
                <a 
                  href={`tel:${user.phoneNumber}`}
                  className="w-10 h-10 border border-emerald-200 text-emerald-600 flex items-center justify-center hover:bg-emerald-600 hover:text-white transition-all"
                >
                  <PhoneCall className="w-4 h-4" />
                </a>
              )}
            </motion.div>
          ))}
        </div>
      )}

      {viewMode === 'list' && (
        <div className="bg-white border-2 border-slate-900 overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-900 text-white">
                <th className="p-4 text-[10px] font-black uppercase tracking-widest">{t('name')}</th>
                <th className="p-4 text-[10px] font-black uppercase tracking-widest">{t('role')}</th>
                <th className="p-4 text-[10px] font-black uppercase tracking-widest">{t('phoneNumber')}</th>
                <th className="p-4 text-[10px] font-black uppercase tracking-widest text-right">{t('actions')}</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.uid} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 border border-slate-900 overflow-hidden">
                        {user.photoURL ? (
                          <img src={user.photoURL} alt={user.displayName} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-slate-400">
                            <UserCircle className="w-4 h-4" />
                          </div>
                        )}
                      </div>
                      <span className="font-black text-slate-900 uppercase text-xs tracking-tight">{user.displayName || user.email}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest">{t(user.role)}</span>
                  </td>
                  <td className="p-4">
                    {user.phoneNumber ? (
                      <a href={`tel:${user.phoneNumber}`} className="text-xs font-black text-slate-600 hover:text-blue-600 tracking-widest">
                        {user.phoneNumber}
                      </a>
                    ) : (
                      <span className="text-slate-300">-</span>
                    )}
                  </td>
                  <td className="p-4 text-right">
                    {user.phoneNumber && (
                      <a 
                        href={`tel:${user.phoneNumber}`}
                        className="inline-flex w-8 h-8 border border-emerald-200 text-emerald-600 items-center justify-center hover:bg-emerald-600 hover:text-white transition-all"
                      >
                        <PhoneCall className="w-4 h-4" />
                      </a>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {viewMode === 'details' && (
        <div className="space-y-6">
          {users.map((user) => (
            <motion.div
              key={user.uid}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white border-2 border-slate-900 p-8 flex flex-col md:flex-row md:items-center justify-between gap-8"
            >
              <div className="flex items-center gap-8">
                <div className="w-32 h-32 border-4 border-slate-900 overflow-hidden shadow-[8px_8px_0px_0px_rgba(0,0,0,0.1)]">
                  {user.photoURL ? (
                    <img src={user.photoURL} alt={user.displayName} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-400 bg-slate-50">
                      <UserCircle className="w-16 h-16" />
                    </div>
                  )}
                </div>
                <div>
                  <h3 className="text-3xl font-black text-slate-900 uppercase tracking-tighter">{user.displayName || user.email}</h3>
                  <div className="flex items-center gap-3 mt-2">
                    <span className="px-2 py-1 bg-blue-600 text-white text-[10px] font-black uppercase tracking-widest">
                      {t(user.role)}
                    </span>
                    <span className="text-slate-400 text-[10px] font-mono font-bold uppercase tracking-widest">
                      UID: {user.uid.substring(0, 12)}
                    </span>
                  </div>
                  <div className="mt-6 flex flex-wrap gap-6">
                    {user.phoneNumber && (
                      <div className="flex items-center gap-2 text-slate-600">
                        <Phone className="w-4 h-4 text-slate-400" />
                        <span className="text-sm font-black tracking-widest">{user.phoneNumber}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2 text-slate-600">
                      <FileText className="w-4 h-4 text-slate-400" />
                      <span className="text-sm font-black uppercase tracking-widest">{user.email}</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex gap-4">
                {user.phoneNumber && (
                  <a 
                    href={`tel:${user.phoneNumber}`}
                    className="btn-industrial flex items-center gap-3 text-sm"
                  >
                    <PhoneCall className="w-5 h-5" />
                    {t('call')}
                  </a>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {users.length === 0 && (
        <div className="py-24 text-center text-slate-400 font-black uppercase tracking-[0.3em] italic border-2 border-dashed border-slate-200">
          {t('noContacts')}
        </div>
      )}
    </div>
  );
}

function ProfileSettings() {
  const { profile, user } = useAuth();
  const { t } = useLanguage();
  const { showToast } = useToast();
  const [displayName, setDisplayName] = useState(profile?.displayName || '');
  const [phoneNumber, setPhoneNumber] = useState(profile?.phoneNumber || '');
  const [photoURL, setPhotoURL] = useState(profile?.photoURL || '');
  const [accentColor, setAccentColor] = useState(profile?.accentColor || '#2563eb');
  const [updating, setUpdating] = useState(false);
  const [uploading, setUploading] = useState(false);

  const ACCENT_OPTIONS = [
    { name: 'Blue', value: '#2563eb' },
    { name: 'Emerald', value: '#10b981' },
    { name: 'Indigo', value: '#4f46e5' },
    { name: 'Purple', value: '#8b5cf6' },
    { name: 'Crimson', value: '#e11d48' },
    { name: 'Amber', value: '#f59e0b' },
  ];

  const handleProfilePicUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 1000000) {
      showToast("File size too large (max 1MB)", "error");
      return;
    }

    setUploading(true);
    try {
      const storagePath = `profiles/${user?.uid}_${Date.now()}`;
      const storageRef = ref(storage, storagePath);
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);
      setPhotoURL(url);
      showToast(t('successUploaded'));
    } catch (error) {
      const userMessage = handleStorageError(error, StorageOperationType.UPLOAD, 'profiles');
      showToast(userMessage, 'error');
    } finally {
      setUploading(false);
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !displayName.trim()) return;
    setUpdating(true);
    try {
      await updateDoc(doc(db, 'users', user.uid), {
        displayName: displayName.trim(),
        phoneNumber: phoneNumber.trim(),
        photoURL: photoURL.trim(),
        accentColor: accentColor,
        updatedAt: new Date().toISOString()
      });
      showToast(t('successUpdated'));
    } catch (error) {
      console.error("Profile update error:", error);
      showToast("Failed to update profile", "error");
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="max-w-md mx-auto space-y-8 pb-12">
      <header>
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">{t('profileSettings')}</h1>
        <p className="text-slate-500 font-medium">{t('changeName')}</p>
      </header>

      <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 space-y-8">
        <form onSubmit={handleUpdateProfile} className="space-y-6">
          <div>
            <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">{t('displayName')}</label>
            <input
              type="text"
              required
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="w-full p-4 rounded-2xl bg-slate-50 border border-slate-100 outline-none focus:ring-2 focus:ring-blue-500 font-bold text-slate-900"
            />
          </div>
          <div>
            <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">{t('phoneNumber')}</label>
            <input
              type="tel"
              required
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="w-full p-4 rounded-2xl bg-slate-50 border border-slate-100 outline-none focus:ring-2 focus:ring-blue-500 font-bold text-slate-900"
              placeholder="01XXXXXXXXX"
            />
          </div>

          {/* Accent Color Picker */}
          <div>
            <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-3">Accent Color</label>
            <div className="grid grid-cols-6 gap-3">
              {ACCENT_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setAccentColor(opt.value)}
                  className={cn(
                    "w-full aspect-square rounded-xl transition-all relative flex items-center justify-center",
                    accentColor === opt.value ? "ring-2 ring-offset-2 ring-slate-900 scale-110" : "hover:scale-105"
                  )}
                  style={{ backgroundColor: opt.value }}
                >
                  {accentColor === opt.value && <CheckCircle2 className="w-5 h-5 text-white" />}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">{t('image')} URL</label>
            <div className="flex gap-2">
              <input
                type="url"
                value={photoURL}
                onChange={(e) => setPhotoURL(e.target.value)}
                className="flex-1 p-4 rounded-2xl bg-slate-50 border border-slate-100 outline-none focus:ring-2 focus:ring-blue-500 font-bold text-slate-900"
                placeholder="https://..."
              />
              <label className={cn(
                "flex items-center justify-center p-4 bg-slate-100 rounded-2xl cursor-pointer hover:bg-slate-200 transition-colors",
                uploading && "opacity-50 cursor-not-allowed"
              )}>
                <Upload className="w-5 h-5 text-slate-600" />
                <input 
                  type="file" 
                  className="hidden" 
                  accept="image/png, image/jpeg, image/jpg" 
                  onChange={handleProfilePicUpload} 
                  disabled={uploading}
                />
              </label>
            </div>
            {uploading && <p className="text-[10px] font-bold text-blue-600 mt-1 uppercase tracking-widest animate-pulse">{t('uploading')}</p>}
          </div>

          <button
            type="submit"
            disabled={updating || !displayName.trim() || (displayName === profile?.displayName && phoneNumber === profile?.phoneNumber && photoURL === profile?.photoURL && accentColor === profile?.accentColor)}
            className="w-full bg-slate-900 text-white font-black py-4 rounded-2xl hover:bg-black transition-all shadow-xl shadow-slate-100 disabled:opacity-50 disabled:shadow-none"
            style={{ backgroundColor: accentColor }}
          >
            {updating ? t('settingUp') : t('updateProfile')}
          </button>
        </form>
      </div>
    </div>
  );
}

function UserHistory() {
  const { profile } = useAuth();
  const { t } = useLanguage();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<'day' | 'week' | 'month'>('month');

  useEffect(() => {
    if (!profile) return;
    const q = query(
      collection(db, 'orders'),
      profile.role === 'shop_owner'
        ? where('shopCode', '==', profile.shopCode)
        : where('workerUid', '==', profile.uid)
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setOrders(snapshot.docs.map(d => ({ id: d.id, ...d.data() })));
      setLoading(false);
    }, (error) => handleFirestoreError(error, OperationType.LIST, 'orders_history'));
    return () => unsubscribe();
  }, [profile]);

  if (loading) return <LoadingScreen />;

  const groupedData = () => {
    const groups: { [key: string]: any[] } = {};
    orders.forEach(order => {
      const date = new Date(order.createdAt);
      let key = '';
      if (view === 'day') key = format(date, 'yyyy-MM-dd');
      else if (view === 'week') key = `Week ${format(date, 'w, yyyy')}`;
      else key = format(date, 'MMMM yyyy');
      
      if (!groups[key]) groups[key] = [];
      groups[key].push(order);
    });
    return groups;
  };

  const data = groupedData();

  // Chart Data: Sales Trend
  const chartData = Object.entries(data).map(([key, items]) => ({
    name: key.length > 10 ? key.substring(0, 3) + ' ' + key.split(' ')[1] : key,
    sales: items.reduce((sum, i) => sum + i.grandTotal, 0)
  })).sort((a, b) => {
    if (view === 'day') return a.name.localeCompare(b.name);
    return 0; // Default sort is fine for others
  }).slice(-10);

  return (
    <div className="space-y-8 pb-12">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">{t('orderHistory')}</h1>
          <p className="text-slate-500 font-medium">{t('viewPastOrders')}</p>
        </div>
        <div className="flex bg-white p-1.5 rounded-2xl border border-slate-200 shadow-sm self-start">
          {(['day', 'week', 'month'] as const).map((v) => (
            <button
              key={v}
              onClick={() => setView(v)}
              className={cn(
                "px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all",
                view === v ? "bg-blue-600 text-white shadow-lg shadow-blue-200" : "text-slate-400 hover:text-blue-600"
              )}
            >
              {t(v)}
            </button>
          ))}
        </div>
      </header>

      {/* History Summary Chart */}
      {orders.length > 0 && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100"
        >
          <h2 className="text-sm font-black text-slate-400 uppercase tracking-[0.2em] mb-8">{t('performanceOverview')}</h2>
          <div className="h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={70}
                  paddingAngle={5}
                  dataKey="sales"
                  animationDuration={1500}
                >
                  {chartData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} stroke="transparent" />
                  ))}
                </Pie>
                <Tooltip 
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-white p-3 rounded-xl shadow-lg border border-slate-100">
                          <p className="text-[10px] font-black uppercase text-slate-400">{payload[0].payload.name}</p>
                          <p className="text-sm font-black text-slate-900">৳{payload[0].value.toLocaleString()}</p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      )}

      <div className="space-y-12">
        {Object.entries(data).length === 0 ? (
          <div className="bg-white p-12 rounded-2xl border border-slate-100 text-center text-slate-400 uppercase font-bold">
            {t('noHistory')}
          </div>
        ) : (
          Object.entries(data).sort((a, b) => b[0].localeCompare(a[0])).map(([key, items]) => (
            <div key={key} className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
              <div className="p-6 border-b border-slate-50 bg-slate-50/50 flex items-center justify-between">
                <h2 className="text-lg font-bold text-slate-900 uppercase">{key}</h2>
                <div className="text-right">
                  <p className="text-xs font-bold text-slate-400 uppercase">{t('totalSales')}</p>
                  <p className="text-xl font-bold text-blue-600">৳{items.reduce((sum, i) => sum + i.grandTotal, 0).toFixed(2)}</p>
                </div>
              </div>
              <div className="divide-y divide-slate-50">
                {items.map((order) => (
                  <div key={order.id} className="p-6 flex items-center justify-between hover:bg-slate-50 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm border border-slate-100">
                        <Store className="w-5 h-5 text-slate-400" />
                      </div>
                      <div>
                        <p className="font-bold text-slate-900">{order.shopName}</p>
                        <p className="text-xs text-slate-500">{format(new Date(order.createdAt), 'MMM d, yyyy • h:mm a')}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-slate-900">৳{order.grandTotal.toFixed(2)}</p>
                      <p className="text-[10px] font-bold text-slate-400 uppercase">{order.items.length} {t('items')}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

// --- App Navigation ---

function ProductCalculation() {
  const { t } = useLanguage();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [activePeriod, setActivePeriod] = useState(30);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'orders'), (snapshot) => {
      setOrders(snapshot.docs.map(d => ({ id: d.id, ...d.data() })) as Order[]);
      setLoading(false);
    }, (error) => handleFirestoreError(error, OperationType.LIST, 'orders_product_calc'));
    return () => unsubscribe();
  }, []);

  const getDemandForPeriod = (days: number) => {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    
    const periodOrders = orders.filter(o => new Date(o.createdAt) >= startDate);
    const productStats: Record<string, { quantity: number; amount: number }> = {};

    periodOrders.forEach(order => {
      order.items.forEach(item => {
        const key = `${item.productName} (${item.size}, G${item.grade})`;
        if (!productStats[key]) productStats[key] = { quantity: 0, amount: 0 };
        productStats[key].quantity += item.quantity;
        productStats[key].amount += item.total;
      });
    });

    return Object.entries(productStats)
      .map(([name, stats]) => ({ name, ...stats }))
      .sort((a, b) => b.quantity - a.quantity);
  };

  if (loading) return <LoadingScreen />;

  const periods = [
    { label: t('lastYear'), days: 365 },
    { label: t('last6Months'), days: 180 },
    { label: t('lastMonth'), days: 30 },
    { label: t('last15Days'), days: 15 },
    { label: t('lastWeek'), days: 7 }
  ];

  const currentData = getDemandForPeriod(activePeriod);

  return (
    <div className="space-y-8 pb-12">
      <header className="space-y-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 uppercase tracking-tighter">{t('productCalculation')}</h1>
          <p className="text-slate-500 font-bold uppercase text-xs tracking-widest mt-2 px-1">Detailed analysis of your sales performance</p>
        </div>

        {/* Period Selection Bar (2nd Row) */}
        <div className="flex flex-wrap gap-2 p-1.5 bg-slate-100 rounded-[2rem] w-fit">
          {periods.map((period) => (
            <button
              key={period.days}
              onClick={() => setActivePeriod(period.days)}
              className={`px-6 py-3 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${
                activePeriod === period.days
                  ? 'bg-slate-900 text-white shadow-xl scale-105'
                  : 'text-slate-500 hover:bg-white hover:text-slate-900'
              }`}
            >
              {period.label}
            </button>
          ))}
        </div>
      </header>

      <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden group">
        <div className="p-8 bg-slate-900 text-white flex items-center justify-between">
          <div>
            <h2 className="text-xl font-black uppercase tracking-widest flex items-center gap-3">
              <TrendingUp className="w-5 h-5 text-blue-400" />
              {periods.find(p => p.days === activePeriod)?.label}
            </h2>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mt-1 ml-8">Product Performance Data</p>
          </div>
          <div className="text-right">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Distinct Products</p>
            <p className="text-2xl font-black">{currentData.length}</p>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/50">
                <th className="p-6 text-[10px] font-black uppercase tracking-widest text-slate-400">{t('product')}</th>
                <th className="p-6 text-[10px] font-black uppercase tracking-widest text-slate-400 text-center">{t('quantity')}</th>
                <th className="p-6 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">{t('total')}</th>
                <th className="p-6 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">Trend</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {currentData.length === 0 ? (
                <tr>
                  <td colSpan={4} className="p-20 text-center">
                    <div className="flex flex-col items-center gap-4">
                      <div className="w-16 h-16 bg-slate-50 rounded-3xl flex items-center justify-center">
                        <ShoppingBag className="w-8 h-8 text-slate-200" />
                      </div>
                      <p className="text-slate-400 font-bold uppercase text-xs tracking-widest">{t('noOrders')} in this period</p>
                    </div>
                  </td>
                </tr>
              ) : (
                currentData.map((prod, idx) => (
                  <tr key={prod.name} className="hover:bg-slate-50/50 transition-colors group/row">
                    <td className="p-6">
                      <p className="font-black text-slate-900 group-hover/row:text-blue-600 transition-colors uppercase text-sm tracking-tight">{prod.name}</p>
                    </td>
                    <td className="p-6 text-center">
                      <span className="px-4 py-1.5 bg-slate-100 rounded-full text-xs font-black text-slate-600 transition-all group-hover/row:bg-blue-50 group-hover/row:text-blue-600">
                        {prod.quantity}
                      </span>
                    </td>
                    <td className="p-6 text-right">
                      <p className="font-black text-slate-900 italic text-lg">৳{prod.amount.toLocaleString()}</p>
                    </td>
                    <td className="p-6 text-right">
                       <div className="flex items-center justify-end gap-2">
                          {idx < 3 ? (
                            <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-600 text-[9px] font-black uppercase rounded-full shadow-sm border border-emerald-100">
                              <span className="w-1 h-1 bg-emerald-600 rounded-full animate-ping" />
                              High Demand
                            </div>
                          ) : idx > currentData.length - 3 ? (
                            <div className="px-3 py-1 bg-red-50 text-red-600 text-[9px] font-black uppercase rounded-full border border-red-100">
                              Low Volume
                            </div>
                          ) : (
                            <div className="px-3 py-1 bg-slate-50 text-slate-400 text-[9px] font-black uppercase rounded-full border border-slate-100">
                              Stable
                            </div>
                          )}
                       </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function AppRoutes() {
  const { user, profile, loading, hasPermission, connectionError } = useAuth();
  const { t } = useLanguage();

  if (loading) return <LoadingScreen />;

  if (connectionError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
        <div className="max-w-md w-full bg-white p-8 rounded-3xl shadow-xl border border-red-100 text-center space-y-6">
          <div className="w-16 h-16 bg-red-50 text-red-600 rounded-2xl flex items-center justify-center mx-auto">
            <AlertCircle className="w-8 h-8" />
          </div>
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-slate-900 leading-tight">Database Connection Error</h2>
            <p className="text-slate-500 font-medium">{connectionError}</p>
            <div className="bg-slate-50 p-4 rounded-2xl text-left">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Troubleshooting:</p>
              <ul className="text-xs text-slate-600 space-y-1 list-disc ml-4">
                <li>Check your internet connection.</li>
                <li>Verify your project hasn't reached its Firebase quota.</li>
                <li>Wait a few moments and try again.</li>
              </ul>
            </div>
          </div>
          <button 
            onClick={() => window.location.reload()}
            className="w-full py-4 bg-slate-900 text-white font-black rounded-2xl hover:bg-black transition-all shadow-lg active:scale-95"
          >
            Retry Connection
          </button>
        </div>
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/catalog" element={<PublicCatalog />} />
      
      {!user ? (
        <Route path="*" element={<LoginScreen />} />
      ) : !profile ? (
        <Route path="*" element={<RegistrationScreen />} />
      ) : profile.status === 'pending' && profile.role !== 'admin' ? (
        <Route path="*" element={<PendingApproval />} />
      ) : profile.status === 'suspended' ? (
        <Route path="*" element={<SuspendedScreen />} />
      ) : (
        <Route path="*" element={
          <MainLayout>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/orders" element={<OrderList />} />
              <Route path="/orders/:id" element={<OrderDetails />} />
              <Route path="/history" element={<UserHistory />} />
              <Route path="/shops/:code" element={<ShopDetails />} />
              <Route path="/catalog" element={<PublicCatalog />} />
              <Route path="/profile" element={<ProfileSettings />} />
              <Route path="/contacts" element={<Contacts />} />
              
              {profile?.role === 'shop_owner' && (
                <Route path="/shop-dashboard" element={<ShopOwnerDashboard />} />
              )}
              
              {/* Permission-based Routes */}
              {hasPermission('CREATE_ORDERS') && (
                <Route path="/new-order" element={<NewOrder />} />
              )}

              {hasPermission('MANAGE_PRODUCTS') && (
                <Route path="/products" element={<ProductManagement />} />
              )}

              {hasPermission('MANAGE_SHOPS') && (
                <Route path="/shops" element={<ShopManagement />} />
              )}

              {hasPermission('VIEW_REPORTS') && (
                <Route path="/reports" element={<Reports />} />
              )}

              {hasPermission('VIEW_REPORTS') && (
                <Route path="/product-calculation" element={<ProductCalculation />} />
              )}

              {hasPermission('MANAGE_USERS') && (
                <Route path="/users" element={<UserManagement />} />
              )}

              {hasPermission('VIEW_ACTIVITY_LOG') && (
                <Route path="/activity" element={<ActivityLog />} />
              )}

              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </MainLayout>
        } />
      )}
    </Routes>
  );
}

export default function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <LanguageProvider>
          <BrandingProvider>
            <NotificationProvider>
              <Router>
                <AppRoutes />
              </Router>
            </NotificationProvider>
          </BrandingProvider>
        </LanguageProvider>
      </AuthProvider>
    </ToastProvider>
  );
}
