import Link from 'next/link';
import { ArrowLeft, ShieldX } from 'lucide-react';

export default function Unauthorized() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-amber-100 p-4">
            <div className="max-w-md w-full bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="bg-amber-500 p-6 flex justify-center">
                    <ShieldX size={64} className="text-white" />
                </div>
                <div className="p-6 space-y-6">
                    <h1 className="text-2xl font-bold text-center text-gray-800">Access Denied</h1>
                    
                    <div className="bg-amber-100 border-l-4 border-amber-500 p-4 rounded">
                        <p className="text-amber-800">
                            You don't have permission to access this page. Please contact an administrator if you believe this is an error.
                        </p>
                    </div>
                    
                    <div className="space-y-4">
                        <p className="text-gray-600 text-center">
                            Please make sure you're logged in with the correct account or request access to this resource.
                        </p>
                        
                        <div className="flex justify-center pt-2">
                            <Link 
                                href="/" 
                                className="inline-flex items-center px-4 py-2 bg-amber-300 hover:bg-amber-400 text-amber-800 rounded-md transition-colors duration-200"
                            >
                                <ArrowLeft size={18} className="mr-2" />
                                Return to Home
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
