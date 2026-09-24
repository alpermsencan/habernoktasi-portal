'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { MessageSquare, ThumbsUp, Send, CheckCircle2, AlertCircle } from 'lucide-react';

export default function CommentsSection({ initialComments = [] }) {
  const [comments, setComments] = useState(initialComments);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [likedComments, setLikedComments] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const handleLike = (id) => {
    if (likedComments[id]) return; // already liked

    setComments((prev) =>
      prev.map((c) => (c.id === id ? { ...c, likes: c.likes + 1 } : c))
    );
    setLikedComments((prev) => ({ ...prev, [id]: true }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) return;

    const newComment = {
      id: `c-${Date.now()}`,
      userName: name,
      userAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=80&q=80',
      date: 'Az önce',
      likes: 0,
      content: message,
    };

    setComments([newComment, ...comments]);
    setName('');
    setEmail('');
    setMessage('');
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 4000);
  };

  return (
    <section className="mt-12 pt-8 border-t-2 border-neutral-200 dark:border-neutral-800" aria-label="Yorumlar">
      {/* Section Title */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-hurriyet-red" />
          <h3 className="text-xl font-black text-neutral-900 dark:text-white uppercase tracking-tight">
            YORUMLAR ({comments.length})
          </h3>
        </div>
        <span className="text-xs text-neutral-500 dark:text-neutral-400">
          Yorumlar moderasyon onayından sonra yayınlanabilir.
        </span>
      </div>

      {/* Comment Submission Form */}
      <div className="bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-5 mb-8 shadow-sm">
        <h4 className="text-sm font-bold text-neutral-800 dark:text-neutral-100 mb-3">
          Fikrinizi Paylaşın
        </h4>

        {submitted ? (
          <div className="p-4 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-300 dark:border-emerald-800 rounded-lg flex items-center gap-3 text-emerald-700 dark:text-emerald-300 text-sm">
            <CheckCircle2 className="w-5 h-5 shrink-0" />
            <span>Yorumunuz başarıyla eklendi! Teşekkür ederiz.</span>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-neutral-600 dark:text-neutral-400 mb-1">
                  Adınız Soyadınız *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Örn: Ahmet Kaya"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-hurriyet-red"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-600 dark:text-neutral-400 mb-1">
                  E-Posta Adresiniz * (Gizli tutulur)
                </label>
                <input
                  type="email"
                  required
                  placeholder="ornek@domain.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-hurriyet-red"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-600 dark:text-neutral-400 mb-1">
                Yorumunuz *
              </label>
              <textarea
                required
                rows={3}
                placeholder="Haber hakkındaki görüşlerinizi yazın (Küfür, hakaret ve nefret söylemi içeren yorumlar onaylanmaz)..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-hurriyet-red"
              />
            </div>

            <div className="flex items-center justify-between pt-1">
              <span className="text-[11px] text-neutral-400">
                Göndererek Topluluk Kurallarını kabul etmiş sayılırsınız.
              </span>
              <button
                type="submit"
                className="inline-flex items-center gap-1.5 px-5 py-2 bg-hurriyet-red hover:bg-hurriyet-darkRed text-white text-xs font-bold rounded-lg transition shadow"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Yorumu Gönder</span>
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Comments List */}
      <div className="space-y-4">
        {comments.map((comment) => {
          const isLiked = likedComments[comment.id];
          return (
            <div
              key={comment.id}
              className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-4 shadow-sm"
            >
              <div className="flex items-start justify-between gap-3 mb-2">
                <div className="flex items-center gap-3">
                  <div className="relative w-9 h-9 rounded-full overflow-hidden shrink-0 border border-neutral-300 dark:border-neutral-700 bg-neutral-100">
                    <Image
                      src={comment.userAvatar}
                      alt={comment.userName}
                      fill
                      sizes="36px"
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <h5 className="font-bold text-xs text-neutral-900 dark:text-white">
                      {comment.userName}
                    </h5>
                    <span className="text-[11px] text-neutral-400">
                      {comment.date}
                    </span>
                  </div>
                </div>

                {/* Like Button */}
                <button
                  onClick={() => handleLike(comment.id)}
                  className={`inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full border transition ${
                    isLiked
                      ? 'border-hurriyet-red text-hurriyet-red bg-red-50 dark:bg-red-950/40'
                      : 'border-neutral-200 dark:border-neutral-700 text-neutral-500 hover:text-hurriyet-red hover:border-hurriyet-red'
                  }`}
                >
                  <ThumbsUp className={`w-3.5 h-3.5 ${isLiked ? 'fill-hurriyet-red' : ''}`} />
                  <span className="font-semibold">{comment.likes}</span>
                </button>
              </div>

              <p className="text-xs sm:text-sm text-neutral-700 dark:text-neutral-300 leading-relaxed pl-12">
                {comment.content}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
