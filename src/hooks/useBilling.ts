import { useState, useCallback } from 'react';
import type { Buyer, ProductPrice, BillItem } from '../services/billingService';

export type BillStep = 1 | 2 | 3;
export type { BillItem, ProductPrice, Buyer };

export function useBilling() {
  const [step, setStep] = useState<BillStep>(1);
  const [selectedBuyer, setSelectedBuyer] = useState<Buyer | null>(null);
  const [billItems, setBillItems] = useState<BillItem[]>([]);

  const selectBuyer = useCallback((buyer: Buyer) => setSelectedBuyer(buyer), []);

  const addProduct = useCallback((product: ProductPrice) => {
    setBillItems(prev => {
      if (prev.find(i => i.product.productId === product.productId)) return prev;
      return [...prev, { product, quantity: 1, totalPrice: product.rate }];
    });
  }, []);

  const removeProduct = useCallback((productId: string) => {
    setBillItems(prev => prev.filter(i => i.product.productId.toString() !== productId));
  }, []);

  const updateQuantity = useCallback((productId: string, quantity: number) => {
    if (quantity < 1) return;
    setBillItems(prev =>
      prev.map(i =>
        i.product.productId.toString() === productId
          ? { ...i, quantity, totalPrice: i.product.rate * quantity }
          : i
      )
    );
  }, []);

  const nextStep = useCallback(() => setStep(prev => Math.min(prev + 1, 3) as BillStep), []);
  const prevStep = useCallback(() => setStep(prev => Math.max(prev - 1, 1) as BillStep), []);

  const reset = useCallback(() => {
    setStep(1);
    setSelectedBuyer(null);
    setBillItems([]);
  }, []);

  const subtotal = billItems.reduce((sum, i) => sum + i.totalPrice, 0);
  const tax = subtotal * 0.05;
  const totalAmount = subtotal + tax;

  return {
    step, selectedBuyer, billItems,
    subtotal, tax, totalAmount,
    selectBuyer, addProduct, removeProduct, updateQuantity,
    nextStep, prevStep, reset,
  };
}