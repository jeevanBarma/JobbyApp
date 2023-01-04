import {Component} from 'react'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'

import {AiOutlineSearch} from 'react-icons/ai'

import Header from '../Header'
import JobItem from '../JobItem'

import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  isProgress: 'ISPROGRESS',
}

const apiProfileStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  isProgress: 'ISPROGRESS',
}

const employmentTypesList = [
  {
    label: 'Full Time',
    employmentTypeId: 'FULLTIME',
  },
  {
    label: 'Part Time',
    employmentTypeId: 'PARTTIME',
  },
  {
    label: 'Freelance',
    employmentTypeId: 'FREELANCE',
  },
  {
    label: 'Internship',
    employmentTypeId: 'INTERNSHIP',
  },
]

const salaryRangesList = [
  {
    salaryRangeId: '1000000',
    label: '10 LPA and above',
  },
  {
    salaryRangeId: '2000000',
    label: '20 LPA and above',
  },
  {
    salaryRangeId: '3000000',
    label: '30 LPA and above',
  },
  {
    salaryRangeId: '4000000',
    label: '40 LPA and above',
  },
]

class Jobs extends Component {
  state = {
    jobList: [],
    apiStatus: apiStatusConstants.initial,
    apiProfileStatus: apiProfileStatusConstants.initial,
    profileData: [],
    searchInput: '',
    checkboxInput: [],
    radioInput: '',
  }

  componentDidMount() {
    this.getProfile()
    this.getJobList()
  }

  getProfile = async () => {
    this.setState({
      apiProfileStatus: apiProfileStatusConstants.isProgress,
    })
    const jwtToken = Cookies.get('jwt_token')
    const profileUrl = 'https://apis.ccbp.in/profile'
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(profileUrl, options)
    if (response.ok === true) {
      const fetchedData = [await response.json()]
      const updatedProfileData = fetchedData.map(eachProfile => ({
        name: eachProfile.profile_details.name,
        profileImageUrl: eachProfile.profile_details.profile_image_url,
        shortBio: eachProfile.profile_details.short_bio,
      }))
      this.setState({
        profileData: updatedProfileData,
        responseSuccess: true,
        apiProfileStatus: apiProfileStatusConstants.success,
      })
    } else {
      this.setState({
        apiProfileStatus: apiProfileStatusConstants.failure,
      })
    }
  }

  getJobList = async () => {
    this.setState({
      apiStatus: apiStatusConstants.isProgress,
    })

    const jwtToken = Cookies.get('jwt_token')
    const {searchInput, checkboxInput, radioInput} = this.state
    const apiUrl = `https://apis.ccbp.in/jobs?employment_type=${checkboxInput}&minimum_package=${radioInput}&search=${searchInput}`
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(apiUrl, options)
    if (response.ok === true) {
      const fetchedData = await response.json()
      const updatedData = fetchedData.jobs.map(eachData => ({
        companyLogoUrl: eachData.company_logo_url,
        employmentType: eachData.employment_type,
        id: eachData.id,
        jobDescription: eachData.job_description,
        location: eachData.location,
        packagePerAnnum: eachData.package_per_annum,
        rating: eachData.rating,
        title: eachData.title,
      }))
      this.setState({
        jobList: updatedData,
        apiStatus: apiStatusConstants.success,
        searchInput: '',
      })
    } else {
      this.setState({
        apiStatus: apiStatusConstants.failure,
      })
    }
  }

  renderProfileSuccessView = () => {
    const {profileData, responseSuccess} = this.state
    if (responseSuccess) {
      const {name, profileImageUrl, shortBio} = profileData[0]
      return (
        <div className="profile-bg-container">
          <img className="profile-logo" src={profileImageUrl} alt="profile" />
          <h1 className="profile-heading">{name}</h1>
          <p className="profile-desc">{shortBio}</p>
        </div>
      )
    }
    return null
  }

  onClickProfileFailureButton = () => {
    this.getProfile()
  }

  renderProfileFailureView = () => (
    <div>
      <button type="button" onClick={this.onClickProfileFailureButton}>
        Retry
      </button>
    </div>
  )

  onChangeRadioInput = event => {
    this.setState({radioInput: event.target.id}, this.getJobList)
  }

  onChangeChechboxInput = event => {
    const {checkboxInput} = this.state
    const inputNotInList = checkboxInput.filter(
      eachItem => eachItem === event.target.id,
    )
    if (inputNotInList.length === 0) {
      this.setState(
        prevState => ({
          checkboxInput: [...prevState.checkboxInput, event.target.id],
        }),
        this.getJobList,
      )
    } else {
      const filteredData = checkboxInput.filter(
        eachItem => eachItem !== event.target.id,
      )
      this.setState(
        // eslint-disable-next-line no-unused-vars
        prevState => ({checkboxInput: filteredData}),
        this.getJobList,
      )
    }
  }

