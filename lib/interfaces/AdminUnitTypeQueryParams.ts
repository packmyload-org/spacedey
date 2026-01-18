export interface AdminUnitTypeQueryParams {
  limit?: number;
  offset?: number;
  cursor?: string;
  updatedAfter?: string; // YYYY-MM-DD or YYYY-MM-DDTHH:mm:ss.SSSZ
  ids?: string | string[];
  siteId?: string;
  groupId?: string;
  tagIds?: string;
  labels?: string;
  search?: string;
  include?: string | string[]; // 'site' or 'customFields'
}