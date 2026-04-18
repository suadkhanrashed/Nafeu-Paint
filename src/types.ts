export type UserRole = 'owner' | 'admin' | 'manager' | 'worker' | 'shop_owner';
export type UserStatus = 'pending' | 'approved' | 'suspended';
export type OrderStatus = 'pending' | 'in_transport' | 'delivered' | 'cancelled' | 'received';
export type PaymentStatus = 'unpaid' | 'partially_paid' | 'paid';

export type Permission = 
  | 'MANAGE_USERS' 
  | 'MANAGE_ROLES' 
  | 'MANAGE_PERMISSIONS'
  | 'MANAGE_SHOPS' 
  | 'MANAGE_PRODUCTS' 
  | 'CREATE_ORDERS' 
  | 'VIEW_ORDERS' 
  | 'UPDATE_ORDER_STATUS' 
  | 'MANAGE_PAYMENTS' 
  | 'VIEW_REPORTS' 
  | 'VIEW_ACTIVITY_LOG'
  | 'MANAGE_CATALOG'
  | 'VIEW_DASHBOARD'
  | 'MARK_ORDER_RECEIVED'
  | 'VIEW_MY_SHOP'
  | 'VIEW_SHOPS'
  | 'DELETE_ORDER'
  | 'EDIT_ORDER'
  | 'DELETE_PRODUCT'
  | 'DELETE_SHOP'
  | 'MANAGE_BRANDING';

export interface RolePermissions {
  role: UserRole;
  permissions: Permission[];
}

export interface UserProfile {
  uid: string;
  email: string;
  displayName?: string;
  phoneNumber?: string;
  role: UserRole;
  status: UserStatus;
  shopCode?: string;
  assignedAreas?: string[]; // Areas assigned to the worker
  permissionStatus?: 'none' | 'pending' | 'granted' | 'denied';
  requestedAt?: string;
  createdAt: string;
  reAccessRequested?: boolean;
  customPermissions?: Permission[]; // For fine-grained user-level overrides
  photoURL?: string;
}

export interface Activity {
  id: string;
  uid: string;
  userName: string;
  action: string;
  details: string;
  timestamp: string;
}

export interface Shop {
  code: string;
  name: string;
  area: string;
  ownerEmail?: string;
  totalDue: number;
  createdAt: string;
}

export interface Product {
  id: string;
  name: string;
  sizes: string[];
  grade: '1' | '2';
  baseRate?: number;
  category?: string;
  imageUrl?: string;
  threeDPictureURL?: string;
}

export interface OrderItem {
  productName: string;
  size: string;
  grade: '1' | '2';
  quantity: number;
  rate: number;
  total: number;
}

export interface OrderModification {
  uid: string;
  userName: string;
  timestamp: string;
  action: string;
}

export interface Order {
  id: string;
  shopCode: string;
  shopName: string;
  workerUid: string;
  workerName: string;
  items: OrderItem[];
  grandTotal: number;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  amountPaid: number;
  dueAmount: number;
  receivedByWorker?: boolean;
  createdAt: string;
  updatedAt: string;
  modificationHistory?: OrderModification[];
}

export interface Transaction {
  id: string;
  shopCode: string;
  amount: number;
  discount?: number;
  type: 'payment' | 'due_addition' | 'discount';
  workerUid: string;
  workerName: string;
  date: string;
  note?: string;
}

export interface OrderRequest {
  id: string;
  shopCode: string;
  shopName: string;
  items: {
    productId: string;
    productName: string;
    quantity: number;
  }[];
  status: 'pending' | 'converted' | 'cancelled';
  createdAt: string;
}

export interface AreaRequest {
  id: string;
  workerUid: string;
  workerName: string;
  requestedArea: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  updatedAt?: string;
}
