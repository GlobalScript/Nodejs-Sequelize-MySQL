# Project Overview

This project is created using Node.js, Sequelize, and MySQL. It includes functionality for creating and editing products in the database, placing orders, editing user information, and deleting personal accounts. The project also features role-based access control for different parts and options of the site.

## Project Goals

The main idea of the project is to explore ways to interact with relational databases, link tables, and perform cascading deletions using an ORM (Object-Relational Mapping).

## Features

- **Product Management**: Create and edit products in the database.
- **Order Management**: Place and manage orders.
- **User Management**: Edit user information and delete personal accounts.
- **Role-Based Access Control**: Differentiate access to site parts and options based on user roles.

## Demo Site

To showcase some of the backend options, a simple site is available at:
[this link](https://nodejs-sequelize-my-sql.vercel.app)

### Admin Access

To log in as an admin:
- **Nickname**: Admin
- **Password**: 123123

**Domain**: [https://nodejs-sequelize-my-sql.vercel.app](https://nodejs-sequelize-my-sql.vercel.app)

| Methods | Path                      | Data                       | Middleware              | Description                            |
|---------|---------------------------|----------------------------|-------------------------|----------------------------------------|
| POST    | /auth/signup              | {                          |                         |                                        |
|         |                           | nickname: string           | ---------               | User registration                      |
|         |                           | phone: string              |                         |                                        |
|         |                           | password: string           |                         |                                        |
|         |                           | confirmPassword: string    |                         |                                        |
|         |                           | firstname: string          |                         |                                        |
|         |                           | lastname: string           |                         |                                        |
|         |                           | avatar?: string            |                         |                                        |
|         |                           | }                          |                         |                                        |
| POST    | /auth/signin              | {                          | ----------              | User login                             |
|         |                           | nickname: string           |                         |                                        |
|         |                           | password: string           |                         |                                        |
|         |                           | }                          |                         |                                        |
|         |                           |                            |                         |                                        |
| GET     | /user/all-users           | -------------              | accessRole()            | Access for admin and moderator         |
| POST    | /user/find-user           | {                          | accessRole()            | Access for admin and moderator         |
|         |                           | query: string              |                         | query: nickname or phone               |
|         |                           | }                          |                         |                                        |
| PUT     | /user/update-info         | {                          | authMiddleware          | Update User Info                       |
|         |                           | password: string           |                         | Data update is possible                |
|         |                           | firstname?: string         |                         | when the user                          |
|         |                           | lastname?: string          |                         | is authenticated                       |
|         |                           | avatar?: string            |                         |                                        |
|         |                           | }                          |                         |                                        |
| PUT     | /user/change-phone        | {                          | authMiddleware          | User's phone number update             |
|         |                           | password: string           |                         | is possible  when the user             |
|         |                           | newPhoneNumber: string     |                         | is authenticated                       |
|         |                           | }                          |                         |                                        |
| PUT     | /user/change-password     | {                          | authMiddleware          | User password change                   |
|         |                           | oldPassword: string        |                         | is possible  when the user             |
|         |                           | newPassword: string        |                         | is authenticated                       |
|         |                           | confirmNewPassword: string |                         |                                        |
|         |                           | }                          |                         |                                        |
| DELETE  | /user/delete-user         | {                          | authMiddleware          | Deleting a user profile                |
|         |                           | nickname: string           |                         | is possible  when the user             |
|         |                           | password: string           |                         | is authenticated                       |
|         |                           | }                          |                         |                                        |
|         |                           |                            |                         |                                        |
| POST    | /role/add-admin           | {                          |                         |                                        |
|         |                           | adminSecretKey: string     | authMiddleware          | The initial addition of                |
|         |                           | roleId: number             |                         | an admin to the database               |
|         |                           | }                          |                         |                                        |
| POST    | /role/add-role            | {                          | authMiddleware          | Access for administrator only          |
|         |                           | userId: number             | accessRole(Roles.ADMIN) | Allows the initial admin to add other  |
|         |                           | roleId: number             |                         | admins and moderators                  |
|         |                           | }                          |                         | 1: user, 2: moderator, 3: admin,       |
| DELETE  | /role/delete-admin        | {                          |                         |                                        |
|         |                           | adminSecretKey: string     |                         | Path for removing an admin             |
|         |                           | roleId: number             |                         | role from the database                 |
|         |                           | }                          |                         |                                        |
| DELETE  | /role/delete-role         | {                          | authMiddleware          | Access for administrator only          |
|         |                           | userId: number             | accessRole(Roles.ADMIN) | Allows the removal of user             |
|         |                           | roleId: number             |                         | and moderator roles                    |
|         |                           | }                          |                         |                                        |
|         |                           |                            |                         |                                        |
| POST    | /goods/create-product     | {                          | authMiddleware          | Adding a product to the database       |
|         |                           | title: string              | accessRole(Roles.ADMIN) | is only available to the admin         |
|         |                           | price: number              |                         |                                        |
|         |                           | description: string        |                         |                                        |
|         |                           | category: string           |                         |                                        |
|         |                           | discount?: number          |                         |                                        |
|         |                           | image?: string             |                         |                                        |
|         |                           | isNew?: boolean            |                         |                                        |
|         |                           | popular?: boolean          |                         |                                        |
|         |                           | }                          |                         |                                        |
| PUT     | /goods/edit-product       | {                          | authMiddleware          | Updating product data                  |
|         |                           | title: string              | accessRole(Roles.ADMIN) | is possible  when the admin            |
|         |                           | price: number              |                         | is authenticated                       |
|         |                           | description: string        |                         | Access for administrator only          |
|         |                           | category: string           |                         |                                        |
|         |                           | productID: number          |                         |                                        |
|         |                           | discount?: number          |                         |                                        |
|         |                           | image?: string             |                         |                                        |
|         |                           | isNew?: boolean            |                         |                                        |
|         |                           | popular?: boolean          |                         |                                        |
|         |                           | }                          |                         |                                        |
| DELETE  | /goods/delete-product     | {                          | authMiddleware          | Deleting a product                     |
|         |                           | productId: number          | accessRole(Roles.ADMIN) | from the database                      |
|         |                           | }                          |                         |                                        |
| GET     | /goods/all-products       | ------                     | ------                  | All products                           |
| GET     | /goods/category/:category | ------                     | ------                  | All products by category               |
| GET     | /goods/asc/:category?     | ------                     | ------                  | Products in ascending order            |
| GET     | /goods/desc/:category?    | ------                     | ------                  | Products in descending order           |
|         |                           |                            |                         |                                        |
| POST    | /basket/add-product       | {                          | authMiddleware          | Adding product data                    |
|         |                           | productId: number          |                         | to the database                        |
|         |                           | quantity: number           |                         |                                        |
|         |                           | }                          |                         |                                        |
| PUT     | /basket/update-quantity   | {                          | authMiddleware          |                                        |
|         |                           | productId: number          |                         | Change the item quantity               |
|         |                           | quantity: number           |                         |                                        |
|         |                           | }                          |                         |                                        |
| DELETE  | /basket/remove-product    | {                          | authMiddleware          | Removing a product                     |
|         |                           | productId: number          |                         | from the basket                        |
|         |                           | }                          |                         |                                        |
| GET     | /basket/auth-user         | ------                     | authMiddleware          | Authorized user's basket               |
|         |                           |                            |                         |                                        |
| POST    | /orders/order             | {                          | authMiddleware          | Creating an order                      |
|         |                           | deliveryDate: string       |                         | format 'YYYY-MM-DD'                    |
|         |                           | }                          |                         |                                        |
| GET     | /orders/all-orders        | ------                     | accessRole()            | Retrieving all orders                  |
|         |                           | {                          |                         |                                        |
| POST    | /orders/find-order        | userId: number             | accessRole()            | Searching for an order by user ID      |
|         |                           | }                          |                         |                                        |
| GET     | /orders/details/:orderId  | -------                    | authMiddleware          |  Retrieving information about the      |
|         |                           |                            |                         |  authenticated user's own orders       |
