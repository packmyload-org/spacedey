import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { requireAdmin } from '@/lib/auth/admin';
import { ensureUniqueBlogSlug, serializeBlogPost, slugifyBlogTitle } from '@/lib/services/blogPosts';
import { mapBlogPost } from '@/lib/db/mappers';
import type { Database } from '@/lib/supabase/database.types';

function normalizeOptionalString(value: unknown) {
  const normalized = String(value || '').trim();
  return normalized || null;
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const adminCheck = await requireAdmin(request);

  if (!adminCheck.authorized) {
    return NextResponse.json(
      { ok: false, error: adminCheck.error },
      { status: adminCheck.status }
    );
  }

  try {
    const { id } = await params;
    const supabase = createAdminClient();
    const { data: row, error } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (error) {
      throw error;
    }

    if (!row) {
      return NextResponse.json({ ok: false, error: 'Blog post not found.' }, { status: 404 });
    }

    return NextResponse.json({ ok: true, post: serializeBlogPost(mapBlogPost(row)) });
  } catch (error) {
    console.error('Get admin blog post error:', error);
    const message = error instanceof Error ? error.message : 'Internal Server Error';
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const adminCheck = await requireAdmin(request);

  if (!adminCheck.authorized) {
    return NextResponse.json(
      { ok: false, error: adminCheck.error },
      { status: adminCheck.status }
    );
  }

  try {
    const { id } = await params;
    const body = (await request.json().catch(() => null)) as Record<string, unknown> | null;

    if (!body) {
      return NextResponse.json({ ok: false, error: 'Invalid request body.' }, { status: 400 });
    }

    const supabase = createAdminClient();
    const { data: existingRow, error: lookupError } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (lookupError) {
      throw lookupError;
    }

    if (!existingRow) {
      return NextResponse.json({ ok: false, error: 'Blog post not found.' }, { status: 404 });
    }

    const post = mapBlogPost(existingRow);
    const updates: Database['public']['Tables']['blog_posts']['Update'] = {};

    if (body.title !== undefined) updates.title = String(body.title || '').trim();
    if (body.excerpt !== undefined) updates.excerpt = String(body.excerpt || '').trim();
    if (body.content !== undefined) updates.content = String(body.content || '').trim();
    if (body.author !== undefined) updates.author = String(body.author || '').trim();
    if (body.image !== undefined) updates.image = normalizeOptionalString(body.image);

    if (body.slug !== undefined || body.title !== undefined) {
      const nextSlug = String(body.slug || updates.title || post.title).trim();
      updates.slug = await ensureUniqueBlogSlug(slugifyBlogTitle(nextSlug), id);
    }

    if (body.published !== undefined) {
      const nextPublished = body.published === true;
      updates.published = nextPublished;
      updates.publishedAt = nextPublished && !post.published
        ? new Date().toISOString()
        : nextPublished
          ? post.publishedAt?.toISOString() ?? new Date().toISOString()
          : null;
    }

    const title = (updates.title as string | undefined) ?? post.title;
    const excerpt = (updates.excerpt as string | undefined) ?? post.excerpt;
    const content = (updates.content as string | undefined) ?? post.content;
    const author = (updates.author as string | undefined) ?? post.author;

    if (!title || !excerpt || !content || !author) {
      return NextResponse.json(
        { ok: false, error: 'Title, excerpt, content, and author are required.' },
        { status: 400 }
      );
    }

    const { data: updatedRow, error: updateError } = await supabase
      .from('blog_posts')
      .update(updates)
      .eq('id', id)
      .select('*')
      .single();

    if (updateError) {
      throw updateError;
    }

    return NextResponse.json({ ok: true, post: serializeBlogPost(mapBlogPost(updatedRow)) });
  } catch (error) {
    console.error('Update blog post error:', error);
    const message = error instanceof Error ? error.message : 'Internal Server Error';
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const adminCheck = await requireAdmin(request);

  if (!adminCheck.authorized) {
    return NextResponse.json(
      { ok: false, error: adminCheck.error },
      { status: adminCheck.status }
    );
  }

  try {
    const { id } = await params;
    const supabase = createAdminClient();
    const { error } = await supabase.from('blog_posts').delete().eq('id', id);

    if (error) {
      throw error;
    }

    return NextResponse.json({ ok: true, message: 'Blog post deleted successfully.' });
  } catch (error) {
    console.error('Delete blog post error:', error);
    const message = error instanceof Error ? error.message : 'Internal Server Error';
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
