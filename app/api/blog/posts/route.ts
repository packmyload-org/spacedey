import { NextResponse } from 'next/server';
import { listPublishedBlogPosts } from '@/lib/services/blogPosts';

export async function GET() {
  try {
    const posts = await listPublishedBlogPosts();

    return NextResponse.json({
      ok: true,
      posts,
      total: posts.length,
    });
  } catch (error) {
    console.error('Get blog posts error:', error);
    const message = error instanceof Error ? error.message : 'Internal Server Error';
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
