import { createZodRoute } from 'next-zod-route';
import { z } from 'zod';
import { NextResponse } from 'next/server';
import { verifyText } from '@/lib/bsky/verify';

const querySchema = z.object({
  search: z.string().min(1),
  top_k: z.coerce.number().min(1).max(10).optional().default(5),
});

export const GET = createZodRoute()
  .query(querySchema)
  .handler(async (_, { query: { search, top_k }}) => {

    const result = await verifyText(search, top_k);
    
    return NextResponse.json(result, { status: 200 });
  });


