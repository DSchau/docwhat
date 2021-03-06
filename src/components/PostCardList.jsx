// @format
import PropTypes from 'prop-types'
import React from 'react'

import { rhythm } from '../utils/typography'
import PostCard from './PostCard'

const PostCardList = props => (
  <div
    css={{
      display: `flex`,
      flexDirection: `row`,
      flexWrap: `wrap`,
      maxWidth: rhythm(24 - 1), // from Layout
      overflow: 'auto',
      margin: rhythm(-1 / 2),
      '& > *': {
        margin: rhythm(1 / 2),
        width: rhythm(10),
        maxWidth: rhythm(24 - 2),
      },
    }}
  >
    {props.postcards.map(({ node }) => {
      const {
        fields: { title, slug, date },
        excerpt,
      } = node

      return (
        <PostCard
          overrideCss={{
            flex: `1 1 ${rhythm(10)}`,
            '&>p': { textAlign: `justify` },
          }}
          key={slug}
          slug={slug}
          title={title}
          date={date}
          excerpt={excerpt}
        />
      )
    })}
  </div>
)

PostCardList.propTypes = {
  postcards: PropTypes.arrayOf(
    PropTypes.shape({
      node: PropTypes.shape({
        fields: PropTypes.shape({
          slug: PropTypes.string.isRequired,
          title: PropTypes.string.isRequired,
          date: PropTypes.string.isRequired,
        }),
        excerpt: PropTypes.string.isRequired,
      }),
    })
  ).isRequired,
}

export default PostCardList
