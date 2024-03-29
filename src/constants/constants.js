export const axiosRoutes = {
  menu: '/api/menu',
  orders: {
    getOrders: (userId) => `/api/orders/${userId}`,
    createOrder: (userId) => `/api/orders/${userId}`
  },
  users: {
    login: '/api/login',
    getAllUsers: '/users',
    createUser: '/users',
    getUser: (id) => `/users/${id}`,
    updateUser: '/users',
    deleteUser: '/users'
  },
  userReview: {
    getAllReviews: '/api/userReviews',
    createUserReview: '/api/userReviews',
    getUserReviews: '/api/userReviews/:userId',
    deleteUserReview: '/api/userReviews/:userId'
  }
}

export const routes = {
  HOME_PAGE: '/',
  CHECKOUT_PAGE: 'checkout',
  CREATE_ACCOUNT_PAGE: 'createAccount',
  EDIT_PROFILE_PAGE: 'editProfilePage',
  MY_RESERVATIONS_PAGE: 'myReservationsPage',
  REVIEWS_PAGE: 'reviewsPage',
  NOT_FOUND_PAGE: 'notFoundPage'
}
