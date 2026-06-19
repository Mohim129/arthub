import Link from 'next/link';
import React from 'react';

const Dashboard = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-surface-container-low">
            <Link href="/dashboard/artist" className="text-blue-500 hover:underline">
                Go to Artist Dashboard
            </Link>
            <br />
            <Link href="/dashboard/user" className="text-blue-500 hover:underline">
                Go to User Dashboard
            </Link>
            <br />
            <Link href="/dashboard/admin" className="text-blue-500 hover:underline">
                Go to Admin Dashboard
            </Link>
        </div>
    );
};

export default Dashboard;