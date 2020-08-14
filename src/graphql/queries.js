/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const syncTagReports = /* GraphQL */ `
  query SyncTagReports(
    $filter: ModelTagReportsFilterInput
    $limit: Int
    $nextToken: String
    $lastSync: AWSTimestamp
  ) {
    syncTagReports(
      filter: $filter
      limit: $limit
      nextToken: $nextToken
      lastSync: $lastSync
    ) {
      items {
        id
        tagNumber
        fishType
        tagDate
        tagLocation
        tagArea
        comment
        guideName
        fishLength
        fishWeight
        email
        phone
        pictureUrl
        owner
        recapture
        _version
        _deleted
        _lastChangedAt
        createdAt
        updatedAt
      }
      nextToken
      startedAt
    }
  }
`;
export const getTagReports = /* GraphQL */ `
  query GetTagReports($id: ID!) {
    getTagReports(id: $id) {
      id
      tagNumber
      fishType
      tagDate
      tagLocation
      tagArea
      comment
      guideName
      fishLength
      fishWeight
      email
      phone
      pictureUrl
      owner
      recapture
      _version
      _deleted
      _lastChangedAt
      createdAt
      updatedAt
    }
  }
`;
export const listTagReportss = /* GraphQL */ `
  query ListTagReportss(
    $filter: ModelTagReportsFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listTagReportss(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        tagNumber
        fishType
        tagDate
        tagLocation
        tagArea
        comment
        guideName
        fishLength
        fishWeight
        email
        phone
        pictureUrl
        owner
        recapture
        _version
        _deleted
        _lastChangedAt
        createdAt
        updatedAt
      }
      nextToken
      startedAt
    }
  }
`;
