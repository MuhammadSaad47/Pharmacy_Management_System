import { MatSnackBar } from '@angular/material';
import { InventoryInteractionService } from './../../inventory-interaction.service';
import { Subscription } from 'rxjs';
import { Component, OnInit } from '@angular/core';
import { Inventory } from '../../inventory.model';
import { BillService } from '../../../a-pointofsale-window/bill.service';

@Component({
  selector: 'app-drug-inventory-items',
  templateUrl: './drug-inventory-items.component.html',
  styleUrls: ['./drug-inventory-items.component.css']
})
export class DrugInventoryItemsComponent implements OnInit {
  searchTerm : string;
  inventorys : Inventory[] = [];
  isLoading= false;
  private inventorySubs: Subscription;
  lastAutoAddedId: string | null = null;
  lastAutoAddedValue: string = '';

  constructor(
    private inventoryInteractionService: InventoryInteractionService,
    private snackBar :MatSnackBar,
    private billService: BillService
  ) { }

  ngOnInit() {
    this.isLoading = true;
    this.inventoryInteractionService.getInventory(null,null);
    this.inventorySubs = this.inventoryInteractionService.getInventoryUpdateListener()
      .subscribe((posts: Inventory[]) => {
        this.isLoading = false;
        this.inventorys = posts;
      });



  }


  onDelete(supplierId: string) {
    this.inventoryInteractionService.deleteInventory(supplierId);
    this.snackBar.open("Drug Deleted Successfully", "Close");
  }

  onSearchInputChange(event: any) {
    const value = event.target.value.trim();
    if (!value) return;
    // Find exact match by barcode
    const matchesByBarcode = this.inventorys.filter(item => item.barcode === value);
    if (matchesByBarcode.length === 1) {
      const found = matchesByBarcode[0];
      if (this.lastAutoAddedId === found.id && this.lastAutoAddedValue === value) return;
      if (this.billService.hasItem(found.id)) {
        this.billService.incrementQuantity(found.id, 1);
        this.snackBar.open(`Increased quantity for ${found.name}.`, 'Close', { duration: 1500 });
      } else {
        this.billService.addItem({ ...found, quantity: 1 });
        this.snackBar.open('Item added to bill by barcode!', 'Close', { duration: 1500 });
      }
      this.lastAutoAddedId = found.id;
      this.lastAutoAddedValue = value;
      this.searchTerm = '';
      return;
    }
    // Find exact match by name (case-insensitive)
    const matchesByName = this.inventorys.filter(item => item.name.toLowerCase() === value.toLowerCase());
    if (matchesByName.length === 1) {
      const found = matchesByName[0];
      if (this.lastAutoAddedId === found.id && this.lastAutoAddedValue === value) return;
      if (this.billService.hasItem(found.id)) {
        this.billService.incrementQuantity(found.id, 1);
        this.snackBar.open(`Increased quantity for ${found.name}.`, 'Close', { duration: 1500 });
      } else {
        this.billService.addItem({ ...found, quantity: 1 });
        this.snackBar.open('Item added to bill by name!', 'Close', { duration: 1500 });
      }
      this.lastAutoAddedId = found.id;
      this.lastAutoAddedValue = value;
      this.searchTerm = '';
      return;
    }
    this.lastAutoAddedId = null;
    this.lastAutoAddedValue = '';
  }

  ngOnDestroy() {
    this.inventorySubs.unsubscribe();
  }

}
