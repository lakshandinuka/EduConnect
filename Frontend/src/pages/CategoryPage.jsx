import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getCategoryItems, getCategory } from '../services/categoryService';
import KbLayout from '../components/kb/KbLayout';
import KbItemCard from '../components/kb/KbItemCard';
import KbItemRow from '../components/kb/KbItemRow';
import ViewToggle from '../components/kb/ViewToggle';
import { useToast, ToastContainer } from '../components/common/Toast';

const Skeleton = () => (
    <div className="bg-gray-200 rounded-lg animate-pulse h-40"></div>
);

export const CategoryPage = () => {
    const { categoryId } = useParams();
    const [category, setCategory] = useState(null);
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [view, setView] = useState('grid');
    const [sort, setSort] = useState('recent');
    const { toasts, showToast, removeToast } = useToast();

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const [categoryData, itemsData] = await Promise.all([
                    getCategory(categoryId),
                    getCategoryItems(categoryId, { sort }),
                ]);

                setCategory(categoryData);
                setItems(itemsData.items || itemsData || []);
            } catch (err) {
                showToast('Failed to load category', 'error');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [categoryId, sort]);

    if (!loading && !category) {
        return (
            <KbLayout variant="hub">
                <div className="text-center py-12">
                    <p className="text-gray-600">Category not found</p>
                </div>
            </KbLayout>
        );
    }

    return (
        <KbLayout variant="hub">
            {/* Category Header */}
            <div className="mb-8">
                {loading ? (
                    <div className="space-y-3">
                        <div className="h-8 bg-gray-200 rounded w-1/3 animate-pulse"></div>
                        <div className="h-4 bg-gray-200 rounded w-2/3 animate-pulse"></div>
                    </div>
                ) : (
                    <>
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">
                            {category?.name}
                        </h1>
                        {category?.description && (
                            <p className="text-gray-600">{category.description}</p>
                        )}
                    </>
                )}
            </div>

            {/* View Controls */}
            <div className="flex items-center justify-between mb-6">
                <p className="text-gray-600">
                    {items.length} {items.length === 1 ? 'item' : 'items'}
                </p>
                <div className="flex items-center gap-4">
                    <select
                        value={sort}
                        onChange={(e) => setSort(e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sfs-blue"
                    >
                        <option value="recent">Recently Updated</option>
                        <option value="popular">Most Popular</option>
                    </select>
                    <ViewToggle view={view} onChange={setView} />
                </div>
            </div>

            {/* Items */}
            {loading ? (
                <div
                    className={
                        view === 'grid'
                            ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
                            : 'space-y-4'
                    }
                >
                    {[...Array(6)].map((_, i) => (
                        <Skeleton key={i} />
                    ))}
                </div>
            ) : items.length > 0 ? (
                view === 'grid' ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {items.map((item) => (
                            <KbItemCard key={item.id} item={item} />
                        ))}
                    </div>
                ) : (
                    <div className="space-y-4">
                        {items.map((item) => (
                            <KbItemRow key={item.id} item={item} />
                        ))}
                    </div>
                )
            ) : (
                <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
                    <p className="text-gray-600">
                        No items in this category yet.
                    </p>
                </div>
            )}

            <ToastContainer toasts={toasts} onRemove={removeToast} />
        </KbLayout>
    );
};

export default CategoryPage;
