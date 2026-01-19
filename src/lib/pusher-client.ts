"use client";

import PusherClient from "pusher-js";

// On s'assure de n'avoir qu'une seule instance du client Pusher dans l'application
// C'est une optimisation pour éviter les connexions multiples en développement
let pusherClientInstance: PusherClient | null = null;

const getPusherClient = () => {
  if (!pusherClientInstance) {
    // Log pour s'assurer que les variables sont bien lues côté client
    // console.log("Initializing Pusher Client with key:", process.env.NEXT_PUBLIC_PUSHER_KEY);
    
    if (
      !process.env.NEXT_PUBLIC_PUSHER_KEY ||
      !process.env.NEXT_PUBLIC_PUSHER_CLUSTER
    ) {
      throw new Error("Pusher client-side keys are not configured. Check your .env.local file.");
    }
    
    pusherClientInstance = new PusherClient(process.env.NEXT_PUBLIC_PUSHER_KEY, {
      cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER,
    });
  }
  return pusherClientInstance;
};

export const pusherClient = getPusherClient();
