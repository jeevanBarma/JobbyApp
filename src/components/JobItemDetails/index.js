import {Component} from 'react'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'

import {AiFillStar} from 'react-icons/ai'
import {HiLocationMarker} from 'react-icons/hi'
import {BsFillBriefcaseFill} from 'react-icons/bs'
import {BiLinkExternal} from 'react-icons/bi'

import SimilarJobs from '../SimilarJobs'
import Header from '../Header'

import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  isProgress: 'IS_PROGRESS',
}

class JobItemDetails extends Component {
  state = {
    jobDetatilList: [],
    similarDataList: [],
    apiStatus: apiStatusConstants.initial,
  }

  componentDidMount() {
    this.getJobDetailsView()
  }

  getJobDetailsView = async () => {
    const {match} = this.props
    const {params} = match
    const {id} = params

    this.setState({
      apiStatus: apiStatusConstants.isProgress,
    })

    const jwtToken = Cookies.get('jwt_token')
    const apiUrl = `https://apis.ccbp.in/jobs/${id}`
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }

    const response = await fetch(apiUrl, options)
    if (response.ok === true) {
      const data = await response.json()
      const updatedData = [data.job_details].map(eachData => ({
        companyLogoUrl: eachData.company_logo_url,
        companyWebsiteUrl: eachData.company_website_url,
        employmentType: eachData.employment_type,
        id: eachData.id,
        jobDescription: eachData.job_description,
        skills: eachData.skills.map(eachSkill => ({
          imageUrl: eachSkill.image_url,
          name: eachSkill.name,
        })),
        title: eachData.title,
        location: eachData.location,
        packagePerAnnum: eachData.package_per_annum,
        rating: eachData.rating,
        lifeAtCompany: {
          description: eachData.life_at_company.description,
          imageUrl: eachData.life_at_company.image_url,
        },
      }))

      const updatedSimilarData = data.similar_jobs.map(eachData => ({
        companyLogoUrl: eachData.company_logo_url,
        employmentType: eachData.employment_type,
        id: eachData.id,
        jobDescription: eachData.job_description,
        location: eachData.location,
        rating: eachData.rating,
        title: eachData.title,
      }))

      this.setState({
        jobDetatilList: updatedData,
        similarDataList: updatedSimilarData,
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({
        apiStatus: apiStatusConstants.failure,
      })
    }
  }

  renderJobDetailSuccessView = () => {
    const {jobDetatilList, similarDataList} = this.state

    if (jobDetatilList.length >= 1) {
      const {
        companyLogoUrl,
        companyWebsiteUrl,
        location,
        employmentType,
        jobDescription,
        packagePerAnnum,
        skills,
        lifeAtCompany,
        title,
        rating,
      } = jobDetatilList[0]
      return (
        <>
          <div className="li-job-container">
            <div>
              <div className="title-img-container">
                <img
                  className="job-image"
                  src={companyLogoUrl}
                  alt="job details company logo"
                />
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
              <div className="anchor-element-container">
                <h1 className="job-desc-heading">Description</h1>
                <a className="anchor-element" href={companyWebsiteUrl}>
                  Visit <BiLinkExternal />
                </a>
              </div>
              <p className="job-description">{jobDescription}</p>
              <h1 className="job-desc-heading">Skills</h1>
              <ul className="ul-skill-list">
                {skills.map(eachSkill => (
                  <li className="li-skill-container" key={eachSkill.name}>
                    <img
                      className="skill-img"
                      src={eachSkill.imageUrl}
                      alt={eachSkill.name}
                    />
                    <p className="skill-name">{eachSkill.name}</p>
                  </li>
                ))}
              </ul>
              <div className="life-at-container">
                <div className="heading-container-life">
                  <h1 className="job-desc-heading">Life at Company</h1>
                  <p className="job-description2">
                    {lifeAtCompany.description}
                  </p>
                </div>
                <img
                  className="life-at-company-img"
                  src={lifeAtCompany.imageUrl}
                  alt="life at company"
                />
              </div>
            </div>
          </div>
          <div>
            <h1 className="similar-job-heading">Similar Jobs</h1>
            <ul className="ul-similar-container">
              {similarDataList.map(eachData => (
                <SimilarJobs key={eachData.id} similarJobDetails={eachData} />
              ))}
            </ul>
          </div>
        </>
      )
    }
    return null
  }

  onClickRetryButton = () => {
    this.getJobDetailsView()
  }

  failureView = () => (
    <div>
      <img
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
        alt=" failure view"
      />
      <h1>Oops! Something Went Wrong</h1>
      <p>We cannot seem to find the page you are looking for</p>
      <button type="button" onClick={this.onClickRetryButton}>
        Retry
      </button>
    </div>
  )

  loadingView = () => (
    <div className="loader-container" testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </div>
  )

  renderJobDetailView = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderJobDetailSuccessView()
      case apiStatusConstants.failure:
        return this.failureView()
      case apiStatusConstants.isProgress:
        return this.loadingView()

      default:
        return null
    }
  }

  render() {
    return (
      <>
        <Header />
        <div className="job-item-bg">{this.renderJobDetailView()}</div>
      </>
    )
  }
}

export default JobItemDetails
