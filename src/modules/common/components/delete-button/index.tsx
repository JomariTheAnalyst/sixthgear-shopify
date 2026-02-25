import { deleteLineItem } from "@lib/data/cart"
import { useCartStore } from "@lib/cart"
import { Loader2, Trash2 } from "lucide-react"
import { useState } from "react"

// Simple className utility
function cn(...classes: (string | undefined | false)[]) {
  return classes.filter(Boolean).join(" ")
}

const DeleteButton = ({
  id,
  children,
  className,
}: {
  id: string
  children?: React.ReactNode
  className?: string
}) => {
  const [isDeleting, setIsDeleting] = useState(false)
  const setCart = useCartStore((s) => s.setCart)

  const handleDelete = async (lineId: string) => {
    setIsDeleting(true)
    try {
      const updatedCart = await deleteLineItem({ lineId })
      if (updatedCart) {
        setCart(updatedCart as any)
      }
    } catch (err) {
      console.error("Failed to delete item:", err)
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <button
      className={cn(
        "flex items-center gap-x-1 text-red-500 hover:text-red-700 cursor-pointer transition-colors",
        className
      )}
      onClick={() => handleDelete(id)}
    >
      {isDeleting ? (
        <Loader2 className="animate-spin w-5 h-5" />
      ) : (
        <Trash2 className="w-5 h-5" />
      )}
      {children && <span>{children}</span>}
    </button>
  )
}

export default DeleteButton
