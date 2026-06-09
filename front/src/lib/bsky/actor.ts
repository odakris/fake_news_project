import { Agent } from "@atproto/api";

export async function getWhoToFollow(agent: Agent, limit: number = 5) {
  const whoToFollow = await agent.app.bsky.graph.getSuggestedFollowsByActor({
    actor: agent.did!,
  });

  if (whoToFollow.success) {
    return whoToFollow.data.suggestions.slice(0, limit);
  }

  return [];
}

export async function getProfileByHandle(agent: Agent, handle: string) {
  const profile = await agent.app.bsky.actor.getProfile({
    actor: handle,
  });

  if (profile.success) {
    return profile.data;
  }

  return null;
}