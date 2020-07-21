/* eslint-disable */
// this is an auto generated file. This will be overwritten

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
    }
  }
`;
export const listTagReportss = /* GraphQL */ `
  query ListTagReportss(
    $filter: ModelTagReportsFilterInput
   
    $nextToken: String
  ) {
    listTagReportss(filter: $filter, limit: 100, nextToken: $nextToken) {
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
      }
      nextToken
    }
  }
`;
