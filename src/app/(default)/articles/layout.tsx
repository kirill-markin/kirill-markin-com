import { ReactNode } from 'react';

interface ArticlesLayoutProps {
  children: ReactNode;
}

export default function ArticlesLayout({ children }: ArticlesLayoutProps) {
  return (
    <div className="min-h-screen bg-white">
      {children}
    </div>
  );
} 