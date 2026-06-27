# PassItOn

> **A full-stack campus marketplace that enables students to buy, sell, donate, and exchange pre-owned items securely within their college community.**

PassItOn is designed to promote affordability, sustainability, and community engagement by giving reusable items a second life instead of letting them go to waste.

## Overview

Every academic year, students purchase books, electronics, stationery, lab equipment, and other academic essentials. Once a semester ends or they graduate, many of these items are no longer needed and are often discarded or sold through general online marketplaces that lack trust, verification, and a campus-focused audience.

At the same time, incoming students spend a significant amount of money purchasing brand-new items that are only required for a limited period.

**PassItOn** solves this problem by providing a dedicated marketplace exclusively for college students. It enables users to list, discover, buy, sell, exchange, or donate reusable items within their campus community, reducing waste while making education more affordable.

## Problem Statement

Students frequently face several challenges while buying or disposing of used items:

* No dedicated marketplace designed specifically for college communities.
* Difficulty finding trustworthy buyers and sellers.
* Valuable items are discarded after graduation or semester completion.
* Existing marketplaces lack campus verification and local accessibility.
* Students incur unnecessary expenses purchasing new items that are already available within their college.

## Solution

PassItOn provides a secure and centralized platform where students can:

* Buy and sell pre-owned items.
* Donate or exchange reusable products.
* Browse listings posted by fellow students.
* Manage their own marketplace activity.
* Interact through a verified and authenticated platform.

By encouraging the reuse of products, PassItOn helps students save money while promoting environmental sustainability.

## Features

### Student Features

* User Registration & Login
* Secure JWT Authentication
* User Profile Management
* Create, Edit & Delete Listings
* Upload Product Images
* Browse Available Items
* View Product Details
* Claim Available Items
* Track Personal Listings
* View Claimed Products

### Admin Features

* Secure Admin Login
* Admin Dashboard
* Manage Users
* Manage Item Listings
* Remove Inappropriate Listings
* Monitor Marketplace Activity
* Manage Platform Content

### Security

* JWT Authentication
* Password Hashing using bcrypt
* Protected Routes
* Role-Based Authorization
* Secure REST APIs

## Tech Stack

### Frontend

* HTML5
* CSS3
* JavaScript

### Backend

* Node.js
* Express.js

### Database

* MongoDB
* Mongoose

### Authentication

* JWT
* bcrypt

### Development Tools

* Git
* GitHub
* Postman
* MongoDB
* Visual Studio Code

## Project Structure

```text
PassItOn
│
├── backend
│   ├── controllers
│   ├── middleware
│   ├── models
│   ├── routes
│   ├── database
│   ├── uploads
│   └── server.js
│
├── frontend
│   ├── assets
│   ├── css
│   ├── js
│   ├── pages
│   └── index.html
│
└── README.md
```

## API Modules

### Authentication

* Register User
* Login User
* Update Profile
* Change Password

### Marketplace

* Create Listing
* Update Listing
* Delete Listing
* Browse Listings
* View Item Details
* Claim Item
* View My Listings
* View Claimed Items

### Admin

* Manage Users
* Manage Listings
* Moderate Platform Content

## Objectives

* Build a trusted marketplace exclusively for college students.
* Encourage sustainable reuse of educational resources.
* Reduce unnecessary expenditure on academic essentials.
* Minimize waste by extending the lifecycle of reusable products.
* Provide a secure, scalable, and user-friendly platform.

## Future Enhancements

* Real-time chat between buyers and sellers
* Product categories and advanced filters
* Wishlist functionality
* Email notifications
* Real-time notifications
* College email verification
  

## Author

**Shivang Pandey**

GitHub: https://github.com/Shivang0402

## Why PassItOn?

PassItOn is a platform built to create a sustainable campus ecosystem where reusable items continue to benefit students instead of becoming waste. By making second-hand resources easily accessible, the platform reduces costs, promotes responsible consumption, and strengthens collaboration within the college community.
