import {Link} from 'react-router-dom'

import {AiFillStar} from 'react-icons/ai'
import {HiLocationMarker} from 'react-icons/hi'
import {BsFillBriefcaseFill} from 'react-icons/bs'

import './index.css'

const JobItem = props => {
  const {jobDetails} = props
  const {
    companyLogoUrl,
    employmentType,
    jobDescription,
    location,
    packagePerAnnum,
    rating,
    title,
    id,
  } = jobDetails
  return (
    <Link to={`jobs/${id}`} className="nav-item">
      <li className="li-container">
        <div className="title-img-container">
          <img className="job-image" src={companyLogoUrl} alt="company logo" />
          <div className="head-rating-container">
            <h1 className="job-heading">{title}</h1>
            <p className="number">
              <AiFillStar className="star-icon" />
              {rating}
            </p>
          </div>
        </div>
        <div className="location-job-lpa-container">
          <div className="location-job-container-2">
            <p className="location">
              <HiLocationMarker className="location-icon" />
              {location}
            </p>
            <p className="job-type">
              <BsFillBriefcaseFill className="job-icon" />
              {employmentType}
            </p>
          </div>
          <p className="lpa">{packagePerAnnum}</p>
        </div>
        <hr className="hr" />
        <h1 className="job-desc-heading">Description</h1>
        <p className="job-description">{jobDescription}</p>
      </li>
    </Link>
  )
}
export default JobItem
