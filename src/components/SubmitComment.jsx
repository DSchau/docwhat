// @flow
// @format
import { css } from 'glamor'
import g, { Div, Form, Input, Legend, Span, Textarea } from 'glamorous'
import * as React from 'react'

// $FlowIssue: the gatsby svgr plugin isn't understood by flow.
import { ReactComponent as CaretRightIcon } from '../icons/caret-right.svg'
// $FlowIssue: the gatsby svgr plugin isn't understood by flow.
import { ReactComponent as CommentIcon } from '../icons/comment-alt.svg'
import { heroColor } from '../utils/colors'
import { rhythm } from '../utils/typography'
import StyledButton from './StyledButton'

// TODO: Move the reCapcha into a separate component.
// TODO: Get reCaptcha siteKey and secret from staticman.yml instead.
// TODO: Use a GraphQL Fragment

const textBoxCss = css({
  '::placeholder': {
    color: heroColor.darken(0.7).string(),
    fontStyle: `italic`,
  },
  padding: `0 ${rhythm(1 / 4)}`,
})

const FormOption = (props: { option: string, value: string }): React.Node => {
  const optParts = props.option.split(`.`)
  const name = `options[${optParts.join(`][]`)}]`
  return <Input name={name} value={props.value} type="hidden" />
}

const StyledLabel = g.label(
  (props: { css: Object }): Array<Object> => {
    const styles = [
      {
        ':focus': {
          background: heroColor.string(),
        },
        display: `flex`,
        flexDirection: `row`,
        flexWrap: `wrap`,
        justifyContent: `flex-start`,
        margin: `1em 0`,
      },
    ]

    styles.push(props.css)

    return styles
  }
)

const StyledLabelDiv = g.label(props => {
  const styles = [
    {
      display: `inline-block`,
      flex: `0 0 30%`,
    },
  ]

  styles.push(props.css)

  return styles
})

const Labelled = (props: {
  required?: boolean,
  label: string,
  children: React.Node,
  labelCss?: Object,
  divCss?: Object,
}) => {
  let requiredText = ``

  if (!props.required) {
    requiredText = (
      <Span
        css={{
          color: heroColor.darken(0.5).string(),
          fontStyle: `italic`,
        }}
      >
        (optional)
      </Span>
    )
  }

  return (
    <StyledLabel css={props.labelCss}>
      <StyledLabelDiv css={props.divCss}>
        {props.label}
        {requiredText}
      </StyledLabelDiv>
      {props.children}
    </StyledLabel>
  )
}

const LabelledInput = (props: {
  label: string,
  required?: boolean,
  name: string,
  type: string,
  placeholder: string,
}) => (
  <Labelled label={props.label} required={props.required}>
    <Input
      css={{
        flex: `0 0 70%`,
      }}
      {...textBoxCss}
      name={props.name}
      type={props.type}
      placeholder={props.placeholder}
    />
  </Labelled>
)

const ReCaptcha = () => null

// const ReCaptcha = () => {
//   return null
//   const siteKey = `6LeIP0oUAAAAANRB2QX0a3ItZkkiBJsmEs9pel4P`
//   const secret =
//     `HxjRkHBC9KGoa7rBLWS5L6mmWcIem/aJewy+hvao4gwXNengRVD+Xgjqffkt1JSzVr20wGWc1kG6RDx8` +
//     `y79kUyLGfcrUDro127Hvi+U7A8gnE4snDsXeYUPTnTxR0nbUqO4PmUApmNZf54IOtOyHZHmTFdV19/dv` +
//     `qJopL1jhByo=`
//   return (
//     <Div>
//       <Helmet>
//         <script src="https://www.google.com/recaptcha/api.js" />
//       </Helmet>
//       <Div className="g-recaptcha" data-sitekey={siteKey} />
//       <FormOption option="reCaptcha.siteKey" value={siteKey} />
//       <FormOption option="reCaptcha.secret" value={secret} />
//     </Div>
//   )
// }

type Props = {
  url: string,
  slug: string,
  closeSection?: boolean,
  onCloseSectionClick?: Function,
}

type State = {
  isOpen: boolean,
}

class SubmitComment extends React.Component<Props, State> {
  toggleForm: any

  constructor(props: Props) {
    super(props)

    this.state = {
      isOpen: false,
    }

    this.toggleForm = this.toggleForm.bind(this)
  }

  toggleForm() {
    if (this.props.closeSection) {
      if (this.props.onCloseSectionClick) {
        this.props.onCloseSectionClick()
      }
    } else {
      this.setState({
        isOpen: !this.state.isOpen,
      })
    }
  }

  render() {
    const formUrl = `https://api.staticman.net/v2/entry/docwhat/docwhat/master/comments`
    const { url: returnUrl, slug } = this.props
    const slugdir = slug.replace(/^\/+|\/+$/g, ``)

    return (
      <Form method="POST" action={formUrl}>
        <Legend
          css={{
            ':hover': {
              textDecoration: `underline`,
            },
            cursor: `pointer`,
            flex: `0 0 100%`,
            fontSize: rhythm(1),
          }}
          onClick={this.toggleForm}
        >
          <CommentIcon /> Submit a Comment{` `}
          <CaretRightIcon
            css={{
              transform: this.state.isOpen ? `rotate(90deg)` : null,
            }}
          />
        </Legend>
        {this.state.isOpen ? (
          <div>
            <FormOption option="redirect" value={returnUrl} />
            <FormOption option="slug" value={slug} />
            <FormOption option="slugdir" value={slugdir} />

            <LabelledInput
              label="Name"
              name="fields[name]"
              type="text"
              placeholder="Joe Cool"
              required
            />

            <LabelledInput
              label="E-mail"
              name="fields[email]"
              type="email"
              placeholder="joe.cool@example.com"
              required
            />

            <LabelledInput
              label="Website"
              name="fields[url]"
              type="url"
              placeholder="http://joecool.example.com/"
            />

            <Labelled label="Message" required>
              <Textarea
                name="fields[message]"
                placeholder="Type your message. You can use **Markdown**!"
                css={{
                  flex: `0 1 70%`,
                  height: rhythm(5),
                  minWidth: rhythm(10),
                  width: `100%`,
                }}
                {...textBoxCss}
              />
            </Labelled>

            <Labelled
              label="I want to be notified of new comments"
              divCss={{
                display: `inline-block`,
                flex: `1 0 80%`,
              }}
              required
            >
              <Div
                css={{
                  flex: `0 1 20%`,
                  textAlign: `right`,
                }}
              >
                <Input type="checkbox" name="options[subscribe]" css={{}} />
              </Div>
            </Labelled>

            <ReCaptcha />

            <Div
              css={{
                textAlign: `right`,
              }}
            >
              <StyledButton>Comment</StyledButton>
            </Div>
          </div>
        ) : null}
      </Form>
    )
  }
}

export default SubmitComment