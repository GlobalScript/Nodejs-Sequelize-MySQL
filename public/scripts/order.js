document.addEventListener('DOMContentLoaded', async () => {
    showLoader();
    const params = new URLSearchParams(window.location.search);
    const orderId = params.get('orderId');
    if (!orderId) {
        alert('Order ID is missing');
        return;
    }
    try {
        const response = await fetch(`${URL}/orders/details/${orderId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        hideLoader();
        document.getElementById('firstName').innerText = data.user.firstName;
        document.getElementById('lastName').innerText = data.user.lastName;
        document.getElementById('phone').innerText = data.user.phone;
        document.getElementById('totalPrice').innerText = data.order.totalPrice.toFixed(2);
        document.getElementById('deliveryDate').innerText = new Date(data.order.deliveryDate).toLocaleDateString();

        const itemsContainer = document.getElementById('itemsContainer');
        data.order.items.forEach(item => {
            const itemDiv = document.createElement('div');
            itemDiv.className = 'order-item';
            itemDiv.innerHTML = `
                    <div class="placeholder-image"></div>
                    <div>
                        <p><strong>Title:</strong> ${item.title}</p>
                        <p><strong>Quantity:</strong> ${item.quantity}</p>
                        <p><strong>Price:</strong> $${item.price.toFixed(2)}</p>
                    </div>
                `;
            itemsContainer.appendChild(itemDiv);
        });
    } catch (error) {
        console.error('Error fetching order details:', error);
    }
});

document.getElementById('homeButton').addEventListener('click', () => {
    window.location.href = 'index.html';
});
