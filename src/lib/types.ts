import { ReactNode } from "react";

export type VerificationStatus = 'pending' | 'verified' | 'rejected';

export interface Specialist {
    id: string;
    title: string;
    description: string;
    basePrice: number;
    platformFee: number;
    finalPrice: number;
    rating: number;
    durationDays: number;
    slug: string;
    isDraft: boolean;
    verificationStatus: VerificationStatus;
    isVerified: boolean;
    averageRating?: number;
    totalNumberOfRatings?: number;
    userId?: string;
    createdAt?: string;
    updatedAt?: string;
    serviceOfferings?: any[];
    media?: any[];
}

export interface CreateSpecialistData {
    title: string;
    description: string;
    basePrice: number;
    durationDays: number;
    slug?: string;
    serviceIds?: string[];
    isDraft?: boolean;
}

export interface UpdateSpecialistData {
    title?: string;
    description?: string;
    basePrice?: number;
    durationDays?: number;
    slug?: string;
    serviceIds?: string[];
}

export interface FilterSpecialistParams {
    search?: string;
    status?: VerificationStatus;
    isDraft?: boolean;
    minPrice?: number;
    maxPrice?: number;
    minRating?: number;
    sortBy?: 'price' | 'rating' | 'newest' | 'alphabetical';
    sortOrder?: 'asc' | 'desc';
    page?: number;
    limit?: number;
}

export interface PlatformFee {
    id: string;
    tierName: 'basic' | 'standard' | 'premium' | 'enterprise';
    minValue: number;
    maxValue: number;
    platformFeePercentage: number;
    createdAt: string;
    updatedAt: string;
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
    createdAt: string;
    updatedAt: string;
}

export interface AuthResponse {
    accessToken: string;
    user: User;
}

export interface LoginRequest {
    email: string;
    password: string;
}

export interface RegisterRequest {
    email: string;
    password: string;
    role: UserRole;
}

export interface PaginationMeta {
    currentPage: number;
    totalPages: number;
    pageSize: number;
    totalItems: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
}

export interface PaginatedResponse<T> {
    items: T[];
    pagination: PaginationMeta;
}

// Media types
export enum MimeType {
    IMAGE_JPEG = 'image/jpeg',
    IMAGE_PNG = 'image/png',
    IMAGE_WEBP = 'image/webp',
    VIDEO_MP4 = 'video/mp4',
    APPLICATION_PDF = 'application/pdf',
}

export enum MediaType {
    IMAGE = 'image',
    VIDEO = 'video',
    DOCUMENT = 'document',
}

export interface Media {
    id: string;
    specialists: string;
    fileName: string;
    fileSize: number;
    displayOrder: number;
    mimeType: MimeType;
    mediaType: MediaType;
    uploadedAt: string;
    publicUrl: string;
    s3Key?: string;
    bucketName?: string;
    createdAt: string;
    updatedAt: string;
    deletedAt?: string;
}

// Alias for FilterSpecialistParams
export type SpecialistFilters = FilterSpecialistParams;


// Auth types
export interface LoginCredentials {
    email: string;
    password: string;
}

export interface RegisterData {
    email: string;
    password: string;
    role?: UserRole;
}
