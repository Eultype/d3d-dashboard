import PusherServer from "pusher";

// Le "globalThis" est une astuce pour éviter de recréer une connexion à chaque
// rechargement à chaud en développement. C'est le même principe que pour votre
// connexion Prisma.
const globalForPusher = globalThis as unknown as {
  pusher: PusherServer | undefined;
};

export const pusherServer =
  globalForPusher.pusher ??
  new PusherServer({
    appId: process.env.PUSHER_APP_ID!,
    key: process.env.NEXT_PUBLIC_PUSHER_KEY!,
    secret: process.env.PUSHER_SECRET!,
    cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
    useTLS: true,
  });

if (process.env.NODE_ENV !== "production") {
  globalForPusher.pusher = pusherServer;
}
