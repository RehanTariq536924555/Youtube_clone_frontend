import React from 'react';
import { Link } from 'react-router-dom';

export const AuthLayout = ({ children, title, subtitle }: { children?: React.ReactNode, title: string, subtitle: string }) => {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center p-4 bg-background relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
            <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] bg-primary/10 rounded-full blur-[120px]" />
            <div className="absolute bottom-[10%] right-[10%] w-[30%] h-[30%] bg-blue-500/10 rounded-full blur-[100px]" />
        </div>

        <div className="z-10 w-full max-w-md">
            <div className="flex justify-center mb-8">
                <Link to="/" className="flex items-center gap-2 group">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-violet-500/20 group-hover:scale-105 transition-transform">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="w-6 h-6 text-white">
                            <path d="M5 3l14 9-14 9V3z" fill="currentColor" stroke="none" />
                        </svg>
                    </div>
                    <span className="text-2xl font-bold tracking-tight">Nebula<span className="text-primary">Stream</span></span>
                </Link>
            </div>

            <div className="bg-[#18181b] border border-white/5 shadow-2xl rounded-3xl p-8 backdrop-blur-sm">
                <div className="text-center mb-8">
                    <h1 className="text-2xl font-bold text-white mb-2">{title}</h1>
                    <p className="text-zinc-400 text-sm">{subtitle}</p>
                </div>
                {children}
            </div>
            
            <div className="mt-8 text-center">
                 <p className="text-zinc-500 text-xs">
                    By continuing, you agree to our <a href="#" className="underline hover:text-zinc-300">Terms of Service</a> and <a href="#" className="underline hover:text-zinc-300">Privacy Policy</a>.
                 </p>
            </div>
        </div>
    </div>
  );
};