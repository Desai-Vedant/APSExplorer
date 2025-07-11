import React from 'react';
import { Card, CardContent, Typography, CardActionArea } from '@mui/material';
import { Link, useParams } from 'react-router-dom';

function ProjectTile({ project }) {
    const { hub_id } = useParams();
    return (
        <Card>
            <CardActionArea component={Link} to={`/hubs/${hub_id}/projects/${project.id}`}>
                <CardContent>
                    <Typography gutterBottom variant="h5" component="div">
                        {project.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Click to view details
                    </Typography>
                </CardContent>
            </CardActionArea>
        </Card>
    );
}

export default ProjectTile;