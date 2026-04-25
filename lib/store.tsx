"use client";

/**
 * AppStore — Global in-memory state for the entire dashboard.
 * Provides: products, rawMaterials, orders, purchases, customers, suppliers
 * Every CRUD operation goes through this context so all pages stay in sync.
 */

import React, { createContext, useContext, useReducer, useCallback } from "react";
import {
  snackProducts,
  rawMaterials as initialMaterials,
  ordersHistory,
  suppliers as initialSuppliers,
  customers as initialCustomers,
  boms as initialBoms,
  Product,
  RawMaterial,
  Order,
  Supplier,
  Customer,
  BOM,
  ProductionRun,
  productionRuns as initialProductionRuns,
} from "@/lib/snack-mock-data";

// ─── Purchase type ──────────────────────────────────────────────────────────
export interface Purchase {
  id: string;
  supplierId: string;
  supplierName: string;
  materialId: string;
  materialName: string;
  quantity: number;
  unit: string;
  unitCost: number;
  totalCost: number;
  status: "Processing" | "In Transit" | "Delivered" | "Cancelled";
  date: string;
}

const initialPurchases: Purchase[] = [
  { id: "PO001", supplierId: "SUP001", supplierName: "Global Grains Ltd", materialId: "RM001", materialName: "Corn Meal", quantity: 500, unit: "kg", unitCost: 50, totalCost: 25000, status: "Delivered", date: "2026-04-20" },
  { id: "PO002", supplierId: "SUP002", supplierName: "Pure Oil Co", materialId: "RM002", materialName: "Palm Oil", quantity: 200, unit: "litre", unitCost: 90, totalCost: 18000, status: "In Transit", date: "2026-04-21" },
  { id: "PO003", supplierId: "SUP003", supplierName: "Spice Masters", materialId: "RM004", materialName: "Masala Mix", quantity: 50, unit: "kg", unitCost: 250, totalCost: 12500, status: "Delivered", date: "2026-04-18" },
  { id: "PO004", supplierId: "SUP004", supplierName: "Agro Foods", materialId: "RM003", materialName: "Potato", quantity: 1000, unit: "kg", unitCost: 20, totalCost: 20000, status: "Processing", date: "2026-04-22" },
];

// ─── State shape ────────────────────────────────────────────────────────────
interface AppState {
  products: Product[];
  materials: RawMaterial[];
  orders: Order[];
  purchases: Purchase[];
  customers: Customer[];
  suppliers: Supplier[];
  boms: BOM[];
  productionRuns: ProductionRun[];
}

const initialState: AppState = {
  products: snackProducts,
  materials: initialMaterials,
  orders: ordersHistory,
  purchases: initialPurchases,
  customers: initialCustomers,
  suppliers: initialSuppliers,
  boms: initialBoms,
  productionRuns: initialProductionRuns,
};

// ─── Actions ────────────────────────────────────────────────────────────────
type Action =
  // Products
  | { type: "ADD_PRODUCT"; payload: Product }
  | { type: "UPDATE_PRODUCT"; payload: Product }
  | { type: "DELETE_PRODUCT"; payload: string }
  // Materials
  | { type: "ADD_MATERIAL"; payload: RawMaterial }
  | { type: "UPDATE_MATERIAL"; payload: RawMaterial }
  | { type: "DELETE_MATERIAL"; payload: string }
  // Orders
  | { type: "ADD_ORDER"; payload: Order }
  | { type: "UPDATE_ORDER"; payload: Order }
  | { type: "DELETE_ORDER"; payload: string }
  | { type: "UPDATE_ORDER_STATUS"; payload: { id: string; orderStatus: Order["orderStatus"]; paymentStatus?: Order["paymentStatus"] } }
  // Purchases
  | { type: "ADD_PURCHASE"; payload: Purchase }
  | { type: "UPDATE_PURCHASE_STATUS"; payload: { id: string; status: Purchase["status"] } }
  | { type: "DELETE_PURCHASE"; payload: string }
  // Customers
  | { type: "ADD_CUSTOMER"; payload: Customer }
  | { type: "UPDATE_CUSTOMER"; payload: Customer }
  | { type: "DELETE_CUSTOMER"; payload: string }
  // Suppliers
  | { type: "ADD_SUPPLIER"; payload: Supplier }
  | { type: "UPDATE_SUPPLIER"; payload: Supplier }
  | { type: "DELETE_SUPPLIER"; payload: string }
  // BOMs
  | { type: "ADD_BOM"; payload: BOM }
  | { type: "UPDATE_BOM"; payload: BOM }
  | { type: "DELETE_BOM"; payload: string }
  // Production Runs
  | { type: "ADD_PRODUCTION_RUN"; payload: ProductionRun }
  | { type: "UPDATE_PRODUCTION_RUN"; payload: ProductionRun }
  | { type: "DELETE_PRODUCTION_RUN"; payload: string };

