import { redirect } from "next/navigation"
import { Metadata } from "next"

type Props = {
  params: Promise<{ countryCode: string }>
  searchParams: Promise<{ session_id?: string }>
}

export const metadata: Metadata = {
  title: "Payment Processing",
  description: "Processing your payment",
}

/**
 * Stripe Checkout Success Page
 *
 * Handles the redirect from Stripe Checkout after successful payment
 * Creates order in Medusa and redirects to thank you page
 *
 * @see https://stripe.com/docs/payments/checkout/how-checkout-works
 */
export default async function CheckoutSuccessPage(props: Props) {
  const searchParams = await props.searchParams
  const { session_id } = searchParams

  if (!session_id) {
    redirect(`/checkout`)
  }

  try {
    const stripeResponse = await fetch(
      `https://api.stripe.com/v1/checkout/sessions/${session_id}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.STRIPE_API_KEY}`,
        },
      }
    )

    if (!stripeResponse.ok) {
      throw new Error("Failed to fetch Stripe session")
    }

    const session = await stripeResponse.json()
    const cartId = session.metadata?.cart_id

    if (!cartId) {
      redirect(`/order/confirmed?session_id=${session_id}`)
    }

    let order_id = null
    const maxAttempts = 10

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const backendUrl =
        process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL ||
        process.env.MEDUSA_BACKEND_URL

      try {
        const ordersResponse = await fetch(
          `${backendUrl}/store/orders?cart_id=${cartId}`,
          {
            headers: {
              "x-publishable-api-key":
                process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || "",
            },
          }
        )

        if (ordersResponse.ok) {
          const { orders } = await ordersResponse.json()
          if (orders && orders.length > 0) {
            order_id = orders[0].id
            break
          }
        }
      } catch (checkError) {
        console.error(checkError)
      }
    }

    const { revalidateTag } = await import("next/cache")
    revalidateTag("carts")

    if (order_id) {
      redirect(
        `/order/confirmed?session_id=${session_id}&order_id=${order_id}`
      )
    } else {
      redirect(
        `/order/confirmed?session_id=${session_id}&cart_id=${cartId}`
      )
    }
  } catch (error) {
    console.error(error)
    redirect(`/order/confirmed?session_id=${session_id}`)
  }
}
