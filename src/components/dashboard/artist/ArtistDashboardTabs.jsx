"use client";
import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { File } from '@gravity-ui/icons';
import ArtworkForm from './ArtworkForm';
import ArtworkTable from './ArtworkTable';
import ProfileSettings from '../ProfileSettings';
import { getArtistArtworks, deleteArtwork } from '@/lib/api/artworks';
import { authClient } from '@/lib/auth-client';      // adjust path
import { salesHistory as initialSalesHistory } from '@/data/salesHistory';   // mock sales data

export default function ArtistDashboardTabs() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const tab = searchParams.get('tab') || 'add';

    // 1. Session hook – called at top level ✅
    const { data: session } = authClient.useSession();
    const userId = session?.user?.id;

    // 2. State
    const [artworks, setArtworks] = useState([]);
    const [salesHistory] = useState(initialSalesHistory);   // mock data, never changes
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [artworkToEdit, setArtworkToEdit] = useState(null);

    // 3. Reset edit mode when tab changes
    useEffect(() => {
        setArtworkToEdit(null);
    }, [tab]);

    // 4. Fetch artworks from API
    useEffect(() => {
        if (!userId) {
            return;
        }

        async function fetchArtworks() {
            try {
                setLoading(true);
                const data = await getArtistArtworks(userId);
                setArtworks(data);
            } catch (err) {
                setError(err.message || "Failed to load artworks.");
            } finally {
                setLoading(false);
            }
        }

        fetchArtworks();
    }, [userId]);

    // 5. Handlers
    const handleAddArtwork = (newWork) => {
        setArtworks(prev => [newWork, ...prev]);
        toast.success(`Successfully published "${newWork.title}"!`);
        router.push('/dashboard/artist?tab=manage');
    };

    const handleUpdateArtwork = (updatedWork) => {
        setArtworks(prev =>
            prev.map(art => art.id === updatedWork.id ? updatedWork : art)
        );
        toast.success(`Successfully updated "${updatedWork.title}"!`);
        setArtworkToEdit(null);
    };

    const handleDeleteArtwork = async (id) => {
        const itemToDelete = artworks.find(art => art.id === id);
        if (!confirm(`Are you sure you want to delete "${itemToDelete?.title || 'this artwork'}"?`)) return;

        try {
            await deleteArtwork(id);
            setArtworks(prev => prev.filter(art => art.id !== id));
            toast.success(`Deleted "${itemToDelete?.title || 'artwork'}"!`);
        } catch (err) {
            toast.error(err.message || 'Failed to delete artwork.');
        }
    };

    // 6. Loading / error / empty states
    if (loading) {
        return (
            <div className="text-center py-20 text-on-surface-variant">
                <div className="animate-spin inline-block w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full mb-4" />
                <p>Loading your dashboard…</p>
            </div>
        );
    }

    if (error) {
        return <div className="text-center py-20 text-error">{error}</div>;
    }

    return (
        <div className="max-w-4xl mx-auto space-y-xl">
            {tab === 'add' && (
                <ArtworkForm key="add-new" onSubmit={handleAddArtwork} />
            )}

            {tab === 'manage' && (
                artworkToEdit ? (
                    <ArtworkForm
                        key={`edit-${artworkToEdit.id}`}
                        artworkToEdit={artworkToEdit}
                        onSubmit={handleUpdateArtwork}
                        onCancel={() => setArtworkToEdit(null)}
                    />
                ) : (
                    <ArtworkTable
                        artworks={artworks}
                        onEdit={(art) => setArtworkToEdit(art)}
                        onDelete={handleDeleteArtwork}
                    />
                )
            )}

            {tab === 'sales' && (
                <section className="flex flex-col gap-md">
                    {/* sales table unchanged */}
                    {/* … */}
                </section>
            )}

            {tab === 'profile' && (
                <ProfileSettings/>
            )}
        </div>
    );
}