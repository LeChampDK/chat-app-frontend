import {Component, OnDestroy, OnInit} from '@angular/core';
import {StockService} from './shared/stock.service';
import {Stock} from './shared/stock.model';
import {Observable, Subject} from 'rxjs';
import {debounceTime, takeUntil} from 'rxjs/operators';
import {FormControl} from '@angular/forms';
import {MatListOption} from '@angular/material/list';

@Component({
  selector: 'app-stock',
  templateUrl: './stock.component.html',
  styleUrls: ['./stock.component.scss']
})
export class StockComponent implements OnInit, OnDestroy {
  stocks$: Observable<Stock[]> | undefined;
  unsubscribe$ = new Subject();
  valueField = new FormControl();
  selected: Stock | undefined;
  stock: Stock | undefined;

  constructor(private stockService: StockService) { }

  ngOnInit(): void {
    this.valueField.patchValue(this.selected?.value);
    this.stockService.connect();
    this.stocks$ = this.stockService.getStocks();
  }

  ngOnDestroy(): void {
    console.log('Destroyed');
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  currentSelection(selection: MatListOption[]): void {
    this.selected = selection[0].value;
  }

  updateStock(): void {
    if (this.selected === undefined){
    }
    else {
      this.selected.value = this.valueField.value;
      this.stockService.updateStock(this.selected);
      this.stocks$ = this.stockService.getStocks();
      this.valueField.patchValue('')
    }
  }
}