function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    // ── Products ──
    case "ADD_PRODUCT":
      return { ...state, products: [action.payload, ...state.products] };
    case "UPDATE_PRODUCT":
      return { ...state, products: state.products.map((p) => p.product_id === action.payload.product_id ? action.payload : p) };
    case "DELETE_PRODUCT":
      return { ...state, products: state.products.filter((p) => p.product_id !== action.payload) };

    // ── Materials ──
    case "ADD_MATERIAL":
      return { ...state, materials: [action.payload, ...state.materials] };
    case "UPDATE_MATERIAL":
      return { ...state, materials: state.materials.map((m) => m.material_id === action.payload.material_id ? action.payload : m) };
    case "DELETE_MATERIAL":
      return { ...state, materials: state.materials.filter((m) => m.material_id !== action.payload) };

    // ── Orders ──
    case "ADD_ORDER":
      return { ...state, orders: [action.payload, ...state.orders] };
    case "UPDATE_ORDER":
      return { ...state, orders: state.orders.map((o) => o.id === action.payload.id ? action.payload : o) };
    case "DELETE_ORDER":
      return { ...state, orders: state.orders.filter((o) => o.id !== action.payload) };
    case "UPDATE_ORDER_STATUS":
      return {
        ...state,
        orders: state.orders.map((o) =>
          o.id === action.payload.id
            ? { ...o, orderStatus: action.payload.orderStatus, ...(action.payload.paymentStatus ? { paymentStatus: action.payload.paymentStatus } : {}) }
            : o
        ),
      };

    // ── Purchases ──
    case "ADD_PURCHASE":
      return { ...state, purchases: [action.payload, ...state.purchases] };
    case "UPDATE_PURCHASE_STATUS":
      return { ...state, purchases: state.purchases.map((p) => p.id === action.payload.id ? { ...p, status: action.payload.status } : p) };
    case "DELETE_PURCHASE":
      return { ...state, purchases: state.purchases.filter((p) => p.id !== action.payload) };

    // ── Customers ──
    case "ADD_CUSTOMER":
      return { ...state, customers: [action.payload, ...state.customers] };
    case "UPDATE_CUSTOMER":
      return { ...state, customers: state.customers.map((c) => c.id === action.payload.id ? action.payload : c) };
    case "DELETE_CUSTOMER":
      return { ...state, customers: state.customers.filter((c) => c.id !== action.payload) };

    // ── Suppliers ──
    case "ADD_SUPPLIER":
      return { ...state, suppliers: [action.payload, ...state.suppliers] };
    case "UPDATE_SUPPLIER":
      return { ...state, suppliers: state.suppliers.map((s) => s.id === action.payload.id ? action.payload : s) };
    case "DELETE_SUPPLIER":
      return { ...state, suppliers: state.suppliers.filter((s) => s.id !== action.payload) };

    // ── BOMs ──
    case "ADD_BOM":
      return { ...state, boms: [action.payload, ...state.boms] };
    case "UPDATE_BOM":
      return { ...state, boms: state.boms.map((b) => b.id === action.payload.id ? action.payload : b) };
    case "DELETE_BOM":
      return { ...state, boms: state.boms.filter((b) => b.id !== action.payload) };

    // ── Production Runs ──
    case "ADD_PRODUCTION_RUN":
      return { ...state, productionRuns: [action.payload, ...state.productionRuns] };
    case "UPDATE_PRODUCTION_RUN":
      return { ...state, productionRuns: state.productionRuns.map((p) => p.id === action.payload.id ? action.payload : p) };
    case "DELETE_PRODUCTION_RUN":
      return { ...state, productionRuns: state.productionRuns.filter((p) => p.id !== action.payload) };

    default:
      return state;
  }
}

// ─── Context ────────────────────────────────────────────────────────────────
interface AppContextValue {
  state: AppState;
  dispatch: React.Dispatch<Action>;
  // Convenience helpers
  addProduct: (p: Product) => void;
  updateProduct: (p: Product) => void;
  deleteProduct: (id: string) => void;
  addMaterial: (m: RawMaterial) => void;
  updateMaterial: (m: RawMaterial) => void;
  deleteMaterial: (id: string) => void;
  addOrder: (o: Order) => void;
  updateOrderStatus: (id: string, orderStatus: Order["orderStatus"], paymentStatus?: Order["paymentStatus"]) => void;
  deleteOrder: (id: string) => void;
  addPurchase: (p: Purchase) => void;
  updatePurchaseStatus: (id: string, status: Purchase["status"]) => void;
  deletePurchase: (id: string) => void;
  addCustomer: (c: Customer) => void;
  updateCustomer: (c: Customer) => void;
  deleteCustomer: (id: string) => void;
  addSupplier: (s: Supplier) => void;
  deleteSupplier: (id: string) => void;
  addBom: (b: BOM) => void;
  updateBom: (b: BOM) => void;
  deleteBom: (id: string) => void;
  addProductionRun: (p: ProductionRun) => void;
  updateProductionRun: (p: ProductionRun) => void;
  deleteProductionRun: (id: string) => void;
  // Computed
  totalRevenue: number;
  lowStockCount: number;
  pendingOrdersCount: number;
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const addProduct    = useCallback((p: Product) => dispatch({ type: "ADD_PRODUCT", payload: p }), []);
  const updateProduct = useCallback((p: Product) => dispatch({ type: "UPDATE_PRODUCT", payload: p }), []);
  const deleteProduct = useCallback((id: string) => dispatch({ type: "DELETE_PRODUCT", payload: id }), []);

