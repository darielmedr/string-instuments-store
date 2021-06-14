import { StoreItemCategoryString } from "src/app/shared/types/store-item-category";

export default interface StoreItem {
    id: number,
    title: string,
    image: string,
    description: string,
    content: string,
    publishDate: Date,
    state: StoreItemState,
    categories: StoreItemCategoryString[]
}