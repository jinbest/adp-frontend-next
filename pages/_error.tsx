import React from "react"

const Error = ({ statusCode }: Record<string, any>) => {
  return (
    <p>
      {statusCode ? `An error ${statusCode} occurred on server` : "An error occurred on client"}
    </p>
  )
}

Error.getInitialProps = ({ res, err }: Record<string, any>) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404
  return { statusCode }
}

export default Error
