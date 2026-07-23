import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Search,
  Send,
  ArrowLeft,
  MessageCircle,
  Users,
  RefreshCw,
  CheckCheck,
} from 'lucide-react';
import {
  getSessions,
  getChats,
  getMessages,
  sendText,
  type Session,
  type Chat,
  type Message,
} from '../api/wahaApi';

export function Chats() {
  const { session: sessionParam } = useParams<{ session: string }>();
  const navigate = useNavigate();

  const [sessions, setSessions] = useState<Session[]>([]);
  const [selectedSession, setSelectedSession] = useState<string>(sessionParam || '');
  const [chats, setChats] = useState<Chat[]>([]);
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [messageText, setMessageText] = useState('');
  const [loading, setLoading] = useState(true);
  const [loadingChats, setLoadingChats] = useState(false);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    getSessions()
      .then(data => {
        setSessions(data);
        if (!sessionParam && data.length > 0) {
          const working = data.find(s => s.status === 'WORKING');
          setSelectedSession(working?.name || data[0].name);
        }
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to load sessions');
        setLoading(false);
      });
  }, [sessionParam]);

  useEffect(() => {
    if (sessionParam) setSelectedSession(sessionParam);
  }, [sessionParam]);

  const fetchChats = useCallback(async () => {
    if (!selectedSession) return;
    try {
      setLoadingChats(true);
      setError(null);
      const data = await getChats(selectedSession);
      setChats(data);
    } catch {
      setError('Failed to load chats');
    } finally {
      setLoadingChats(false);
    }
  }, [selectedSession]);

  useEffect(() => {
    fetchChats();
  }, [fetchChats]);

  const fetchMessages = useCallback(async (chatId: string) => {
    if (!selectedSession) return;
    try {
      setLoadingMessages(true);
      const data = await getMessages(selectedSession, chatId);
      // Create a copy before reversing to avoid mutating the original array
      setMessages([...data].reverse());
    } catch {
      setMessages([]);
    } finally {
      setLoadingMessages(false);
    }
  }, [selectedSession]);

  const handleSelectChat = (chat: Chat) => {
    setSelectedChat(chat);
    fetchMessages(chat.id);
  };

  const handleSendMessage = async () => {
    if (!messageText.trim() || !selectedSession || !selectedChat) return;
    const text = messageText.trim();
    setMessageText('');

    const optimisticMsg: Message = {
      id: `opt-${Date.now()}`,
      body: text,
      fromMe: true,
      timestamp: Date.now() / 1000,
    };
    setMessages(prev => [...prev, optimisticMsg]);

    try {
      await sendText(selectedSession, selectedChat.id, text);
    } catch {
      setError('Failed to send message');
      setMessages(prev => prev.filter(m => m.id !== optimisticMsg.id));
    }
  };

  const handleSessionChange = (name: string) => {
    setSelectedSession(name);
    setSelectedChat(null);
    setMessages([]);
    navigate(`/chats/${name}`);
  };

  const filteredChats = chats.filter(chat => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return (
      (chat.name && chat.name.toLowerCase().includes(term)) ||
      chat.id.toLowerCase().includes(term)
    );
  });

  const formatTime = (timestamp?: number) => {
    if (!timestamp) return '';
    const date = new Date(timestamp * 1000);
    const now = new Date();
    const isToday = date.toDateString() === now.toDateString();
    if (isToday) return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto space-y-4 animate-fade-in">
        <div className="skeleton h-8 w-48" />
        <div className="skeleton h-12 rounded-xl" />
        <div className="grid gap-2">
          {[1, 2, 3, 4, 5].map(i => (
            <div key={i} className="skeleton h-16 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  if (sessions.length === 0) {
    return (
      <div className="max-w-6xl mx-auto text-center py-16 animate-fade-in">
        <MessageCircle className="w-16 h-16 text-app-text-muted mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-app-text mb-2">No Active Sessions</h2>
        <p className="text-app-text-muted mb-4">Create and start a session first to view chats</p>
        <button
          onClick={() => navigate('/sessions')}
          className="px-5 py-2.5 rounded-lg bg-[#25D366] hover:bg-[#1fb855] text-black font-medium transition-all"
        >
          Go to Sessions
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-4 h-[calc(100vh-8rem)] flex flex-col animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between flex-shrink-0">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-app-text">Chats</h1>
          <p className="text-app-text-muted mt-1">Browse conversations and send messages</p>
        </div>
        <select
          value={selectedSession}
          onChange={e => handleSessionChange(e.target.value)}
          className="px-3 py-2 rounded-lg bg-app-surface border border-app-border text-white text-sm focus:outline-none focus:border-[#25D366]"
        >
          {sessions.map(s => (
            <option key={s.name} value={s.name}>
              {s.name} ({s.status})
            </option>
          ))}
        </select>
      </div>

      {/* Error */}
      {error && (
        <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex items-center justify-between flex-shrink-0">
          <span>{error}</span>
          <button onClick={() => setError(null)} className="hover:text-red-300">Dismiss</button>
        </div>
      )}

      {/* Chat Layout */}
      <div className="flex-1 flex bg-app-surface rounded-xl border border-app-border overflow-hidden min-h-0">
        {/* Chat List */}
        <div className={`${selectedChat ? 'hidden md:flex' : 'flex'} flex-col w-full md:w-80 lg:w-96 border-r border-app-border flex-shrink-0`}>
          <div className="p-3 border-b border-app-border">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-app-text-muted" />
              <input
                type="text"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-2 rounded-lg bg-app-bg border border-app-border text-white text-sm placeholder-app-text-muted focus:outline-none focus:border-[#25D366]"
                placeholder="Search chats..."
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            {loadingChats ? (
              <div className="p-4 space-y-3">
                {[1, 2, 3, 4, 5].map(i => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="skeleton w-10 h-10 rounded-full" />
                    <div className="flex-1 space-y-2">
                      <div className="skeleton h-4 w-32" />
                      <div className="skeleton h-3 w-48" />
                    </div>
                  </div>
                ))}
              </div>
            ) : filteredChats.length === 0 ? (
              <div className="text-center py-8">
                <Users className="w-8 h-8 text-app-text-muted mx-auto mb-2" />
                <p className="text-app-text-muted text-sm">
                  {searchTerm ? 'No chats matching search' : 'No chats found'}
                </p>
              </div>
            ) : (
              filteredChats.map(chat => (
                <div
                  key={chat.id}
                  onClick={() => handleSelectChat(chat)}
                  className={`flex items-center gap-3 p-3 mx-2 my-0.5 rounded-lg cursor-pointer transition-all ${
                    selectedChat?.id === chat.id
                      ? 'bg-[#25D366]/10 border border-[#25D366]/20'
                      : 'hover:bg-app-surface-hover border border-transparent'
                  }`}
                >
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#25D366] to-[#128C7E] flex items-center justify-center text-app-text font-semibold text-sm flex-shrink-0">
                    {chat.isGroup ? <Users className="w-4 h-4" /> : (chat.name || chat.id).charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="text-app-text text-sm font-medium truncate">
                        {chat.name || chat.id.replace('@c.us', '')}
                      </span>
                      {chat.lastMessage?.timestamp && (
                        <span className="text-app-text-muted text-xs flex-shrink-0 ml-2">
                          {formatTime(chat.lastMessage.timestamp)}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center justify-between mt-0.5">
                      <span className="text-app-text-muted text-xs truncate">
                        {chat.lastMessage?.body || 'No messages yet'}
                      </span>
                      {chat.unreadCount ? (
                        <span className="ml-2 px-1.5 py-0.5 rounded-full bg-[#25D366] text-black text-xs font-bold flex-shrink-0 min-w-[20px] text-center">
                          {chat.unreadCount}
                        </span>
                      ) : null}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Chat Window */}
        <div className={`${selectedChat ? 'flex' : 'hidden md:flex'} flex-1 flex-col min-w-0`}>
          {!selectedChat ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <MessageCircle className="w-16 h-16 text-app-text-muted mx-auto mb-3" />
                <p className="text-app-text-muted">Select a chat to start messaging</p>
              </div>
            </div>
          ) : (
            <>
              {/* Chat Header */}
              <div className="flex items-center gap-3 p-3 border-b border-app-border bg-app-bg">
                <button
                  onClick={() => { setSelectedChat(null); setMessages([]); }}
                  className="md:hidden p-1 rounded-lg hover:bg-app-surface-hover text-app-text-secondary"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#25D366] to-[#128C7E] flex items-center justify-center text-app-text font-semibold text-sm flex-shrink-0">
                  {selectedChat.isGroup ? <Users className="w-4 h-4" /> : (selectedChat.name || selectedChat.id).charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-app-text text-sm font-medium truncate">
                    {selectedChat.name || selectedChat.id.replace('@c.us', '')}
                  </p>
                  <p className="text-app-text-muted text-xs">{selectedChat.id}</p>
                </div>
                <button
                  onClick={() => fetchMessages(selectedChat.id)}
                  className="p-2 rounded-lg hover:bg-app-surface-hover text-app-text-secondary transition-all"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-2 bg-app-bg/50">
                {loadingMessages ? (
                  <div className="space-y-3">
                    {[1, 2, 3, 4, 5].map(i => (
                      <div key={i} className={`flex ${i % 2 === 0 ? 'justify-end' : 'justify-start'}`}>
                        <div className={`skeleton h-12 rounded-2xl ${i % 2 === 0 ? 'w-48' : 'w-56'}`} />
                      </div>
                    ))}
                  </div>
                ) : messages.length === 0 ? (
                  <div className="flex-1 flex items-center justify-center h-full">
                    <p className="text-app-text-muted text-sm">No messages yet. Say hello!</p>
                  </div>
                ) : (
                  messages.map((msg, i) => {
                    const isFromMe = msg.fromMe;
                    const showAvatar = i === 0 || messages[i - 1].fromMe !== msg.fromMe;

                    return (
                      <div
                        key={msg.id}
                        className={`flex ${isFromMe ? 'justify-end' : 'justify-start'} ${showAvatar ? 'mt-3' : 'mt-0.5'}`}
                      >
                        {!isFromMe && showAvatar && (
                          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-gray-500 to-gray-600 flex items-center justify-center text-white text-xs font-semibold mr-2 flex-shrink-0 mt-1">
                            {(msg.author || 'U').charAt(0).toUpperCase()}
                          </div>
                        )}
                        <div
                          className={`max-w-[75%] px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed ${
                            isFromMe
                              ? 'bg-[#25D366] text-black rounded-br-md'
                              : 'bg-[#1e2532] text-white rounded-bl-md'
                          }`}
                        >
                          <p className="whitespace-pre-wrap break-words">{msg.body}</p>
                          <div className={`flex items-center gap-1 mt-1 ${isFromMe ? 'justify-end' : 'justify-start'}`}>
                            <span className={`text-xs ${isFromMe ? 'text-black/60' : 'text-app-text-muted'}`}>
                              {formatTime(msg.timestamp)}
                            </span>
                            {isFromMe && (
                              <CheckCheck className="w-3 h-3 text-black/60" />
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Input */}
              <div className="p-3 border-t border-app-border bg-app-bg">
                <div className="flex items-center gap-2">
                  <div className="flex-1 flex items-center gap-2 bg-app-surface border border-app-border rounded-xl px-4 py-2 focus-within:border-[#25D366] transition-all">
                    <input
                      type="text"
                      value={messageText}
                      onChange={e => setMessageText(e.target.value)}
                      onKeyDown={e => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          handleSendMessage();
                        }
                      }}
                      className="flex-1 bg-transparent text-white text-sm placeholder-app-text-muted focus:outline-none"
                      placeholder="Type a message..."
                    />
                  </div>
                  <button
                    onClick={handleSendMessage}
                    disabled={!messageText.trim()}
                    className="p-2.5 rounded-xl bg-[#25D366] hover:bg-[#1fb855] text-black transition-all disabled:opacity-40 disabled:cursor-not-allowed active:scale-95"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
