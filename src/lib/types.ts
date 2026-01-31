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

export interface JunctionServiceOffering {
    id: string;
    specialists: string;
    serviceOfferingsMasterListId: string;
    specialist: Specialist;
    createdAt: string;
    updatedAt: string;
}

export interface ServiceOffering {
    id: string;
    title: string;
    description: string;
    s3Key?: string | null;
    bucketName?: string | null;
    createdAt: string;
    updatedAt: string;
    serviceOfferings?: JunctionServiceOffering[];
}

export interface CreateServiceOfferingRequest {
    title: string;
    description: string;
    specialistId: string;
    s3Key?: string;
    bucketName?: string;
}

export interface UpdateServiceOfferingRequest {
    title?: string;
    description?: string;
    s3Key?: string;
    bucketName?: string;
    specialistId?: string;
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
