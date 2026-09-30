type ShopifyPolicyProps = {
  title: string
  /** HTML from Shopify admin > Settings > Policies (store-owner content). */
  html: string
}

/** Renders a Shopify store policy in the same layout as the legal pages. */
export default function ShopifyPolicy({ title, html }: ShopifyPolicyProps) {
  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-8">
          {title}
        </h1>
        <div
          className="text-gray-700 leading-relaxed [&_a]:font-medium [&_a]:text-gray-900 [&_a]:underline [&_h2]:mb-6 [&_h2]:mt-12 [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:text-gray-900 [&_h3]:mb-4 [&_h3]:mt-8 [&_h3]:text-xl [&_h3]:font-semibold [&_h3]:text-gray-900 [&_li]:mb-2 [&_ol]:mb-6 [&_ol]:list-decimal [&_ol]:pl-6 [&_p]:mb-6 [&_strong]:text-gray-900 [&_table]:mb-6 [&_table]:w-full [&_td]:border [&_td]:border-gray-200 [&_td]:p-2 [&_th]:border [&_th]:border-gray-200 [&_th]:p-2 [&_th]:text-left [&_ul]:mb-6 [&_ul]:list-disc [&_ul]:pl-6"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      </div>
    </div>
  )
}
