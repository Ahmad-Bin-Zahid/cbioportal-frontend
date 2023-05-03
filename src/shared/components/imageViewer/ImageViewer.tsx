import React, { useRef, useMemo, useEffect, useState } from 'react';

const SCROLL_SENSITIVITY = 0.0005;
const MAX_ZOOM = 5;
const MIN_ZOOM = 0.1;

interface ZoomImageProps {
    image: string;
}

const ZoomImage = ({ image }: ZoomImageProps) => {
    const [offset, setOffset] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [dragging, setDragging] = useState(false);

    const touch = useRef({ x: 0, y: 0 });
    const canvasRef: any = useRef(null);
    const containerRef: any = useRef(null);
    const observer: any = useRef(null);
    const background = useMemo(() => new Image(), [image]);

    const clamp = (num: number, min: number, max: number) =>
        Math.min(Math.max(num, min), max);

    const handleWheel = (event: any) => {
        const { deltaY } = event;
        if (!dragging) {
            setZoom(zoom =>
                clamp(
                    zoom + deltaY * SCROLL_SENSITIVITY * -1,
                    MIN_ZOOM,
                    MAX_ZOOM
                )
            );
        }
    };

    const handleMouseMove = (event: any) => {
        if (dragging) {
            const { x, y } = touch.current;
            const { clientX, clientY } = event;
            setOffset({
                x: offset.x + (x - clientX),
                y: offset.y + (y - clientY),
            });
            touch.current = { x: clientX, y: clientY };
        }
    };

    const handleMouseDown = (event: any) => {
        const { clientX, clientY } = event;
        touch.current = { x: clientX, y: clientY };
        setDragging(true);
    };

    const handleMouseUp = () => setDragging(false);

    const draw = () => {
        if (canvasRef.current) {
            const { width, height } = canvasRef.current;
            const context: any = canvasRef.current.getContext('2d');

            // Set canvas dimensions
            canvasRef.current.width = width;
            canvasRef.current.height = height;

            // Clear canvas and scale it
            context.translate(-offset.x, -offset.y);
            context.scale(zoom, zoom);
            context.clearRect(0, 0, width, height);

            // Make sure we're zooming to the center
            const x = (context.canvas.width / zoom - background.width) / 2;
            const y = (context.canvas.height / zoom - background.height) / 2;

            // Draw image
            context.drawImage(background, x, y);
        }
    };

    useEffect(() => {
        observer.current = new ResizeObserver((entries: any) => {
            entries.forEach(({ target }: any) => {
                const { width, height } = background;
                // If width of the container is smaller than image, scale image down
                if (target.clientWidth < width) {
                    // Calculate scale
                    const scale = target.clientWidth / width;

                    // Redraw image
                    canvasRef.current.width = width * scale;
                    canvasRef.current.height = height * scale;
                    canvasRef.current
                        .getContext('2d')
                        .drawImage(
                            background,
                            Math.floor(containerRef.current.clientWidth / 2) -
                                Math.floor(width / 2),
                            Math.floor(containerRef.current.clientHeight / 2) -
                                Math.floor(height / 2),
                            width * scale,
                            height * scale
                        );
                }
            });
        });

        observer.current.observe(containerRef.current);

        return () => observer.current.unobserve(containerRef.current);
    }, []);

    useEffect(() => {
        background.src = image;

        setZoom(1);
        // setOffset({x: 0, y: 0});
        // setDragging(false);

        if (canvasRef.current) {
            background.onload = () => {
                // Get the image dimensions
                const { width, height } = background;

                // canvasRef.current.width = width;
                // canvasRef.current.height = height;

                canvasRef.current.width = containerRef.current.clientWidth;
                canvasRef.current.height = containerRef.current.clientHeight;

                // Set image as background
                canvasRef.current
                    .getContext('2d')
                    .drawImage(
                        background,
                        Math.floor(containerRef.current.clientWidth / 2) -
                            Math.floor(width / 2),
                        Math.floor(containerRef.current.clientHeight / 2) -
                            Math.floor(height / 2)
                    );
            };
        }
    }, [background]);

    useEffect(() => {
        draw();
    }, [zoom, offset]);

    return (
        <div
            ref={containerRef}
            style={{
                border: '1px solid #dddddd',
                width: '50%',
                height: '500px',
                overflow: 'hidden',
            }}
        >
            <canvas
                onMouseDown={handleMouseDown}
                onMouseUp={handleMouseUp}
                onWheel={handleWheel}
                onMouseMove={handleMouseMove}
                ref={canvasRef}
                style={{
                    objectFit: 'none',
                }}
            />
        </div>
    );
};

export default ZoomImage;
