import React, { useEffect, useRef } from 'react';

const { Autodesk } = window;

const ModelViewer = ({ runtime, urn , urnEncoded}) => {
    const viewerRef = useRef(null);
    const containerRef = useRef(null);
    const config = {
        extensions: [
            'LoggerExtension',
            'SummaryExtension',
            'SampleExtension'
        ]
    };

    useEffect(() => {
        if (!runtime) return;

        const options = {
            env: 'AutodeskProduction',
            api: 'derivativeV2',
            getAccessToken: (onGetAccessToken) => {
                onGetAccessToken(runtime.accessToken, 3600);
            }
        };

        Autodesk.Viewing.Initializer(options, () => {
            const viewer = new Autodesk.Viewing.GuiViewer3D(containerRef.current, config);
            viewer.start();
            viewerRef.current = viewer;
            if (urn) {
                loadModel(viewer, btoa(urn));
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
            viewerRef.current.tearDown();
            loadModel(viewerRef.current, urnEncoded);
        }
    }, [urn]);

    const loadModel = (viewer, documentId) => {
        if (!documentId.startsWith('urn:')) {
            documentId = 'urn:' + documentId;
        }
        Autodesk.Viewing.Document.load(
            documentId,
            (doc) => {
                const viewables = doc.getRoot().getDefaultGeometry();
                viewer.loadDocumentNode(doc, viewables);
            },
            (errorCode, errorMsg) => {
                console.error('Load failed! ', errorCode, errorMsg);
            }
        );
    };

    return <div ref={containerRef} style={{ width: '100%', height: '100%', position: 'relative' }} />;
};

export default ModelViewer;