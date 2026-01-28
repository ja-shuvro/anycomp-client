'use client';

import { Box, Typography, Avatar, Button, Paper } from '@mui/material';
import Image from 'next/image';

export default function ServiceProviderProfile() {
    return (
        <Box sx={{ mt: 6 }}>
            <Typography variant="h5" fontWeight={700} gutterBottom>
                Company Secretary
            </Typography>

            <Box sx={{ display: 'flex', gap: 4, flexDirection: { xs: 'column', md: 'row' } }}>
                {/* Profile Card */}
                <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
                    <Avatar
                        src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                        sx={{ width: 64, height: 64 }}
                    />
                    <Box>
                        <Typography fontWeight={700}>Grace Lam <Box component="span" sx={{ color: 'green', fontSize: '0.8em' }}>● Verified</Box></Typography>
                        <Typography variant="caption" color="text.secondary" display="block">Corpsec Services Sdn Bhd</Typography>
                        <Button
                            variant="contained"
                            size="small"
                            sx={{ mt: 1, textTransform: 'none', bgcolor: '#0f2c59', fontSize: '0.75rem' }}
                        >
                            View Profile
                        </Button>
                    </Box>
                </Box>

                {/* Certifications (Visual Mock) */}
                <Box sx={{ flex: 1 }}>
                    <Typography fontWeight={600} gutterBottom>Certified Company Secretary</Typography>
                    <Box sx={{ display: 'flex', gap: 2 }}>
                        <Image
                            src="/certifications.png"
                            alt="Certifications: SSM, MAICSA, IACS"
                            width={300}
                            height={40}
                            style={{ objectFit: 'contain', width: 'auto', height: 40 }}
                        />
                    </Box>
                </Box>
            </Box>

            <Typography variant="body2" color="text.secondary" sx={{ mt: 2, maxWidth: 600 }}>
                A company secretarial service founded by Grace, who believes that every company deserves clarity, confidence, and care in their compliance journey. Inspired by the spirit of entrepreneurship, Grace treats every client's business as if it were her own — attentive to detail, committed to deadlines, and focused on growth.
            </Typography>
        </Box>
    );
}
