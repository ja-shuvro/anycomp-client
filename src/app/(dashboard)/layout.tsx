import Sidebar from '@/components/layout/Sidebar';
import Header from '@/components/layout/Header';
import { Box } from '@mui/material';

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#F8F9FA' }}>
            <Sidebar />
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    ml: '280px', // Matches sidebar width
                    display: 'flex',
                    flexDirection: 'column',
                    width: 'calc(100% - 280px)',
                }}
            >
                <Header />
                <Box sx={{ p: 4, pt: 2, flexGrow: 1 }}>
                    {children}
                </Box>
            </Box>
        </Box>
    );
}
