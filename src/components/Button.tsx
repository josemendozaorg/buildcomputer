import { ReactNode } from 'react'

interface ButtonProps {
  children: ReactNode
  onClick?: () => void
}

function Button({ children, onClick }: ButtonProps) {
  return (
    <button
      onClick={onClick}
      className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-4 rounded-lg transition-colors duration-200 min-h-[44px]"
    >
      {children}
    </button>
  )
}

export default Button
