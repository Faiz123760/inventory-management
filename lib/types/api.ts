export interface ApiEnvelope<T> {
  status: boolean;
  message: string;
  data: T;
}

export interface BaseEntity {
  _id: string;
  createdAt: string;
  updatedAt: string;
}

export type UserRole = "admin" | "customer" | string;

export interface AuthLoginRequest {
  email: string;
  password: string;
}

export interface AuthLoginResponse {
  accessToken: string;
  userRole: UserRole;
}

export interface AuthRecord extends BaseEntity {
  email: string;
  userRole: UserRole;
}

export interface CreateAuthRecordRequest {
  key?: string;
  value?: string;
  type?: string;
  email?: string;
  password?: string;
  userRole?: UserRole;
}

export interface Category extends BaseEntity {
  name: string;
  type: "mainCategory" | string;
  image?: string;
}

export interface CreateCategoryRequest {
  name: string;
  image?: string;
}

export interface UpdateCategoryRequest {
  name?: string;
  image?: string;
}

export interface Sweet extends BaseEntity {
  name: string;
  description: string;
  price: number;
  weight: number;
  currency: string;
  categories: string[] | Category[];
  images: string[];
  slug: string;
  activeStatus: "active" | "inactive" | string;
  averageRating: number;
  totalReviews: number;
  totalRatings: number;
  deletedAt: string | null;
}

export interface CreateSweetRequest {
  name: string;
  description: string;
  price: number;
  weight: number;
  currency: string;
  categories: string[];
  images: string[];
  quantity: number;
  lowStockThreshold: number;
}

export interface UpdateSweetRequest extends Partial<CreateSweetRequest> {}

export interface Inventory extends BaseEntity {
  sweet: Sweet;
  quantity: number;
  lowStockThreshold: number;
}

export interface UpdateInventoryRequest {
  quantity?: number;
  lowStockThreshold?: number;
}

export interface CartItem extends BaseEntity {
  customerId: { _id: string; fullName?: string; email?: string } | string;
  sweet: Sweet | string;
  quantity: number;
  status: "checkout" | "pending" | "rejected" | "delivered" | null;
}

export interface CreateCartItemRequest {
  user: string;
  sweet: string;
  quantity: number;
}

export interface UpdateCartItemRequest {
  quantity: number;
}

export type PaymentMethod = "cod";
export type PaymentStatus = "pending" | "paid" | "failed";

export interface OrderPayment {
  method: PaymentMethod;
  status: PaymentStatus;
}

export interface OrderTotals {
  subtotal: number;
  discount: number;
  shippingFee: number;
  totalAmount: number;
  totalHandlingFee?: number;
}

export interface OrderItem extends BaseEntity {
  sweet: string | Sweet;
  quantity: number;
  price: number;
  total: number;
}

export interface ShippingAddress {
  name: string;
  phone: string;
  pincode: string;
  state: string;
  city: string;
  addressLine1: string;
  addressLine2?: string;
  landmark?: string;
}

export interface Order extends BaseEntity {
  user: {
    _id: string;
    email: string;
  };
  shippingAddress: ShippingAddress;
  items: OrderItem[];
  totals: OrderTotals;
  status: "checkout" | "pending" | "rejected" | "delivered" | string;
  payment: string;
}

export interface CreateOrderRequest {
  payment: OrderPayment;
  totals: OrderTotals;
  items: Array<{ sweet: string; quantity: number }>;
  address: string;
}

export interface UpdateOrderRequest {
  status?: string;
  payment?: Partial<OrderPayment>;
}

export interface Customer extends BaseEntity {
  fullName?: string;
  email?: string;
  phone?: string;
  userRole?: UserRole;
  addresses?: Address[];
}

export interface CreateCustomerRequest {
  fullName: string;
  email: string;
  password: string;
  phone: string;
}

export interface UpdateCustomerRequest {
  fullName?: string;
  email?: string;
  phone?: string;
}

export interface Address extends BaseEntity {
  customer?: string;
  customerId?: string;
  fullName: string;
  phone: string;
  pincode: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  country: string;
  landmark?: string;
  isDefault: boolean;
}

export interface CreateAddressRequest {
  fullName: string;
  phone: string;
  pincode: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  country: string;
  landmark?: string;
  isDefault: boolean;
}

export interface Banner extends BaseEntity {
  bannerText: string | null;
}

export interface UpdateBannerRequest {
  bannerText: string;
}
