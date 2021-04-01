import { Injectable } from '@angular/core';
import {Observable} from 'rxjs';
import {Stock} from './stock.model';
import {Socket} from 'ngx-socket-io';
import {SocketStock} from '../../app.module';

@Injectable({
  providedIn: 'root'
})
export class StockService {

  constructor(private socket: SocketStock) {}

  getStocks(): Observable<Stock[]> {
    return this.socket.fromEvent<Stock[]>('allStocks');
  }

  updateStock(stock: Stock): void {
    this.socket.emit('updateStock', stock);
  }

  disconnect(): void {
    this.socket.disconnect();
  }

  connect(): void {
    this.socket.connect();
  }

}
