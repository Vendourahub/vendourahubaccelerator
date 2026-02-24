import React, { useState, useEffect } from 'react';
import { MessageSquare, Send, Users, Clock, TrendingUp, Filter, Search, Plus, Heart, MessageCircle, Share2, ChevronDown, X, Hash, Check, Copy } from 'lucide-react';
import { formatWATDateTime } from '../lib/time';
import { formatCurrency } from '../lib/currency';
import { getFounderProfile } from '../lib/authManager';
import { createCommunityPost, createCommunityReply, getCommunityPosts, getCommunityReplies, toggleCommunityPostLike } from '../lib/api';
import { toast } from 'sonner@2.0.3';
import { HelpPanel } from '../components/HelpPanel';

interface CommunityPost {
  id: string;
  author_id: string;
  author_name: string;
  author_stage: number;
  author_business: string;
  content: string;
  category: 'win' | 'tactic' | 'question' | 'update';
  timestamp: string;
  likes: number;
  comments: number;
  tags?: string[];
  likedBy?: string[]; // Array of founder IDs who liked this post
  replies?: Reply[];
}

interface Reply {
  id: string;
  post_id?: string;
  author_id: string;
  author_name: string;
  author_business: string;
  content: string;
  timestamp: string;
}

interface FounderProfile {
  id: string;
  name: string;
  business_name: string;
  current_stage: number;
  current_week: number;
}

