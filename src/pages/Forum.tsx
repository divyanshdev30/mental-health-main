import { useEffect, useMemo, useState } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Textarea } from "../components/ui/textarea";
import { useAuth } from "../context/AuthContext";

type Comment = { id: string; author: string; text: string; createdAt: number };
export type Post = {
  id: string;
  author: string;
  title: string;
  body: string;
  createdAt: number;
  comments: Comment[];
};

const STORAGE_KEY = "dpi_forum_posts";

const initialPosts: Post[] = [
  {
    id: crypto.randomUUID(),
    author: "alex@college.edu",
    title: "Any tips for exam stress?",
    body: "I've been overwhelmed with finals. What helps you calm down before study sessions?",
    createdAt: Date.now() - 1000 * 60 * 60 * 5,
    comments: [
      {
        id: crypto.randomUUID(),
        author: "sam@college.edu",
        text: "Box breathing and short walks help me.",
        createdAt: Date.now() - 1000 * 60 * 60 * 4,
      },
    ],
  },
];

export default function Forum() {
  const { user } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      setPosts(raw ? JSON.parse(raw) : initialPosts);
    } catch {
      setPosts(initialPosts);
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(posts));
    } catch {}
  }, [posts]);

  const addPost = (e: React.FormEvent) => {
    e.preventDefault();
    const email = user?.email ?? "student@college.edu";
    const p: Post = {
      id: crypto.randomUUID(),
      author: email,
      title: title.trim(),
      body: body.trim(),
      createdAt: Date.now(),
      comments: [],
    };
    if (!p.title || !p.body) return;
    setPosts([p, ...posts]);
    setTitle("");
    setBody("");
  };

  const addComment = (postId: string, text: string) => {
    if (!text.trim()) return;
    const email = user?.email ?? "student@college.edu";
    setPosts((ps) =>
      ps.map((p) =>
        p.id === postId
          ? {
              ...p,
              comments: [
                ...p.comments,
                {
                  id: crypto.randomUUID(),
                  author: email,
                  text: text.trim(),
                  createdAt: Date.now(),
                },
              ],
            }
          : p,
      ),
    );
  };

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Start a discussion</CardTitle>
          <p className="text-sm text-muted-foreground">
            Local-only forum. Replace with a Firebase posts collection later.
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={addPost} className="grid gap-3">
            <Input
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <Textarea
              rows={4}
              placeholder="Share your thoughts in a supportive way"
              value={body}
              onChange={(e) => setBody(e.target.value)}
            />
            <div className="flex justify-end">
              <Button type="submit">Post</Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <div className="space-y-4">
        {posts.map((p) => (
          <PostCard key={p.id} post={p} onAddComment={addComment} />
        ))}
      </div>
    </div>
  );
}

function PostCard({
  post,
  onAddComment,
}: {
  post: Post;
  onAddComment: (postId: string, text: string) => void;
}) {
  const [text, setText] = useState("");
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">{post.title}</CardTitle>
        <p className="text-xs text-muted-foreground">by {post.author}</p>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm">{post.body}</p>
        <div className="space-y-2">
          <p className="text-sm font-medium">Comments</p>
          <div className="space-y-2">
            {post.comments.map((c) => (
              <div key={c.id} className="rounded-md bg-muted/60 p-2 text-sm">
                <p>{c.text}</p>
                <p className="text-xs text-muted-foreground">— {c.author}</p>
              </div>
            ))}
            {post.comments.length === 0 && (
              <p className="text-xs text-muted-foreground">
                Be the first to comment
              </p>
            )}
          </div>
        </div>
      </CardContent>
      <CardFooter className="gap-2">
        <Input
          placeholder="Add a comment"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              onAddComment(post.id, text);
              setText("");
            }
          }}
        />
        <Button
          onClick={() => {
            onAddComment(post.id, text);
            setText("");
          }}
        >
          Send
        </Button>
      </CardFooter>
    </Card>
  );
}
