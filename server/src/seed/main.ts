import prisma from '@/database'
import { faker } from '@faker-js/faker'

const generateProducts = async () => {
  const products = Array.from({ length: 50 }).map(() => ({
    name: faker.commerce.productName(),
    image: faker.image.url(),
    description: faker.commerce.productDescription(),
    price: parseFloat(faker.commerce.price())
  }))

  await prisma.product.createMany({
    data: products
  })
  console.log('Seeded 50 products successfully!')
}

export async function handleSeedData() {
  generateProducts()
}
