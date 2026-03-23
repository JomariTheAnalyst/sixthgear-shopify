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
  const params = await props.params
  const searchParams = await props.searchParams
  const { session_id } = searchParams


  if (!session_id) {
    console.error("[Checkout Success] ❌ No session_id provided")
    redirect(`/${params.countryCode}/checkout`)
  }


  // Wait for webhook to create order
  try {
    // Get cart ID from Stripe session
    const stripeResponse = await fetch(
      `https://api.stripe.com/v1/checkout/sessions/${session_id}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.STRIPE_API_KEY}`,
        },
      }
    )

    if (!stripeResponse.ok) {
      console.error(
        "[Checkout Success] ❌ Failed to fetch Stripe session:",
        stripeResponse.status
      )
      throw new Error("Failed to fetch Stripe session")
    }

    const session = await stripeResponse.json()

    const cartId = session.metadata?.cart_id

    if (!cartId) {
      console.error("[Checkout Success] ❌ No cart_id in session metadata")
      redirect(
        `/${params.countryCode}/order/confirmed?session_id=${session_id}`
      )
    }


    // Poll for order creation (webhook should create it)
    // Try up to 10 times with 1 second delay
    let order_id = null
    const maxAttempts = 10

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {

      // Wait 1 second before checking
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Check if order exists for this cart
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
        console.error(
          `[Checkout Success] Error checking for order:`,
          checkError
        )
      }
    }

    if (!order_id) {
      console.error(
        "[Checkout Success] ⚠️ Order not found after polling, redirecting anyway..."
      )
    }

    // Clear cart cookie since order is complete
    const { removeCartId } = await import("@lib/data/cookies")
    await removeCartId()

    // Clear selected items from sessionStorage and localStorage
    // Note: This runs server-side, so we'll clear on client-side in the confirmed page

    // Revalidate cart cache to force refresh
    const { revalidateTag } = await import("next/cache")
    revalidateTag("carts")

    // Redirect to order confirmation
    if (order_id) {
      redirect(
        `/${params.countryCode}/order/confirmed?session_id=${session_id}&order_id=${order_id}`
      )
    } else {
      redirect(
        `/${params.countryCode}/order/confirmed?session_id=${session_id}&cart_id=${cartId}`
      )
    }
  } catch (error: any) {
    console.error("[Checkout Success] ❌ Error:", error.message)
    console.error("[Checkout Success] Stack:", error.stack)
    // Fallback: redirect to generic thank you page
    redirect(`/${params.countryCode}/order/confirmed?session_id=${session_id}`)
  }
}