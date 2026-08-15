import { EventEmitter } from "node:events";
import { createModuleLogger } from "@/config/logger.config";
import type { EventName } from "@/shared/constants/event-names";

const logger = createModuleLogger("event-bus");

/**
 * In-process pub/sub. Emitters (services) never know which listeners exist;
 * listeners (events/listeners/*) subscribe independently at module load.
 * This is the architecture-only notification layer described in the spec:
 * it records/logs that a notification-worthy event occurred, without
 * integrating any actual email/push provider.
 */
class DomainEventBus extends EventEmitter {
  publish<T = unknown>(eventName: EventName, payload: T): void {
    logger.debug({ eventName, payload }, "Domain event published");
    this.emit(eventName, payload);
  }
}

export const eventBus = new DomainEventBus();
eventBus.setMaxListeners(50);
