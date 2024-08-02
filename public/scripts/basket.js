document.addEventListener('DOMContentLoaded', () => {
    const basketItems = document.getElementById('basket-items');
    const placeOrderButton = document.getElementById('place-order');
    const deliveryDateInput = document.getElementById('delivery-date');
    const logoutButton = document.getElementById('logout');

    const fetchBasket = async () => {
        showLoader();
        try {
            const response = await fetch(`${URL}/basket/auth-user`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            const result = await response.json();
            if (response.ok) {
                displayBasket(result.basket);
            } else {
                displayBasket(result.basket);
            }
        } catch (error) {
            alert('Error occurred while fetching basket');
            console.error(error);
        } finally {
            hideLoader();
        }
    };

    const displayBasket = (basket) => {
        const totalPriceElement = document.getElementById('total-price');
        basketItems.innerHTML = '';
        let totalPrice = 0;
        if (!basket || basket.goods.length === 0) {
            basketItems.innerHTML = '';
            totalPriceElement.textContent = '';
            setTimeout(() => {
                alert('Your basket is empty.');
                window.location.href = 'index.html';
            },20);
            return;
        }
        basket.goods.forEach(item => {
            totalPrice += item.subtotal;
            const basketItem = document.createElement('div');
            basketItem.className = 'basket-item';
            basketItem.innerHTML = `
                <div class="image-placeholder"></div>
                <div class="item-details">
                    <h3>${item.title}</h3>
                    <p>${item.description}</p>
                    <p>Price: $${item.finalPrice}</p>
                    <p>Subtotal: $${item.subtotal}</p>
                </div>
                <div class="item-actions">
                    <button class="remove-button" data-id="${item.id}">Remove</button>
                    <input type="number" class="quantity-input" value="${item.basket_product.quantity}" min="1" data-id="${item.id}">
                </div>
            `;
            basketItems.appendChild(basketItem);
        });
        totalPriceElement.textContent = `Total Price: $${totalPrice.toFixed(2)}`;
    };

    const updateQuantity = async (productId, quantity) => {
        showLoader();
        try {
            const response = await fetch(`${URL}/basket/update-quantity`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({ productId, quantity })
            });
            const result = await response.json();
            if (response.ok) {
                fetchBasket();
            } else {
                alert(result.error || 'Failed to update quantity');
            }
        } catch (error) {
            alert('Error occurred while updating quantity');
            console.error(error);
        } finally {
            hideLoader();
        }
    };

    const removeProduct = async (productId) => {
        showLoader();
        try {
            const response = await fetch(`${URL}/basket/remove-product`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({ productId })
            });
            const result = await response.json();
            if (response.ok) {
                fetchBasket();
            } else {
                alert(result.error || 'Failed to remove product');
            }
        } catch (error) {
            alert('Error occurred while removing product');
            console.error(error);
        } finally {
            hideLoader();
        }
    };

    const placeOrder = async () => {
        const deliveryDate = deliveryDateInput.value;
        if (!deliveryDate) {
            alert('Please select a delivery date');
            return;
        }
        showLoader();
        try {
            const response = await fetch(`${URL}/orders/order`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({ deliveryDate })
            });
            const result = await response.json();
            hideLoader();
            setTimeout(() => {
                if (response.ok) {
                    const orderId = result.orderId;
                    window.location.href = `order.html?orderId=${orderId}`;
                } else {
                    const errorMessage = result.error ? result.error.errors[0].message : result.message;
                    alert(errorMessage);
                }
            }, 20);
        } catch (error) {
            hideLoader();
            setTimeout(() => {
                alert('Error occurred while placing order');
            }, 20);
            console.error(error);
        }
    };

    basketItems.addEventListener('change', (event) => {
        if (event.target.classList.contains('quantity-input')) {
            const productId = event.target.getAttribute('data-id');
            const quantity = parseInt(event.target.value, 10);
            updateQuantity(productId, quantity);
        }
    });

    basketItems.addEventListener('click', (event) => {
        if (event.target.classList.contains('remove-button')) {
            const productId = event.target.getAttribute('data-id');
            removeProduct(productId);
        }
    });

    placeOrderButton.addEventListener('click', placeOrder);
    logoutButton.addEventListener('click', () => {
        localStorage.removeItem('token');
        window.location.href = 'signin.html';
    });

    displayUserInfo();
    fetchBasket();
});
