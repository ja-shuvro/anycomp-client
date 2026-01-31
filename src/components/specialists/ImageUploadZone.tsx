'use client';

import { Box, Typography, Paper, Button, IconButton } from '@mui/material';
import { Upload, Trash2 } from 'lucide-react';
import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';

interface ImageUploadZoneProps {
    images: File[];
    onFilesSelected: (files: File[]) => void;
    onRemove: (index: number) => void;
    maxFiles?: number;
    minFiles?: number;
    disabled?: boolean;
}

const MAX_FILE_SIZE = 4 * 1024 * 1024; // 4MB

export default function ImageUploadZone({
    images,
    onFilesSelected,
    onRemove,
    maxFiles = 3,
    minFiles = 1,
    disabled = false,
}: ImageUploadZoneProps) {

    const onDrop = useCallback((acceptedFiles: File[]) => {
        // Filter files by size
        const validFiles = acceptedFiles.filter(file => file.size <= MAX_FILE_SIZE);

        if (validFiles.length < acceptedFiles.length) {
            alert('Some files were too large (max 4MB)');
        }

        // Only add up to maxFiles total
        const availableSlots = maxFiles - images.length;
        const filesToAdd = validFiles.slice(0, availableSlots);

        if (filesToAdd.length > 0) {
            onFilesSelected(filesToAdd);
        }
    }, [images.length, maxFiles, onFilesSelected]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'image/jpeg': ['.jpg', '.jpeg'],
            'image/png': ['.png'],
            'image/webp': ['.webp'],
        },
        maxFiles: maxFiles - images.length,
        disabled: disabled || images.length >= maxFiles,
        multiple: true,
    });

    const formatFileSize = (bytes: number) => {
        return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
    };

    return (
        <Box>
            <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                Service Images
            </Typography>
            <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 1 }}>
                ⓘ Minimum of {minFiles} Image, Maximum of {maxFiles} Images
            </Typography>

            {/* Upload Box - shown only if can add more */}
            {images.length < maxFiles && (
                <Paper
                    {...getRootProps()}
                    elevation={0}
                    sx={{
                        border: '2px dashed #E0E0E0',
                        borderRadius: 2,
                        p: 6,
                        textAlign: 'center',
                        cursor: disabled ? 'not-allowed' : 'pointer',
                        bgcolor: isDragActive ? 'action.hover' : 'transparent',
                        mb: images.length > 0 ? 2 : 0,
                    }}
                >
                    <input {...getInputProps()} />
                    <Upload size={48} color="#0f2c59" style={{ marginBottom: 16 }} />
                    <Box>
                        <Button
                            variant="contained"
                            sx={{ bgcolor: '#0f2c59', textTransform: 'none', mb: 1 }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            Browse
                        </Button>
                        <Typography variant="body2" color="text.secondary">
                            or
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Drag files to upload
                        </Typography>
                    </Box>
                    <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 2 }}>
                        Accepted formats: JPG, JPEG, PNG or WEBP
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                        Maximum file size: 4MB | {images.length}/{maxFiles} images selected
                    </Typography>
                </Paper>
            )}

            {/* File List */}
            {images.length > 0 && (
                <Box>
                    <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                        Selected Images ({images.length}/{maxFiles})
                    </Typography>
                    {images.map((file, index) => {
                        return (
                            <Paper
                                key={index}
                                elevation={0}
                                sx={{
                                    border: '1px solid #E0E0E0',
                                    borderRadius: 2,
                                    p: 2,
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 2,
                                    mb: 1,
                                }}
                            >
                                <Box
                                    component="img"
                                    src={URL.createObjectURL(file)}
                                    alt={file.name}
                                    sx={{
                                        width: 80,
                                        height: 80,
                                        objectFit: 'cover',
                                        borderRadius: 1,
                                    }}
                                />
                                <Box sx={{ flex: 1 }}>
                                    <Typography variant="body2" fontWeight={500}>
                                        {file.name}
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary">
                                        Size: {formatFileSize(file.size)}
                                    </Typography>
                                    <br />
                                    <Typography variant="caption" color="text.secondary">
                                        File type: {file.type.split('/')[1].toUpperCase()}
                                    </Typography>
                                </Box>
                                <Box sx={{ display: 'flex', gap: 1, alignSelf: 'flex-start' }}>
                                    <IconButton
                                        onClick={() => onRemove(index)}
                                        color="error"
                                        size="small"
                                    >
                                        <Trash2 size={20} />
                                    </IconButton>
                                </Box>
                            </Paper>
                        );
                    })}
                </Box>
            )}
        </Box>
    );
}
