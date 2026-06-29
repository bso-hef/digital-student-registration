import {
  buildErrObject,
  buildSuccObject,
  itemNotFound,
} from "@/server/utils/server.utils";
import type {
  Document,
  FilterQuery,
  Model,
  PaginateModel,
  PopulateOptions,
  UpdateQuery,
} from "mongoose";
import type { PaginateResult } from "mongoose";

export function buildSort(sort: string, order: 1 | -1): Record<string, 1 | -1> {
  return { [sort]: order };
}

export function cleanPaginationID<T>(result: PaginateResult<T>) {
  result.docs.forEach((element) => {
    delete (element as Record<string, unknown>).id;
  });
  return result;
}

export async function listInitOptions(req: {
  query?: Record<string, unknown>;
}): Promise<{
  sort: Record<string, 1 | -1>;
  lean: true;
  page: number;
  limit: number;
  populate: string | string[] | PopulateOptions | PopulateOptions[] | undefined;
}> {
  const order: 1 | -1 = (req.query?.order as 1 | -1) ?? -1;
  const sort: string = (req.query?.sort as string) ?? "createdAt";
  const sortBy = buildSort(sort, order);
  const page = parseInt(req.query?.page as string, 10) || 1;
  const limit = parseInt(req.query?.limit as string, 10) || 5;
  let populate = req.query?.populate as
    string | string[] | PopulateOptions | PopulateOptions[] | undefined;

  if (typeof populate === "string") {
    if (populate.trim() === "") {
      populate = undefined;
    } else if (populate.includes(",")) {
      populate = populate.split(",").map((p) => p.trim());
    }
  }

  return { sort: sortBy, lean: true, page, limit, populate };
}

export async function checkQueryString(query: {
  filter?: string;
  fields?: string;
}) {
  try {
    if (query.filter !== undefined && query.fields !== undefined) {
      const arrayFields = query.fields.split(",");
      return {
        $or: arrayFields.map((item) => ({
          [item]: { $regex: new RegExp(query.filter as string, "i") },
        })),
      };
    }
    return {};
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.error(err.message);
    } else {
      console.error(err);
    }
    throw buildErrObject(422, "ERROR_WITH_FILTER");
  }
}

export async function getAllItems<T extends Document>(
  model: Model<T>,
  query: FilterQuery<T>,
): Promise<T[]> {
  try {
    return await model.find(query);
  } catch (err) {
    throw buildErrObject(422, (err as Error).message);
  }
}

export async function getItems<T extends Document>(
  req: { query?: Record<string, unknown> },
  model: PaginateModel<T>,
  query: FilterQuery<T>,
) {
  const options = await listInitOptions(req);
  try {
    const items = await model.paginate(query, options);
    return cleanPaginationID(items);
  } catch (err: unknown) {
    throw buildErrObject(422, err instanceof Error ? err.message : String(err));
  }
}

export async function getItem<T extends Document>(
  id: string,
  model: Model<T>,
  populateQuery?: string | PopulateOptions | (string | PopulateOptions)[],
): Promise<T> {
  try {
    const item = await model.findById(id);
    itemNotFound(null, item, () => {
      throw buildErrObject(404, "NOT_FOUND");
    });
    if (populateQuery) {
      let validPopulateQuery: string | PopulateOptions | PopulateOptions[];
      if (Array.isArray(populateQuery)) {
        validPopulateQuery = populateQuery.filter(
          (q): q is PopulateOptions => typeof q === "object",
        );
      } else {
        validPopulateQuery = populateQuery;
      }
      return (await model.populate(item!, validPopulateQuery)) as unknown as T;
    }
    return item!;
  } catch (err: unknown) {
    throw buildErrObject(422, err instanceof Error ? err.message : String(err));
  }
}

export async function createItem<T extends Document>(
  data: Partial<T>,
  model: Model<T>,
): Promise<T> {
  try {
    return await model.create(data);
  } catch (err: unknown) {
    throw buildErrObject(422, err instanceof Error ? err.message : String(err));
  }
}

export async function updateItem<T extends Document>(
  model: Model<T>,
  id: string,
  data: Partial<T>,
): Promise<T> {
  try {
    const item = await model.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });
    itemNotFound(null, item, () => {
      throw buildErrObject(404, "NOT_FOUND");
    });
    return item!;
  } catch (err: unknown) {
    throw buildErrObject(422, err instanceof Error ? err.message : String(err));
  }
}

export async function updateOneItem<T extends Document>(
  model: Model<T>,
  query: FilterQuery<T>,
  updateData: UpdateQuery<T>,
  options: Record<string, unknown> = { upsert: false, new: true, multi: false },
) {
  try {
    const result = await model.updateOne(query, updateData, options);
    if (!result || (result as { matchedCount?: number }).matchedCount === 0) {
      throw buildErrObject(404, "NOT_FOUND");
    }
    return result;
  } catch (err: unknown) {
    throw buildErrObject(422, err instanceof Error ? err.message : String(err));
  }
}

