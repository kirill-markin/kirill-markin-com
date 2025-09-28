'use client';
import { useEffect, useState } from 'react';

interface SidebarVisibilityWrapperProps {
    children: React.ReactNode;
}

export default function SidebarVisibilityWrapper({ children }: SidebarVisibilityWrapperProps) {
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        const footer = document.querySelector('footer');
        if (!footer) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                setIsVisible(!entry.isIntersecting);
            },
            { threshold: 0 }
        );

        observer.observe(footer);
        return () => observer.disconnect();
    }, []);

    return isVisible ? <>{children}</> : null;
}
