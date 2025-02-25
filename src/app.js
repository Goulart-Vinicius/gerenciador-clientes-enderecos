const loginController = new LoginController();
const registerController = new RegisterController();
const dashboardController = new DashboardController();
const addressController = new AddressController();

const router = new Router([
  {
    path: "/",
    controller: loginController,
  },
  {
    path: "/login",
    controller: loginController,
  },
  {
    path: "/register",
    controller: registerController,
  },
  {
    path:"/dashboard",
    controller: dashboardController
  },
  {
    path: "/address",
    controller: addressController
  },
  {
    path:"/address/:clientId",
    controller: addressController,
  },
]);

loginController.setRouter(router);
registerController.setRouter(router);
dashboardController.setRouter(router);
addressController.setRouter(router);

router.navigate(document.location.pathname);
