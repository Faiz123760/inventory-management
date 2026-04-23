export interface RawMaterial {
  material_id: string;
  name: string;
  unit: 'kg' | 'litre' | 'pcs';
  current_stock: number;
  cost_per_unit: number;
}

export interface Product {
  product_id: string;
  name: string;
  category: 'dalmoth' | 'chips';
  unit: string;
  selling_price: number;
  sku: number;
  stock_quantity: number;
  status: string;
  image: string;
}

export interface StockLog {
  id: string;
  date: string;
  item: string;
  type: string;
  quantity: string;
  reason: string;
  user: string;
}

export interface BOMItem {
  material_id: string;
  name: string;
  quantity: number;
  unit: string;
  cost: number;
}

export interface BOM {
  id: string;
  product_id: string;
  product_name: string;
  items: BOMItem[];
  total_cost: number;
  status: 'Active' | 'Draft' | 'Archived';
  last_updated: string;
}

export const boms: BOM[] = [
  {
    id: "BOM-001",
    product_id: "PR001",
    product_name: "Royal Dalmoth Mix",
    total_cost: 45.50,
    status: "Active",
    last_updated: "2026-04-20",
    items: [
      { material_id: "RM001", name: "Corn Meal", quantity: 0.5, unit: "kg", cost: 25.00 },
      { material_id: "RM002", name: "Palm Oil", quantity: 0.2, unit: "litre", cost: 18.00 },
      { material_id: "RM004", name: "Masala Mix", quantity: 0.01, unit: "kg", cost: 2.50 },
    ]
  },
  {
    id: "BOM-002",
    product_id: "PR002",
    product_name: "Classic Salted Chips",
    total_cost: 12.80,
    status: "Active",
    last_updated: "2026-04-18",
    items: [
      { material_id: "RM003", name: "Potato", quantity: 0.4, unit: "kg", cost: 8.00 },
      { material_id: "RM002", name: "Palm Oil", quantity: 0.05, unit: "litre", cost: 4.50 },
      { material_id: "RM005", name: "Packaging Bags", quantity: 1, unit: "pcs", cost: 0.30 },
    ]
  }
];

export interface Supplier {
  id: string;
  name: string;
  contact: string;
  phone: string;
  email: string;
}

export const snackMetrics = [
  { label: "Total Raw Materials", value: "4,250 kg", change: "+12% from last month", icon: "box" },
  { label: "Finished Products", value: "12,840 units", change: "+5% from last week", icon: "package" },
  { label: "Low Stock Alerts", value: "12 items", change: "4 critical items", icon: "alert" },
  { label: "Expiring Products", value: "8 batches", change: "Within next 7 days", icon: "clock" },
  { label: "Daily Orders", value: "₹ 84,200", change: "+18% vs yesterday", icon: "trending-up" },
];

export const stockTrendsData = [
  { name: "Mon", raw: 4000, finished: 2400 },
  { name: "Tue", raw: 3000, finished: 1398 },
  { name: "Wed", raw: 2000, finished: 9800 },
  { name: "Thu", raw: 2780, finished: 3908 },
  { name: "Fri", raw: 1890, finished: 4800 },
  { name: "Sat", raw: 2390, finished: 3800 },
  { name: "Sun", raw: 3490, finished: 4300 },
];

export const weeklyActivity = [
  { day: "Mon", value: 4200 },
  { day: "Tue", value: 3800 },
  { day: "Wed", value: 5100 },
  { day: "Thu", value: 4600 },
  { day: "Fri", value: 5900 },
  { day: "Sat", value: 4100 },
  { day: "Sun", value: 3200 },
];



export const recentPurchases = [
  { id: "P001", supplier: "Global Grains Ltd", item: "Corn Meal", quantity: "500 kg", cost: "₹ 25,000", status: "Delivered" },
  { id: "P002", supplier: "Pure Oil Co", item: "Palm Oil", quantity: "200 L", cost: "₹ 18,000", status: "In Transit" },
  { id: "P003", supplier: "Spice Masters", item: "Masala Mix", quantity: "50 kg", cost: "₹ 12,500", status: "Delivered" },
  { id: "P004", supplier: "Agro Foods", item: "Potato", quantity: "1000 kg", cost: "₹ 20,000", status: "Processing" },
];

export const topSellingProducts = [
  { name: "Bhujia Sev", orders: "1,200 units", revenue: "₹ 24,000", trend: "+12%" },
  { name: "Potato Chips Classic Salted", orders: "950 units", revenue: "₹ 19,000", trend: "+8%" },
  { name: "Dalmoth Chilli Chatka", orders: "800 units", revenue: "₹ 16,000", trend: "+5%" },
  { name: "Banana Chips", orders: "600 units", revenue: "₹ 15,000", trend: "-2%" },
];

export const lowStockItems = [
  { name: "Palm Oil", current: "45 L", min: "100 L", status: "Critical" },
  { name: "Masala Mix", current: "12 kg", min: "20 kg", status: "Low" },
  { name: "Packaging Film", current: "5 rolls", min: "15 rolls", status: "Critical" },
  { name: "Salt", current: "25 kg", min: "50 kg", status: "Low" },
];

