import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { StoreItemCategoryString } from 'src/app/shared/types/store-item-category';
import { environment } from 'src/environments/environment';
import StoreItem from '../modules/store/models/store-item.model';

@Injectable()
export class StoreService {

  // private apiUrl: string = `${environment.API_URL}/store`;
  private apiUrl: string = `/assets/db/items.json`;

  constructor(
    private http: HttpClient
  ) { }

  public getAllStoreItems(): Observable<StoreItem[]> {
    return this.http.get<StoreItem[]>(this.apiUrl);
  }

  public getStoreItemsByCategory(category: StoreItemCategoryString): Observable<StoreItem[]> {
    return this.http.get<StoreItem[]>(this.apiUrl).pipe(
      map((items: StoreItem[]) => items.filter((item: StoreItem) => item.categories.includes(category)))
    );
  }

  public createStoreItem(storeItem: StoreItem): Observable<boolean> {
    return this.http.post<boolean>(this.apiUrl, storeItem);
  }

  public updateStoreItem(storeItem: StoreItem): Observable<boolean> {
    return this.http.put<boolean>(`this.apiUrl/${storeItem.id}`, storeItem);
  }

  public deleteStoreItem(id: number): Observable<boolean> {
    return this.http.delete<boolean>(`this.apiUrl/${id}`);
  }
}
