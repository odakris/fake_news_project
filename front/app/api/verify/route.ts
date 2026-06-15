import { createZodRoute } from 'next-zod-route';
import { z } from 'zod';
import { NextResponse } from 'next/server';
import { verifyText } from '@/lib/bsky/verify';

const querySchema = z.object({
  search: z.string().optional(),
  top_k: z.coerce.number().min(1).max(10).optional().default(5),
});

export const GET = createZodRoute()
  .query(querySchema)
  .handler(async (request, { query: { search, top_k }}) => {
    if (!search) {
      return NextResponse.json({ error: 'Search is required' }, { status: 400 });
    }

    if (!top_k) {
      return NextResponse.json({ error: 'Top k is required' }, { status: 400 });
    }

    const result = await verifyText(search, top_k);
    
    return NextResponse.json(result, { status: 200 });
  });