import "next-auth";

declare module "next-auth" {
  interface User {
    id: string;
    name: string;
  }

  interface Session {
    user: session.user;
    expires: session.user;
    token: session.token;
    activeSubscription: userActiveSubscription;
  }
}
