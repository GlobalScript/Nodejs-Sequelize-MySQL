document.addEventListener('DOMContentLoaded', () => {
    const signupForm = document.getElementById('signup-form');
    const signinForm = document.getElementById('signin-form');
    const logoutButton = document.getElementById('logout-button');

    const handleLogout = () => {
        localStorage.removeItem('token');
        alert('You have been logged out.');
        window.location.href = 'index.html';
    };
    if (logoutButton) {
        logoutButton.addEventListener('click', handleLogout);
    }

    if (signupForm) {
        signupForm.addEventListener('submit', async (event) => {
            event.preventDefault();
            showLoader();
            const formData = new FormData(signupForm);
            const data = Object.fromEntries(formData);
            try {
                const response = await fetch(`${URL}/auth/signup`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(data)
                });
                const result = await response.json();
                if (response.ok) {
                    setTimeout(() => {
                        alert('Registration successful!');
                        window.location.href = 'signin.html';
                    },20);
                } else {
                    const errorMessage = result.error ? result.error.errors[0].message : result.message;
                    alert(errorMessage);
                }
            } catch (error) {
                alert('Error occurred during registration');
                console.error(error);
            } finally {
                hideLoader();
            }
        });
    }

    if (signinForm) {
        signinForm.addEventListener('submit', async (event) => {
            event.preventDefault();
            showLoader();
            const formData = new FormData(signinForm);
            const data = Object.fromEntries(formData);
            try {
                const response = await fetch(`${URL}/auth/signin`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(data)
                });
                const result = await response.json();
                if (response.ok) {
                    localStorage.setItem('token', result.token);
                    setTimeout(() => {
                        alert('Sign-in successful!');
                        window.location.href = 'index.html';
                    },20);
                } else {
                    const errorMessage = result.error ? result.error.errors[0].message : result.message;
                    alert(errorMessage);
                }
            } catch (error) {
                alert('Error occurred during sign-in');
                console.error(error);
            } finally {
                hideLoader();
            }
        });
    }
});
