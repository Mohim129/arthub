"use client";
import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { File } from '@gravity-ui/icons';
import Link from 'next/link';
import ArtworkForm from './ArtworkForm';
import ArtworkTable from './ArtworkTable';
import ProfileSettings from '../ProfileSettings';
import { getArtistArtworks, deleteArtwork } from '@/lib/api/artworks';
import { authClient } from '@/lib/auth-client';
import { fetchAPI } from '@/lib/fetchWithAuth';

export default function ArtistDashboardTabs() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const tab = searchParams.get('tab') || 'add';

    // 1. Session hook – called at top level ✅
    const { data: session } = authClient.useSession();
    const userId = session?.user?.id;

    // 2. State
    const [artworks, setArtworks] = useState([]);
    const [salesHistory, setSalesHistory] = useState([]);
    const [loading, setLoading] = useState(false);
    const [salesLoading, setSalesLoading] = useState(false);
    const [error, setError] = useState(null);
    const [artworkToEdit, setArtworkToEdit] = useState(null);

    // 3. Reset edit mode only through explicit actions

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

    // 5. Fetch sales history from API
    useEffect(() => {
        if (tab === 'sales' && userId) {
            const fetchSalesHistory = async () => {
                try {
                    setSalesLoading(true);
                    const response = await fetchAPI(`/api/artists/${userId}/sales`, userId);
                    if (!response.ok) throw new Error("Failed to fetch sales");
                    const data = await response.json();
                    setSalesHistory(data);
                } catch (err) {
                    toast.error(err.message || "Failed to load sales history");
                } finally {
                    setSalesLoading(false);
                }
            };

            fetchSalesHistory();
        }
    }, [tab, userId]);

    // 6. Handlers
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

    // 7. Loading / error / empty states
    if (loading && tab !== 'sales') {
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
                    <div className="flex justify-between items-end">
                        <div>
                            <h2 className="font-h2 text-h2 text-on-surface">Sales History</h2>
                            <p className="font-body-large text-body-large text-on-surface-variant">
                                Track all your artwork sales and transactions.
                            </p>
                        </div>
                        <button className="flex items-center gap-xs text-primary font-bold hover:underline">
                            <File className="text-sm" />
                            Export CSV
                        </button>
                    </div>

                    {salesLoading ? (
                        <div className="text-center py-12 text-on-surface-variant">
                            Loading sales history...
                        </div>
                    ) : salesHistory.length === 0 ? (
                        <div className="text-center py-12 text-on-surface-variant">
                            No sales recorded yet.
                        </div>
                    ) : (
                        <div className="bg-surface-container-lowest rounded-xl shadow-sm overflow-hidden border border-outline-variant/30">
                            <div className="overflow-x-auto custom-scrollbar">
                                <table className="w-full text-left border-collapse">
                                    <thead className="bg-surface-container-low border-b border-outline-variant/50">
                                        <tr>
                                            <th className="px-md py-md font-label-caps text-label-caps text-outline">
                                                Artwork
                                            </th>
                                            <th className="px-md py-md font-label-caps text-label-caps text-outline">
                                                Buyer
                                            </th>
                                            <th className="px-md py-md font-label-caps text-label-caps text-outline">
                                                Email
                                            </th>
                                            <th className="px-md py-md font-label-caps text-label-caps text-outline">
                                                Amount
                                            </th>
                                            <th className="px-md py-md font-label-caps text-label-caps text-outline">
                                                Date
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-outline-variant/20">
                                        {salesHistory.map((sale) => (
                                            <tr
                                                key={sale.id}
                                                className="hover:bg-surface-container-low/50 transition-colors"
                                            >
                                                <td className="px-md py-md">
                                                    <div className="flex items-center gap-md">
                                                        <div className="w-12 h-12 rounded bg-surface-variant overflow-hidden shrink-0 flex items-center justify-center border border-outline-variant/30">
                                                            {sale.artworkImage ? (
                                                                <img
                                                                    className="w-full h-full object-cover"
                                                                    alt={sale.artworkTitle}
                                                                    src={sale.artworkImage}
                                                                />
                                                            ) : (
                                                                <div className="w-6 h-6 text-on-surface-variant flex items-center justify-center">🖼️</div>
                                                            )}
                                                        </div>
                                                        {sale.artworkId ? (
                                                            <Link 
                                                                href={`/artwork/${sale.artworkId}`}
                                                                className="font-bold text-on-surface hover:text-primary transition-colors"
                                                            >
                                                                {sale.artworkTitle || 'Unknown'}
                                                            </Link>
                                                        ) : (
                                                            <span className="font-bold text-on-surface">
                                                                {sale.artworkTitle || 'Unknown'}
                                                            </span>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="px-md py-md font-body-large text-on-surface-variant">
                                                    {sale.buyerName || 'Unknown'}
                                                </td>
                                                <td className="px-md py-md font-body-large text-on-surface-variant">
                                                    {sale.buyerEmail || 'N/A'}
                                                </td>
                                                <td className="px-md py-md font-h3 text-h3 text-primary">
                                                    ${sale.amount?.toFixed(2) || '0.00'}
                                                </td>
                                                <td className="px-md py-md font-body-large text-on-surface-variant">
                                                    {sale.createdAt
                                                        ? new Date(sale.createdAt).toLocaleDateString()
                                                        : 'N/A'}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </section>
            )}

            {tab === 'profile' && (
                <ProfileSettings/>
            )}
        </div>
    );
}