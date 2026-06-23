'use client';
import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { File } from '@gravity-ui/icons';
import ArtworkForm from './ArtworkForm';
import ArtworkTable from './ArtworkTable';
import ProfileSettings from '../ProfileSettings';
import { artistArtworks } from '@/data/artistArtworks';
import { salesHistory as initialSalesHistory } from '@/data/salesHistory';

export default function ArtistDashboardTabs() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const tab = searchParams.get('tab') || 'add'; // default tab

    // local state for artworks
    const [artworks, setArtworks] = useState(artistArtworks);
    const [artworkToEdit, setArtworkToEdit] = useState(null);
    const [salesHistory, setSalesHistory] = useState(initialSalesHistory);

    // reset edit state during rendering when tab changes
    const [prevTab, setPrevTab] = useState(tab);
    if (tab !== prevTab) {
        setPrevTab(tab);
        setArtworkToEdit(null);
    }

    const handleAddArtwork = (newWork) => {
        const nextId = artworks.length > 0 ? Math.max(...artworks.map(a => a.id)) + 1 : 1;
        const workToAdd = {
            ...newWork,
            id: nextId,
        };
        setArtworks([workToAdd, ...artworks]);
        toast.success(`Successfully published "${newWork.title}" to gallery!`);
        // Navigate to manage tab
        router.push('/dashboard/artist?tab=manage');
    };

    const handleUpdateArtwork = (updatedWork) => {
        setArtworks(artworks.map(art => art.id === updatedWork.id ? updatedWork : art));
        toast.success(`Successfully updated "${updatedWork.title}"!`);
        setArtworkToEdit(null);
    };

    const handleDeleteArtwork = (id) => {
        const itemToDelete = artworks.find(art => art.id === id);
        if (confirm(`Are you sure you want to delete "${itemToDelete?.title || 'this artwork'}"?`)) {
            setArtworks(artworks.filter(art => art.id !== id));
            toast.success(`Successfully deleted "${itemToDelete?.title || 'artwork'}"!`);
        }
    };

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
                            <h1 className="font-h1-desktop text-h1-desktop text-on-surface">
                                Sales History
                            </h1>
                            <p className="font-body-large text-body-large text-on-surface-variant">
                                Monitor your revenue stream and buyer digital certificate deliveries.
                            </p>
                        </div>
                        <button className="flex items-center gap-xs text-primary font-bold hover:underline">
                            <File className="text-sm" />
                            Export Statement
                        </button>
                    </div>

                    <div className="bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/30 overflow-hidden">
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
                                            Date
                                        </th>
                                        <th className="px-md py-md font-label-caps text-label-caps text-outline text-right">
                                            Amount
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-outline-variant/20">
                                    {salesHistory.map((item) => (
                                        <tr key={item.id} className="hover:bg-surface-container-low/50 transition-colors">
                                            <td className="px-md py-md">
                                                <div className="flex items-center gap-md">
                                                    <div 
                                                        className="w-12 h-12 rounded-lg bg-cover bg-center shrink-0 border border-outline-variant/20"
                                                        style={{ backgroundImage: `url('${item.image}')` }}
                                                    />
                                                    <span className="font-bold text-on-surface">{item.artwork}</span>
                                                </div>
                                            </td>
                                            <td className="px-md py-md font-body-large text-on-surface-variant">
                                                <div>
                                                    <p className="font-semibold text-on-surface">{item.buyer}</p>
                                                    <p className="text-body-small text-outline">{item.buyerEmail}</p>
                                                </div>
                                            </td>
                                            <td className="px-md py-md font-body-large text-on-surface-variant">
                                                {item.date}
                                            </td>
                                            <td className="px-md py-md font-h3 text-h3 text-primary text-right">
                                                {item.amount}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </section>
            )}

            {tab === 'profile' && (
                <ProfileSettings
                    initialName="Elena Vance"
                    initialEmail="elena.v@email.com"
                    initialBio="Professional curator and generative artist."
                    initialAvatar="https://lh3.googleusercontent.com/aida-public/AB6AXuAen3Z8BAwbxhnggBVHO9O6xaU4-IDOVs0KPV5xE_qBBeif7m_2flj7qvsTFwRNAZP6CihzEIwsP8gRU7WKKUqbvguAH8Q9b1W8qOWWCDRKqBAuLB1g7lCFpERIll3IEMxGA15ocXuzklbbjMYRGehE7ZVJNQZSSHhYHcIAEsfcPjIwrdMapWlReBmm9WLTxqVyO_7bRUvi1Zzam6sp0EitYN_t48yEw3P-2iiavgzzddsRJ1moUP9lgLAPqpNlk1rK4-4GFUQBz7yT"
                />
            )}
        </div>
    );
}