  const addMaterial    = useCallback((m: RawMaterial) => dispatch({ type: "ADD_MATERIAL", payload: m }), []);
  const updateMaterial = useCallback((m: RawMaterial) => dispatch({ type: "UPDATE_MATERIAL", payload: m }), []);
  const deleteMaterial = useCallback((id: string) => dispatch({ type: "DELETE_MATERIAL", payload: id }), []);

  const addOrder = useCallback((o: Order) => dispatch({ type: "ADD_ORDER", payload: o }), []);
  const updateOrderStatus = useCallback(
    (id: string, orderStatus: Order["orderStatus"], paymentStatus?: Order["paymentStatus"]) =>
      dispatch({ type: "UPDATE_ORDER_STATUS", payload: { id, orderStatus, paymentStatus } }),
    []
  );
  const deleteOrder = useCallback((id: string) => dispatch({ type: "DELETE_ORDER", payload: id }), []);

  const addPurchase = useCallback((p: Purchase) => dispatch({ type: "ADD_PURCHASE", payload: p }), []);
  const updatePurchaseStatus = useCallback(
    (id: string, status: Purchase["status"]) => dispatch({ type: "UPDATE_PURCHASE_STATUS", payload: { id, status } }),
    []
  );
  const deletePurchase = useCallback((id: string) => dispatch({ type: "DELETE_PURCHASE", payload: id }), []);

  const addCustomer    = useCallback((c: Customer) => dispatch({ type: "ADD_CUSTOMER", payload: c }), []);
  const updateCustomer = useCallback((c: Customer) => dispatch({ type: "UPDATE_CUSTOMER", payload: c }), []);
  const deleteCustomer = useCallback((id: string) => dispatch({ type: "DELETE_CUSTOMER", payload: id }), []);

  const addSupplier    = useCallback((s: Supplier) => dispatch({ type: "ADD_SUPPLIER", payload: s }), []);
  const deleteSupplier = useCallback((id: string) => dispatch({ type: "DELETE_SUPPLIER", payload: id }), []);

  const addBom    = useCallback((b: BOM) => dispatch({ type: "ADD_BOM", payload: b }), []);
  const updateBom = useCallback((b: BOM) => dispatch({ type: "UPDATE_BOM", payload: b }), []);
  const deleteBom = useCallback((id: string) => dispatch({ type: "DELETE_BOM", payload: id }), []);

  const addProductionRun    = useCallback((p: ProductionRun) => dispatch({ type: "ADD_PRODUCTION_RUN", payload: p }), []);
  const updateProductionRun = useCallback((p: ProductionRun) => dispatch({ type: "UPDATE_PRODUCTION_RUN", payload: p }), []);
  const deleteProductionRun = useCallback((id: string) => dispatch({ type: "DELETE_PRODUCTION_RUN", payload: id }), []);

  // Computed values (memoized via inline computation — small dataset)
  const totalRevenue       = state.orders.reduce((s, o) => s + o.totalAmount, 0);
  const lowStockCount      = state.materials.filter((m) => m.current_stock < 50).length + state.products.filter((p) => p.stock_quantity <= 0).length;
  const pendingOrdersCount = state.orders.filter((o) => o.orderStatus === "Pending" || o.orderStatus === "Confirmed").length;

  return (
    <AppContext.Provider value={{
      state, dispatch,
      addProduct, updateProduct, deleteProduct,
      addMaterial, updateMaterial, deleteMaterial,
      addOrder, updateOrderStatus, deleteOrder,
      addPurchase, updatePurchaseStatus, deletePurchase,
      addCustomer, updateCustomer, deleteCustomer,
      addSupplier, deleteSupplier,
      addBom, updateBom, deleteBom,
      addProductionRun, updateProductionRun, deleteProductionRun,
      totalRevenue, lowStockCount, pendingOrdersCount,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppStore() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useAppStore must be used within <AppProvider>");
  return ctx;
}
