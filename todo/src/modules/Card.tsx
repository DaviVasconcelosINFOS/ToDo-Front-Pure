import React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';

interface BasicCardProps {
  title: string;
  content: number;
}

const BasicCard: React.FC<BasicCardProps> = ({ title, content }) => {
  return (
    <Card sx={{ minWidth: 275, height: 200 }}>
      <CardContent>
        <Box 
          display="flex" 
          flexDirection="column" 
          justifyContent="center" 
          alignItems="center" 
          height="100%"
        >
          <Typography sx={{ fontSize: 20 }} color="text.secondary" gutterBottom>
            {title}
          </Typography>
          <Typography variant="h2" component="div" sx={{ mt: 2 }}>
            {content}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export default BasicCard;
