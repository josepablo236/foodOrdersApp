export interface Product {
    id: number;
    categoryId: number;
    name: string;
    price: number;
    cost: number;
    description?: string;
}