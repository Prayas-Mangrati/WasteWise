const categories = [
  {
    name: 'Plastic',
    icon: '🧴',
    type: 'Non-biodegradable'
  },
  {
    name: 'Paper',
    icon: '📄',
    type: 'Biodegradable'
  },
  {
    name: 'Cardboard',
    icon: '📦',
    type: 'Biodegradable'
  },
  {
    name: 'Glass',
    icon: '🍾',
    type: 'Non-biodegradable'
  },
  {
    name: 'Metal',
    icon: '🥫',
    type: 'Non-biodegradable'
  },
  {
    name: 'Food Organics',
    icon: '🍎',
    type: 'Biodegradable'
  },
  {
    name: 'Vegetation',
    icon: '🌿',
    type: 'Biodegradable'
  },
  {
    name: 'Textile Trash',
    icon: '👕',
    type: 'Special / Textile Waste'
  },
  {
    name: 'Miscellaneous Trash',
    icon: '🗑️',
    type: 'General / Mixed Waste'
  }
]

function Categories() {
  return (
    <section className="categories-section">
      <div className="categories-container">

        <div className="categories-heading">
          <p className="categories-label">WHAT WE RECOGNIZE</p>

          <h2>Supported Waste Categories</h2>

          <p>
            WasteWise can currently identify these nine types of waste.
          </p>
        </div>

        <div className="categories-grid">
          {categories.map((category) => (
            <div className="category-card" key={category.name}>
              <div className="category-icon">
                {category.icon}
              </div>

              <h3>{category.name}</h3>

              <p>{category.type}</p>
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}

export default Categories