export const rawMaterials: RawMaterial[] = [
  { material_id: "RM001", name: "Corn Meal", current_stock: 1200, unit: "kg", cost_per_unit: 50 },
  { material_id: "RM002", name: "Palm Oil", current_stock: 45, unit: "litre", cost_per_unit: 90 },
  { material_id: "RM003", name: "Potato", current_stock: 800, unit: "kg", cost_per_unit: 20 },
  { material_id: "RM004", name: "Masala Mix", current_stock: 12, unit: "kg", cost_per_unit: 250 },
  { material_id: "RM005", name: "Packaging Bags", current_stock: 500, unit: "pcs", cost_per_unit: 5 },
];

export const snackProducts: Product[] = [
  { product_id: "PR001", name: "Royal Dalmoth Mix", category: "dalmoth", stock_quantity: 450, unit: "packets", selling_price: 120, sku: 12, status: "In Stock", image: "/products/kurkure.png" },
  { product_id: "PR002", name: "Classic Salted Chips", category: "chips", stock_quantity: 320, unit: "packets", selling_price: 25, sku: 24, status: "In Stock", image: "/products/chips.png" },
  { product_id: "PR003", name: "Spicy Masala Dalmoth", category: "dalmoth", stock_quantity: 15, unit: "packets", selling_price: 80, sku: 12, status: "Low Stock", image: "/products/kurkure.png" },
  { product_id: "PR004", name: "Tomato Tango Chips", category: "chips", stock_quantity: 210, unit: "packets", selling_price: 30, sku: 24, status: "In Stock", image: "/products/chips.png" },
  { product_id: "PR005", name: "Peri Peri Chips", category: "chips", stock_quantity: 0, unit: "packets", selling_price: 35, sku: 24, status: "Out of Stock", image: "/products/chips.png" },
];

export const stockLogs: StockLog[] = [
  { id: "LOG001", date: "2026-04-22 10:30", item: "Corn Meal", type: "Inflow", quantity: "+500 kg", reason: "Purchase P001", user: "Admin" },
  { id: "LOG002", date: "2026-04-22 09:15", item: "Kurkure Masala Munch", type: "Outflow", quantity: "-150 units", reason: "Order Batch #224", user: "Operator" },
  { id: "LOG003", date: "2026-04-21 16:45", item: "Palm Oil", type: "Outflow", quantity: "-20 L", reason: "Production Run #45", user: "Production Lead" },
  { id: "LOG004", date: "2026-04-21 14:20", item: "Potato Chips", type: "Adjustment", quantity: "+5 units", reason: "Inventory Count Correction", user: "Admin" },
];

export const suppliers: Supplier[] = [
  { id: "SUP001", name: "Global Grains Ltd", contact: "John Doe", phone: "+91 98765 00111", email: "contact@globalgrains.com" },
  { id: "SUP002", name: "Pure Oil Co", contact: "Sarah Smith", phone: "+91 98765 00222", email: "sales@pureoil.co" },
  { id: "SUP003", name: "Spice Masters", contact: "Rajesh Kumar", phone: "+91 98765 00333", email: "info@spicemasters.in" },
  { id: "SUP004", name: "Agro Foods", contact: "Amit Patel", phone: "+91 98765 00444", email: "bulk@agrofoods.com" },
];



export interface Customer {
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  location: string;
  total_orders: number;
  total_spent: number;
  status: 'Active' | 'Inactive';
  last_order: string;
}

export const customers: Customer[] = [
  {
    id: "CL001",
    name: "Rajesh Kumar",
    company: "Kumar Supermarket",
    email: "rajesh@kumar.com",
    phone: "+91 98765 11223",
    location: "Mumbai, MH",
    total_orders: 45,
    total_spent: 154200,
    status: "Active",
    last_order: "2026-04-20"
  },
  {
    id: "CL002",
    name: "Suresh Mehra",
    company: "Mehra & Sons",
    email: "suresh@mehra.in",
    phone: "+91 98765 22334",
    location: "Delhi, DL",
    total_orders: 12,
    total_spent: 42500,
    status: "Active",
    last_order: "2026-04-15"
  },
  {
    id: "CL003",
    name: "Anita Singh",
    company: "Fresh Foods Pvt Ltd",
    email: "anita@freshfoods.com",
    phone: "+91 98765 33445",
    location: "Bangalore, KA",
    total_orders: 89,
    total_spent: 320000,
    status: "Active",
    last_order: "2026-04-22"
  },

];

export const ordersHistory = [
  { id: "SL001", date: "2026-04-22", product: "Bhujia Sev", quantity: "150 units", revenue: "₹ 3,000", payment: "UIP", status: "Completed" },
  { id: "SL002", date: "2026-04-22", product: "Potato Chips Classic Salted", quantity: "80 units", revenue: "₹ 2,000", payment: "Cash", status: "Completed" },
  { id: "SL003", date: "2026-04-21", product: "Tomato Tango Chips", quantity: "120 units", revenue: "₹ 3,000", payment: "Card", status: "Completed" },
  { id: "SL004", date: "2026-04-21", product: "Banana Chips Spicy", quantity: "200 units", revenue: "₹ 6,000", payment: "UIP", status: "Completed" },
];
