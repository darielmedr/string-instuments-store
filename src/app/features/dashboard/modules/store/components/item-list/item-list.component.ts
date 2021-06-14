import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { StoreService } from 'src/app/features/dashboard/services/store.service';
import { StoreItemCategory } from 'src/app/shared/enums/store-item-category.enum';
import { StoreItemCategoryString } from 'src/app/shared/types/store-item-category';
import StoreItem from '../../models/store-item.model';

@Component({
  selector: 'app-item-list',
  templateUrl: './item-list.component.html',
  styleUrls: ['./item-list.component.scss']
})
export class ItemListComponent implements OnInit, OnDestroy {

  private unsubscribe$: Subject<void> = new Subject();
  public storeItems$: Observable<StoreItem[]> = new Observable();

  public categories: string[] = [];
  public categoryForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private storeService: StoreService,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.setCategories();

    const initialCategory: string = StoreItemCategory[StoreItemCategory.ALL];
    this.categoryForm = this.fb.group({
      category: [initialCategory]
    });

    this.setAllStoreItems();
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  private setCategories(): void {
    for (const key in StoreItemCategory) {
      if (isNaN(Number(key))) {
        this.categories.push(key);
      }
    }
  }

  private setAllStoreItems(): void {
    this.storeItems$ = this.storeService.getAllStoreItems();
  }

  private setStoreItemsByCategory(category: StoreItemCategoryString): void {
    this.storeItems$ = this.storeService.getStoreItemsByCategory(category);
  }

  public categoryChanged(value: string): void {
    const category: StoreItemCategoryString = value as keyof typeof StoreItemCategory;

    (category === 'ALL') ? this.setAllStoreItems()
                         : this.setStoreItemsByCategory(category);
  }

  public deleteItem(itemId: number): void {
    this.storeService.deleteStoreItem(itemId)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(
        (result: boolean) => {
          result ? this.showMessage('The item was deleted successfully')
            : this.showMessage("Error. The item couldn't be deleted");
        },
        (error: Error) => {
          this.showMessage('Oops! Something went wrong.');
          console.error(error);
        });
  }

  private showMessage(message: string): void {
    this.snackBar.open(message, "Close", {
      duration: 2000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
      panelClass: 'error-snackBar'
    });
  }
}
