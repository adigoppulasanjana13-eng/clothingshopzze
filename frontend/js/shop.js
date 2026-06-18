// Catalog filter, search, and pagination manager

let currentPage = 1;
let selectedSizes = [];

// Parse initial filters from URL query parameters
function getUrlParams() {
  const params = new URLSearchParams(window.location.search);
  return {
    ageGroup: params.get('ageGroup'),
    category: params.get('category'),
    search: params.get('search'),
    sort: params.get('sort')
  };
}

// Set initial checkbox/input states based on URL query
function initFilterUI() {
  const urlParams = getUrlParams();

  if (urlParams.ageGroup) {
    const groups = urlParams.ageGroup.split(',');
    groups.forEach(g => {
      const cb = document.querySelector(`#filter-ageGroup input[value="${g}"]`);
      if (cb) cb.checked = true;
    });
  }

  if (urlParams.category) {
    const cats = urlParams.category.split(',');
    cats.forEach(c => {
      const cb = document.querySelector(`#filter-category input[value="${c}"]`);
      if (cb) cb.checked = true;
    });
  }

  if (urlParams.search) {
    document.getElementById('search-input').value = urlParams.search;
  }

  if (urlParams.sort) {
    document.getElementById('sort-select').value = urlParams.sort;
  }

  // Bind Listeners
  document.querySelectorAll('#filter-ageGroup input, #filter-category input, #filter-price input, #filter-rating input').forEach(el => {
    el.addEventListener('change', () => {
      currentPage = 1;
      fetchAndRenderProducts();
    });
  });

  // Size option listeners
  document.querySelectorAll('#filter-sizes .size-btn-option').forEach(btn => {
    btn.addEventListener('click', function() {
      const size = this.getAttribute('data-size');
      if (selectedSizes.includes(size)) {
        selectedSizes = selectedSizes.filter(s => s !== size);
        this.classList.remove('active');
      } else {
        selectedSizes.push(size);
        this.classList.add('active');
      }
      currentPage = 1;
      fetchAndRenderProducts();
    });
  });

  // Sort dropdown listener
  document.getElementById('sort-select').addEventListener('change', () => {
    currentPage = 1;
    fetchAndRenderProducts();
  });

  // Search listeners
  document.getElementById('search-btn').addEventListener('click', () => {
    currentPage = 1;
    fetchAndRenderProducts();
  });
  document.getElementById('search-input').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      currentPage = 1;
      fetchAndRenderProducts();
    }
  });
}

// Build query string from active filters
function buildQueryString() {
  const params = [];

  // Age group checkboxes
  const activeAgeGroups = Array.from(document.querySelectorAll('#filter-ageGroup input:checked')).map(cb => cb.value);
  if (activeAgeGroups.length > 0) {
    params.push(`ageGroup=${encodeURIComponent(activeAgeGroups.join(','))}`);
  }

  // Category checkboxes
  const activeCategories = Array.from(document.querySelectorAll('#filter-category input:checked')).map(cb => cb.value);
  if (activeCategories.length > 0) {
    params.push(`category=${encodeURIComponent(activeCategories.join(','))}`);
  }

  // Sizes selection
  if (selectedSizes.length > 0) {
    params.push(`sizes=${encodeURIComponent(selectedSizes.join(','))}`);
  }

  // Price range radio
  const priceRange = document.querySelector('#filter-price input:checked').value;
  if (priceRange !== 'all') {
    const [min, max] = priceRange.split('-');
    if (min) params.push(`minPrice=${min}`);
    if (max) params.push(`maxPrice=${max}`);
  }

  // Rating radio
  const rating = document.querySelector('#filter-rating input:checked').value;
  if (rating !== 'all') {
    params.push(`rating=${encodeURIComponent(rating)}`);
  }

  // Sort selection
  const sort = document.getElementById('sort-select').value;
  params.push(`sort=${encodeURIComponent(sort)}`);

  // Search text
  const searchVal = document.getElementById('search-input').value.trim();
  if (searchVal) {
    params.push(`search=${encodeURIComponent(searchVal)}`);
  }

  // Current Page
  params.push(`page=${currentPage}`);

  return params.length > 0 ? `?${params.join('&')}` : '';
}

