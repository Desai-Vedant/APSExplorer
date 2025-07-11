import React, { useEffect, useRef } from 'react';

const { Autodesk } = window;

const ModelViewer = ({ runtime, urn }) => {
    const viewerRef = useRef(null);
    const containerRef = useRef(null);

    useEffect(() => {
        if (!runtime || !runtime.accessToken) return;

        const options = {
            env: 'AutodeskProduction',
            api: 'derivativeV2',
            getAccessToken: (onGetAccessToken) => {
                onGetAccessToken(runtime.accessToken, 3600);
            }
        };

        Autodesk.Viewing.Initializer(options, () => {
            const viewer = new Autodesk.Viewing.GuiViewer3D(containerRef.current);
            viewer.start();
            viewerRef.current = viewer;
            if (urn) {
                loadModel(viewer, urn);
            }
        });

        return () => {
            if (viewerRef.current) {
                viewerRef.current.finish();
                viewerRef.current = null;
            }
        };
    }, [runtime]);

    useEffect(() => {
        if (viewerRef.current && urn) {
            loadModel(viewerRef.current, urn);
        }
    }, [urn]);

    const loadModel = (viewer, documentId) => {
        const onDocumentLoadSuccess = (doc) => {
            const viewables = doc.getRoot().getDefaultGeometry();
            viewer.loadDocumentNode(doc, viewables);
        };
        const onDocumentLoadFailure = (errorCode, errorMsg) => {
            console.error('Load failed! ', errorCode, errorMsg);
        };

        if (!documentId.startsWith('urn:')) {
            documentId = 'urn:' + btoa(documentId).replace(/=/g, '');
        }

        Autodesk.Viewing.Document.load(documentId, onDocumentLoadSuccess, onDocumentLoadFailure);
    };

    return <div ref={containerRef} style={{ width: '100%', height: '100%', position: 'relative' }} />;
};

export default ModelViewer;