  renderCheckboxList = () => {
    const {checkboxInput} = this.state
    return (
      <ul className="ul-em-type">
        {employmentTypesList.map(eachType => (
          <li
            key={eachType.employmentTypeId}
            onChange={this.onChangeChechboxInput}
          >
            <input
              type="checkbox"
              value={checkboxInput}
              id={eachType.employmentTypeId}
            />
            <label
              className="profile-type-heading"
              htmlFor={eachType.employmentTypeId}
            >
              {eachType.label}
            </label>
          </li>
        ))}
      </ul>
    )
  }

  renderRadioButtonList = () => (
    <ul className="ul-em-type">
      {salaryRangesList.map(eachSalary => (
        <li
          className="li-em-type"
          key={eachSalary.salaryRangeId}
          onChange={this.onChangeRadioInput}
        >
          <input type="radio" id={eachSalary.salaryRangeId} />
          <label
            className="profile-type-heading"
            htmlFor={eachSalary.salaryRangeId}
          >
            {eachSalary.label}
          </label>
        </li>
      ))}
    </ul>
  )

  renderJobDetailsView = () => {
    const {jobList} = this.state
    const jobs = jobList.length === 0
    return jobs ? (
      <div className="no-jobs-container">
        <img
          className="no-jobs-img"
          src="https://assets.ccbp.in/frontend/react-js/no-jobs-img.png"
          alt="no jobs"
        />
        <h1 className="no-jobs-heading">No jobs found</h1>
        <p className="no-jobs-desc">
          We could not find any jobs. Try other filters.
        </p>
      </div>
    ) : (
      <ul className="ul-container">
        {jobList.map(eachJob => (
          <JobItem key={eachJob.id} jobDetails={eachJob} />
        ))}
      </ul>
    )
  }

  onClickFailureJobButton = () => {
    this.getJobList()
  }

  renderFailureView = () => (
    <div className="failure-view">
      <img
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
        alt="failure view"
        className="failure-job-img"
      />
      <h1>Oops! Something Went Wrong</h1>
      <p>We cannot seem to find the page you are looking for</p>
      <button
        className="retry-button"
        onClick={this.onClickFailureJobButton}
        type="button"
      >
        Retry
      </button>
    </div>
  )

  renderLoadingView = () => (
    <div className="loader-container" testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </div>
  )

  renderProfileView = () => {
    const {apiProfileStatus} = this.state
    switch (apiProfileStatus) {
      case apiProfileStatusConstants.success:
        return this.renderProfileSuccessView()
      case apiProfileStatusConstants.failure:
        return this.renderProfileFailureView()
      case apiProfileStatusConstants.isProgress:
        return this.renderLoadingView()
      default:
        return null
    }
  }

  renderDetailsView = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderJobDetailsView()
      case apiStatusConstants.failure:
        return this.renderFailureView()
      case apiStatusConstants.isProgress:
        return this.renderLoadingView()
      default:
        return null
    }
  }

  onChangeSearchInput = event => {
    this.setState({
      searchInput: event.target.value,
    })
  }

  onClickSearch = () => {
    this.getJobList()
  }

  onKeyDownChange = event => {
    if (event.key === 'Enter') {
      this.getJobList()
    }
  }

  render() {
    const {searchInput} = this.state
    return (
      <>
        <Header />
        <div className="job-bg-container">
          <div className="search-container-lg">
            <input
              type="search"
              onChange={this.onChangeSearchInput}
              onKeyDown={this.onKeyDownChange}
              value={searchInput}
              className="search-box"
            />
            <button
              className="search-btn"
              type="button"
              testId="searchButton"
              onClick={this.onClickSearch}
            >
              <AiOutlineSearch className="search-icon" />
            </button>
          </div>
          <div className="side-bar-container">
            {this.renderProfileView()}
            <hr className="hr" />
            <h1 className="employe-heading">Type of Employment</h1>
            {this.renderCheckboxList()}
            <hr className="hr" />
            <h1 className="employe-heading">Salary Range</h1>
            {this.renderRadioButtonList()}
          </div>
          <div className="jobs-container ">
            <div className="search-container-sm">
              <input
                type="search"
                onChange={this.onChangeSearchInput}
                onKeyDown={this.onKeyDownChange}
                value={searchInput}
                className="search-box"
              />
              <button
                className="search-btn"
                type="button"
                testId="searchButton"
                onClick={this.onClickSearch}
              >
                <AiOutlineSearch className="search-icon" />
              </button>
            </div>
            {this.renderDetailsView()}
          </div>
        </div>
      </>
    )
  }
}

export default Jobs
