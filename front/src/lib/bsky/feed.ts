import { Agent } from "@atproto/api";

export async function getFeed(agent: Agent, limit: number = 10) {
  const feedData = await agent.app.bsky.feed.getTimeline({
    limit,
  });
  if (feedData.success) {
    return feedData.data;
  }
  return { feed: [], cursor: null };
}

export async function getSuggestedFeeds(agent: Agent) {
  const suggestedFeeds = await agent.app.bsky.feed.getSuggestedFeeds();
  return suggestedFeeds;
}

export async function getUserPosts(agent: Agent, did: string, limit: number = 30) {
  const userPosts = await agent.app.bsky.feed.getAuthorFeed({
    actor: did,
    filter: 'posts_no_replies',
    limit: limit,
  });
  if (userPosts.success) {
    return userPosts.data;
  }
  return { feed: [], cursor: null };
}