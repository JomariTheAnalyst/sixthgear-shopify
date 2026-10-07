import { Metadata } from "next"
import { notFound } from "next/navigation"

import { getCategoryByHandle } from "@lib/data/categories"
import JsonLd from "@modules/common/components/json-ld"
import {
  getBreadcrumbStructuredData,
  getCanonicalPath,
} from "@lib/seo"
import CategoryTemplate from "@modules/categories/templates"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"

export const dynamic = "force-dynamic"

type Props = {
  params: Promise<{ category: string[]; countryCode: string }>
  searchParams: Promise<{
    sortBy?: SortOptions
    page?: string
  }>
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const params = await props.params
  try {
    const productCategory = await getCategoryByHandle(params.category[params.category.length - 1])

    if (!productCategory) return { title: "Not Found" }
    const title = productCategory.title

    const description = productCategory.description ?? `${title} category.`
    const categoryPath = `/categories/${params.category.join("/")}`

    return {
      title,
      description,
      alternates: {
        canonical: getCanonicalPath(categoryPath),
      },
    }
  } catch (error) {
    notFound()
  }
}

export default async function CategoryPage(props: Props) {
  const searchParams = await props.searchParams
  const params = await props.params
  const { sortBy, page } = searchParams

  const productCategory = await getCategoryByHandle(params.category[params.category.length - 1])

  if (!productCategory) {
    notFound()
  }
  const categoryPath = `/categories/${params.category.join("/")}`
  const breadcrumbStructuredData = getBreadcrumbStructuredData([
    { name: "Home", path: "/" },
    { name: "Shop", path: "/store" },
    { name: productCategory.title, path: categoryPath },
  ])

  return (
    <>
      <JsonLd id="category-breadcrumbs" data={breadcrumbStructuredData} />
      <CategoryTemplate
        category={productCategory}
        sortBy={sortBy}
        page={page}
        countryCode={params.countryCode}
      />
    </>
  )
}