export default function Community() {
  const [founder, setFounder] = useState<FounderProfile | null>(null);
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [newPost, setNewPost] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'win' | 'tactic' | 'question' | 'update'>('all');
  const [stageFilter, setStageFilter] = useState<'all' | number>('all');
  const [showNewPostForm, setShowNewPostForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selectedHashtag, setSelectedHashtag] = useState<string | null>(null);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');
  const [showReplies, setShowReplies] = useState<Record<string, boolean>>({});
  const [newPostCategory, setNewPostCategory] = useState<'win' | 'tactic' | 'question' | 'update'>('update');
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    loadFounderAndPosts();
  }, []);

  const mapReplyToUI = (reply: any): Reply => {
    return {
      id: reply.id,
      post_id: reply.post_id,
      author_id: reply.author_id,
      author_name: reply.author_name,
      author_business: reply.author_avatar || 'Founder',
      content: reply.content,
      timestamp: reply.created_at,
    };
  };

  const mapPostToUI = (post: any, founderProfile: FounderProfile | null, replies: Reply[] = []): CommunityPost => {
    return {
      id: post.id,
      author_id: post.author_id,
      author_name: post.author_name,
      author_stage: founderProfile?.current_stage || 1,
      author_business: post.topic || 'Founder Update',
      content: post.content,
      category: post.category,
      timestamp: post.created_at,
      likes: post.likes || 0,
      comments: post.reply_count || replies.length,
      tags: extractHashtags(post.content),
      likedBy: post.liked_by || [],
      replies,
    };
  };

  const loadFounderAndPosts = async () => {
    try {
      setLoading(true);
      setLoadError(null);
      
      // Get founder profile
      const profileResult = await getFounderProfile();
      let founderProfile: FounderProfile | null = null;
      if (profileResult.success && profileResult.data) {
        founderProfile = profileResult.data;
        setFounder(profileResult.data);
      } else {
        toast.error('Unable to load founder profile. Please re-login.');
      }

      const apiPosts = await getCommunityPosts();
      const postsWithReplies = await Promise.all(
        apiPosts.map(async (post: any) => {
          const replies = await getCommunityReplies(post.id);
          return mapPostToUI(post, founderProfile, replies.map(mapReplyToUI));
        })
      );
      setPosts(postsWithReplies);
    } catch (error) {
      console.error('Error loading community:', error);
      const message = error instanceof Error ? error.message : 'Failed to load community posts';
      setLoadError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  // Extract hashtags from text
  const extractHashtags = (text: string): string[] => {
    const hashtagRegex = /#[\w-]+/g;
    const matches = text.match(hashtagRegex);
    return matches ? matches.map(tag => tag.substring(1).toLowerCase()) : [];
  };

  // Get all hashtags from all posts
  const getAllHashtags = (): { tag: string; count: number }[] => {
    const hashtagMap: Record<string, number> = {};
    
    posts.forEach(post => {
      const hashtags = extractHashtags(post.content);
      hashtags.forEach(tag => {
        hashtagMap[tag] = (hashtagMap[tag] || 0) + 1;
      });
    });

    return Object.entries(hashtagMap)
      .map(([tag, count]) => ({ tag, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);
  };

  const handlePostSubmit = async () => {
    if (!newPost.trim()) return;
    if (!founder) {
      toast.error('Founder profile not loaded. Please refresh and try again.');
      return;
    }

    try {
      const createdPost = await createCommunityPost({
        author_name: founder.name,
        author_avatar: founder.business_name,
        topic: founder.business_name,
        category: newPostCategory,
        content: newPost,
      });

      const post = mapPostToUI(createdPost, founder, []);

      const updatedPosts = [post, ...posts];
      setPosts(updatedPosts);
      setNewPost('');
      setShowNewPostForm(false);
      toast.success('Post shared with the community!');
    } catch (error: any) {
      toast.error(error?.message || 'Failed to post. Please try again.');
    }
  };

  const handleLike = async (postId: string) => {
    if (!founder) {
      toast.error('Please sign in to like posts.');
      return;
    }

    try {
      const updatedPostFromApi = await toggleCommunityPostLike(postId);
      const updatedPosts = posts.map(post => {
        if (post.id === postId) {
          return {
            ...post,
            likes: updatedPostFromApi.likes || 0,
            likedBy: updatedPostFromApi.liked_by || [],
          };
        }
        return post;
      });

      setPosts(updatedPosts);
    } catch (error: any) {
      toast.error(error?.message || 'Failed to update like.');
    }
  };

  const handleReply = async (postId: string) => {
    if (!replyText.trim()) return;
    if (!founder) {
      toast.error('Founder profile not loaded. Please refresh and try again.');
      return;
    }

    try {
      const createdReply = await createCommunityReply(postId, {
        author_name: founder.name,
        author_avatar: founder.business_name,
        content: replyText,
      });

      const reply = mapReplyToUI(createdReply);

      const updatedPosts = posts.map(post => {
        if (post.id === postId) {
          return {
            ...post,
            replies: [...(post.replies || []), reply],
            comments: post.comments + 1
          };
        }
        return post;
      });

      setPosts(updatedPosts);
      setReplyText('');
      setReplyingTo(null);
      setShowReplies({ ...showReplies, [postId]: true });
      toast.success('Reply posted!');
    } catch (error: any) {
      toast.error(error?.message || 'Failed to post reply.');
    }
  };

  const handleShare = (post: CommunityPost) => {
    const shareText = `${post.author_name} (${post.author_business}): ${post.content}`;
    
    if (navigator.clipboard) {
      navigator.clipboard.writeText(shareText)
        .then(() => toast.success('Post copied to clipboard!'))
        .catch(() => toast.error('Failed to copy'));
    } else {
      toast.info('Share feature not available');
    }
  };

  const insertHashtag = (tag: string) => {
    setNewPost(prev => prev + (prev.endsWith(' ') ? '' : ' ') + '#' + tag + ' ');
  };

  const filteredPosts = posts.filter(post => {
    const categoryMatch = selectedCategory === 'all' || post.category === selectedCategory;
    const stageMatch = stageFilter === 'all' || post.author_stage === stageFilter;
    const hashtagMatch = !selectedHashtag || extractHashtags(post.content).includes(selectedHashtag);
    return categoryMatch && stageMatch && hashtagMatch;
  });

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'win': return 'bg-green-100 text-green-700 border-green-200';
      case 'tactic': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'question': return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'update': return 'bg-purple-100 text-purple-700 border-purple-200';
      default: return 'bg-neutral-100 text-neutral-700 border-neutral-200';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'win': return '🎉';
      case 'tactic': return '💡';
      case 'question': return '❓';
      case 'update': return '📊';
      default: return '💬';
    }
  };

  // Render post content with clickable hashtags
  const renderContentWithHashtags = (content: string) => {
    const parts = content.split(/(#[\w-]+)/g);
    
    return parts.map((part, index) => {
      if (part.startsWith('#')) {
        const tag = part.substring(1).toLowerCase();
        return (
          <span
            key={index}
            onClick={() => {
              setSelectedHashtag(tag);
              toast.info(`Filtering by #${tag}`);
            }}
            className="text-blue-600 hover:text-blue-800 cursor-pointer font-medium transition-colors"
          >
            {part}
          </span>
        );
      }
      return <span key={index}>{part}</span>;
    });
  };

  const trendingHashtags = getAllHashtags();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-neutral-900 mx-auto mb-4"></div>
          <p className="text-neutral-600">Loading community...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Header */}
      <div className="bg-white border-b border-neutral-200 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <MessageSquare className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold">Community</h1>
                <p className="text-sm text-neutral-600">Stage-filtered peer support</p>
              </div>
            </div>
            <button
              onClick={() => setShowNewPostForm(!showNewPostForm)}
              className="flex items-center justify-center gap-2 px-4 py-2 bg-neutral-900 text-white rounded-lg hover:bg-neutral-800 transition-colors font-medium"
            >
              <Plus className="w-5 h-5" />
              New Post
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Info Banner */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <Users className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <div className="font-medium text-blue-900 mb-1">Stage-Based Community</div>
              <p className="text-sm text-blue-800">
                Share wins, tactics, and questions with other founders. Use hashtags like #sales #pricing to make your posts discoverable.
                No fluff, no theory—just real tactics that are working right now.
              </p>
            </div>
          </div>
        </div>

        {/* Error Banner */}
        {loadError && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center justify-between gap-3">
              <div className="text-sm text-red-800">{loadError}</div>
              <button
                type="button"
                onClick={loadFounderAndPosts}
                disabled={loading}
                className="px-3 py-1.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:bg-red-300 disabled:cursor-not-allowed text-sm font-medium"
              >
                Retry
              </button>
            </div>
          </div>
        )}

        {/* Trending Hashtags */}
        {trendingHashtags.length > 0 && (
          <div className="bg-white rounded-lg border border-neutral-200 p-4">
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp className="w-4 h-4 text-orange-600" />
              <h3 className="font-bold text-neutral-900">Trending Hashtags</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {trendingHashtags.map(({ tag, count }) => (
                <button
                  key={tag}
                  onClick={() => {
                    setSelectedHashtag(selectedHashtag === tag ? null : tag);
                    toast.info(selectedHashtag === tag ? 'Filter cleared' : `Filtering by #${tag}`);
                  }}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                    selectedHashtag === tag
                      ? 'bg-blue-600 text-white'
                      : 'bg-blue-50 text-blue-700 hover:bg-blue-100'
                  }`}
                >
                  <Hash className="w-3 h-3" />
                  {tag}
                  <span className="text-xs opacity-75">({count})</span>
                </button>
              ))}
              {selectedHashtag && (
                <button
                  onClick={() => {
                    setSelectedHashtag(null);
                    toast.info('Filter cleared');
                  }}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-medium bg-neutral-100 text-neutral-700 hover:bg-neutral-200 transition-colors"
                >
                  <X className="w-3 h-3" />
                  Clear
                </button>
              )}
            </div>
          </div>
        )}

        {/* New Post Form */}
        {showNewPostForm && (
          <div className="bg-white rounded-lg border border-neutral-200 p-6">
            <div className="mb-4">
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Post Category <span className="text-red-600">*</span>
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4">
                {(['win', 'tactic', 'question', 'update'] as const).map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setNewPostCategory(cat)}
                    className={`px-4 py-3 rounded-lg text-sm font-bold border-2 transition-all ${
                      newPostCategory === cat
                        ? `${getCategoryColor(cat)} border-current`
                        : 'bg-white text-neutral-600 border-neutral-200 hover:border-neutral-300'
                    }`}
                  >
                    <div className="text-2xl mb-1">{getCategoryIcon(cat)}</div>
                    {cat.charAt(0).toUpperCase() + cat.slice(1)}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Share with the community
              </label>
              <textarea
                value={newPost}
                onChange={(e) => setNewPost(e.target.value)}
                placeholder="Share a win, tactic, question, or update... Use #hashtags to make it discoverable!"
                className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-neutral-500 focus:border-neutral-500 outline-none resize-none"
                rows={4}
              />
              
              {/* Quick hashtag insert */}
              {trendingHashtags.length > 0 && (
                <div className="mt-3">
                  <div className="text-xs text-neutral-600 mb-2">Quick insert trending hashtags:</div>
                  <div className="flex flex-wrap gap-2">
                    {trendingHashtags.slice(0, 5).map(({ tag }) => (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => insertHashtag(tag)}
                        className="inline-flex items-center gap-1 px-2 py-1 bg-neutral-100 text-neutral-700 hover:bg-neutral-200 rounded text-xs transition-colors"
                      >
                        <Plus className="w-3 h-3" />
                        #{tag}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <div className="flex items-center justify-between">
              <p className="text-xs text-neutral-500">
                Your post will be visible to all founders in the cohort
              </p>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowNewPostForm(false);
                    setNewPostCategory('update');
                  }}
                  className="px-4 py-2 text-neutral-700 hover:bg-neutral-100 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handlePostSubmit}
                  disabled={!newPost.trim()}
                  className="flex items-center gap-2 px-4 py-2 bg-neutral-900 text-white rounded-lg hover:bg-neutral-800 transition-colors disabled:bg-neutral-300 disabled:cursor-not-allowed"
                >
                  <Send className="w-4 h-4" />
                  Post
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="bg-white rounded-lg border border-neutral-200 p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Category Filter */}
            <div className="flex-1">
              <label className="block text-xs font-medium text-neutral-600 mb-2">Category</label>
              <div className="flex flex-wrap gap-2">
                {['all', 'win', 'tactic', 'question', 'update'].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat as any)}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                      selectedCategory === cat
                        ? 'bg-neutral-900 text-white'
                        : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                    }`}
                  >
                    {cat === 'all' ? 'All' : getCategoryIcon(cat)} {cat.charAt(0).toUpperCase() + cat.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {/* Stage Filter */}
            <div>
              <label className="block text-xs font-medium text-neutral-600 mb-2">Stage</label>
              <select
                value={stageFilter}
                onChange={(e) => setStageFilter(e.target.value === 'all' ? 'all' : Number(e.target.value))}
                className="px-3 py-1.5 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-neutral-500 focus:border-neutral-500 outline-none text-sm"
              >
                <option value="all">All Stages</option>
                <option value="1">Stage 1</option>
                <option value="2">Stage 2</option>
                <option value="3">Stage 3</option>
                <option value="4">Stage 4</option>
                <option value="5">Stage 5</option>
              </select>
            </div>
          </div>
        </div>

        {/* Posts Feed */}
        <div className="space-y-4">
          {filteredPosts.length === 0 ? (
            <div className="bg-white rounded-lg border border-neutral-200 p-12 text-center">
              <MessageSquare className="w-16 h-16 text-neutral-300 mx-auto mb-4" />
              <div className="text-xl font-bold text-neutral-900 mb-2">No posts yet</div>
              <p className="text-neutral-600 mb-4">
                {selectedCategory === 'all' && stageFilter === 'all' && !selectedHashtag
                  ? 'Be the first to share with the community!'
                  : 'No posts match your filters. Try adjusting them.'}
              </p>
              <button
                onClick={() => setShowNewPostForm(true)}
                className="inline-flex items-center gap-2 px-4 py-2 bg-neutral-900 text-white rounded-lg hover:bg-neutral-800 transition-colors"
              >
                <Plus className="w-5 h-5" />
                Create First Post
              </button>
            </div>
          ) : (
            filteredPosts.map((post) => {
              const hasLiked = founder && post.likedBy?.includes(founder.id);
              
              return (
                <div key={post.id} className="bg-white rounded-lg border border-neutral-200 p-6 hover:shadow-md transition-shadow">
                  {/* Post Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start gap-3 flex-1">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold flex-shrink-0">
                        {post.author_name.charAt(0)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-bold text-neutral-900">{post.author_name}</span>
                          <span className="px-2 py-0.5 bg-neutral-100 text-neutral-700 rounded text-xs font-medium">
                            Stage {post.author_stage}
                          </span>
                        </div>
                        <div className="text-sm text-neutral-600 truncate">{post.author_business}</div>
                        <div className="flex items-center gap-1 text-xs text-neutral-500 mt-1">
                          <Clock className="w-3 h-3" />
                          {formatWATDateTime(new Date(post.timestamp))}
                        </div>
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-lg text-xs font-bold border ${getCategoryColor(post.category)} flex-shrink-0`}>
                      {getCategoryIcon(post.category)} {post.category.toUpperCase()}
                    </span>
                  </div>

                  {/* Post Content with clickable hashtags */}
                  <div className="text-neutral-900 mb-4 leading-relaxed whitespace-pre-wrap">
                    {renderContentWithHashtags(post.content)}
                  </div>

                  {/* Post Tags */}
                  {post.tags && post.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {post.tags.map((tag, idx) => (
                        <button
                          key={idx}
                          onClick={() => {
                            setSelectedHashtag(selectedHashtag === tag ? null : tag);
                            toast.info(selectedHashtag === tag ? 'Filter cleared' : `Filtering by #${tag}`);
                          }}
                          className={`px-2 py-1 rounded text-xs font-medium transition-colors ${
                            selectedHashtag === tag
                              ? 'bg-blue-600 text-white'
                              : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                          }`}
                        >
                          #{tag}
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Post Actions */}
                  <div className="flex items-center gap-6 pt-4 border-t border-neutral-100">
                    <button
                      onClick={() => handleLike(post.id)}
                      className={`flex items-center gap-2 text-sm transition-colors ${
                        hasLiked 
                          ? 'text-red-600 hover:text-red-700' 
                          : 'text-neutral-600 hover:text-red-600'
                      }`}
                    >
                      <Heart className={`w-4 h-4 ${hasLiked ? 'fill-current' : ''}`} />
                      <span className="font-medium">{post.likes}</span>
                    </button>
                    <button 
                      onClick={() => {
                        setReplyingTo(replyingTo === post.id ? null : post.id);
                        setShowReplies({ ...showReplies, [post.id]: true });
                      }}
                      className="flex items-center gap-2 text-sm text-neutral-600 hover:text-blue-600 transition-colors"
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span className="font-medium">{post.comments}</span>
                    </button>
                    <button 
                      onClick={() => handleShare(post)}
                      className="flex items-center gap-2 text-sm text-neutral-600 hover:text-green-600 transition-colors"
                    >
                      <Share2 className="w-4 h-4" />
                      <span className="font-medium">Share</span>
                    </button>
                  </div>

                  {/* Replies Section */}
                  {post.replies && post.replies.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-neutral-100">
                      <button
                        onClick={() => setShowReplies({ ...showReplies, [post.id]: !showReplies[post.id] })}
                        className="text-sm text-neutral-600 hover:text-neutral-900 font-medium mb-3 flex items-center gap-1"
                      >
                        {showReplies[post.id] ? 'Hide' : 'Show'} {post.replies.length} {post.replies.length === 1 ? 'reply' : 'replies'}
                        <ChevronDown className={`w-4 h-4 transition-transform ${showReplies[post.id] ? 'rotate-180' : ''}`} />
                      </button>
                      
                      {showReplies[post.id] && (
                        <div className="space-y-3">
                          {post.replies.map((reply) => (
                            <div key={reply.id} className="bg-neutral-50 rounded-lg p-3">
                              <div className="flex items-start gap-2 mb-2">
                                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-green-500 to-blue-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                                  {reply.author_name.charAt(0)}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="font-medium text-sm text-neutral-900">{reply.author_name}</div>
                                  <div className="text-xs text-neutral-600 truncate">{reply.author_business}</div>
                                </div>
                                <div className="text-xs text-neutral-500 flex-shrink-0">
                                  {formatWATDateTime(new Date(reply.timestamp))}
                                </div>
                              </div>
                              <div className="text-sm text-neutral-900 leading-relaxed pl-8">
                                {reply.content}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Reply Input */}
                  {replyingTo === post.id && (
                    <div className="mt-4 pt-4 border-t border-neutral-100">
                      <div className="flex gap-2">
                        <textarea
                          value={replyText}
                          onChange={(e) => setReplyText(e.target.value)}
                          placeholder="Write a reply..."
                          className="flex-1 px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-neutral-500 focus:border-neutral-500 outline-none resize-none text-sm"
                          rows={2}
                        />
                        <div className="flex flex-col gap-2">
                          <button
                            onClick={() => handleReply(post.id)}
                            disabled={!replyText.trim()}
                            className="px-4 py-2 bg-neutral-900 text-white rounded-lg hover:bg-neutral-800 transition-colors disabled:bg-neutral-300 disabled:cursor-not-allowed text-sm font-medium"
                          >
                            <Send className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => {
                              setReplyingTo(null);
                              setReplyText('');
                            }}
                            className="px-4 py-2 bg-neutral-100 text-neutral-700 rounded-lg hover:bg-neutral-200 transition-colors text-sm font-medium"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Community Guidelines */}
        <div className="bg-neutral-100 border border-neutral-200 rounded-lg p-6">
          <h3 className="font-bold text-neutral-900 mb-3">Community Guidelines</h3>
          <ul className="space-y-2 text-sm text-neutral-700">
            <li className="flex items-start gap-2">
              <span className="text-green-600 font-bold">✓</span>
              <span><strong>DO:</strong> Share specific tactics with numbers and use #hashtags (e.g., "Sent 100 DMs, got 23 responses #cold-outreach")</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-600 font-bold">✓</span>
              <span><strong>DO:</strong> Ask actionable questions that help you execute this week</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-600 font-bold">✓</span>
              <span><strong>DO:</strong> Celebrate wins and acknowledge struggles honestly</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-red-600 font-bold">✗</span>
              <span><strong>DON'T:</strong> Share generic advice or motivational quotes</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-red-600 font-bold">✗</span>
              <span><strong>DON'T:</strong> Promote external products, services, or opportunities</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}