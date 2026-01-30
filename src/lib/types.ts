export type VerificationStatus = 'pending' | 'verified' | 'rejected';

export interface Specialist {
    id: string;
    title: string;
    slug: string;
    description: string;
    basePrice: number;
    platformFee: number;
    finalPrice: number;
    averageRating: number;
    totalNumberOfRatings: number;
    isDraft: boolean;
    verificationStatus: VerificationStatus;
    isVerified: boolean;
    durationDays: number;
    createdAt: string;
    updatedAt: string;
    userId: string;
    serviceOfferings?: {
        serviceOfferingsMasterList: ServiceOffering;
    }[];
}

export interface CreateSpecialistData {
    title: string;
    description: string;
    basePrice: number;
    durationDays: number;
    slug?: string;
    serviceIds?: string[];
}

export interface UpdateSpecialistData {
    title?: string;
    description?: string;
    basePrice?: number;
    isDraft?: boolean;
    verificationStatus?: VerificationStatus;
}

export interface SpecialistFilters {
    page?: number;
    limit?: number;
    search?: string;
    status?: VerificationStatus;
    isDraft?: boolean;
    minPrice?: number;
    maxPrice?: number;
    sortBy?: 'price' | 'rating' | 'newest' | 'alphabetical';
    sortOrder?: 'asc' | 'desc';
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
