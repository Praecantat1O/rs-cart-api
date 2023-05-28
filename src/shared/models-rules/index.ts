import { AppRequest } from '../models';

/**
 * @param {AppRequest} request
 * @returns {string}
 */
export function getUserIdFromRequest(request: AppRequest): string {
  return "a6d98b47-6517-4f8a-9b48-70253b32d3ae";
  // return request.user && request.user.id;
}
