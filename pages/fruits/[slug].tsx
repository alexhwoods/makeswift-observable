import { GetStaticPropsContext } from 'next/types'

import {
  Makeswift,
  Page as MakeswiftPage,
  PageProps as MakeswiftPageProps,
} from '@makeswift/runtime/next'

export default function Page({ snapshot, slug }: MakeswiftPageProps & { slug: string }) {
  return (
    <div>
      <h1>{slug}</h1>
      <MakeswiftPage snapshot={snapshot} />
    </div>
  )
}

export async function getStaticProps({
  previewData,
  params,
}: GetStaticPropsContext<{ slug: string }, { makeswift: boolean }>) {
  console.log('In getStaticProps for slug:', params?.slug)
  const makeswift = new Makeswift(process.env.MAKESWIFT_SITE_API_KEY!)

  const snapshot = await makeswift.getPageSnapshot('/fruits/__template__', {
    siteVersion: Makeswift.getSiteVersion(previewData),
  })

  if (snapshot == null) {
    return { notFound: true, revalidate: 5000 }
  }

  return {
    props: {
      snapshot,
      slug: params!.slug,
    },
    revalidate: 5000,
  }
}

export async function getStaticPaths() {
  const paths = ['strawberry', 'banana', 'apple']

  return {
    paths: paths.map(slug => ({ params: { slug } })),
    fallback: 'blocking',
  }
}
