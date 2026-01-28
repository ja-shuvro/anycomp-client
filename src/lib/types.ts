export type PurchaseStatus = 'Approved' | 'Under Review' | 'Rejected';
export type PublishStatus = 'Published' | 'Not Published';

export interface Specialist {
    id: string;
    title: string;
    description: string;
    slug?: string;
    price: number; // mapped from basePrice in table? or should we align with backend? Let's keep price for now but add basePrice mapping
    basePrice: number;
    currency: string;
    purchases: number;
    duration: string; // e.g., "3 Days"
    durationDays: number;
    approvalStatus: PurchaseStatus;
    publishStatus: PublishStatus;
    // Relationships
    serviceOfferings?: ServiceOffering[];
}

export interface CreateSpecialistData {
    title: string;
    description: string;
    basePrice: number;
    durationDays: number;
    slug?: string;
    serviceIds?: string[];
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

export enum UserRole {
    ADMIN = 'admin',
    SPECIALIST = 'specialist',
    CLIENT = 'client'
}

export interface User {
    id: string;
    email: string;
    role: UserRole;
    createdAt?: string;
    updatedAt?: string;
}

export interface LoginCredentials {
    email: string;
    password: string;
}

export interface RegisterData {
    email: string;
    password: string;
    role?: UserRole;
}

export interface PaginationMeta {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
}

export interface PaginatedResponse<T> {
    items: T[];
    pagination: PaginationMeta;
}
