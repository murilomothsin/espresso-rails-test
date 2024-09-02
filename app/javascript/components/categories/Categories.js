import React from "react"
import PropTypes from "prop-types"
import Layout from '../Layout';
import ListCategories from './ListCategories';

const Categories = (props) => {
  console.log(props)
  return (
    <Layout user={props.current_user}>
      <ListCategories categories={props.categories} />
    </Layout>
  )
}

Categories.propTypes = {
  categories: PropTypes.array
};

export default Categories
