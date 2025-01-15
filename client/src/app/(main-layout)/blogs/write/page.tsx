import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Đăng bài viết trên Larry Social Networking'
}

export default async function BlogWrite() {
  return (
    <div>
      <h1>Đăng bài</h1>
    </div>
  )
}
