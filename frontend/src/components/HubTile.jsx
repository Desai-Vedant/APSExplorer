import React from 'react';
import { Card, CardContent, Typography, CardActionArea } from '@mui/material';
import { Link } from 'react-router-dom';

function HubTile({ hub }) {
    return (
        <Card>
            <CardActionArea component={Link} to={`/hubs/${hub.id}/projects`}>
                <CardContent>
                    <Typography gutterBottom variant="h5" component="div">
                        {hub.id}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Click to view projects
                    </Typography>
                </CardContent>
            </CardActionArea>
        </Card>
    );
}

export default HubTile;