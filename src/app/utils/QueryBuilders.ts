// T = model type

import {
  IQueryConfig,
  IqueryParams,
  IQueryResult,
  PrismaCountArgs,
  PrismaFindManyArgs,
  PrismaModelDelegate,
  PrismaNumberFilter,
  PrismaStringFields,
  PrismaWhereCondition,
} from "../interfaces/query.interface";

export class QueryBuilder<
  T,
  TWhereInput = Record<string, unknown>,
  TInclude = Record<string, unknown>,
> {
  private query: PrismaFindManyArgs;
  private countQuery: PrismaCountArgs;
  private page: number = 1;
  private limit: number = 10;
  private skip: number = 0;
  private sortBy: string = "createdAt";
  private sortOrder: "desc" | "asc" = "asc";
  private selectFields: Record<string, boolean> | undefined;

  constructor(
    private model: PrismaModelDelegate,
    private queryParams: IqueryParams,
    private config: IQueryConfig = {},
  ) {
    this.query = {
      where: {},
      include: {},
      orderBy: {
        createdAt: "asc",
      },
      skip: 0,
      take: 10,
    };

    this.countQuery = {
      where: {},
    };

    // this.selectFields = {};
  }

  // search(): this {
  //   const { searchTerm } = this.queryParams;
  //   const { searchableFields } = this.config;

  //   if (searchTerm && searchableFields && searchableFields.length > 0) {
  //     const searchConditions: Record<string, unknown>[] = searchableFields.map(
  //       (field): Record<string, unknown> => {
  //         const stringFilter: PrismaStringFields = {
  //           contains: searchTerm,
  //           mode: "insensitive" as const,
  //         };

  //         if (field.includes(".")) {
  //           const parts = field.split(".");

  //           if (parts.length === 2) {
  //             const relation = parts[0]!;
  //             const nestedField = parts[1]!;

  //             return {
  //               [relation]: {
  //                 [nestedField]: stringFilter,
  //               },
  //             };
  //           } else if (parts.length === 3) {
  //             const relation = parts[0]!;
  //             const nestedRelation = parts[1]!;
  //             const nestedField = parts[2]!;

  //             return {
  //               [relation]: {
  //                 [nestedRelation]: {
  //                   [nestedField]: stringFilter,
  //                 },
  //               },
  //             };
  //           }
  //         }

  //         return {
  //           [field]: stringFilter,
  //         };
  //       },
  //     );

  //     const whereCondition = this.query.where as PrismaWhereCondition;
  //     whereCondition.OR = searchConditions;

  //     const countWhereCondition = this.countQuery.where as PrismaWhereCondition;
  //     countWhereCondition.OR = searchConditions;
  //   }

  //   return this;
  // }

  search(): this {
    const { searchTerm } = this.queryParams ?? {};
    const { searchableFields } = this.config;

    if (searchTerm && searchableFields && searchableFields.length > 0) {
      const searchConditions: Record<string, unknown>[] = searchableFields.map(
        (field): Record<string, unknown> => {
          const stringFilter: PrismaStringFields = {
            contains: searchTerm,
            mode: "insensitive",
          };

          if (field.includes(".")) {
            const parts = field.split(".");

            if (parts.length === 2) {
              const relation = parts[0]!;
              const nestedField = parts[1]!;

              return {
                [relation]: {
                  [nestedField]: stringFilter,
                },
              };
            }

            if (parts.length === 3) {
              const relation = parts[0]!;
              const nestedRelation = parts[1]!;
              const nestedField = parts[2]!;

              return {
                [relation]: {
                  some: {
                    [nestedRelation]: {
                      [nestedField]: stringFilter,
                    },
                  },
                },
              };
            }
          }

          return {
            [field]: stringFilter,
          };
        },
      );

      const whereCondition = this.query.where as PrismaWhereCondition;
      whereCondition.OR = searchConditions;

      const countWhereCondition = this.countQuery.where as PrismaWhereCondition;
      countWhereCondition.OR = searchConditions;
    }

    return this;
  }

  filter(): this {
    const { filterableFields } = this.config;

    const excludedField = [
      "searchTerm",
      "page",
      "limit",
      "sortBy",
      "sortOrder",
      "fields",
      "include",
    ];

    const filterParams: Record<string, unknown> = {};

    Object.keys(this.queryParams).forEach((key) => {
      if (!excludedField.includes(key)) {
        filterParams[key] = this.queryParams[key];
      }
    });

    const queryWhere = this.query.where as Record<string, unknown>;
    const countQueryWhere = this.countQuery.where as Record<string, unknown>;

    Object.keys(filterParams).forEach((key) => {
      const value = filterParams[key];

      if (value === undefined || value === "") {
        return;
      }

      const isAllowedField =
        !filterableFields ||
        filterableFields.length === 0 ||
        filterableFields.includes(key);

      if (!isAllowedField) {
        return;
      }

      if (key.includes(".")) {
        const parts = key.split(".");

        if (filterableFields && !filterableFields.includes(key)) {
          return;
        }

        if (parts.length === 2) {
          const relation = parts[0]!;
          const nestedField = parts[1]!;

          if (!queryWhere[relation]) {
            queryWhere[relation] = {};
            countQueryWhere[relation] = {};
          }

          const queryRelation = queryWhere[relation] as Record<string, unknown>;
          const countRelation = countQueryWhere[relation] as Record<
            string,
            unknown
          >;

          queryRelation[nestedField] = this.parseFilterValue(value);
          countRelation[nestedField] = this.parseFilterValue(value);
          return;
        } else if (parts.length === 3) {
          const relation = parts[0]!;
          const nestedRelation = parts[1]!;
          const nestedField = parts[2]!;

          if (!queryWhere[relation]) {
            queryWhere[relation] = {};
            countQueryWhere[relation] = {};
          }
          const queryRelation = queryWhere[relation] as Record<string, unknown>;
          const countRelation = countQueryWhere[relation] as Record<
            string,
            unknown
          >;

          queryRelation[nestedField] = this.parseFilterValue(value);
          countRelation[nestedField] = this.parseFilterValue(value);

          if (!queryRelation[nestedRelation]) {
            queryRelation[nestedRelation] = {};
          }
          if (!countRelation[nestedRelation]) {
            countRelation[nestedRelation] = {};
          }

          return;
        }
      } else {
        const parsedValue =
          key === "gender"
            ? String(value).trim().toUpperCase()
            : this.parseFilterValue(value);

        queryWhere[key] = parsedValue;
        countQueryWhere[key] = parsedValue;

        return;
      }

      if (
        typeof value === "object" &&
        value !== null &&
        !Array.isArray(value)
      ) {
        queryWhere[key] = this.parseFilterValue(value);
        countQueryWhere[key] = this.parseFilterValue(value);
        return;
      }
      queryWhere[key] = this.parseFilterValue(value);
      countQueryWhere[key] = this.parseFilterValue(value);
    });

    return this;
  }

  //paginate
  paginate(): this {
    const page = Number(this.queryParams.page) || 1;
    const limit = Number(this.queryParams.limit) || 10;
    this.page = page;
    this.limit = limit;
    this.skip = (page - 1) * limit;
    this.query.skip = this.skip;
    this.query.take = this.limit;
    return this;
  }

  // sort

  sort(): this {
    const sortBy = this.queryParams.sortBy || "createdAt";
    const sortOrder = this.queryParams.sortOrder === "desc" ? "desc" : "asc";
    this.sortBy = sortBy;
    this.sortOrder = sortOrder;

    if (sortBy.includes(".")) {
      const parts = sortBy.split(".");

      if (parts.length === 2) {
        const relation = parts[0]!;
        const nestedField = parts[1]!;
        this.query.orderBy = {
          [relation]: {
            [nestedField]: sortOrder,
          },
        };
      } else if (parts.length === 3) {
        const relation = parts[0]!;
        const nestedField = parts[1]!;
        const nestedRelation = parts[2]!;
        this.query.orderBy = {
          [relation]: {
            [nestedRelation]: {
              [nestedField]: sortOrder,
            },
          },
        };
      } else {
        this.query.orderBy = {
          [sortBy]: sortOrder,
        };
      }
    }
    return this;
  }

  fields(): this {
    const fieldsParam = this.queryParams.fields;

    if (fieldsParam && typeof fieldsParam === "string") {
      const fieldsArray = fieldsParam?.split(",").map((field) => field.trim());
      this.selectFields = {};

      fieldsArray?.forEach((field) => {
        if (this.selectFields) {
          this.selectFields[field] = true;
        }
      });

      this.query.select = this.selectFields as Record<
        string,
        boolean | Record<string, unknown>
      >;

      delete this.query.include;
    }
    return this;
  }
  // filter

  include(relation: TInclude): this {
    if (this.selectFields) {
      return this;
    }

    this.query.include = {
      ...(this.query.include as Record<string, unknown>),
      ...(relation as Record<string, unknown>),
    };
    return this;
  }

  dynamicInclude(
    includeConfig: Record<string, unknown>,
    defaultInclude?: string[],
  ): this {
    if (this.selectFields) {
      return this;
    }

    const result: Record<string, unknown> = {};

    defaultInclude?.forEach((field) => {
      if (includeConfig[field]) {
        result[field] = includeConfig[field];
      }
    });

    const includeParam = this.queryParams.includes as string | undefined;

    if (includeParam && typeof includeParam === "string") {
      const requestRelations = includeParam
        .split(".")
        .map((relation) => relation.trim());

      requestRelations.forEach((relation) => {
        if (includeConfig[relation]) {
          result[relation] = includeConfig[relation];
        }
      });
    }

    this.query.include = {
      ...(this.query.include as Record<string, unknown>),
      ...result,
    };

    return this;
  }

  where(condition: TInclude): this {
    this.query.where = this.deepMerge(
      this.query.where as Record<string, unknown>,
      condition as Record<string, unknown>,
    );

    return this;
  }

  // sort

  async execute(): Promise<IQueryResult<T>> {
    const [total, data] = await Promise.all([
      this.model.count(
        this.countQuery as Parameters<typeof this.model.count>[0],
      ),
      this.model.findMany(
        this.query as Parameters<typeof this.model.findMany>[0],
      ),
    ]);

    const totalPages = Math.ceil(total / this.limit);

    return {
      data: data as T[],
      meta: {
        page: this.page,
        limit: this.limit,
        total,
        totalPages,
      },
    };
  }

  async count(): Promise<number> {
    return await this.model.count(
      this.countQuery as Parameters<typeof this.model.count>[0],
    );
  }

  getQuery(): PrismaFindManyArgs {
    return this.query;
  }
  private deepMerge(
    target: Record<string, unknown>,
    source: Record<string, unknown>,
  ): Record<string, unknown> {
    const result = { ...target };

    for (const key in source) {
      if (
        source[key] &&
        typeof source[key] === "object" &&
        !Array.isArray(source[key])
      ) {
        if (
          result[key] &&
          typeof result[key] === "object" &&
          !Array.isArray(result[key])
        ) {
          result[key] = this.deepMerge(
            result[key] as Record<string, unknown>,
            source[key] as Record<string, unknown>,
          );
        } else {
          result[key] = source[key];
        }
      } else {
        result[key] = source[key];
      }
    }

    return result;
  }

  private parseFilterValue(value: unknown): unknown {
    if (value == "true") {
      return true;
    }
    if (value === "false") {
      return false;
    }

    if (typeof value === "string" && isNaN(Number(value)) && value != "") {
      return Number(value);
    }

    if (Array.isArray(value)) {
      return {
        in: value.map((item) => this.parseFilterValue(item)),
      };
    }

    return value;
  }

  private parseRangeFilter(
    value: Record<string, unknown>,
  ): PrismaNumberFilter | PrismaStringFields | Record<string, unknown> {
    const rangeQuery: Record<string, string | number | (string | number)[]> =
      {};

    Object.keys(value).forEach((operator) => {
      const operatorValue = value[operator];

      //   const parsedValue: string | number =
      //     typeof operatorValue === "string" && !isNaN(Number(operatorValue))
      //       ? Number(operatorValue)
      //       : operatorValue;

      const parsedValue: string | number =
        typeof operatorValue === "string"
          ? !isNaN(Number(operatorValue)) && operatorValue.trim() !== ""
            ? Number(operatorValue)
            : operatorValue
          : typeof operatorValue === "number"
            ? operatorValue
            : String(operatorValue);

      switch (operator) {
        case "lt":
        case "lte":
        case "gt":
        case "gte":
        case "equals":
        case "not":
        case "contains":
        case "startsWith":
        case "endsWith":
          rangeQuery[operator] = parsedValue;
          break;

        case "in":
        case "notIn":
          if (Array.isArray(operatorValue)) {
            rangeQuery[operator] = operatorValue;
          } else {
            rangeQuery[operator] = [parsedValue];
          }
          break;
        default:
          break;
      }
    });

    return Object.keys(rangeQuery).length > 0 ? rangeQuery : value;
  }
}
