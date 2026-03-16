import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity({ name: 'blog_posts' })
export class BlogPost {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar' })
  title!: string;

  @Column({ type: 'varchar', unique: true })
  slug!: string;

  @Column({ type: 'text' })
  excerpt!: string;

  @Column({ type: 'text' })
  content!: string;

  @Column({ type: 'varchar', nullable: true })
  image!: string | null;

  @Column({ type: 'varchar' })
  author!: string;

  @Column({ type: 'boolean', default: true })
  published!: boolean;

  @Column({ type: 'timestamp', nullable: true })
  publishedAt!: Date | null;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}

export default BlogPost;
