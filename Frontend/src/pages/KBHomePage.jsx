import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getKBHome, getRecommendedItems, getTrendingItems, getFeaturedItems } from '../services/kbService';
import { getCategories } from '../services/categoryService';
import KbLayout from '../components/kb/KbLayout';
import KbItemCard from '../components/kb/KbItemCard';
import CategoryTile from '../components/kb/CategoryTile';
import { useToast, ToastContainer } from '../components/common/Toast';

const Skeleton = () => (
    <div className="bg-gray-200 rounded-lg animate-pulse h-48"></div>
);

export const KBHomePage = () => {
    const [recommendations, setRecommendations] = useState([]);
    const [trending, setTrending] = useState([]);
    const [categories, setCategories] = useState([]);
    const [featuredArticles, setFeaturedArticles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { toasts, showToast, removeToast } = useToast();

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const [homeData, categoriesData, featuredData] = await Promise.all([
                    getKBHome(),
                    getCategories(),
                    getFeaturedItems()
                ]);

                setRecommendations(Array.isArray(homeData?.recommended) ? homeData.recommended : []);
                setTrending(Array.isArray(homeData?.trending) ? homeData.trending : []);
                setCategories(Array.isArray(categoriesData) ? categoriesData : []);

                // Use featured items from the service
                setFeaturedArticles(Array.isArray(featuredData) ? featuredData : []);
            } catch (err) {
                setError('Failed to load knowledge base home');
                showToast('Error loading content', 'error');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    return (
        <KbLayout variant="hub">
            {/* Recommended Section */}
            <section className="mb-12">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">
                        Recommended for You
                    </h2>
                </div>

                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[...Array(6)].map((_, i) => (
                            <Skeleton key={i} />
                        ))}
                    </div>
                ) : recommendations.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {recommendations.slice(0, 6).map((item) => (
                            <KbItemCard key={item.id} item={item} />
                        ))}
                    </div>
                ) : (
                    <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
                        <p className="text-gray-600">
                            No recommendations available yet. Browse by category below or use search.
                        </p>
                    </div>
                )}
            </section>

            {/* Browse by Category Section */}
            <section className="mb-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                    Browse by Category
                </h2>

                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[...Array(4)].map((_, i) => (
                            <Skeleton key={i} />
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {(Array.isArray(categories) ? categories : []).map((category) => (
                            <CategoryTile
                                key={category.id}
                                category={category}
                                itemCount={category.itemCount || 0}
                            />
                        ))}
                    </div>
                )}
            </section>

            {/* Trending Section */}
            <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                    Recently Updated
                </h2>

                {loading ? (
                    <div className="space-y-4">
                        {[...Array(3)].map((_, i) => (
                            <Skeleton key={i} />
                        ))}
                    </div>
                ) : trending.length > 0 ? (
                    <div className="space-y-4">
                        {trending.slice(0, 6).map((item) => (
                            <KbItemCard key={item.id} item={item} />
                        ))}
                    </div>
                ) : (
                    <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
                        <p className="text-gray-600">
                            No trending content at the moment.
                        </p>
                    </div>
                )}
            </section>

            {/* Featured Articles Section */}
            <section className="mb-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                    Featured Articles
                </h2>

                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {[...Array(4)].map((_, i) => (
                            <Skeleton key={i} />
                        ))}
                    </div>
                ) : featuredArticles.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {featuredArticles.map((article) => (
                            <div key={article.id} className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow cursor-pointer">
                                <div className="flex items-start justify-between mb-3">
                                    <span className="text-sm text-sfs-blue bg-sfs-blue/10 px-2 py-1 rounded">
                                        {typeof article.category === 'string'
                                            ? article.category
                                            : article.category?.name || 'General'}
                                    </span>
                                    <div className="text-right text-sm text-gray-500">
                                        <div>{article.views} views</div>
                                        <div>{article.helpful}% helpful</div>
                                    </div>
                                </div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                    <Link
                                        to={`/kb/item/${article.id}`}
                                        className="hover:text-sfs-blue transition-colors"
                                    >
                                        {article.title}
                                    </Link>
                                </h3>
                                <p className="text-gray-600 text-sm leading-relaxed">
                                    {article.description}
                                </p>
                                <div className="mt-4">
                                    <Link
                                        to={`/kb/item/${article.id}`}
                                        className="text-sfs-blue hover:text-sfs-blue text-sm font-medium"
                                    >
                                        Read Article →
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
                        <p className="text-gray-600">
                            No featured articles available at the moment.
                        </p>
                    </div>
                )}
            </section>

            {/* FAQ Section */}
            <section className="mb-12">
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-8 text-center">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">
                        Have Questions?
                    </h2>
                    <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                        Check out our comprehensive FAQ section for answers to common questions about using the portal, assignments, exams, and more.
                    </p>
                    <Link
                        to="/kb/faq"
                        className="inline-flex items-center px-6 py-3 bg-sfs-blue text-white rounded-lg hover:bg-sfs-blue transition-colors"
                    >
                        View FAQ
                        <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </Link>
                </div>
            </section>

            <ToastContainer toasts={toasts} onRemove={removeToast} />
        </KbLayout>
    );
};

export default KBHomePage;
