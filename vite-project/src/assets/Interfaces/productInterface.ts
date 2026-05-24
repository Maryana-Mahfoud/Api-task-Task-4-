// ==========================================================================
// PRODUCT INTERFACE FOR API RESPONSES AND COMPONENT PROPS
// ==========================================================================

export interface IProduct {
    id: number;
    name: string;
    price: string;
    image_url?: string;
    image?: string;
    created_at: string;
    updated_at: string;
}