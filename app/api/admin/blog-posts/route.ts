import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { requireAdmin } from '@/lib/auth/admin';
import { ensureUniqueBlogSlug, serializeBlogPost, slugifyBlogTitle } from '@/lib/services/blogPosts';
import { mapBlogPost } from '@/lib/db/mappers';

function normalizeBlogPostPayload(body: Record<string, unknown>) {
  const title = String(body.title || '').trim();
  const excerpt = String(body.excerpt || '').trim();
  const content = String(body.content || '').trim();
  const image = String(body.image || '').trim() || null;
  const author = String(body.author || '').trim();
  const published = body.published === true;
  const rawSlug = String(body.slug || title).trim();

  return {
    title,
    excerpt,
    content,
    image,
    author,
    published,
    rawSlug,
  };
}

export async function GET(request: NextRequest) {
  const adminCheck = await requireAdmin(request);

  if (!adminCheck.authorized) {
    return NextResponse.json(
      { ok: false, error: adminCheck.error },
      { status: adminCheck.status }
    );
  }

  try {
    const supabase = createAdminClient();
    const { data: posts, error } = await supabase
      .from('blog_posts')
      .select('*')
      .order('updatedAt', { ascending: false })
      .order('createdAt', { ascending: false });

    if (error) {
      throw error;
    }

    return NextResponse.json({
      ok: true,
      posts: (posts ?? []).map((row) => serializeBlogPost(mapBlogPost(row))),
      total: posts.length,
    });
  } catch (error) {
    console.error('Get admin blog posts error:', error);
    const message = error instanceof Error ? error.message : 'Internal Server Error';
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const adminCheck = await requireAdmin(request);

  if (!adminCheck.authorized) {
    return NextResponse.json(
      { ok: false, error: adminCheck.error },
      { status: adminCheck.status }
    );
  }

  try {
    const body = (await request.json().catch(() => null)) as Record<string, unknown> | null;

    if (!body) {
      return NextResponse.json({ ok: false, error: 'Invalid request body.' }, { status: 400 });
    }

    const { title, excerpt, content, image, author, published, rawSlug } = normalizeBlogPostPayload(body);

    if (!title || !excerpt || !content || !author) {
      return NextResponse.json(
        { ok: false, error: 'Title, excerpt, content, and author are required.' },
        { status: 400 }
      );
    }

    const slug = await ensureUniqueBlogSlug(slugifyBlogTitle(rawSlug));
    const supabase = createAdminClient();
    const { data: post, error } = await supabase
      .from('blog_posts')
      .insert({
        title,
        slug,
        excerpt,
        content,
        image,
        author,
        published,
        publishedAt: published ? new Date().toISOString() : null,
      })
      .select('*')
      .single();

    if (error) {
      throw error;
    }

    return NextResponse.json(
      { ok: true, post: serializeBlogPost(mapBlogPost(post)) },
      { status: 201 }
    );
  } catch (error) {
    console.error('Create blog post error:', error);
    const message = error instanceof Error ? error.message : 'Internal Server Error';
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
