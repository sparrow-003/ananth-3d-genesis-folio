export interface Comment {
    id: string;
    user: string;
    text: string;
    date: string;
}

export interface BlogPost {
    id: string;
    title: string;
    excerpt: string;
    content: string;
    author: string;
    date: string;
    image: string;
    category: string;
    likes: number;
    comments: Comment[];
    tags: string[];
}

export const initialBlogPosts: BlogPost[] = [
    {
        id: "1",
        title: "Neural Architecture: The Genesis Protocol",
        excerpt: "Deconstructing the cognitive layers of the next-generation digital interface.",
        content: "The protocol is simple: optimize for humanity, execute with machines. We aren't just building websites anymore; we are building environments that breathe. This log explains the recursive feedback loops used in the Genesis Folio.\n\nKey focuses include:\n- Adaptive 3D depth perception\n- Emotional responsive gradients\n- Low-latency cognitive interactions",
        author: "Ananth N",
        date: "Dec 30, 2025",
        image: "https://images.unsplash.com/photo-1639322537228-f710d846310a?auto=format&fit=crop&q=80&w=800",
        category: "Technology",
        likes: 124,
        comments: [],
        tags: ["Systems", "Architecture", "Genesis"]
    },
    {
        id: "2",
        title: "Quantum UI: Beyond the Grid",
        excerpt: "Why the standard 12-column grid is reaching its biological limit.",
        content: "The grid was a cage. In the new era, components exist in a state of superposition—defined by utility but shaped by observer interaction. We explore fluid layouts that adapt to user focus in real-time, moving away from static breakpoints towards intent-driven reactivity.",
        author: "Ananth N",
        date: "Dec 29, 2025",
        image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&q=80&w=800",
        category: "Design",
        likes: 89,
        comments: [],
        tags: ["UI", "Future", "Quantum"]
    },
    {
        id: "3",
        title: "The Silent Shift in AI Mentorship",
        excerpt: "How teaching 150+ students taught me more about AI than documentation ever did.",
        content: "When I stand before a class, the AI isn't the assistant—it's the canvas. I've realized that the most powerful part of the 'Naan Mudhalvan' program isn't the code; it's the decentralized problem-solving that emerges when human creativity meets machine scale.",
        author: "Ananth N",
        date: "Dec 28, 2025",
        image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=800",
        category: "Education",
        likes: 210,
        comments: [],
        tags: ["AI", "Mentorship", "Community"]
    }
];
