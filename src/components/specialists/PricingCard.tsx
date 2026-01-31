'use client';

import { Box, Typography, Divider, Paper } from '@mui/material';

interface PricingCardProps {
    basePrice: number;
    platformFee: number;
    finalPrice: number;
    currency: string;
}

export default function PricingCard({ basePrice, platformFee, finalPrice, currency }: PricingCardProps) {
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-MY', {
            style: 'decimal',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(amount);
    };

    return (
        <Paper elevation={0} sx={{ p: 4, borderRadius: 2, border: '1px solid #E0E0E0' }}>
            <Typography variant="h5" fontWeight={700} gutterBottom>
                Professional Fee
            </Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
                Set a rate for your service
            </Typography>

            <Box sx={{ my: 4, textAlign: 'center' }}>
                <Typography variant="h3" fontWeight={700} sx={{ display: 'inline-block', borderBottom: '3px solid #222' }}>
                    {currency} {formatCurrency(finalPrice)}
                </Typography>
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography color="text.secondary">Base price</Typography>
                <Typography fontWeight={600}>{currency} {formatCurrency(basePrice)}</Typography>
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography color="text.secondary" sx={{ textDecoration: 'underline' }}>Service processing fee</Typography>
                <Typography fontWeight={600}>{currency} {formatCurrency(platformFee)}</Typography>
            </Box>

            <Divider sx={{ my: 2 }} />

            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 4 }}>
                <Typography>Total</Typography>
                <Typography fontWeight={700}>{currency} {formatCurrency(finalPrice)}</Typography>
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography>Your returns</Typography>
                <Typography fontWeight={700}>{currency} {formatCurrency(basePrice)}</Typography>
            </Box>
        </Paper>
    );
}
