import React from "react"

type Props = {
  color?: string
}

const PlusSVG = ({ color }: Props) => {
  return (
    <div>
      <svg
        width="50"
        height="50"
        viewBox="0 0 71 70"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M70.0582 36.2208C70.2184 35.8335 70.3006 35.4183 70.3001 34.9991C70.3006 34.5799 70.2184 34.1648 70.0582 33.7774C69.8981 33.39 69.6631 33.0381 69.3667 32.7417C69.0703 32.4453 68.7183 32.2102 68.3309 32.0501C67.9436 31.8899 67.5284 31.8077 67.1092 31.8083L38.7534 31.8083L38.7534 3.45411C38.7539 3.03494 38.6718 2.61977 38.5116 2.2324C38.3514 1.84503 38.1164 1.49306 37.82 1.19666C37.5236 0.90026 37.1716 0.665244 36.7843 0.505079C36.3969 0.344911 35.9817 0.262736 35.5626 0.263266C35.1434 0.262737 34.7282 0.344911 34.3408 0.505079C33.9535 0.665247 33.6015 0.900261 33.3051 1.19666C33.0087 1.49307 32.7737 1.84504 32.6135 2.2324C32.4534 2.61977 32.3712 3.03494 32.3717 3.45411L32.3717 31.8083L4.01342 31.8083C3.16715 31.8083 2.35555 32.1445 1.75715 32.7429C1.15875 33.3413 0.822571 34.1529 0.822571 34.9991C0.822571 35.8454 1.15875 36.657 1.75715 37.2554C2.35555 37.8538 3.16715 38.19 4.01342 38.19L32.3717 38.19L32.3717 66.5499C32.3717 67.3962 32.7079 68.2078 33.3063 68.8062C33.9047 69.4046 34.7163 69.7408 35.5626 69.7408C36.4088 69.7408 37.2204 69.4046 37.8188 68.8062C38.4172 68.2078 38.7534 67.3962 38.7534 66.5499L38.7534 38.19L67.1092 38.19C67.5284 38.1905 67.9436 38.1083 68.3309 37.9481C68.7183 37.788 69.0703 37.553 69.3667 37.2566C69.6631 36.9602 69.8981 36.6082 70.0582 36.2208Z"
          fill={color}
          className="plus-svg"
        />
      </svg>
    </div>
  )
}

export default PlusSVG
