'use client';

import { Box, Typography } from '@mui/material';
import { Camera } from 'lucide-react';

export default function ServiceGallery() {
    return (
        <Box sx={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: 2, height: 400, mb: 4 }}>
            {/* Main Image */}
            <Box sx={{
                bgcolor: '#F5F5F5',
                borderRadius: 2,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                position: 'relative'
            }}>
                <Camera size={48} color="#9E9E9E" />
                <Typography variant="caption" color="text.secondary" sx={{ mt: 2, maxWidth: 200, textAlign: 'center' }}>
                    Upload an image for your service listing in PNG, JPG or JPEG up to 4MB
                </Typography>
            </Box>

            {/* Side Images */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Box sx={{
                    flex: 1,
                    borderRadius: 2,
                    overflow: 'hidden',
                    backgroundImage: 'url(https://images.unsplash.com/photo-1542744173-8e7e53415bb0?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80)',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    position: 'relative'
                }}>
                    <Box sx={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, bgcolor: 'rgba(0,0,0,0.3)', p: 3, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Typography variant="h5" color="white" fontWeight={700} textAlign="center">
                            10 Best Company Secretarial in Johor Bahru
                        </Typography>
                    </Box>
                </Box>
                <Box sx={{
                    flex: 1,
                    borderRadius: 2,
                    overflow: 'hidden',
                    backgroundImage: 'url(https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80)',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    position: 'relative'
                }}>
                    <Box sx={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, p: 3, display: 'flex', alignItems: 'center' }}>
                        <Typography color="text.primary" fontWeight={500} sx={{ bgcolor: 'rgba(255,255,255,0.8)', p: 2, borderRadius: 1 }}>
                            A <strong>Company Secretary</strong> Represents a Key Role in Any Business. This is Why
                        </Typography>
                    </Box>
                </Box>
            </Box>
        </Box>
    );
}
