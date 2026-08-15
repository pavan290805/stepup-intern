import { registerEventRegistrationListeners } from "@/events/listeners/on-event-registration.listener";
import { registerCommunityListeners } from "@/events/listeners/on-community-activity.listener";
import { createModuleLogger } from "@/config/logger.config";

const logger = createModuleLogger("event-emitter");

let registered = false;

/**
 * Idempotent listener registration, called once from application bootstrap
 * (or lazily by the first route handler that publishes an event). Keeping
 * this separate from `event-bus.ts` avoids import-order issues where a
 * listener module and the bus that it subscribes to would otherwise need
 * to import each other.
 */
export function registerAllEventListeners(): void {
  if (registered) return;

  registerEventRegistrationListeners();
  registerCommunityListeners();

  registered = true;
  logger.info("Domain event listeners registered");
}
