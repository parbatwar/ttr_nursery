import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { useAuth } from "./AuthContext";
import { cartStorage } from "../lib/storage";
import {
  addToCart,
  getCart,
  removeCartItem,
  updateCartItem,
} from "../services/cart";

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const { isLoggedIn } = useAuth();

  const [items, setItems] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");

  const itemCount = items.reduce((total, item) => total + item.quantity, 0);
  const subtotal = items.reduce(
    (total, item) => total + Number(item.unit_price) * item.quantity,
    0,
  );

  const refreshCart = useCallback(async () => {
    try {
      const cart = await getCart();
      setItems(cart.items);
    } catch {
      setError("We couldn't load your cart.");
    }
  }, []);

  // Reload on sign in too, because that moves guest items into the account.
  useEffect(() => {
    let isCurrent = true;

    getCart()
      .then((cart) => {
        if (isCurrent) setItems(cart.items);
      })
      .catch(() => {
        if (isCurrent) setError("We couldn't load your cart.");
      })
      .finally(() => {
        if (isCurrent) setIsLoading(false);
      });

    return () => {
      isCurrent = false;
    };
  }, [isLoggedIn]);

  const openCart = useCallback(() => {
    setNotice("");
    setError("");
    setIsOpen(true);
  }, []);

  const closeCart = useCallback(() => {
    setIsOpen(false);
  }, []);

  // Forget the signed-out customer's cart in this browser.
  const clearLocalCart = useCallback(() => {
    cartStorage.clear();
    setItems([]);
  }, []);

  async function addItem(product, variantId = null, { openDrawer = true } = {}) {
    setNotice("");
    setError("");

    try {
      const cart = await addToCart(product.id, 1, variantId);
      setItems(cart.items);
      setNotice(`${product.name} added`);
      if (openDrawer) setIsOpen(true);
      return true;
    } catch (addError) {
      setError(addError.message);
      setIsOpen(true);
      return false;
    }
  }

  async function changeQuantity(itemId, quantity) {
    setNotice("");
    setError("");

    try {
      const cart = await updateCartItem(itemId, quantity);
      setItems(cart.items);
    } catch (updateError) {
      setError(updateError.message);
    }
  }

  async function removeItem(itemId) {
    setNotice("");
    setError("");

    try {
      const cart = await removeCartItem(itemId);
      setItems(cart.items);
    } catch (removeError) {
      setError(removeError.message);
    }
  }

  return (
    <CartContext.Provider
      value={{
        items,
        itemCount,
        subtotal,
        isOpen,
        isLoading,
        notice,
        error,
        openCart,
        closeCart,
        addItem,
        changeQuantity,
        removeItem,
        refreshCart,
        clearLocalCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

// This hook intentionally shares the context module with its provider.
// eslint-disable-next-line react-refresh/only-export-components
export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error("useCart must be used inside CartProvider");
  }

  return context;
}
