import { Box, Button } from '@mui/material';

const navigationItems: { name: string; path: string }[] = [
  { name: 'Home', path: '/' },
  { name: 'Video Example', path: '/video-example' },
];

export const Navigation = () => {
  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        backgroundColor: '#eaeaea',
        p: '10px',
        gap: '10px',
        display: 'flex',
        zIndex: 1000,
      }}
    >
      {navigationItems.map((item, index) => (
        <Button key={index} variant="outlined">
          <a href={item.path}>{item.name}</a>
        </Button>
      ))}
    </Box>
  );
};
