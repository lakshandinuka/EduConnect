import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { searchKB } from '../services/searchService';
import { getCategories } from '../services/categoryService';
import KbLayout from '../components/kb/KbLayout';
import KbItemCard from '../components/kb/KbItemCard';
import KbItemRow from '../components/kb/KbItemRow';
import FilterPanel from '../components/kb/FilterPanel';
import ViewToggle from '../components/kb/ViewToggle';
import { useToast, ToastContainer } from '../components/common/Toast';

const Skeleton = () => (
    <div className="bg-gray-200 rounded-lg animate-pulse h-40"></div>
);

export const SearchPage = () => {
    const [searchParams] = useSearchParams();
    const query = searchParams.get('q') || '';
    
    const [results, setResults] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [view, setView] = useState('grid');
    const [showFilters, setShowFilters] = useState(true);
    const [totalResults, setTotalResults] = useState(0);
    const [filters, setFilters] = useState({
        category: '',
        type: '',
        sort: 'relevance',
    });
    const { toasts, showToast, removeToast } = useToast();

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const data = await getCategories();
                
                if (Array.isArray(data)) {
                    setCategories(data);
                } else if (Array.isArray(data?.categories)) {
                    setCategories(data.categories);
                } else if (Array.isArray(data?.items)) {
                    setCategories(data.items);
                } else {
                    setCategories([]);
                }
            } catch (err) {
                showToast('Failed to load categories', 'error');
                setCategories([]);
            }
        };

        fetchCategories();
    }, []);

    useEffect(() => {
        if (!query.trim()) {
            setResults([]);
            return;
        }

        const performSearch = async () => {
            try {
                setLoading(true);
                const data = await searchKB(query, filters);
                setResults(data.items || data.results || []);
                setTotalResults(data.total || 0);
            } catch (err) {
                showToast('Search failed', 'error');
                setResults([]);
            } finally {
                setLoading(false);
            }
        };

        performSearch();
    }, [query, filters]);

    const handleFilterChange = (newFilters) => {
        setFilters(newFilters);
    };

    return (
        <KbLayout variant="hub">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* Sidebar - Filters (Desktop) */}
                <aside
                    className={`${
                        showFilters ? 'block' : 'hidden'
                    } lg:block lg:col-span-1`}
                >
                    <div className="bg-white rounded-lg border border-gray-200 p-4 sticky top-4">
                        <FilterPanel
                            categories={categories}
                            onFilterChange={handleFilterChange}
                            isOpen={showFilters}
                            onToggle={() => setShowFilters(!showFilters)}
                        />
                    </div>
                </aside>

                {/* Main Content */}
                <main className="lg:col-span-3">
                    {/* Header */}
                    <div className="mb-6">
                        <div className="flex items-center justify-between mb-4">
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">
                                    Search Results
                                </h1>
                                <p className="text-gray-600 text-sm mt-1">
                                    {totalResults > 0 ? (
                                        <>
                                            Found <strong>{totalResults}</strong> results for{' '}
                                            <strong>"{query}"</strong>
                                        </>
                                    ) : (
                                        <>No results found for "{query}"</>
                                    )}
                                </p>
                            </div>
                            <ViewToggle view={view} onChange={setView} />
                        </div>

                        {/* Mobile Filter Toggle */}
                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            className="lg:hidden px-4 py-2 bg-sfs-blue/10 text-sfs-blue rounded hover:bg-sfs-blue/10 text-sm font-medium"
                        >
                            {showFilters ? '✕ Hide Filters' : '☰ Show Filters'}
                        </button>
                    </div>

                    {/* Results */}
                    {loading ? (
                        <div
                            className={
                                view === 'grid'
                                    ? 'grid grid-cols-1 md:grid-cols-2 gap-6'
                                    : 'space-y-4'
                            }
                        >
                            {[...Array(6)].map((_, i) => (
                                <Skeleton key={i} />
                            ))}
                        </div>
                    ) : results.length > 0 ? (
                        view === 'grid' ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {results.map((item) => (
                                    <KbItemCard key={item.id} item={item} />
                                ))}
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {results.map((item) => (
                                    <KbItemRow key={item.id} item={item} />
                                ))}
                            </div>
                        )
                    ) : (
                        <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
                            <p className="text-gray-600 mb-4">
                                No results found. Try adjusting your search or filters.
                            </p>
                        </div>
                    )}
                </main>
            </div>

            <ToastContainer toasts={toasts} onRemove={removeToast} />
        </KbLayout>
    );
};

export default SearchPage;
