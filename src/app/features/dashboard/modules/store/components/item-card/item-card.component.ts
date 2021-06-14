import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import StoreItem from '../../models/store-item.model';

@Component({
  selector: 'app-item-card',
  templateUrl: './item-card.component.html',
  styleUrls: ['./item-card.component.scss']
})
export class ItemCardComponent implements OnInit {

  @Input()
  public storeItem: StoreItem = {
    id: 0,
    title: '',
    image: '',
    description: '',
    content: '',
    publishDate: new Date(),
    state: 'deleted',
    categories: ['CRAFTED']
  };

  @Output('delete')
  public deleteEvent: EventEmitter<number> = new EventEmitter();

  public isStoreItemActive: boolean = false;

  constructor() { }

  ngOnInit(): void {
    this.isStoreItemActive = this.checkStoreItemActiveConditions(this.storeItem);
  }

  private checkStoreItemActiveConditions(item: StoreItem): boolean {
    return (item.state === 'deleted' ||
      item.publishDate.getDate() > Date.now())
      ? false
      : true;
  }

  public delete(): void {
    this.deleteEvent.emit(this.storeItem.id);
  }
}
