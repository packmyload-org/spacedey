export class BlogPost {
  id!: string;
  title!: string;
  slug!: string;
  excerpt!: string;
  content!: string;
  image!: string | null;
  author!: string;
  published!: boolean;
  publishedAt!: Date | null;
  createdAt!: Date;
  updatedAt!: Date;
}

export default BlogPost;
