import React from "react"
import PropTypes from "prop-types"
import Layout from '../Layout';
import ListCards from './ListCards';

const Cards = (props) => {
  console.log(props)
  return (
    <Layout user={props.current_user}>
      <ListCards cards={props.cards} users={props.users} />
    </Layout>
  )
}

Cards.propTypes = {
  cards: PropTypes.array,
  users: PropTypes.array
};

export default Cards
