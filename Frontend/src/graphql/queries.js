import { gql } from "@apollo/client";

const getProfileQuery = gql`
  query getProfile($token: String) {
    getProfile(token: $token) {
      name
      email
      currency
      pic
      phone
      language
      timezone
      msg
      success
    }
  }
`;

const getDashQuery = gql`
  query getDash($token: String) {
    getDash(token: $token) {
      grps
      msg
      success
    }
  }
`;

const getGroupQuery = gql`
  query getGroup($token: String) {
    getGroup(token: $token) {
      expense
      msg
      success
    }
  }
`;

const getRecentQuery = gql`
  query getRecent($token: String) {
    getRecent(token: $token) {
      expenses
      msg
      success
    }
  }
`;

const getCommentQuery = gql`
  query getComment($expense_id: String, $token: String) {
    getComment(expense_id: $expense_id, token: $token) {
      comment
      msg
      success
    }
  }
`;


const getGroupRequestsQuery = gql`
  query getGroupRequests($token: String) {
    getGroupRequests(token: $token) {
      created_by
      bill_amount
    }
  }
`;

export {
  getProfileQuery,
  getDashQuery,
  getGroupQuery,
  getRecentQuery,
  getCommentQuery,
  getGroupRequestsQuery,
};
