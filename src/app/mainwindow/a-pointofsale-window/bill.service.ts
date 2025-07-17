import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class BillService {
  private items: any[] = [];
  private itemsSubject = new BehaviorSubject<any[]>([]);

  getItems() {
    return this.itemsSubject.asObservable();
  }

  hasItem(id: string): boolean {
    return this.items.some(item => item.id === id);
  }

  incrementQuantity(id: string, amount: number = 1) {
    const item = this.items.find(item => item.id === id);
    if (item) {
      item.quantity = (item.quantity || 1) + amount;
      this.itemsSubject.next([...this.items]);
    }
  }

  addItem(item: any) {
    const existing = this.items.find(i => i.id === item.id);
    if (existing) {
      existing.quantity = (existing.quantity || 1) + (item.quantity || 1);
    } else {
      this.items.push({ ...item, quantity: item.quantity || 1 });
    }
    this.itemsSubject.next([...this.items]);
  }

  clear() {
    this.items = [];
    this.itemsSubject.next([]);
  }
} 