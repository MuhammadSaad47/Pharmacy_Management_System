import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { BillService } from '../bill.service';
import { InventoryInteractionService } from '../../a-inventory-window/inventory-interaction.service';
// NOTE: Make sure FormsModule is imported in your parent module for ngModel to work
// import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-add-to-bill',
  templateUrl: './add-to-bill.component.html',
  styleUrls: ['./add-to-bill.component.css']
})
export class AddToBillComponent implements OnInit, AfterViewInit {
  barcode: string = '';
  loading: boolean = false;
  error: string = '';
  scannedItem: any = null;
  success: string = '';
  inventory: any[] = [];
  searchTerm: string = '';
  lastAutoAddedId: string | null = null;
  lastAutoAddedValue: string = '';
  @ViewChild('barcodeInputRef', { static: false }) barcodeInputRef!: ElementRef<HTMLInputElement>;

  constructor(private billService: BillService, private inventoryService: InventoryInteractionService) { }

  ngOnInit() {
    // Load all inventory for local lookup
    this.inventoryService.getInventory(1000, 1); // adjust page size as needed
    this.inventoryService.getInventoryUpdateListener().subscribe((items: any[]) => {
      this.inventory = items;
    });
  }

  ngAfterViewInit() {
    this.focusBarcodeInput();
  }

  // Call this in ngAfterViewInit to auto-focus barcode input
  focusBarcodeInput() {
    if (this.barcodeInputRef) {
      this.barcodeInputRef.nativeElement.focus();
    }
  }

  onBarcodeInputChange(event: any) {
    const value = event.target.value.trim();
    if (!value) return;
    if (!this.inventory.length || !('barcode' in this.inventory[0])) {
      this.error = 'Inventory does not contain barcode information.';
      return;
    }
    // Only add if exactly one item matches the barcode exactly
    const matches = this.inventory.filter(item => item.barcode === value);
    if (matches.length === 1) {
      const found = matches[0];
      // Prevent double-add for same value and item
      if (this.lastAutoAddedId === found.id && this.lastAutoAddedValue === value) return;
      if (this.billService.hasItem(found.id)) {
        this.billService.incrementQuantity(found.id, 1);
        this.success = `Increased quantity for ${found.name}.`;
      } else {
        this.billService.addItem({ ...found, quantity: 1 });
        this.success = 'Item added to bill by barcode!';
      }
      this.error = '';
      this.barcode = '';
      this.lastAutoAddedId = found.id;
      this.lastAutoAddedValue = value;
      setTimeout(() => this.focusBarcodeInput(), 100);
    } else {
      this.error = '';
      this.success = '';
      this.lastAutoAddedId = null;
      this.lastAutoAddedValue = '';
    }
  }

  onNameOrBarcodeInputChange(event: any) {
    const value = event.target.value.trim();
    if (!value) return;
    // Try to find by barcode exact match
    const matchesByBarcode = this.inventory.filter(item => item.barcode === value);
    if (matchesByBarcode.length === 1) {
      const found = matchesByBarcode[0];
      if (this.lastAutoAddedId === found.id && this.lastAutoAddedValue === value) return;
      if (this.billService.hasItem(found.id)) {
        this.billService.incrementQuantity(found.id, 1);
        this.success = `Increased quantity for ${found.name}.`;
      } else {
        this.billService.addItem({ ...found, quantity: 1 });
        this.success = 'Item added to bill by barcode!';
      }
      this.error = '';
      this.searchTerm = '';
      this.lastAutoAddedId = found.id;
      this.lastAutoAddedValue = value;
      return;
    }
    // Try to find by name exact match (case-insensitive)
    const matchesByName = this.inventory.filter(item => item.name.toLowerCase() === value.toLowerCase());
    if (matchesByName.length === 1) {
      const found = matchesByName[0];
      if (this.lastAutoAddedId === found.id && this.lastAutoAddedValue === value) return;
      if (this.billService.hasItem(found.id)) {
        this.billService.incrementQuantity(found.id, 1);
        this.success = `Increased quantity for ${found.name}.`;
      } else {
        this.billService.addItem({ ...found, quantity: 1 });
        this.success = 'Item added to bill by name!';
      }
      this.error = '';
      this.searchTerm = '';
      this.lastAutoAddedId = found.id;
      this.lastAutoAddedValue = value;
      return;
    }
    this.error = '';
    this.success = '';
    this.lastAutoAddedId = null;
    this.lastAutoAddedValue = '';
  }
}
