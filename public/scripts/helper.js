// const URL = 'http://localhost:8080';
const URL = 'https://nodejs-sequelize-my-sql.vercel.app';

const userNameElement = document.getElementById('user-name');
const preloader = document.querySelector('.preloader');

const displayUserInfo = () => {
    const token = localStorage.getItem('token');
    if (!token) {
        userNameElement.style.display = 'none';
        return;
    }

    const payload = JSON.parse(atob(token.split('.')[1]));
    if (payload && payload.firstname && payload.lastname) {
        userNameElement.innerText = `Welcome, ${payload.firstname} ${payload.lastname}`;
        userNameElement.style.display = 'block';
    } else {
        userNameElement.style.display = 'none';
    }
};

const showLoader = () => {
    preloader.style.display = 'flex';
};

const hideLoader = () => {
    preloader.style.display = 'none';
};

