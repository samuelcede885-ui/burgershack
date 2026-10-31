import { createContext, useCallback, useContext, useMemo, useState } from "react";

const OrderContext = createContext({ open: () => {}, close: () => {}, state: null });

/** Estado global del panel de pedidos / catering.
 *  state = { mode: "order" | "catering", product?: string } */
export function OrderProvider({ children }) {
  const [state, setState] = useState(null);
  const open = useCallback((opts = {}) => setState({ mode: "order", ...opts }), []);
  const close = useCallback(() => setState(null), []);
  const value = useMemo(() => ({ open, close, state }), [open, close, state]);
  return <OrderContext.Provider value={value}>{children}</OrderContext.Provider>;
}

export const useOrder = () => useContext(OrderContext);
