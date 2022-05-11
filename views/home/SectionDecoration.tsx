import React from "react"
import { storesDetails } from "../../store"

const SectionDecoration: React.FC = () => {
  const data = storesDetails.storeCnts
  const thisPage = data.homepage.sectionDecoration

  if (!thisPage) return null

  return (
    <div>
      <div className="decoration-section">
        <div className="decoration-container">
          <div className="decoration-circle-left">
            {[3, 2, 1].map(i => (
              <div className="d-flex mb-48" key={i}>
                {new Array(i).fill(1).map((_, index) => (
                  <div key={index} className="decoration-circle" />
                ))}
              </div>
            ))}
          </div>
          <div className="decoration-circle-right">
            {[1, 2, 3, 4, 5, 6, 7].map(i => (
              <div className="d-flex mb-48 flex-end" key={`right${i}`}>
                {new Array(i).fill(1).map((_, index) => (
                  <div key={index} className="decoration-circle" style={{marginRight: 0, marginLeft: 48}} />
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="decoration-background">
        <div className="decoration-left" />     
        <div className="decoration-right" />
      </div>
    </div>
  )
}
export default SectionDecoration
