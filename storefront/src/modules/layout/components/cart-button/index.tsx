"use client"

import { useEffect, useState } from "react"
import CartDropdown from "../cart-dropdown"
import { enrichLineItems, retrieveCart } from "@lib/data/cart"
import { HttpTypes } from "@medusajs/types"

export default function CartButton() {
  const [cart, setCart] = useState<HttpTypes.StoreCart | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const cart = await retrieveCart()

        if (!cart) {
          setCart(null)
          return
        }

        if (cart?.items?.length) {
          const enrichedItems = await enrichLineItems(cart.items, cart.region_id!)
          cart.items = enrichedItems
        }

        setCart(cart)
      } catch (error) {
        console.error("Error fetching cart:", error)
        setCart(null)
      } finally {
        setLoading(false)
      }
    }

    fetchCart()
  }, [])

  if (loading) {
    return <CartDropdown cart={null} />
  }

  return <CartDropdown cart={cart} />
}
