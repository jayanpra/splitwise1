import { gql } from "@apollo/client";

const loginQuery = gql`
  mutation checkLogin($email: String, $password: String) {
    checkLogin(email: $email, password: $password) {
      status
      token
      message

    }
  }
`;

const signupQuery = gql`
  mutation registerUser($fname: String, $lname: String, $user_email: String, $password: String) {
    registerUser(email: $user_email, password: $password, username: $username) {
      status
      token
      message
    }
  }
`;

const changeProfileQuery = gql`
  mutation saveProfile($token: String, $type: String, $value: String  ) {
    saveProfile(token: $token, $type: String, $value: String) {
      message
    }
  }
`;

const addExpenseQuery = gql`
  mutation addExpense($groupname: String, $token: String, $expenseName: String, $expense: Float) {
    addExpense(groupname: $groupname , token: $token,expenseName: $expenseName, expense: $expense) {
      message
    }
  }
`;

const addCommentQuery = gql`
  mutation addComment($token: String, $comment: String) {
    addComment(token: $token, comment: $comment) {
      message
    }
  }
`;

const groupCreateQuery = gql`
  mutation groupCreate($token: String, $group_name: String, $members: [String]) {
    groupCreate(token: $token, group_name: $group_name, members: $members) {
      message
    }
  }
`;

const groupExitsQuery = gql`
  mutation groupExit($token: String, $group_name: String) {
    groupExit(token: $token, group_name: $group_name) {
      message
    }
  }
`;

const groupDeleteCommentQuery = gql`
  mutation groupDeleteComment($token: String, $comment_id: String) {
    groupDeleteComment(token: $token, comment_id: $comment_id) {
      message
    }
  }
`;

const settleUp = gql`
  mutation settleUp($token: String) {
    settleUp(token: $token) {
      message
    }
  }
`;

export {
  loginQuery,
  signupQuery,
  changeProfileQuery,
  addExpenseQuery,
  addCommentQuery,
  groupCreateQuery,
  groupExitsQuery,
  groupDeleteCommentQuery,
  settleUp,
};
