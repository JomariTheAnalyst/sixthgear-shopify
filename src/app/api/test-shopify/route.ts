import { NextResponse } from "next/server";
import { shopifyGraphql } from "@lib/shopify/client";

export async function GET() {
  const query = `
    query {
      shop {
        name
        primaryDomain { url }
        paymentSettings { currencyCode }
      }
      products(first: 3) {
        edges {
          node {
            id
            title
            handle
          }
        }
      }
    }
  `;

  try {
    const { data, errors } = await shopifyGraphql(query, {}, true);

    if (errors && errors.length > 0) {
      return NextResponse.json({ success: false, errors }, { status: 500 });
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
  }
}
