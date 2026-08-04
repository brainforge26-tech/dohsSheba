'use client';

import React, { useState, useEffect } from 'react';
import { fetchApi } from '@/lib/api-client';
import { CustomerEmptyState } from '@/components/dashboard/customer/CustomerEmptyState';
import { Star, Edit3, Trash2, Plus, Loader2 } from 'lucide-react';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { useConfirm } from '@/hooks/useConfirm';

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedRating, setSelectedRating] = useState(5);
  const [reviewText, setReviewText] = useState('');
  const { confirm, dialogProps } = useConfirm();

  useEffect(() => {
    setLoading(true);
    fetchApi<any[]>('/reviews/my-reviews')
      .then((res) => {
        if (res.success && Array.isArray(res.data) && res.data.length > 0) {
          const mapped = res.data.map((r: any) => ({
            id: r.id,
            product: r.product?.name || r.service?.title || 'Purchased Item',
            rating: r.rating,
            date: new Date(r.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
            comment: r.comment || '',
            seller: r.product?.sellerProfile?.shopName || 'Marketplace Seller',
          }));
          setReviews(mapped);
        } else {
          setReviews([]);
        }
      })
      .catch(() => setReviews([]))
      .finally(() => setLoading(false));
  }, []);

  const deleteReview = async (id: string) => {
    const ok = await confirm({
      title: 'Delete Review',
      message: 'Are you sure you want to delete this review?',
      confirmText: 'Delete Review',
      variant: 'danger',
    });
    if (!ok) return;
    try {
      await fetchApi(`/reviews/${id}`, { method: 'DELETE' });
      setReviews((prev) => prev.filter((r) => r.id !== id));
    } catch (err) {
      console.error('Failed to delete review', err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center gap-2">
            <Star className="w-6 h-6 text-amber-400 fill-amber-400" /> My Reviews & Ratings
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">Share feedback on products you purchased and manage your posted reviews</p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-xs transition-all shadow-lg hover:shadow-indigo-500/25 flex items-center gap-2 w-fit"
        >
          <Plus className="w-4 h-4" /> Write New Review
        </button>
      </div>

      {loading ? (
        <div className="py-16 text-center text-slate-400 bg-[#1e1f32] rounded-2xl border border-white/10">
          <Loader2 className="w-8 h-8 animate-spin mx-auto text-amber-400 mb-2" />
          <p className="font-semibold text-sm">Loading your reviews...</p>
        </div>
      ) : reviews.length === 0 ? (
        <CustomerEmptyState
          icon={Star}
          title="No Posted Reviews"
          description="You haven't written any product reviews or ratings yet. Your posted reviews will be managed here."
          actionText="View My Orders"
          actionHref="/dashboard/orders"
        />
      ) : (
        <div className="space-y-4">
          {reviews.map((rev) => (
            <div key={rev.id} className="rounded-2xl bg-[#1e1f32] border border-white/10 p-5 space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="font-bold text-white text-sm">{rev.product}</h3>
                  <p className="text-xs text-slate-400">Seller: <span className="text-indigo-300">{rev.seller}</span> · {rev.date}</p>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    title="Delete Review"
                    onClick={() => deleteReview(rev.id)}
                    className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Stars */}
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`w-4 h-4 ${star <= rev.rating ? 'text-amber-400 fill-amber-400' : 'text-slate-600'}`}
                  />
                ))}
              </div>

              <p className="text-xs text-slate-300 bg-white/5 p-3 rounded-xl border border-white/5">{rev.comment}</p>
            </div>
          ))}
        </div>
      )}

      {/* Write Review Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#1e1f32] border border-white/10 rounded-3xl p-6 max-w-lg w-full space-y-4 shadow-2xl">
            <h3 className="text-lg font-black text-white flex items-center gap-2">
              <Star className="w-5 h-5 text-amber-400 fill-amber-400" /> Write Product Review
            </h3>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Your Rating</label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => setSelectedRating(star)}
                      className="p-1 text-2xl transition-transform hover:scale-110"
                    >
                      <Star
                        className={`w-6 h-6 ${star <= selectedRating ? 'text-amber-400 fill-amber-400' : 'text-slate-600'}`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Your Review</label>
                <textarea
                  rows={3}
                  placeholder="What did you like or dislike about this product?"
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-white placeholder-slate-400 focus:outline-none"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-semibold text-slate-300"
              >
                Cancel
              </button>
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-xs font-bold text-white"
              >
                Post Review
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Confirm Dialog ── */}
      <ConfirmDialog {...dialogProps} />
    </div>
  );
}