// Fetch and render products on the grid
async function fetchAndRenderProducts() {
  const grid = document.getElementById('shop-products-grid');
  grid.innerHTML = `
    <div style="grid-column: 1/-1; text-align: center; color: var(--text-muted); padding: 5rem;">
      <i class="fas fa-circle-notch fa-spin" style="font-size: 2rem; margin-bottom: 1rem;"></i>
      <p>Curating catalog...</p>
    </div>
  `;

  try {
    const queryString = buildQueryString();
    const response = await window.API.get(`/products${queryString}`);

    if (response.success && response.data) {
      const { products, page, pages, totalProducts } = response.data;

      // Update URL search query in the browser address bar without reload
      const newUrl = window.location.pathname + queryString;
      window.history.pushState({ path: newUrl }, '', newUrl);

      if (products.length === 0) {
        grid.innerHTML = `
          <div style="grid-column: 1/-1; text-align: center; color: var(--text-muted); padding: 5rem;">
            <i class="fas fa-search" style="font-size: 2.5rem; margin-bottom: 1rem; color: var(--border-color);"></i>
            <p style="font-size: 1.1rem; font-weight: 500;">No items found matching your filters.</p>
            <p style="font-size: 0.9rem; margin-top: 0.25rem;">Try relaxing your search terms or checkboxes.</p>
          </div>
        `;
        document.getElementById('shop-pagination').innerHTML = '';
        return;
      }

      // Render product cards
      grid.innerHTML = products.map(prod => {
        const stars = Array(Math.round(prod.rating.average || 5)).fill('<i class="fas fa-star"></i>').join('');
        const ratingCount = prod.rating.count || 0;
        return `
          <div class="product-card animate-fade-in-up" onclick="window.location.href='/product.html?id=${prod._id}'">
            <div class="product-image-container">
              ${prod.isSale ? '<div class="product-badge sale">Sale</div>' : prod.isFeatured ? '<div class="product-badge">Featured</div>' : ''}
              <img src="${prod.images[0]}" alt="${prod.name}" class="product-img">
              <img src="${prod.hoverImage || prod.images[0]}" alt="${prod.name}" class="product-img-hover">
            </div>
            <div class="product-info">
              <span class="product-brand">${prod.brand}</span>
              <h3 class="product-name">${prod.name}</h3>
              <div class="product-rating">
                ${stars}
                <span>(${ratingCount})</span>
              </div>
              <div class="product-footer">
                <div class="product-price-box">
                  <span class="product-price">₹${prod.price}</span>
                  ${prod.mrp > prod.price ? `<span class="product-mrp">₹${prod.mrp}</span>` : ''}
                  ${prod.discount > 0 ? `<span class="product-discount">${prod.discount}% Off</span>` : ''}
                </div>
              </div>
            </div>
          </div>
        `;
      }).join('');

      // Render pagination
      renderPagination(page, pages);
    }
  } catch (err) {
    grid.innerHTML = `<p style="grid-column: 1/-1; text-align: center; color: var(--error);">Failed to load products. Please check server connection.</p>`;
  }
}

// Render page buttons
function renderPagination(page, pages) {
  const container = document.getElementById('shop-pagination');
  if (pages <= 1) {
    container.innerHTML = '';
    return;
  }

  let html = '';
  
  // Previous button
  if (page > 1) {
    html += `<button class="pagination-btn" onclick="changePage(${page - 1})"><i class="fas fa-chevron-left"></i></button>`;
  }

  // Page numbers
  for (let i = 1; i <= pages; i++) {
    html += `<button class="pagination-btn ${i === page ? 'active' : ''}" onclick="changePage(${i})">${i}</button>`;
  }

  // Next button
  if (page < pages) {
    html += `<button class="pagination-btn" onclick="changePage(${page + 1})"><i class="fas fa-chevron-right"></i></button>`;
  }

  container.innerHTML = html;
}

// Change page action
window.changePage = function(pageNumber) {
  currentPage = pageNumber;
  fetchAndRenderProducts();
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

// Initial run
document.addEventListener('DOMContentLoaded', () => {
  initFilterUI();
  fetchAndRenderProducts();
});
