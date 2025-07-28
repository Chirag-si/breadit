import { INFINITE_SCROLL_PAGINATION_RESULTS } from '@/config'
import { getAuthSession } from '@/lib/auth'
import { db } from '@/lib/db'
import PostFeed from './PostFeed'
import GeneralFeed from './GeneralFeed'
import { notFound } from 'next/navigation'

const CustomFeed = async () => {
  const session = await getAuthSession()

  if (!session) return notFound()

  // Get all communities the user is subscribed to
  const followedCommunities = await db.subscription.findMany({
    where: {
      userId: session.user.id,
    },
    include: {
      subreddit: true,
    },
  })

  // If user is not subscribed to any communities, show general feed or a message
  if (followedCommunities.length === 0) {
    // Option 1: Show a message
    // return <div className="text-center text-zinc-500 py-8">You are not following any communities yet.</div>
    // Option 2: Fallback to general feed
    return await GeneralFeed()
  }

  // Get posts from followed communities
  const posts = await db.post.findMany({
    where: {
      subredditId: {
        in: followedCommunities.map((sub) => sub.subreddit.id),
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
    include: {
      votes: true,
      author: true,
      comments: true,
      subreddit: true,
    },
    take: INFINITE_SCROLL_PAGINATION_RESULTS,
  })

  return <PostFeed initialPosts={posts} feedType="custom" />
}

export default CustomFeed