import React, {PropTypes} from 'react'
import {connect} from 'react-redux'

import Notification from 'src/shared/components/Notification'

const Notifications = ({notifications}) =>
  <div className="flash-messages">
    {notifications.map(n => <Notification key={n.id} notification={n} />)}
  </div>

const {arrayOf, number, shape, string} = PropTypes

Notifications.propTypes = {
  notifications: arrayOf({
    notification: shape({
      id: string.isRequired,
      type: string.isRequired,
      message: string.isRequired,
      created: number.isRequired,
      duration: number.isRequired,
      icon: string,
    }),
  }),
}

const mapStateToProps = ({notifications}) => ({
  notifications,
})

export default connect(mapStateToProps, null)(Notifications)
