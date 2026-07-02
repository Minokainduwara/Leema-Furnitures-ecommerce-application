// src/components/ProductImageGallery.tsx
import { useState } from 'react'

type Props = { images: string[]; name: string }

const ProductImageGallery = ({ images, name }: Props) => {
  const [selected, setSelected] = useState(0)

  return (
    <div>
        <div className="bg-white p-4 rounded"></div>
      <h1 className="text-2xl font-bold mb-4 text-black uppercase">{name}</h1>
      <img
        src={images[selected]}
        alt={name}
        className="w-full h-72 object-cover rounded border mb-3"
      />
      <div className="flex gap-2">
        {images.map((img, i) => (
          <img
            key={i}
            src={img}
            onClick={() => setSelected(i)}
            className={`w-24 h-16 object-cover rounded cursor-pointer border-2 ${
              selected === i ? 'border-yellow-500' : 'border-transparent'
            }`}
          />
        ))}
      </div>
    </div>
  )
}

export default ProductImageGallery