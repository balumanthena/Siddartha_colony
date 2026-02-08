import React from 'react';
import clsx from 'clsx';

interface CardProps {
    children: React.ReactNode;
    className?: string;
    onClick?: () => void;
}

export function Card({ children, className, onClick }: CardProps) {
    return (
        <div
            className={clsx(
                "bg-white rounded-xl shadow-sm border border-gray-100 p-4 transition-all",
                onClick && "active:scale-98 active:bg-gray-50 cursor-pointer",
                className
            )}
            onClick={onClick}
        >
            {children}
        </div>
    );
}

export function CardHeader({ children, className }: { children: React.ReactNode; className?: string }) {
    return (
        <div className={clsx("mb-3 border-b border-gray-50 pb-2", className)}>
            {children}
        </div>
    );
}

export function CardTitle({ children, className }: { children: React.ReactNode; className?: string }) {
    return (
        <h3 className={clsx("text-lg font-semibold text-gray-900", className)}>
            {children}
        </h3>
    );
}

export function CardContent({ children, className }: { children: React.ReactNode; className?: string }) {
    return (
        <div className={className}>
            {children}
        </div>
    );
}

export function CardDescription({ children, className }: { children: React.ReactNode; className?: string }) {
    return (
        <div className={clsx("text-sm text-gray-500", className)}>
            {children}
        </div>
    );
}
