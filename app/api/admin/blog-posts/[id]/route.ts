import { NextRequest, NextResponse } from 'next/server';
import { connectTypeORM } from '@/lib/db';
import BlogPost from '@/lib/db/entities/BlogPost';
import { requireAdmin } from '@/lib/auth/admin';
import { ensureUniqueBlogSlug, serializeBlogPost, slugifyBlogTitle } from '@/lib/services/blogPosts';

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
    const dataSource = await connectTypeORM();
    const repo = dataSource.getRepository(BlogPost);
    const post = await repo.findOne({ where: { id } });

    if (!post) {
      return NextResponse.json({ ok: false, error: 'Blog post not found.' }, { status: 404 });
    }

    return NextResponse.json({ ok: true, post: serializeBlogPost(post) });
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

    const dataSource = await connectTypeORM();
    const repo = dataSource.getRepository(BlogPost);
    const post = await repo.findOne({ where: { id } });

    if (!post) {
      return NextResponse.json({ ok: false, error: 'Blog post not found.' }, { status: 404 });
    }

    if (body.title !== undefined) {
      post.title = String(body.title || '').trim();
    }

    if (body.excerpt !== undefined) {
      post.excerpt = String(body.excerpt || '').trim();
    }

    if (body.content !== undefined) {
      post.content = String(body.content || '').trim();
    }

    if (body.author !== undefined) {
      post.author = String(body.author || '').trim();
    }

    if (body.image !== undefined) {
      post.image = normalizeOptionalString(body.image);
    }

    if (body.slug !== undefined || body.title !== undefined) {
      const nextSlug = String(body.slug || post.title).trim();
      post.slug = await ensureUniqueBlogSlug(repo, slugifyBlogTitle(nextSlug), post.id);
    }

    if (body.published !== undefined) {
      const nextPublished = body.published === true;
      const wasPublished = post.published;

      post.published = nextPublished;

      if (nextPublished && !wasPublished) {
        post.publishedAt = new Date();
      }

      if (!nextPublished) {
        post.publishedAt = null;
      }
    }

    if (!post.title || !post.excerpt || !post.content || !post.author) {
      return NextResponse.json(
        { ok: false, error: 'Title, excerpt, content, and author are required.' },
        { status: 400 }
      );
    }

    await repo.save(post);

    return NextResponse.json({ ok: true, post: serializeBlogPost(post) });
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
    const dataSource = await connectTypeORM();
    const repo = dataSource.getRepository(BlogPost);
    const post = await repo.findOne({ where: { id } });

    if (!post) {
      return NextResponse.json({ ok: false, error: 'Blog post not found.' }, { status: 404 });
    }

    await repo.remove(post);

    return NextResponse.json({ ok: true, message: 'Blog post deleted successfully.' });
  } catch (error) {
    console.error('Delete blog post error:', error);
    const message = error instanceof Error ? error.message : 'Internal Server Error';
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
