import { useState, useEffect } from "react";
import {
  Search,
  Send,
  Calendar as CalendarIcon,
} from "lucide-react";

import { Button } from "../components/Button";
import { StatusBadge } from "../components/StatusBadge";
import { cn } from "../lib/utils";
import { api } from "../lib/api";

/* ---------------- TYPES ---------------- */

type Conversation = {
  id: string;
  name: string;
  lastMessage?: string;
  time?: string;
  unread?: number;
  status?: string;
};

type Message = {
  id: string;
  text: string;
  time?: string;
  isMe: boolean;
};

/* ---------------- COMPONENT ---------------- */

export function Inbox() {
  const [conversations, setConversations] =
    useState<Conversation[]>([]);

  const [messages, setMessages] =
    useState<Message[]>([]);

  const [selectedConversation, setSelectedConversation] =
    useState<Conversation | null>(null);

  const [messageText, setMessageText] =
    useState("");

  const [searchQuery, setSearchQuery] =
    useState("");

  const [loading, setLoading] =
    useState(true);

  /* ---------------- LOAD CONVERSATIONS ---------------- */

  useEffect(() => {
    loadConversations();
  }, []);

  const loadConversations = async () => {
    try {
      setLoading(true);

      const data =
        await api.getConversations();

      const formatted = data.map((c: any) => ({
        id: c.id,
        name: c.name,
        lastMessage: c.last_message,
        time: c.updated_at,
        status: c.status,
      }));

      setConversations(formatted);

      if (formatted.length) {
        setSelectedConversation(formatted[0]);
        loadMessages(formatted[0].id);
      }
    } catch (err) {
      console.error(
        "Failed to load conversations:",
        err
      );
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- LOAD MESSAGES ---------------- */

  const loadMessages = async (
    conversationId: string
  ) => {
    try {
      const data =
        await api.getMessages(
          conversationId
        );

      const formatted = data.map(
        (m: any) => ({
          id: m.id,
          text: m.text,
          isMe: m.is_me,
          time: m.created_at,
        })
      );

      setMessages(formatted);
    } catch (err) {
      console.error(
        "Failed to load messages:",
        err
      );
    }
  };

  /* ---------------- SEND MESSAGE ---------------- */

  const handleSend = async () => {
    if (
      !messageText.trim() ||
      !selectedConversation
    )
      return;

    try {
      await api.sendMessage({
        conversationId:
          selectedConversation.id,
        text: messageText,
      });

      setMessageText("");

      loadMessages(
        selectedConversation.id
      );
    } catch (err) {
      console.error(
        "Failed to send message:",
        err
      );
    }
  };

  if (loading) {
    return (
      <div className="p-8">
        Loading inbox...
      </div>
    );
  }

  /* ---------------- FILTER ---------------- */

  const filteredConversations =
    conversations.filter((c) =>
      c.name
        ?.toLowerCase()
        .includes(
          searchQuery.toLowerCase()
        )
    );

  /* ---------------- UI ---------------- */

  return (
    <div className="h-[calc(100vh-7rem)]">
      <div className="mb-6">
        <h1 className="text-3xl font-semibold mb-2">
          Inbox
        </h1>
        <p className="text-muted-foreground">
          Manage customer conversations
        </p>
      </div>

      <div className="grid grid-cols-12 gap-6 h-[calc(100%-5rem)]">
        {/* Conversations */}
        <div className="col-span-12 lg:col-span-4 bg-card border rounded-xl flex flex-col">
          {/* Search */}
          <div className="p-4 border-b">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4" />

              <input
                value={searchQuery}
                onChange={(e) =>
                  setSearchQuery(
                    e.target.value
                  )
                }
                placeholder="Search..."
                className="w-full pl-10 pr-4 py-2 border rounded-lg"
              />
            </div>
          </div>

          {/* List */}
          <div className="flex-1 overflow-y-auto">
            {filteredConversations.map(
              (c) => (
                <div
                  key={c.id}
                  onClick={() => {
                    setSelectedConversation(
                      c
                    );
                    loadMessages(c.id);
                  }}
                  className={cn(
                    "p-4 border-b cursor-pointer",
                    selectedConversation?.id ===
                      c.id &&
                      "bg-accent"
                  )}
                >
                  <p className="font-medium">
                    {c.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {c.lastMessage}
                  </p>
                </div>
              )
            )}
          </div>
        </div>

        {/* Thread */}
        <div className="col-span-12 lg:col-span-8 bg-card border rounded-xl flex flex-col">
          {selectedConversation ? (
            <>
              {/* Header */}
              <div className="p-4 border-b flex justify-between">
                <div>
                  <p className="font-medium">
                    {
                      selectedConversation.name
                    }
                  </p>
                  <StatusBadge
                    status={
                      selectedConversation.status as any
                    }
                  />
                </div>

                <Button
                  variant="secondary"
                  size="sm"
                >
                  <CalendarIcon className="h-4 w-4 mr-2" />
                  Booking
                </Button>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((m) => (
                  <div
                    key={m.id}
                    className={cn(
                      "flex",
                      m.isMe
                        ? "justify-end"
                        : "justify-start"
                    )}
                  >
                    <div
                      className={cn(
                        "px-4 py-2 rounded-xl max-w-[70%]",
                        m.isMe
                          ? "bg-primary text-white"
                          : "bg-secondary"
                      )}
                    >
                      {m.text}
                    </div>
                  </div>
                ))}
              </div>

              {/* Input */}
              <div className="p-4 border-t flex gap-2">
                <textarea
                  value={messageText}
                  onChange={(e) =>
                    setMessageText(
                      e.target.value
                    )
                  }
                  className="flex-1 border rounded-lg p-2"
                />

                <Button onClick={handleSend}>
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-muted-foreground">
              Select a conversation
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
