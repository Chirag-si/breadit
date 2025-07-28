import { z } from 'zod'

export const CommentValidator = z.object({
  postId: z.string(),
  text: z.string(),
  replyToId: z.string().nullable().optional()
})

export type CommentRequest = z.infer<typeof CommentValidator>