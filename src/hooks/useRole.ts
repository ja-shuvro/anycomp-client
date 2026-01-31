'use client';

import { useAppSelector } from '@/store/hooks';
import { UserRole } from '@/lib/types';

export const useAuth = () => {
    const { user, isAuthenticated, isLoading } = useAppSelector((state) => state.auth);

    return {
        user,
        isAuthenticated,
        isLoading,
    };
};

export const useRole = () => {
    const { user } = useAppSelector((state) => state.auth);

    const hasRole = (allowedRoles: UserRole | UserRole[]): boolean => {
        if (!user) return false;

        const roles = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];
        return roles.includes(user.role);
    };

    return {
        role: user?.role,
        isAdmin: user?.role === UserRole.ADMIN,
        isSpecialist: user?.role === UserRole.SPECIALIST,
        isClient: user?.role === UserRole.CLIENT,
        // hasRole returns true if user has ANY of the allowed roles
        hasRole,
        // hasAnyRole is alias for hasRole
        hasAnyRole: hasRole,
        // canAccessSpecialistFeatures: admin OR specialist
        canAccessSpecialistFeatures: user?.role === UserRole.ADMIN || user?.role === UserRole.SPECIALIST,
        // canAccessAdminFeatures: admin only
        canAccessAdminFeatures: user?.role === UserRole.ADMIN,
    };
};
