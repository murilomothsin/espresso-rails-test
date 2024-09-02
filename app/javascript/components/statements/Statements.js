import React from "react"
import PropTypes from "prop-types"
import Layout from '../Layout'
import ListStatementsAdmin from './ListStatementsAdmin'
import ListStatements from './ListStatements'

const Statements = (props) => {
  console.log(props)
  let list = null
  if(props.current_user.role === "admin") {
    list = <ListStatementsAdmin statements={JSON.parse(props.statements)} />
  } else {
    list = <ListStatements statements={JSON.parse(props.statements)} categories={props.categories} />
  }
  return (
    <Layout user={props.current_user}>
      {list}
    </Layout>
  )
}

Statements.propTypes = {
  statements: PropTypes.string,
};

export default Statements
