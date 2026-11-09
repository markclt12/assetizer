import { badRequest } from "./errors";

/** Next free `position` value given the current max (null when the list is empty). */
export const nextPosition = (max: number | null | undefined) => (max ?? -1) + 1;

/**
 * Throws unless `ids` lists every sibling under one parent exactly once.
 * `found` are the rows matching `ids`; `siblingCount` returns how many children that parent has.
 * Resolves to the shared parent id.
 */
export async function assertCompleteReorder(
  ids: string[],
  found: { parentId: string | null }[],
  siblingCount: (parentId: string) => Promise<number>,
): Promise<string> {
  if (new Set(ids).size !== ids.length) throw badRequest("Duplicate ids in reorder request");
  if (found.length !== ids.length) throw badRequest("Some ids do not exist");

  const parents = new Set(found.map((row) => row.parentId));
  const [parentId] = [...parents];
  if (parents.size !== 1 || !parentId) throw badRequest("All items must belong to the same parent");

  if ((await siblingCount(parentId)) !== ids.length) {
    throw badRequest("Reorder must include every item exactly once");
  }
  return parentId;
}
