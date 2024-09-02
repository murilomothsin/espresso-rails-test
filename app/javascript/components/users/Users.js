import * as React from 'react';
import PropTypes from "prop-types"
import Layout from '../Layout';
import ListUsers from './ListUsers';

const Users = (props) => {

  return (
    <Layout user={props.current_user}>
      <ListUsers users={props.users} />
    </Layout>
  );
}

Users.propTypes = {
  users: PropTypes.array
};

export default Users