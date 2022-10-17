import Head from "next/head"
import {  GetStaticPaths, GetStaticProps } from "next"
import { getSession, useSession } from "next-auth/react"
import { getPrismicClient } from "../../../services/prismic"

import styles from '../post.module.scss'
import Link from "next/link"
import { useRouter } from "next/router"
import { useEffect } from "react"

type Post = {
  slug: string;
  title: string;
  content: {
    text: string;
  }[];
  excerpt: string;
  updatedAt: string;
}

interface PostPreviewProps {
  post: Post
}

 

export default function PostPreview({ post }: PostPreviewProps) {
  const { data } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (data?.activeSubscription) {
      router.push(`/posts/${post.slug}`)
    }
  }, [data, post.slug, router])

  return (
   <>
    <Head>
      <title>{post.title} | Ignews</title>
    </Head>

    <main className={styles.container}>
      <article className={styles.post}>
        <h1>{post.title}</h1>
        <time>{post.updatedAt}</time>
        {/* <div
          className={styles.postContent}
          dangerouslySetInnerHTML={{ __html: post.content[0]}}
        /> */}

        <div className={`${styles.postContent} ${styles.previewContent}`}>
        {post.content.map(item => (
            <p key={item.text}>{item.text}</p>
        ))}       
        </div>
        <div className={styles.continueReading}>
          Wanna continue reading?
          <Link href="/">
            <a>Subscribe now 🤗</a>
          </Link>
        </div>
      </article>
    </main>
   </>
  )
}

export const getStaticPaths: GetStaticPaths = () => {
  return {
    paths: [
      { 
        params: {
          slug: 'upload-de-imagens-no-front-end-com-reactjs-e-context'
        } 
      }
    ],
    fallback: 'blocking'
  }
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const { slug } = params;

  const prismic = getPrismicClient();

  const response = await prismic.getByUID('publication', String(slug), {})

  console.log(response.data.content)

  const post = {
    slug,
    title: response.data.title,
    content: response.data.content,
    updatedAt: new Date(response.last_publication_date).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    })
  }

  return {
    props: {
      post
    },
    revalidate: 60 * 30
  }
}