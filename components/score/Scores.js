import React from 'react'
import PropTypes from 'prop-types'
import './Scores.css'

const Scores = ({ scores }) => <div className="scores">Twój wynik: {scores}</div>
Scores.propTypes = {
    scores: PropTypes.number.isRequired,
}

export default Scores