document.addEventListener('DOMContentLoaded', () => {
    const categorySelect = document.getElementById('category');
    const sortSelect = document.getElementById('sort');
    const productList = document.getElementById('product-list');
    const logoutLink = document.getElementById('logout');

    const isAuthenticated = () => {
        return !!localStorage.getItem('token');
    };

    const fetchProducts = async (category = '', sort = '') => {
        let url = `${URL}/goods/all-products`;
        if (category) {
            url = `${URL}/goods/category/${category}`;
        }
        if (sort) {
            url = `${URL}/goods/${sort}/${category}`;
        }
        try {
            showLoader();
            const response = await fetch(url);
            const products = await response.json();
            displayProducts(products);
        } catch (error) {
            console.error('Error fetching products:', error);
        } finally {
            hideLoader();
        }
    };

    const displayProducts = (products) => {
        productList.innerHTML = '';
        products.forEach(product => {
            const productCard = document.createElement('div');
            productCard.className = 'product-card';
            productCard.innerHTML = `
                <div class="product-image"></div>
                <h2 class="product-title">${product.title}</h2>
                <p class="product-description">${product.description}</p>
                <p class="product-price">Price: $${product.finalPrice}</p>
                <button class="order-button" data-id="${product.id}">Order</button>
            `;
            productList.appendChild(productCard);
        });
        document.querySelectorAll('.order-button').forEach(button => {
            button.addEventListener('click', () => {
                if (isAuthenticated()) {
                    const productId = button.getAttribute('data-id');
                    addToBasket(productId);
                } else {
                    alert('You need to sign in to add items to the basket');
                }
            });
        });
    };

    const addToBasket = async (productId) => {
        showLoader();
        try {
            const response = await fetch(`${URL}/basket/add-product`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({productId, quantity: 1})
            });
            const result = await response.json();
            hideLoader();
            setTimeout(() => {
                if (response.ok) {
                    alert('Product added to basket successfully');
                } else {
                    alert(result.error || 'Failed to add product to basket');
                }
            }, 20);
        } catch (error) {
            hideLoader();
            setTimeout(() => {
                alert('Error occurred while adding product to basket');
            }, 20);
            console.error(error);
        }
    };
    categorySelect.addEventListener('change', () => {
        fetchProducts(categorySelect.value, sortSelect.value);
    });

    sortSelect.addEventListener('change', () => {
        fetchProducts(categorySelect.value, sortSelect.value);
    });

    logoutLink.addEventListener('click', () => {
        localStorage.removeItem('token');
        alert('You have been logged out');
        window.location.href = 'signin.html';
    });

    displayUserInfo();
    fetchProducts();
});
