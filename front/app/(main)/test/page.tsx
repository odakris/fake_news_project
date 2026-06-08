import { getServerAgent } from "@/src/lib/bsky-server";
import { getFeed } from "@/src/lib/bsky/feed";
import { logger } from "@/src/lib/logger";
import { verifyText } from "@/src/lib/verify";

export default async function TestPage() {

    const agent = await getServerAgent();
    
    const { feed: firstPost } = await getFeed(agent, 1);

    const text = firstPost[0].post.record.text as string;

    const result = await verifyText(text);
    
    logger.info(result);

    return (
        <div>
            <h1>Test</h1>
            <p>{text}</p>
            <pre>{JSON.stringify(result, null, 2)}</pre>
        </div>
    )
}