
import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import ProjectsPage from './pages/ProjectsPage';
import ProjectDetails from './pages/ProjectDetails';

const router = createBrowserRouter([
    {
        path: '/',
        element: <LoginPage />,
    },
    {
        path: '/home',
        element: <HomePage />,
    },
    {
        path: '/hubs/:hub_id/projects',
        element: <ProjectsPage />,
    },
    {
        path: '/hubs/:hub_id/projects/:project_id',
        element: <ProjectDetails />,
    },
]);

function Router() {
    return <RouterProvider router={router} />;
}

export default Router;
