// src/components/Card.tsx
import React from 'react';
import { Card, CardContent, Typography } from '@mui/material';

const CustomCard = () => {
  return (
    <Card className="shadow-lg border border-gray-200 p-4 rounded-lg">
      <CardContent>
        <Typography variant="h5" className="text-gray-800 font-bold mb-2">
          Card Title
        </Typography>
        <Typography variant="body2" className="text-gray-600">
          This is a simple card description.
        </Typography>
      </CardContent>
    </Card>
  );
};

export default CustomCard;
