import db from '@/db/db';
import { draftLocationTable } from '@/db/schema';

export async function saveLocationDraft(data: any) {
  await db.insert(draftLocationTable).values([data]);
}