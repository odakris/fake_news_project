import { getServerAgent } from "@/lib/bsky-server";
import { getFeed } from "@/lib/bsky/feed";
import { verifyText } from "@/lib/bsky/verify";

export default async function TestPage() {

    const agent = await getServerAgent();
    
    const { feed: firstPost } = await getFeed(agent, 1);

    const text = firstPost[0].post.record.text as string;

    const result = await verifyText(text);

    return (
        <div>
            <h1>Test</h1>
            <p>{text}</p>
            <pre>{JSON.stringify(result, null, 2)}</pre>
        </div>
    )
}