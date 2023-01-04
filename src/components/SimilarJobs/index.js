import {AiFillStar} from 'react-icons/ai'
import {HiLocationMarker} from 'react-icons/hi'
import {BsFillBriefcaseFill} from 'react-icons/bs'

import './index.css'

const SimilarJobs = props => {
  const {similarJobDetails} = props
  const {
    companyLogoUrl,
    location,
    employmentType,
    jobDescription,
    title,
    rating,
  } = similarJobDetails
  return (
    <li className="li-similar-container">
      <div className="title-img-similar">
        <img
          className="similar-img"
          src={companyLogoUrl}
          alt="similar job company logo"
        />
        <div className="star-rating-similar">
          <h1 className="similar-jobs-heading ">{title}</h1>
          <div className="title-star-similar">
            <AiFillStar className="start-similar-job" />
            <p className="rating-similar-job">{rating}</p>
          </div>
        </div>
      </div>
      <div>
        <h1 className="similar-job-desc-heading">Description</h1>
        <p className="similar-job-desc">{jobDescription}</p>
      </div>
      <div className="similar-job-icon-container">
        <div className="similar-job-location-container">
          <HiLocationMarker />
          <p className="icon-similar-job-desc">{location}</p>
        </div>
        <div className="similar-job-location-container">
          <BsFillBriefcaseFill />
          <p className="icon-similar-job-desc">{employmentType}</p>
        </div>
      </div>
    </li>
  )
}
export default SimilarJobs
