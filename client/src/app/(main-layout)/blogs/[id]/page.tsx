import productApiRequest from '@/apiRequests/product'
import Image from 'next/image'
import { Metadata, ResolvingMetadata } from 'next'
import { cache } from 'react'
import envConfig from '@/config'
import { baseOpenGraph } from '@/app/shared-metadata'
import blogApiRequest from '@/apiRequests/blog'
import { faker } from '@faker-js/faker'
import moment from 'moment'

const getDetail = cache(blogApiRequest.getDetail)

type Props = {
  params: Promise<{ id: string }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export async function generateMetadata(props: Props, parent: ResolvingMetadata): Promise<Metadata> {
  const params = await props.params;
  const { payload } = await getDetail(params.id)
  const blog = payload.data
  const url = envConfig.NEXT_PUBLIC_URL + '/blogs/' + blog.id
  return {
    title: blog.title,
    description: blog.description,
    openGraph: {
      ...baseOpenGraph,
      title: blog.title,
      description: blog.title,
      url,
      images: [
        {
          url: blog.image || "  "
        }
      ]
    },
    alternates: {
      canonical: url
    }
  }
}

export default async function ProductDetail(props: Props) {
  const params = await props.params;
  let blog = null
  try {
    const { payload } = await getDetail(String(params.id))
    blog = payload.data
  } catch (error) { }

  return (
    <div>
      {!blog && <div>Không tìm thấy sản phẩm</div>}
      {blog && (
        <div>
          <div className='flex justify-center gap-4  border-b   p-4 w-fit mx-auto'>
            {blog.image && (
              <Image
                src={blog.image}
                alt={blog.title}
                width={180}
                height={180}
                className='w-12 h-12 object-cover'
              />
            )}
            <div>
              <h3 className='font-bold'>{blog.title}</h3>
              <div className='flex justify-between gap-4 items-center'>
                <div className='flex gap-2'>
                  <Image
                    src={faker.image.avatar()}
                    alt={blog.postBy.name}
                    width={180}
                    height={180}
                    className='w-6 h-6 object-cover rounded-full'
                  />
                  <div className='text-gray-500'>
                    {blog.postBy.name}
                  </div>
                </div>
                <p className='text-sm'>{moment(blog.createdAt).format("DD/MM/YYYY hh:mm:ss")}</p>
              </div>
            </div>
          </div>
          <div className='flex justify-center'>
            <div
              className='px-8 mt-6'
              dangerouslySetInnerHTML={{ __html: blog?.content }}
            />
          </div>

        </div>
      )}
    </div>
  )
}
