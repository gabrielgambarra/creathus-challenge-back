import { Request } from "express";

export const getPaginationData = async (prisma: any, req: Request) => {
  const query = req.query;
  const page = parseInt(query.page as string) || 1;
  const limit = 14;
  const last_page = req.query.last_page;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const result: any = {};
  const totalCount = await prisma.count();
  const totalPage = Math.ceil(totalCount / limit);
  const currentPage = page || 0;

  try {
    if (page < 0) {
      return { returnedData: "Page value should not be negative", code: 400 };
    } else if (page === 1 && !last_page) {
      result.totalCount = totalCount;
      result.totalPage = totalPage;
      result.currentPage = currentPage;
      if (totalPage > page) {
        result.next = {
          page: page + 1,
          limit: limit,
        };
      }
      result.data = await prisma.findMany({
        take: limit,
        skip: startIndex,
        orderBy: {
          id: "desc",
        },
      });
      result.currentCountPerPage = Object.keys(result.data).length;
      return { returnedData: result, code: 200 };
    } else if (endIndex < totalCount && !last_page) {
      result.totalCount = totalCount;
      result.totalPage = totalPage;
      result.currentPage = currentPage;
      result.previous = {
        page: page - 1,
        limit: limit,
      };
      result.next = {
        page: page + 1,
        limit: limit,
      };
      result.data = await prisma.findMany({
        take: limit,
        skip: startIndex,
        orderBy: {
          id: "desc",
        },
      });
      result.currentCountPerPage = Object.keys(result.data).length;
      return { returnedData: result, code: 200 };
    } else if (startIndex > 0 && !last_page) {
      result.totalCount = totalCount;
      result.totalPage = totalPage;
      result.currentPage = currentPage;
      result.previous = {
        page: page - 1,
        limit: limit,
      };
      result.data = await prisma.findMany({
        take: limit,
        skip: startIndex,
        orderBy: {
          id: "desc",
        },
      });
      result.currentCountPerPage = Object.keys(result.data).length;
      return { returnedData: result, code: 200 };
    } else if (last_page === "true" && page === totalPage) {
      result.totalCount = totalCount;
      result.totalPage = totalPage;
      result.currentPage = totalPage;
      result.last = {
        page: totalPage,
        limit: limit,
      };
      result.data = await prisma.findMany({
        take: limit,
        skip: startIndex,
        orderBy: {
          id: "desc",
        },
      });
      result.currentCountPerPage = Object.keys(result.data).length;
      return { returnedData: result, code: 200 };
    } else {
      return { returnedData: "Resource not found", code: 404 };
    }
  } catch (err) {
    console.error("error", err);
    return { returnedData: err, code: 500 };
  }
};
