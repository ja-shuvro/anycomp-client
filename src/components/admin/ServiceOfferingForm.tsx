'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
    Box,
    Button,
    TextField,
    Stack,
    Autocomplete,
    CircularProgress,
    Chip,
    Typography,
    ListItem,
    ListItemIcon,
    ListItemText
} from '@mui/material';
import {
    Building2,
    FileText,
    Zap,
    MapPin,
    Calendar,
    Award,
    Truck,
    MessageCircle,
    Briefcase,
    Users
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { CreateServiceOfferingRequest, Specialist } from '@/lib/types';
import { useSpecialists } from '@/lib/queries/specialists';

// Icon mapping based on specialist title keywords
const getSpecialistIcon = (title: string) => {
    const lowerTitle = title.toLowerCase();
    if (lowerTitle.includes('secretary') || lowerTitle.includes('subscription')) return Building2;
    if (lowerTitle.includes('bank')) return Briefcase;
    if (lowerTitle.includes('record') || lowerTitle.includes('form') || lowerTitle.includes('document')) return FileText;
    if (lowerTitle.includes('priority') || lowerTitle.includes('filing')) return Zap;
    if (lowerTitle.includes('office') || lowerTitle.includes('address')) return MapPin;
    if (lowerTitle.includes('calendar') || lowerTitle.includes('compliance')) return Calendar;
    if (lowerTitle.includes('certificate') || lowerTitle.includes('share')) return Award;
    if (lowerTitle.includes('delivery') || lowerTitle.includes('courier')) return Truck;
    if (lowerTitle.includes('support') || lowerTitle.includes('chat')) return MessageCircle;
    return Users;
};

const offeringSchema = z.object({
    title: z.string().min(2, 'Title must be at least 2 characters').max(255, 'Title must be less than 255 characters'),
    description: z.string().min(10, 'Description must be at least 10 characters'),
    specialistIds: z.array(z.string().uuid()).min(1, 'Please select at least one specialist'),
    s3Key: z.string().optional(),
    bucketName: z.string().optional(),
});

type OfferingFormData = z.infer<typeof offeringSchema>;

interface OfferingFormProps {
    initialData?: Partial<CreateServiceOfferingRequest>;
    isEdit?: boolean;
    isLoading?: boolean;
    onSubmit: (data: OfferingFormData) => void;
    onCancel?: () => void;
}

export default function ServiceOfferingForm({ initialData, isEdit, isLoading, onSubmit, onCancel }: OfferingFormProps) {
    const router = useRouter();

    // Support both single specialistId (legacy) and multiple specialistIds
    const initialSelected = initialData?.specialistId
        ? [initialData.specialistId]
        : (initialData as any)?.specialistIds || [];

    const [selectedSpecialists, setSelectedSpecialists] = useState<Specialist[]>([]);

    // Fetch specialists for the autocomplete
    const { data: specialistsData, isLoading: isLoadingSpecialists } = useSpecialists({ page: 1, limit: 100 });
    const specialists = specialistsData?.items || [];

    // Initialize selected specialists when data loads
    if (specialists.length > 0 && selectedSpecialists.length === 0 && initialSelected.length > 0) {
        const initialSpecs = specialists.filter(s => initialSelected.includes(s.id));
        if (initialSpecs.length > 0) {
            setSelectedSpecialists(initialSpecs);
        }
    }

    const { register, handleSubmit, formState: { errors }, setValue } = useForm<OfferingFormData>({
        resolver: zodResolver(offeringSchema),
        defaultValues: {
            title: initialData?.title || '',
            description: initialData?.description || '',
            specialistIds: initialSelected,
            s3Key: initialData?.s3Key || '',
            bucketName: initialData?.bucketName || '',
        },
    });

    const handleSpecialistChange = (_: any, newValue: Specialist[]) => {
        setSelectedSpecialists(newValue);
        setValue('specialistIds', newValue.map(s => s.id), { shouldValidate: true });
    };

    return (
        <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ maxWidth: 600, bgcolor: 'white', p: 4, borderRadius: 2 }}>
            <Stack spacing={3}>
                <TextField
                    {...register('title')}
                    label="Service Title *"
                    fullWidth
                    placeholder="e.g., Company Incorporation"
                    error={!!errors.title}
                    helperText={errors.title?.message || 'Between 2-255 characters'}
                />

                <TextField
                    {...register('description')}
                    label="Description *"
                    fullWidth
                    multiline
                    rows={4}
                    placeholder="Describe the service offering"
                    error={!!errors.description}
                    helperText={errors.description?.message || 'Minimum 10 characters'}
                />

                {/* Multi-Select Specialists with Chips */}
                <Box>
                    <Autocomplete
                        multiple
                        options={specialists}
                        getOptionLabel={(option) => option.title}
                        loading={isLoadingSpecialists}
                        value={selectedSpecialists}
                        onChange={handleSpecialistChange}
                        isOptionEqualToValue={(option, value) => option.id === value.id}
                        renderTags={(value, getTagProps) =>
                            value.map((option, index) => {
                                const { key, ...tagProps } = getTagProps({ index });
                                return (
                                    <Chip
                                        key={key}
                                        label={option.title}
                                        {...tagProps}
                                        sx={{
                                            bgcolor: '#f5f5f5',
                                            '& .MuiChip-deleteIcon': {
                                                color: '#666',
                                                '&:hover': { color: '#333' }
                                            }
                                        }}
                                    />
                                );
                            })
                        }
                        renderOption={(props, option) => {
                            const { key, ...otherProps } = props;
                            const IconComponent = getSpecialistIcon(option.title);
                            return (
                                <ListItem
                                    key={key}
                                    {...otherProps}
                                    sx={{
                                        py: 1.5,
                                        px: 2,
                                        borderBottom: '1px solid #f0f0f0',
                                        '&:last-child': { borderBottom: 'none' },
                                        '&:hover': { bgcolor: '#f9f9f9' },
                                        cursor: 'pointer'
                                    }}
                                >
                                    <ListItemIcon sx={{ minWidth: 40 }}>
                                        <IconComponent size={20} color="#666" />
                                    </ListItemIcon>
                                    <ListItemText
                                        primary={
                                            <Typography variant="body1" fontWeight={600}>
                                                {option.title}
                                            </Typography>
                                        }
                                        secondary={
                                            <Typography variant="body2" color="text.secondary" sx={{
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis',
                                                whiteSpace: 'nowrap',
                                                maxWidth: 350
                                            }}>
                                                {option.description || `Service offered at RM ${option.basePrice}`}
                                            </Typography>
                                        }
                                    />
                                </ListItem>
                            );
                        }}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                label="Select Specialists *"
                                placeholder={selectedSpecialists.length === 0 ? "Choose specialists..." : ""}
                                error={!!errors.specialistIds}
                                helperText={errors.specialistIds?.message || 'Select one or more specialists for this offering'}
                                InputProps={{
                                    ...params.InputProps,
                                    endAdornment: (
                                        <>
                                            {isLoadingSpecialists ? <CircularProgress color="inherit" size={20} /> : null}
                                            {params.InputProps.endAdornment}
                                        </>
                                    ),
                                }}
                            />
                        )}
                        sx={{
                            '& .MuiAutocomplete-listbox': {
                                p: 0,
                                maxHeight: 400
                            }
                        }}
                    />
                </Box>



                <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', pt: 2 }}>
                    <Button
                        variant="outlined"
                        onClick={onCancel || (() => router.back())}
                        disabled={isLoading}
                    >
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        variant="contained"
                        sx={{ bgcolor: '#0f2c59' }}
                        disabled={isLoading}
                    >
                        {isLoading ? 'Saving...' : isEdit ? 'Update Offering' : 'Save Offering'}
                    </Button>
                </Box>
            </Stack>
        </Box>
    );
}
