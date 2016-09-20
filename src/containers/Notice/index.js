import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'

import { clearNotice } from '../../redux/modules/notifier'
// TO DO: make ERROR, WARNING, MASSAGE fields
export class Notice extends Component {
  constructor (props) {
    super(props)
    this._hideNoticeBlock = this._hideNoticeBlock.bind(this)
    this._setNoticeDelay = this._setNoticeDelay.bind(this)
    this._timerID
    this.state = {
      showBlock: false
    }
  }
  static propTypes = {
    notifier: PropTypes.object,
    clearNotice: PropTypes.func
  }
  componentWillReceiveProps (props) {
    // console.log('Notice props', props)
    if (props.notifier.errorMessage || props.notifier.notice) {
      this._setNoticeDelay()
    }
  }
  _hideNoticeBlock () {
    clearTimeout(this._timerID)
    this.setState({
      showBlock: false
    })
  }
  _setNoticeDelay () {
    const { clearNotice } = this.props
    this.setState({
      showBlock: true
    })
    this._timerID = setTimeout(() => {
      this.setState({
        showBlock: false
      })
      console.log('Notice block going to hide!')
      clearNotice({
        isFail: false,
        errorMessage: null,
        errorCode: null,
        notice: null
      })
    }, 5000)
  }
  render () {
    const { showBlock } = this.state
    const { isFail, errorMessage, notice } = this.props.notifier

    if (showBlock && this._timerID) {
      return (
        <div className={'notice-block ' + (isFail ? 'fail' : 'success')}>
          <i className='notice-close' onClick={this._hideNoticeBlock}></i>
          <p className='notice-message'>{errorMessage || notice}</p>
        </div>
        )
    } else {
      return null
    }
  }
}

const mapStateToProps = (state) => ({
  notifier: state.notifier
})

export default connect((mapStateToProps), {
  clearNotice
})(Notice)
