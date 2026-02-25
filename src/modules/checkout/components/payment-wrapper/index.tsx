// Payment wrapper — now a passthrough since Shopify handles checkout
import React from "react"

type PaymentWrapperProps = {
  cart: any
  children: React.ReactNode
}

const PaymentWrapper: React.FC<PaymentWrapperProps> = ({ children }) => {
  return <>{children}</>
}

export default PaymentWrapper