export async function findOneAndUpdateItem<T extends Document>(
  model: Model<T>,
  query: FilterQuery<T>,
  updateData: UpdateQuery<T>,
  populateQuery?: string | PopulateOptions | (string | PopulateOptions)[],
  options: Record<string, unknown> = {
    upsert: false,
    new: true,
    runValidators: true,
  },
): Promise<T> {
  try {
    const result = await model.findOneAndUpdate(query, updateData, options);
    if (!result) throw buildErrObject(404, "NOT_FOUND");
    if (populateQuery) {
      let validPopulateQuery: string | PopulateOptions | PopulateOptions[];
      if (Array.isArray(populateQuery)) {
        if (populateQuery.every((q) => typeof q === "object" && q !== null)) {
          validPopulateQuery = populateQuery as PopulateOptions[];
        } else if (populateQuery.every((q) => typeof q === "string")) {
          validPopulateQuery = (populateQuery as string[]).join(" ");
        } else {
          validPopulateQuery = populateQuery.filter(
            (q): q is PopulateOptions => typeof q === "object" && q !== null,
          );
        }
      } else {
        validPopulateQuery = populateQuery;
      }
      return (await model.populate(result, validPopulateQuery)) as unknown as T;
    }
    return result;
  } catch (err: unknown) {
    throw buildErrObject(422, err instanceof Error ? err.message : String(err));
  }
}

export async function updateManyItem<T extends Document>(
  model: Model<T>,
  conditions: FilterQuery<T>,
  updateData: UpdateQuery<T>,
) {
  try {
    const result = await model.updateMany(conditions, { $set: updateData });
    if (!result) throw buildErrObject(404, "NOT_FOUND");
    return result;
  } catch (err: unknown) {
    throw buildErrObject(422, err instanceof Error ? err.message : String(err));
  }
}

export async function deleteItem<T extends Document>(
  id: string,
  model: Model<T>,
) {
  try {
    const item = await model.findByIdAndDelete(id);
    itemNotFound(null, item, () => {
      throw buildErrObject(404, "NOT_FOUND");
    });
    return buildSuccObject("DELETED");
  } catch (err: unknown) {
    throw buildErrObject(422, err instanceof Error ? err.message : String(err));
  }
}

export async function softDeleteItem<T extends Document>(
  id: string,
  model: Model<T>,
) {
  try {
    const item = await model.findByIdAndUpdate(
      id,
      { deleted: true },
      { new: true, runValidators: true },
    );
    itemNotFound(null, item, () => {
      throw buildErrObject(404, "NOT_FOUND");
    });
    return item!;
  } catch (err: unknown) {
    throw buildErrObject(422, err instanceof Error ? err.message : String(err));
  }
}

export async function deleteManyItem<T extends Document>(
  condition: FilterQuery<T>,
  model: Model<T>,
) {
  try {
    const result = await model.deleteMany(condition);
    itemNotFound(null, result, () => {
      throw buildErrObject(404, "NOT_FOUND");
    });
    return buildSuccObject("DELETED");
  } catch (err: unknown) {
    throw buildErrObject(422, err instanceof Error ? err.message : String(err));
  }
}

export async function getItemsWithoutPaginate<T extends Document>(
  model: Model<T>,
  query: FilterQuery<T>,
  populateQuery?: string | PopulateOptions | (string | PopulateOptions)[],
): Promise<T[]> {
  try {
    const items = await model.find(query);
    if (populateQuery) {
      let validPopulateQuery: string | PopulateOptions | PopulateOptions[];
      if (Array.isArray(populateQuery)) {
        if (populateQuery.every((q) => typeof q === "object" && q !== null)) {
          validPopulateQuery = populateQuery as PopulateOptions[];
        } else if (populateQuery.every((q) => typeof q === "string")) {
          validPopulateQuery = (populateQuery as string[]).join(" ");
        } else {
          validPopulateQuery = populateQuery.filter(
            (q): q is PopulateOptions => typeof q === "object" && q !== null,
          );
        }
      } else {
        validPopulateQuery = populateQuery;
      }
      return (await model.populate(items, validPopulateQuery)) as T[];
    }
    return items;
  } catch (err: unknown) {
    throw buildErrObject(422, err instanceof Error ? err.message : String(err));
  }
}

export async function getOneItem<T extends Document>(
  model: Model<T>,
  query: FilterQuery<T>,
  projection: Record<string, unknown> | null = null,
): Promise<T | null> {
  try {
    return await model.findOne(query, projection ?? undefined);
  } catch (err: unknown) {
    throw buildErrObject(422, err instanceof Error ? err.message : String(err));
  }
}
