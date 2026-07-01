/**
 * Bidirectional Sync and 3-Way Merge Engine
 */

export interface SyncRecord {
  id: string;
  weight: number;
  reps: number;
  rpe: number;
  updatedAt: string;
}

/**
 * Resolves conflicts when parallel modifications occur on both client and server.
 * Implements the 3-way merge logic:
 * - Field-Wise Last-Write-Wins (LWW) for fields updated on both sides.
 * - Field merges when changes are disjoint.
 */
export function resolveThreeWayMerge(
  ancestor: SyncRecord,
  client: SyncRecord,
  server: SyncRecord
): SyncRecord {
  // If client and server values match, no conflict exists
  if (JSON.stringify(client) === JSON.stringify(server)) {
    return client;
  }

  // Determine which fields changed from the ancestor state
  const clientChanged = {
    weight: client.weight !== ancestor.weight,
    reps: client.reps !== ancestor.reps,
    rpe: client.rpe !== ancestor.rpe,
  };

  const serverChanged = {
    weight: server.weight !== ancestor.weight,
    reps: server.reps !== ancestor.reps,
    rpe: server.rpe !== ancestor.rpe,
  };

  // Build the merged record, defaulting to client values
  const merged: SyncRecord = { ...client, updatedAt: new Date().toISOString() };

  // Resolve field conflicts based on which side modified the data
  if (serverChanged.weight && !clientChanged.weight) {
    merged.weight = server.weight;
  }
  if (serverChanged.reps && !clientChanged.reps) {
    merged.reps = server.reps;
  }
  if (serverChanged.rpe && !clientChanged.rpe) {
    merged.rpe = server.rpe;
  }

  // If both sides modified the same field, apply the higher timestamp (LWW)
  const clientTime = new Date(client.updatedAt).getTime();
  const serverTime = new Date(server.updatedAt).getTime();

  if (clientChanged.weight && serverChanged.weight) {
    merged.weight = clientTime >= serverTime ? client.weight : server.weight;
  }
  if (clientChanged.reps && serverChanged.reps) {
    merged.reps = clientTime >= serverTime ? client.reps : server.reps;
  }
  if (clientChanged.rpe && serverChanged.rpe) {
    merged.rpe = clientTime >= serverTime ? client.rpe : server.rpe;
  }

  return merged;
}

export interface SyncStatusSummary {
  dirtyCount: number;
  lastSyncedAt: string | null;
  syncInProgress: boolean;
}
