import type { IncubationEvent, IncubationSession } from '@/types';
import { generateId } from '@/utils';

export function createEvent(
  type: IncubationEvent['type'],
  message: string,
  impact: IncubationEvent['impact'] = {}
): IncubationEvent {
  return {
    id: generateId(),
    type,
    timestamp: Date.now(),
    message,
    impact,
  };
}

export function applyEvent(session: IncubationSession, event: IncubationEvent): IncubationSession {
  return {
    ...session,
    growth: Math.max(0, Math.min(100, session.growth + (event.impact.growth ?? 0))),
    syncRate: Math.max(0, Math.min(100, session.syncRate + (event.impact.syncRate ?? 0))),
    awakening: Math.max(0, Math.min(100, session.awakening + (event.impact.awakening ?? 0))),
    events: [...session.events, event],
  };
}
