import Head from "next/head"
import { GetServerSideProps } from "next"
import { getSession } from "next-auth/react"
import { getPrismicClient } from "../../services/prismic"

import styles from './post.module.scss'

type Post = {
  slug: string;
  title: string;
  content: {
    text: string;
  };
  excerpt: string;
  updatedAt: string;
}

interface PostProps {
  post: Post
}

 

export default function Post({ post }: PostProps) {
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

        <div className={styles.postContent}>
        <p>{(post.content[0]).text}</p>
        </div>
      </article>
    </main>
   </>
  )
}

export const getServerSideProps: GetServerSideProps = async ({ req, params }) => {
  const session = await getSession({ req })
  const { slug } = params;

  if (!session?.activeSubscription) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      }
    }
  }

  const prismic = getPrismicClient(req);

  const response = await prismic.getByUID('publication', String(slug), {})

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
    }
  }
}