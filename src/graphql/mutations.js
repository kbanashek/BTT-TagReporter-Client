/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const createTagReports = /* GraphQL */ `
  mutation CreateTagReports(
    $input: CreateTagReportsInput!
    $condition: ModelTagReportsConditionInput
  ) {
    createTagReports(input: $input, condition: $condition) {
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
export const updateTagReports = /* GraphQL */ `
  mutation UpdateTagReports(
    $input: UpdateTagReportsInput!
    $condition: ModelTagReportsConditionInput
  ) {
    updateTagReports(input: $input, condition: $condition) {
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
export const deleteTagReports = /* GraphQL */ `
  mutation DeleteTagReports(
    $input: DeleteTagReportsInput!
    $condition: ModelTagReportsConditionInput
  ) {
    deleteTagReports(input: $input, condition: $condition) {
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
