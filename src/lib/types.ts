export type PurchaseStatus = 'Approved' | 'Under Review' | 'Rejected';
export type PublishStatus = 'Published' | 'Not Published';

export interface Specialist {
    id: string;
    title: string;
    price: number;
    currency: string;
    purchases: number;
    duration: string; // e.g., "3 Days"
    approvalStatus: PurchaseStatus;
    publishStatus: PublishStatus;
}

export interface SpecialistFilter {
    status: 'All' | 'Drafts' | 'Published';
    search: string;
}

export interface PlatformFee {
    id: string;
    tierName: string;
    percentage: number;
    fixedAmount: number;
    isActive: boolean;
}

export interface ServiceOffering {
    id: string;
    name: string;
    description: string;
    basePrice: number;
    isActive: boolean;
}
