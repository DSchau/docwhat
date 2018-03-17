import React from 'react'
import g, { H1, Div } from 'glamorous'
import Link from 'gatsby-link'
import * as PropTypes from "prop-types"

import { rhythm, scale } from '../utils/typography'
import { heroColor } from '../utils/colors.js'

require('../utils/prismjs.css')

class DefaultLayout extends React.Component {
  render() {
    const { location, children } = this.props
    let header

    let rootPath = `/`
    if (typeof __PREFIX_PATHS__ !== `undefined` && __PREFIX_PATHS__) {
      rootPath = __PATH_PREFIX__ + `/`
    }

    header = (
      <H1 css={{
        ...scale(1.5),
        marginBottom: rhythm(1.5),
        marginTop: 0,
        borderBottomWidth: rhythm( 1 / 2 ),
        borderBottomColor: heroColor.string(),
      }} >
        <Link
          style={{
            boxShadow: 'none',
            textDecoration: 'none',
            color: 'inherit',
          }}
          to={'/'}
        >
          {"docwhat's blog"}
        </Link>
      </H1>
    )
    return (
      <Div css={{
        maxWidth: rhythm(24),
        padding: `${rhythm(1.5)} ${rhythm(3 / 4)}`,
        margin: `0 auto`,
      }} >
        {header}
        {children()}
      </Div>
    )
  }
}

DefaultLayout.propTypes = {
  location: PropTypes.object.isRequired,
  children: PropTypes.func.isRequired,
}

export default DefaultLayout
