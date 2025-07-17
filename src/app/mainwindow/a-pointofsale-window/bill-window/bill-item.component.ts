import { Component, OnInit } from '@angular/core';
import { InventoryInteractionService } from '../../a-inventory-window/inventory-interaction.service';
import { SalesInteractionService } from '../sales-interaction.service';
import { MatSnackBar } from '@angular/material';

export class BillItemComponent implements OnInit {
  barcodeSearchTerm = '';
  barcodeSearchSuccess = '';
  barcodeSearchError = '';
  itemArray: Array<any> = [];
  inventorys: any[] = [];
  searchTerm: string = '';
  lastAutoAddedId: string | null = null;
  lastAutoAddedValue: string = '';

  constructor(private inventoryInteractionService: InventoryInteractionService, private salesInteractionService: SalesInteractionService, private snackbar: MatSnackBar) {
  }

  onBarcodeSearchEnter() {
    this.barcodeSearchSuccess = '';
    this.barcodeSearchError = '';
    const barcode = this.barcodeSearchTerm.trim();
    if (!barcode) {
      this.barcodeSearchError = 'Please enter a barcode.';
      return;
    }
    // Search local inventory for barcode
    if (!this.inventorys.length || !('barcode' in this.inventorys[0])) {
      this.barcodeSearchError = 'Inventory does not contain barcode information.';
      return;
    }
    const found = this.inventorys.find(item => item.barcode === barcode);
    if (found) {
      // Check if already in bill
      const alreadyInBill = this.itemArray.some(item => item[0] === found.id);
      if (!alreadyInBill) {
        this.itemArray.push([
          found.id,
          found.name,
          found.expireDate,
          found.price,
          1, // quantity
          found.quantity // realQuantity (stock)
        ]);
        this.barcodeSearchSuccess = `Added ${found.name} to bill.`;
      } else {
        this.barcodeSearchError = `${found.name} is already in the bill.`;
      }
      this.barcodeSearchTerm = '';
    } else {
      this.barcodeSearchError = 'No medicine found for this barcode.';
    }
  }

  onBarcodeInputChange(event: any) {
    const value = event.target.value.trim();
    if (!value) return;
    if (!this.inventorys.length || !('barcode' in this.inventorys[0])) {
      this.barcodeSearchError = 'Inventory does not contain barcode information.';
      return;
    }
    // Only add if exactly one item matches the barcode exactly
    const matches = this.inventorys.filter(item => item.barcode === value);
    if (matches.length === 1) {
      const found = matches[0];
      // Prevent double-add for same value and item
      if (this.lastAutoAddedId === found.id && this.lastAutoAddedValue === value) return;
      const alreadyInBill = this.itemArray.some(item => item[0] === found.id);
      if (!alreadyInBill) {
        this.itemArray.push([
          found.id,
          found.name,
          found.expireDate,
          found.price,
          1, // quantity
          found.quantity // realQuantity (stock)
        ]);
        this.barcodeSearchSuccess = `Added ${found.name} to bill.`;
      } else {
        this.barcodeSearchError = `${found.name} is already in the bill.`;
      }
      this.barcodeSearchTerm = '';
      this.lastAutoAddedId = found.id;
      this.lastAutoAddedValue = value;
    } else {
      this.barcodeSearchError = '';
      this.barcodeSearchSuccess = '';
      this.lastAutoAddedId = null;
      this.lastAutoAddedValue = '';
    }
  }

  onNameInputChange(event: any) {
    const value = event.target.value.trim();
    if (!value) return;
    // Try to find by name exact match (case-insensitive)
    const matchesByName = this.inventorys.filter(item => item.name.toLowerCase() === value.toLowerCase());
    if (matchesByName.length === 1) {
      const found = matchesByName[0];
      if (this.lastAutoAddedId === found.id && this.lastAutoAddedValue === value) return;
      const alreadyInBill = this.itemArray.some(item => item[0] === found.id);
      if (!alreadyInBill) {
        this.itemArray.push([
          found.id,
          found.name,
          found.expireDate,
          found.price,
          1, // quantity
          found.quantity // realQuantity (stock)
        ]);
        this.barcodeSearchSuccess = `Added ${found.name} to bill.`;
      } else {
        this.barcodeSearchError = `${found.name} is already in the bill.`;
      }
      this.searchTerm = '';
      this.lastAutoAddedId = found.id;
      this.lastAutoAddedValue = value;
      return;
    }
    this.barcodeSearchError = '';
    this.barcodeSearchSuccess = '';
    this.lastAutoAddedId = null;
    this.lastAutoAddedValue = '';
  }

  ngOnInit() {
    // Load all inventory for local lookup
    this.inventoryInteractionService.getInventory(1000, 1); // adjust page size as needed
    this.inventoryInteractionService.getInventoryUpdateListener().subscribe((items: any[]) => {
      this.inventorys = items;
    });
  }
} 