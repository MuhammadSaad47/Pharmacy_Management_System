import { Component, OnInit } from '@angular/core';
import { BillService } from '../bill.service';

@Component({
  selector: 'app-bill-window',
  templateUrl: './bill-window.component.html',
  styleUrls: ['./bill-window.component.css']
})
export class BillWindowComponent implements OnInit {
  items: any[] = [];

  constructor(private billService: BillService) { }

  ngOnInit() {
    this.billService.getItems().subscribe(items => {
      this.items = items;
    });
  }
}
