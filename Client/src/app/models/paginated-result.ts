import { IPagination } from "./ipagination";

export class PaginatedResult<T> {
  result?: T;
  pagination?: IPagination;
}
