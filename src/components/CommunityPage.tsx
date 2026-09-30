import { useState, useEffect } from 'react';
import { ArrowLeft, MessageSquare, Trash2, Plus, MessageCircle, X, Loader2 } from 'lucide-react';
import { db } from '../lib/firebase.ts';
import { collection, query, orderBy, getDocs, addDoc, serverTimestamp, deleteDoc, doc, updateDoc, increment, where } from 'firebase/firestore';
import bgImage from '../assets/hero_section/ladakh.png';
import { Post, Comment } from '../types.ts';

interface CommunityPageProps {
  currentUser: any;
  onBackToHome: () => void;
  onNavigateToLogin: () => void;
}

export function CommunityPage({ currentUser, onBackToHome, onNavigateToLogin }: CommunityPageProps) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  
  // State for new post modal
  const [isNewPostOpen, setIsNewPostOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newBody, setNewBody] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // State for post detail view
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newCommentBody, setNewCommentBody] = useState('');
  const [loadingComments, setLoadingComments] = useState(false);

  useEffect(() => {
    if (currentUser) {
      fetchPosts();
    }
  }, [currentUser]);

  const fetchPosts = async () => {
    try {
      const q = query(collection(db, 'posts'), orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);
      setPosts(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Post)));
    } catch (err) {
      console.error('Error fetching posts', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchComments = async (postId: string) => {
    setLoadingComments(true);
    try {
      const q = query(collection(db, 'comments'), where('postId', '==', postId), orderBy('createdAt', 'asc'));
      const snapshot = await getDocs(q);
      // Fallback sort client-side in case index is missing
      const fetchedComments = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Comment));
      fetchedComments.sort((a, b) => {
        const timeA = a.createdAt?.toMillis ? a.createdAt.toMillis() : 0;
        const timeB = b.createdAt?.toMillis ? b.createdAt.toMillis() : 0;
        return timeA - timeB;
      });
      setComments(fetchedComments);
    } catch (err) {
      console.error('Error fetching comments', err);
      // If missing index for orderBy, just fetch and sort client side
      try {
        const q2 = query(collection(db, 'comments'), where('postId', '==', postId));
        const snap = await getDocs(q2);
        const fetchedComments = snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Comment));
        fetchedComments.sort((a, b) => {
          const timeA = a.createdAt?.toMillis ? a.createdAt.toMillis() : 0;
          const timeB = b.createdAt?.toMillis ? b.createdAt.toMillis() : 0;
          return timeA - timeB;
        });
        setComments(fetchedComments);
      } catch (err2) {
        console.error('Fallback fetching failed', err2);
      }
    } finally {
      setLoadingComments(false);
    }
  };

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newBody.trim() || !currentUser) return;
    setIsSubmitting(true);
    try {
      await addDoc(collection(db, 'posts'), {
        authorId: currentUser.uid,
        authorName: currentUser.displayName || currentUser.email || 'Traveler',
        title: newTitle.trim(),
        body: newBody.trim(),
        commentCount: 0,
        createdAt: serverTimestamp()
      });
      setNewTitle('');
      setNewBody('');
      setIsNewPostOpen(false);
      fetchPosts();
    } catch (err) {
      console.error('Error creating post', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCreateComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommentBody.trim() || !selectedPost || !selectedPost.id || !currentUser) return;
    setIsSubmitting(true);
    try {
      await addDoc(collection(db, 'comments'), {
        postId: selectedPost.id,
        authorId: currentUser.uid,
        authorName: currentUser.displayName || currentUser.email || 'Traveler',
        body: newCommentBody.trim(),
        createdAt: serverTimestamp()
      });
      
      // Update post comment count
      await updateDoc(doc(db, 'posts', selectedPost.id), {
        commentCount: increment(1)
      });
      
      setNewCommentBody('');
      fetchComments(selectedPost.id);
      
      // Update local state for post count
      const updatedPost = { ...selectedPost, commentCount: selectedPost.commentCount + 1 };
      setSelectedPost(updatedPost);
      setPosts(posts.map(p => p.id === selectedPost.id ? updatedPost : p));
    } catch (err) {
      console.error('Error creating comment', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeletePost = async (postId: string) => {
    if (!confirm('Are you sure you want to delete this post?')) return;
    try {
      await deleteDoc(doc(db, 'posts', postId));
      setPosts(posts.filter(p => p.id !== postId));
      if (selectedPost?.id === postId) setSelectedPost(null);
    } catch (err) {
      console.error('Error deleting post', err);
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    if (!selectedPost || !selectedPost.id) return;
    if (!confirm('Are you sure you want to delete this comment?')) return;
    try {
      await deleteDoc(doc(db, 'comments', commentId));
      
      // Update post comment count
      await updateDoc(doc(db, 'posts', selectedPost.id), {
        commentCount: increment(-1)
      });
      
      setComments(comments.filter(c => c.id !== commentId));
      
      // Update local state for post count
      const updatedPost = { ...selectedPost, commentCount: Math.max(0, selectedPost.commentCount - 1) };
      setSelectedPost(updatedPost);
      setPosts(posts.map(p => p.id === selectedPost.id ? updatedPost : p));
    } catch (err) {
      console.error('Error deleting comment', err);
    }
  };

  const openPostDetail = (post: Post) => {
    setSelectedPost(post);
    fetchComments(post.id!);
  };

  return (
    <div 
      className="min-h-screen text-slate-800 antialiased flex flex-col font-sans bg-cover bg-center bg-fixed relative"
      style={{ backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.45), rgba(0, 0, 0, 0.45)), url(${bgImage})` }}
    >
      {/* Top Navbar */}
      <header className="sticky top-0 z-40 bg-[#e1ecf7]/85 backdrop-blur-xl border-b border-white/40 shadow-sm shrink-0">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 grid grid-cols-3 items-center">
          <div className="flex justify-start">
            <button
              onClick={onBackToHome}
              className="p-2 -ml-2 text-slate-500 hover:text-slate-900 rounded-full hover:bg-slate-100 transition flex items-center cursor-pointer"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          </div>
          <div className="flex justify-center">
            <button onClick={onBackToHome} className="font-medium text-2xl text-[#2d497c] tracking-wide">
              TravelX
            </button>
          </div>
          <div className="flex justify-end"></div>
        </div>
      </header>

      {/* Main Content */}
      <main className="w-full max-w-4xl mx-auto px-4 sm:px-6 py-12 flex-1 relative">
        {/* If Not Logged In, Show Blocked State */}
        {!currentUser ? (
          <div className="absolute inset-0 z-10 flex items-center justify-center p-4 backdrop-blur-sm">
            <div className="bg-white/95 backdrop-blur-md border border-slate-200 p-8 rounded-md shadow-2xl text-center max-w-md w-full">
              <MessageCircle className="w-16 h-16 text-blue-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-slate-800 mb-2">Join the Discussion</h2>
              <p className="text-slate-500 mb-8">You need to be logged in to view and participate in the community.</p>
              <button 
                onClick={onNavigateToLogin}
                className="w-full py-3 bg-[#2d497c] hover:bg-[#1e293b] text-white font-semibold rounded-md transition-colors"
              >
                Log In or Sign Up
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-white/90 backdrop-blur-xl rounded-md border border-white/50 shadow-xl overflow-hidden min-h-[600px] flex flex-col relative">
            
            {/* Header Area */}
            <div className="bg-[#e1ecf7]/50 border-b border-white/50 p-6 flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-[#2d497c] flex items-center gap-2">
                  <MessageSquare className="w-6 h-6" />
                  Community Forum
                </h1>
                <p className="text-sm text-slate-500 mt-1">Connect with other travelers and share ideas.</p>
              </div>
              {!selectedPost && (
                <button
                  onClick={() => setIsNewPostOpen(true)}
                  className="px-5 py-2.5 bg-[#2d497c] hover:bg-[#1e293b] text-white font-semibold rounded-md transition-colors shadow-sm flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  New Post
                </button>
              )}
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto p-6 bg-slate-50/50">
              {loading ? (
                <div className="text-center py-20 text-slate-400">Loading...</div>
              ) : selectedPost ? (
                /* Post Detail View */
                <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                  <button 
                    onClick={() => setSelectedPost(null)}
                    className="flex items-center gap-1 text-sm font-semibold text-blue-600 hover:text-blue-800 mb-6 transition"
                  >
                    <ArrowLeft className="w-4 h-4" /> Back to Discussions
                  </button>
                  
                  <div className="bg-white rounded-md p-6 shadow-sm border border-slate-100 mb-8">
                    <div className="flex justify-between items-start mb-4">
                      <h2 className="text-2xl font-bold text-slate-800">{selectedPost.title}</h2>
                      {currentUser.uid === selectedPost.authorId && (
                        <button onClick={() => handleDeletePost(selectedPost.id!)} className="text-red-400 hover:text-red-600 p-1 transition" title="Delete post">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                    <div className="text-xs text-slate-500 mb-6 pb-4 border-b border-slate-100">
                      Posted by <span className="font-semibold text-slate-700">{selectedPost.authorName}</span> on {selectedPost.createdAt?.toDate ? selectedPost.createdAt.toDate().toLocaleDateString() : 'Just now'}
                    </div>
                    <div className="text-slate-700 whitespace-pre-wrap leading-relaxed text-[15px]">
                      {selectedPost.body}
                    </div>
                  </div>

                  {/* Comments Section */}
                  <h3 className="text-lg font-bold text-slate-800 mb-4 px-2">
                    Comments ({selectedPost.commentCount})
                  </h3>
                  
                  <div className="space-y-4 mb-8">
                    {loadingComments ? (
                      <div className="text-center py-8 text-slate-400 text-sm">Loading comments...</div>
                    ) : comments.length === 0 ? (
                      <div className="text-center py-8 text-slate-500 bg-white/50 rounded-md border border-dashed border-slate-200 text-sm">
                        No comments yet. Be the first to share your thoughts!
                      </div>
                    ) : (
                      comments.map(comment => (
                        <div key={comment.id} className="bg-white p-4 rounded-md shadow-sm border border-slate-100 relative group">
                          <div className="text-xs text-slate-500 mb-2 font-medium">
                            {comment.authorName} • {comment.createdAt?.toDate ? comment.createdAt.toDate().toLocaleDateString() : 'Just now'}
                          </div>
                          <div className="text-slate-700 text-sm whitespace-pre-wrap">{comment.body}</div>
                          {currentUser.uid === comment.authorId && (
                            <button 
                              onClick={() => handleDeleteComment(comment.id!)}
                              className="absolute top-4 right-4 text-slate-300 hover:text-red-500 transition opacity-0 group-hover:opacity-100"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      ))
                    )}
                  </div>

                  {/* Add Comment Form */}
                  <form onSubmit={handleCreateComment} className="bg-white p-4 rounded-md shadow-sm border border-slate-200">
                    <h4 className="text-sm font-bold text-slate-700 mb-2">Leave a comment</h4>
                    <textarea 
                      value={newCommentBody}
                      onChange={e => setNewCommentBody(e.target.value)}
                      required
                      placeholder="Write your thoughts..."
                      className="w-full p-3 bg-slate-50 border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm mb-3 min-h-[100px] resize-y"
                    />
                    <div className="flex justify-end">
                      <button 
                        type="submit" 
                        disabled={isSubmitting || !newCommentBody.trim()}
                        className="px-5 py-2 bg-[#2d497c] hover:bg-[#1e293b] disabled:opacity-50 text-white font-semibold text-sm rounded-md transition"
                      >
                        {isSubmitting ? 'Posting...' : 'Post Comment'}
                      </button>
                    </div>
                  </form>
                </div>
              ) : (
                /* Posts List View */
                <div className="space-y-4">
                  {posts.length === 0 ? (
                    <div className="text-center py-20 bg-white/50 rounded-md border border-dashed border-slate-300 text-slate-500">
                      No posts yet. Start the conversation!
                    </div>
                  ) : (
                    posts.map(post => (
                      <div 
                        key={post.id} 
                        onClick={() => openPostDetail(post)}
                        className="bg-white p-5 rounded-md shadow-sm border border-slate-200 hover:border-blue-400 hover:shadow-md transition cursor-pointer flex justify-between items-start group"
                      >
                        <div className="flex-1 pr-4">
                          <h3 className="text-lg font-bold text-slate-800 mb-1 group-hover:text-blue-600 transition">{post.title}</h3>
                          <div className="text-xs text-slate-500">
                            By <span className="font-medium text-slate-700">{post.authorName}</span> • {post.createdAt?.toDate ? post.createdAt.toDate().toLocaleDateString() : 'Just now'}
                          </div>
                        </div>
                        <div className="flex items-center gap-1.5 text-slate-400 bg-slate-50 px-2.5 py-1 rounded-full text-xs font-semibold shrink-0">
                          <MessageCircle className="w-3.5 h-3.5" />
                          {post.commentCount}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>

            {/* New Post Modal Overlay */}
            {isNewPostOpen && (
              <div className="absolute inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
                <div className="bg-white rounded-md shadow-2xl w-full max-w-lg overflow-hidden flex flex-col">
                  <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                    <h3 className="font-bold text-lg text-slate-800">Create New Post</h3>
                    <button onClick={() => setIsNewPostOpen(false)} className="text-slate-400 hover:text-slate-600 transition p-1">
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                  <form onSubmit={handleCreatePost} className="p-5 flex flex-col gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase">Title</label>
                      <input 
                        type="text" 
                        value={newTitle}
                        onChange={e => setNewTitle(e.target.value)}
                        required
                        placeholder="What's on your mind?"
                        className="w-full p-2.5 bg-white border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm font-semibold text-slate-800 placeholder:font-normal"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase">Message</label>
                      <textarea 
                        value={newBody}
                        onChange={e => setNewBody(e.target.value)}
                        required
                        placeholder="Share your travel experiences, questions, or tips..."
                        className="w-full p-3 bg-white border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm min-h-[150px] resize-y"
                      />
                    </div>
                    <div className="flex justify-end gap-3 mt-2">
                      <button 
                        type="button" 
                        onClick={() => setIsNewPostOpen(false)}
                        className="px-4 py-2.5 text-slate-600 hover:text-slate-900 font-semibold text-sm transition"
                      >
                        Cancel
                      </button>
                      <button 
                        type="submit"
                        disabled={isSubmitting || !newTitle.trim() || !newBody.trim()}
                        className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm rounded-md transition shadow-sm disabled:opacity-50 flex items-center gap-2"
                      >
                        {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
                        Post Discussion
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
            
          </div>
        )}
      </main>
    </div>
  );
}
